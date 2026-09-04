import type { FieldConfidence } from '../types';

export interface TranscriptionResult {
  transcript: string;
  language: string;
  confidence: number;
}

export interface ProductFacts {
  category: string;
  craftType: string;
  materials: string[];
  colors: string[];
  dimensions: string;
  weight: string;
  technique: string;
  originRegion: string;
  productionTime: string;
  careInstructions: string;
  stockQuantity: number | null;
  artisanStory: string;
}

export interface GeneratedListing {
  titleEn: string;
  titleHi: string;
  descriptionEn: string;
  descriptionHi: string;
  careInstructionsEn: string;
  careInstructionsHi: string;
  tags: string[];
}

export interface PriceSuggestion {
  suggestedPrice: number | null;
  minimumPrice: number | null;
  maximumPrice: number | null;
  currency: string;
  reasoning: string;
  confidence: 'low' | 'medium' | 'high';
}

export interface EnhancedImageResult {
  enhancedUrl: string;
  originalUrl: string;
}

export interface ProductAIInput {
  transcript: string;
  language: string;
  imageDataUrl?: string;
}

export interface PricingInput {
  category: string;
  craftType: string;
  material: string;
  dimensions: string;
  artisanPriceContext?: string;
}

export interface AIResult {
  productFacts: ProductFacts;
  listing: GeneratedListing;
  pricing: PriceSuggestion;
  uncertainFields: string[];
  confidence: number;
  fieldConfidence: Record<string, FieldConfidence>;
}

export interface SpeechProvider {
  transcribe(audioBlob: Blob, languageCode: string): Promise<TranscriptionResult>;
}

export interface TranslationProvider {
  translate(text: string, sourceLanguage: string, targetLanguage: string): Promise<string>;
}

export interface ListingProvider {
  extractProductFacts(input: ProductAIInput): Promise<ProductFacts>;
  generateListing(facts: ProductFacts): Promise<GeneratedListing>;
  suggestPrice(pricingInput: PricingInput): Promise<PriceSuggestion>;
}

export interface ImageProvider {
  enhance(imageDataUrl: string): Promise<EnhancedImageResult>;
}

// --- Mock Implementations ---

export class MockSpeechProvider implements SpeechProvider {
  async transcribe(_audioBlob: Blob, languageCode: string): Promise<TranscriptionResult> {
    await new Promise((r) => setTimeout(r, 2000));
    const transcripts: Record<string, string> = {
      hi: 'यह मेरी हाथ से बुनी ऊनी शॉल है। यह पहाड़ी भेड़ के ऊन से बनी है। इसे बनाने में 10 से 14 दिन लगते हैं। इसका आकार 200 सेमी लंबा और 90 सेमी चौड़ा है। रंग प्राकृतिक क्रीम और भूरा है। इसे ड्राई क्लीन करना चाहिए। मेरे ख्याल से 2500 रुपये उचित दाम है।',
      en: 'This is my handwoven wool shawl. It is made from mountain sheep wool. It takes 10 to 14 days to make. The size is 200 cm long and 90 cm wide. The color is natural cream and brown. It should be dry cleaned. I think 2500 rupees is a fair price.',
    };
    return {
      transcript: transcripts[languageCode] || transcripts.hi,
      language: languageCode,
      confidence: 0.82,
    };
  }
}

export class MockTranslationProvider implements TranslationProvider {
  async translate(text: string, sourceLanguage: string, targetLanguage: string): Promise<string> {
    await new Promise((r) => setTimeout(r, 800));
    if (sourceLanguage === targetLanguage) return text;
    return text;
  }
}

export class MockListingProvider implements ListingProvider {
  async extractProductFacts(input: ProductAIInput): Promise<ProductFacts> {
    await new Promise((r) => setTimeout(r, 2500));
    return {
      category: 'Wool',
      craftType: 'Handwoven Shawl',
      materials: ['Mountain sheep wool'],
      colors: ['Natural cream', 'Brown'],
      dimensions: '200cm x 90cm',
      weight: '450g',
      technique: 'Handloom weaving',
      originRegion: 'Uttarakhand',
      productionTime: '10–14 days',
      careInstructions: 'Dry clean only. Store in a cool, dry place.',
      stockQuantity: 1,
      artisanStory: input.transcript,
    };
  }

  async generateListing(facts: ProductFacts): Promise<GeneratedListing> {
    await new Promise((r) => setTimeout(r, 1500));
    return {
      titleEn: `Handwoven ${facts.materials[0] || 'Wool'} ${facts.craftType}`,
      titleHi: `हथौड़ी ${facts.materials[0] || 'ऊनी'} ${facts.craftType}`,
      descriptionEn: `A ${facts.technique.toLowerCase()} ${facts.craftType.toLowerCase()} made from ${facts.materials.join(', ').toLowerCase()}. ${facts.colors.join(' and ')} in color. Originating from ${facts.originRegion}.`,
      descriptionHi: `${facts.originRegion} से ${facts.technique} द्वारा बनी ${facts.craftType}। ${facts.materials.join(', ')} से निर्मित। रंग: ${facts.colors.join(' और ')}.`,
      careInstructionsEn: facts.careInstructions,
      careInstructionsHi: 'केवल ड्राई क्लीन करें। ठंडी, सूखी जगह पर रखें।',
      tags: [facts.category, facts.craftType, facts.originRegion, ...facts.colors],
    };
  }

  async suggestPrice(pricingInput: PricingInput): Promise<PriceSuggestion> {
    await new Promise((r) => setTimeout(r, 1000));
    const basePrice: Record<string, number> = {
      Wool: 2000,
      Bamboo: 700,
      Textile: 1500,
    };
    const base = basePrice[pricingInput.category] || 1000;
    const suggested = base + Math.floor(Math.random() * 500);
    return {
      suggestedPrice: suggested,
      minimumPrice: Math.floor(suggested * 0.85),
      maximumPrice: Math.floor(suggested * 1.15),
      currency: 'INR',
      reasoning: `Based on ${pricingInput.category} crafts using ${pricingInput.material}, with ${pricingInput.dimensions}. This is a guidance range, not an authoritative valuation. The final price is the artisan's decision.`,
      confidence: 'medium',
    };
  }
}

export class MockImageProvider implements ImageProvider {
  async enhance(imageDataUrl: string): Promise<EnhancedImageResult> {
    await new Promise((r) => setTimeout(r, 2500));
    return {
      enhancedUrl: imageDataUrl,
      originalUrl: imageDataUrl,
    };
  }
}

// --- Real Provider Adapter Interfaces (for future integration) ---

export class GoogleSpeechProvider implements SpeechProvider {
  constructor(private apiKey: string) {}
  async transcribe(audioBlob: Blob, languageCode: string): Promise<TranscriptionResult> {
    throw new Error('GoogleSpeechProvider requires server-side implementation. Use MockSpeechProvider for demo mode.');
  }
}

export class GoogleTranslateProvider implements TranslationProvider {
  constructor(private apiKey: string) {}
  async translate(text: string, sourceLanguage: string, targetLanguage: string): Promise<string> {
    throw new Error('GoogleTranslateProvider requires server-side implementation. Use MockTranslationProvider for demo mode.');
  }
}

export class ClaudeListingProvider implements ListingProvider {
  constructor(private apiKey: string) {}
  async extractProductFacts(input: ProductAIInput): Promise<ProductFacts> {
    throw new Error('ClaudeListingProvider requires server-side implementation. Use MockListingProvider for demo mode.');
  }
  async generateListing(facts: ProductFacts): Promise<GeneratedListing> {
    throw new Error('ClaudeListingProvider requires server-side implementation. Use MockListingProvider for demo mode.');
  }
  async suggestPrice(pricingInput: PricingInput): Promise<PriceSuggestion> {
    throw new Error('ClaudeListingProvider requires server-side implementation. Use MockListingProvider for demo mode.');
  }
}

export class RemoveBgImageProvider implements ImageProvider {
  constructor(private apiKey: string) {}
  async enhance(imageDataUrl: string): Promise<EnhancedImageResult> {
    throw new Error('RemoveBgImageProvider requires server-side implementation. Use MockImageProvider for demo mode.');
  }
}

// Factory: get providers based on demo mode
export function getProviders(demoMode: boolean) {
  if (demoMode) {
    return {
      speech: new MockSpeechProvider(),
      translation: new MockTranslationProvider(),
      listing: new MockListingProvider(),
      image: new MockImageProvider(),
    };
  }
  // In production, these would be initialized with real API keys from server env
  throw new Error('Real providers require server-side API key configuration.');
}
