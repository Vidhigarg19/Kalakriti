export type Language = 'en' | 'hi';

export type UserRole = 'artisan' | 'buyer' | 'facilitator' | 'admin';

export type ProductStatus =
  | 'draft'
  | 'processing'
  | 'review'
  | 'published'
  | 'paused'
  | 'sold';

export type SyncState =
  | 'local-only'
  | 'queued'
  | 'syncing'
  | 'synced'
  | 'conflict'
  | 'failed';

export type FieldConfidence = 'confirmed' | 'needs_confirmation' | 'unsupported';

export interface Artisan {
  id: string;
  name: string;
  nameHi: string;
  location: string;
  craftType: string;
  craftTypeHi: string;
  bio: string;
  bioHi: string;
  phone: string;
  isDemo: boolean;
}

export interface Product {
  id: string;
  artisanId: string;
  status: ProductStatus;
  revision: number;
  titleEn: string;
  titleHi: string;
  descriptionEn: string;
  descriptionHi: string;
  category: string;
  craftType: string;
  material: string;
  colors: string[];
  dimensions: string;
  weight: string;
  technique: string;
  originRegion: string;
  careInstructionsEn: string;
  careInstructionsHi: string;
  productionTime: string;
  stockQuantity: number | null;
  priceMin: number;
  priceMax: number;
  suggestedPrice: number | null;
  currency: string;
  storyEn: string;
  storyHi: string;
  imageUrl: string;
  originalImageUrl?: string;
  enhancedImageUrl?: string;
  voiceLanguage: string;
  sourceTranscript?: string;
  aiConfidence: number;
  uncertainFields: string[];
  fieldConfidence: Record<string, FieldConfidence>;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
  updatedBy: string;
  isDemo: boolean;
}

export interface Inquiry {
  id: string;
  productId: string;
  artisanId: string;
  buyerName: string;
  buyerContact: string;
  message: string;
  status: 'new' | 'read' | 'responded' | 'closed';
  createdAt: string;
}

export interface LocalDraft {
  id: string;
  artisanId: string;
  step: WorkflowStep;
  syncState: SyncState;
  imageDataUrl?: string;
  audioBlobId?: string;
  audioDuration?: number;
  audioLanguage?: string;
  partialData?: Partial<Product>;
  revision: number;
  lastClientOperationId: string;
  createdAt: string;
  updatedAt: string;
}

export type WorkflowStep = 'show' | 'enhance' | 'speak' | 'ai' | 'confirm' | 'sell';

export interface User {
  id: string;
  role: UserRole;
  name: string;
  nameHi?: string;
  phone?: string;
  preferredLanguage: Language;
  artisanId?: string;
}

export interface AuditLog {
  id: string;
  actorId: string;
  actorRole: UserRole;
  action: string;
  targetType: string;
  targetId: string;
  reason?: string;
  timestamp: string;
}

export interface ModerationItem {
  productId: string;
  product: Product;
  flags: string[];
  aiConfidence: number;
}
