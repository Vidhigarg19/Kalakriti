import { useEffect, useRef, useState } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import {
  Search,
  Bell,
  ChevronDown,
  Home,
  Package,
  ShoppingCart,
  BarChart3,
  MessageSquare,
  PieChart,
  User,
  Settings,
  HelpCircle,
} from 'lucide-react';
import { useApp, demoArtisans } from '@/lib/store';
import avatarPlaceholderImg from '@/assets/avatar-placeholder.jpg';

// ---------------------------------------------------------------------------
// Sidebar
// ---------------------------------------------------------------------------

// `to: null` = page doesn't exist yet in the router, so it renders disabled
// instead of navigating somewhere broken. Fill in the real path once that
// page exists and it'll automatically become a working link.
const NAV_ITEMS = [
  { icon: Home, label: 'Dashboard', to: '/artisan/dashboard' },
  { icon: Package, label: 'My Products', to: '/artisan/products' },
  { icon: ShoppingCart, label: 'Orders', to: null },
  { icon: BarChart3, label: 'Earnings', to: null },
  { icon: MessageSquare, label: 'Messages', to: '/artisan/inquiries' },
  { icon: PieChart, label: 'Analytics', to: null },
  { icon: User, label: 'Profile', to: '/artisan/profile' },
  { icon: Settings, label: 'Settings', to: null },
  { icon: HelpCircle, label: 'Help & Support', to: null },
];

function Sidebar() {
  const location = useLocation();

  return (
    <aside className="hidden lg:flex flex-col w-[260px] shrink-0 bg-walnut-dark/60 border-r border-walnut-light/20 py-8 px-5">
      <div className="px-2 mb-10">
        <h1 className="font-serif text-2xl text-ivory tracking-wide">
          Kalakriti<span className="text-terracotta">+</span>
        </h1>
        <p className="text-[11px] text-taupe/70 mt-0.5 tracking-wide">Tradition Lives On</p>
      </div>

      <nav className="flex-1 space-y-1">
        {NAV_ITEMS.map((item) => {
          const active = item.to !== null && location.pathname === item.to;

          if (item.to === null) {
            return (
              <div
                key={item.label}
                aria-disabled="true"
                title="Coming soon"
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-taupe/35 cursor-not-allowed select-none"
              >
                <item.icon size={18} />
                {item.label}
                <span className="ml-auto text-[10px] px-1.5 py-0.5 rounded-full bg-walnut-light/20 text-taupe/50">
                  Soon
                </span>
              </div>
            );
          }

          return (
            <Link
              key={item.label}
              to={item.to}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors ${
                active
                  ? 'bg-terracotta text-ivory'
                  : 'text-taupe hover:text-ivory hover:bg-walnut-light/20'
              }`}
            >
              <item.icon size={18} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-8 px-2 text-taupe/60 text-sm italic leading-snug">
        <p>"Small Hands</p>
        <p>Big Tomorrows"</p>
        <div className="mt-3 h-px w-10 bg-taupe/30" />
      </div>
    </aside>
  );
}

// ---------------------------------------------------------------------------
// Notification bell (placeholder data — no real notifications backend yet)
// ---------------------------------------------------------------------------

const PLACEHOLDER_NOTIFICATIONS = [
  { id: 1, text: 'A buyer sent you a new inquiry.' },
  { id: 2, text: 'Your product listing was viewed 12 times today.' },
  { id: 3, text: 'Sync completed successfully.' },
];

function NotificationBell() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        aria-label="Notifications"
        onClick={() => setOpen((o) => !o)}
        className="relative w-10 h-10 rounded-full bg-walnut-dark/50 border border-walnut-light/20 flex items-center justify-center text-taupe hover:text-ivory transition-colors"
      >
        <Bell size={17} />
        {PLACEHOLDER_NOTIFICATIONS.length > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-terracotta text-[10px] text-ivory flex items-center justify-center">
            {PLACEHOLDER_NOTIFICATIONS.length}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-72 rounded-xl bg-walnut-dark border border-walnut-light/20 shadow-xl z-50 overflow-hidden">
          <div className="px-4 py-3 border-b border-walnut-light/20">
            <p className="text-sm text-ivory font-medium">Notifications</p>
          </div>
          <ul>
            {PLACEHOLDER_NOTIFICATIONS.map((n) => (
              <li
                key={n.id}
                className="px-4 py-3 text-sm text-taupe hover:bg-walnut-light/10 border-b border-walnut-light/10 last:border-0"
              >
                {n.text}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Top bar
// ---------------------------------------------------------------------------

function TopBar({ name, avatarUrl }: { name: string; avatarUrl?: string }) {
  return (
    <header className="flex items-center gap-4 py-5 px-4 sm:px-6 lg:px-8 border-b border-walnut-light/20">
      <div className="relative flex-1 max-w-xl">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-taupe/60" size={16} />
        <input
          type="text"
          placeholder="Search products, orders, or anything..."
          className="w-full bg-walnut-dark/50 border border-walnut-light/20 rounded-full pl-10 pr-4 py-2.5 text-sm text-ivory placeholder:text-taupe/50 focus:outline-none focus:ring-2 focus:ring-terracotta/40"
        />
      </div>

      <NotificationBell />

      <button className="flex items-center gap-2.5 pl-1 pr-3 py-1 rounded-full bg-walnut-dark/50 border border-walnut-light/20">
        <img
          src={avatarUrl || avatarPlaceholderImg}
          alt={name}
          className="w-8 h-8 rounded-full object-cover"
        />
        <span className="hidden sm:block text-left">
          <span className="block text-sm text-ivory leading-tight">{name}</span>
          <span className="block text-[11px] text-taupe/70 leading-tight">Artisan</span>
        </span>
        <ChevronDown size={14} className="hidden sm:block text-taupe/60" />
      </button>
    </header>
  );
}

// ---------------------------------------------------------------------------
// Layout — wraps every /artisan/* page so the sidebar & top bar persist
// across navigation instead of disappearing when you leave the dashboard.
// ---------------------------------------------------------------------------

export function ArtisanLayout() {
  const { language, user } = useApp();
  const artisan = demoArtisans.find((a) => a.id === user?.artisanId);
  const artisanName = artisan ? (language === 'hi' ? artisan.nameHi : artisan.name) : user?.name;

  return (
    <div className="min-h-screen bg-hero grain-overlay warm-vignette flex">
      <Sidebar />
      <div className="flex-1 min-w-0 flex flex-col">
        <TopBar name={artisanName || ''} avatarUrl={(artisan as any)?.avatarUrl} />
        <main className="flex-1 py-6 px-4 sm:px-6 lg:px-8 max-w-[1600px] mx-auto w-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
}