import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import type { Language, User, Product, Inquiry, LocalDraft, AuditLog, SyncState } from '../types';
import { demoArtisans, demoProducts, demoInquiries } from '../data/seed';
import { translate, type TranslationKey } from '../i18n';
import { getAllDrafts, clearAllDrafts, deleteDraft } from './offline-db';

interface AppState {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKey) => string;

  user: User | null;
  login: (user: User) => void;
  logout: () => void;
  secureLogout: () => void;

  products: Product[];
  addProduct: (product: Product) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  publishProduct: (id: string) => void;

  inquiries: Inquiry[];
  addInquiry: (inquiry: Inquiry) => void;
  updateInquiryStatus: (id: string, status: Inquiry['status']) => void;

  favorites: string[];
  toggleFavorite: (productId: string) => void;

  drafts: LocalDraft[];
  refreshDrafts: () => Promise<void>;
  removeDraft: (id: string) => Promise<void>;

  isOnline: boolean;
  syncState: SyncState;

  auditLogs: AuditLog[];
  addAuditLog: (log: AuditLog) => void;
}

const AppContext = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    return (localStorage.getItem('kalakriti-lang') as Language) || 'en';
  });
  const [user, setUser] = useState<User | null>(null);
  const [products, setProducts] = useState<Product[]>(demoProducts);
  const [inquiries, setInquiries] = useState<Inquiry[]>(demoInquiries);
  const [favorites, setFavorites] = useState<string[]>(() => {
    return JSON.parse(localStorage.getItem('kalakriti-favorites') || '[]');
  });
  const [drafts, setDrafts] = useState<LocalDraft[]>([]);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [syncState, setSyncState] = useState<SyncState>('synced');
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('kalakriti-lang', lang);
  }, []);

  const t = useCallback((key: TranslationKey) => translate(language, key), [language]);

  const login = useCallback((newUser: User) => {
    setUser(newUser);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setSyncState('synced');
  }, []);

  const secureLogout = useCallback(async () => {
    if (user) {
      await clearAllDrafts(user.id);
    }
    setUser(null);
    setDrafts([]);
    setSyncState('synced');
  }, [user]);

  const addProduct = useCallback((product: Product) => {
    setProducts((prev) => [product, ...prev]);
  }, []);

  const updateProduct = useCallback((id: string, updates: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, ...updates, revision: p.revision + 1, updatedAt: new Date().toISOString() } : p
      )
    );
  }, []);

  const deleteProduct = useCallback((id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const publishProduct = useCallback((id: string) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, status: 'published', publishedAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
          : p
      )
    );
  }, []);

  const addInquiry = useCallback((inquiry: Inquiry) => {
    setInquiries((prev) => [inquiry, ...prev]);
  }, []);

  const updateInquiryStatus = useCallback((id: string, status: Inquiry['status']) => {
    setInquiries((prev) => prev.map((i) => (i.id === id ? { ...i, status } : i)));
  }, []);

  const toggleFavorite = useCallback((productId: string) => {
    setFavorites((prev) => {
      const next = prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId];
      localStorage.setItem('kalakriti-favorites', JSON.stringify(next));
      return next;
    });
  }, []);

  const refreshDrafts = useCallback(async () => {
    if (!user) return;
    try {
      const allDrafts = await getAllDrafts(user.id);
      setDrafts(allDrafts);
    } catch {
      setDrafts([]);
    }
  }, [user]);

  const removeDraft = useCallback(async (id: string) => {
    await deleteDraft(id);
    setDrafts((prev) => prev.filter((d) => d.id !== id));
  }, []);

  const addAuditLog = useCallback((log: AuditLog) => {
    setAuditLogs((prev) => [log, ...prev]);
  }, []);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setSyncState('syncing');
      setTimeout(() => setSyncState('synced'), 1500);
    };
    const handleOffline = () => {
      setIsOnline(false);
      setSyncState('queued');
    };
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    if (user) {
      refreshDrafts();
    } else {
      setDrafts([]);
    }
  }, [user, refreshDrafts]);

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        t,
        user,
        login,
        logout,
        secureLogout,
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        publishProduct,
        inquiries,
        addInquiry,
        updateInquiryStatus,
        favorites,
        toggleFavorite,
        drafts,
        refreshDrafts,
        removeDraft,
        isOnline,
        syncState,
        auditLogs,
        addAuditLog,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}

export { demoArtisans };
