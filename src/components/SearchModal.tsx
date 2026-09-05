import { useState, useMemo, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, MapPin, User, Sparkles, ArrowRight, Package } from 'lucide-react';
import { useApp } from '@/lib/store';
import { demoArtisans } from '@/data/seed';
import { panIndiaLocations, POPULAR_SEARCH_CRAFTS, POPULAR_SEARCH_LOCATIONS } from '@/data/locations';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const { t, language, products } = useApp();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const cleanQuery = query.trim().toLowerCase();

  const searchResults = useMemo(() => {
    if (!cleanQuery) return { products: [], artisans: [], locations: [] };

    const matchingProducts = products.filter((p) => {
      if (p.status !== 'published') return false;
      const titleEn = p.titleEn.toLowerCase();
      const titleHi = p.titleHi.toLowerCase();
      const descEn = p.descriptionEn.toLowerCase();
      const descHi = p.descriptionHi.toLowerCase();
      const category = p.category.toLowerCase();
      const craftType = p.craftType.toLowerCase();
      const material = (p.material || '').toLowerCase();
      const origin = p.originRegion.toLowerCase();
      return (
        titleEn.includes(cleanQuery) ||
        titleHi.includes(cleanQuery) ||
        descEn.includes(cleanQuery) ||
        descHi.includes(cleanQuery) ||
        category.includes(cleanQuery) ||
        craftType.includes(cleanQuery) ||
        material.includes(cleanQuery) ||
        origin.includes(cleanQuery)
      );
    });

    const matchingArtisans = demoArtisans.filter((a) => {
      const name = a.name.toLowerCase();
      const nameHi = a.nameHi.toLowerCase();
      const craft = a.craftType.toLowerCase();
      const loc = a.location.toLowerCase();
      const bio = a.bio.toLowerCase();
      return (
        name.includes(cleanQuery) ||
        nameHi.includes(cleanQuery) ||
        craft.includes(cleanQuery) ||
        loc.includes(cleanQuery) ||
        bio.includes(cleanQuery)
      );
    });

    const matchingLocations = panIndiaLocations.filter((loc) => {
      const city = loc.city.toLowerCase();
      const state = loc.state.toLowerCase();
      const region = loc.region.toLowerCase();
      const crafts = loc.popularCrafts.join(' ').toLowerCase();
      return (
        city.includes(cleanQuery) ||
        state.includes(cleanQuery) ||
        region.includes(cleanQuery) ||
        crafts.includes(cleanQuery)
      );
    });

    return {
      products: matchingProducts,
      artisans: matchingArtisans,
      locations: matchingLocations,
    };
  }, [cleanQuery, products]);

  const hasResults =
    searchResults.products.length > 0 ||
    searchResults.artisans.length > 0 ||
    searchResults.locations.length > 0;

  const handleSelectProduct = (productId: string) => {
    onClose();
    navigate(`/catalog/${productId}`);
  };

  const handleSearchSubmit = (searchString: string) => {
    onClose();
    navigate(`/catalog?search=${encodeURIComponent(searchString)}`);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-20 px-4 sm:px-6">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-hero/80 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.96 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="relative w-full max-w-3xl bg-walnut border border-walnut-light/60 rounded-2xl shadow-2xl overflow-hidden z-10 my-4"
          >
            {/* Search Input Header */}
            <div className="relative border-b border-walnut-light/40 p-4 sm:p-5 flex items-center gap-3">
              <Search className="text-terracotta shrink-0" size={22} />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && query.trim()) {
                    handleSearchSubmit(query.trim());
                  }
                }}
                placeholder={
                  language === 'hi'
                    ? 'शिल्प, कारीगर, शहर (जैसे: जयपुर, पश्मीना, बनारसी)...'
                    : 'Search crafts, artisans, cities (e.g. Jaipur, Pashmina, Banarasi)...'
                }
                className="w-full bg-transparent text-ivory text-base sm:text-lg placeholder-taupe/50 focus:outline-none font-medium"
              />
              {query && (
                <button
                  onClick={() => setQuery('')}
                  className="p-1 text-taupe hover:text-ivory rounded-lg transition-colors"
                >
                  <X size={18} />
                </button>
              )}
              <button
                onClick={onClose}
                className="px-2.5 py-1 text-xs text-taupe/70 hover:text-ivory bg-walnut-light/40 rounded-lg border border-walnut-light/40 transition-colors"
              >
                ESC
              </button>
            </div>

            {/* Content Area */}
            <div className="p-4 sm:p-6 max-h-[70vh] overflow-y-auto no-scrollbar space-y-6">
              {!cleanQuery ? (
                /* EMPTY STATE - SUGGESTIONS */
                <div className="space-y-6">
                  {/* Popular Crafts */}
                  <div>
                    <div className="flex items-center gap-2 text-xs font-semibold text-terracotta uppercase tracking-wider mb-3">
                      <Sparkles size={14} />
                      {language === 'hi' ? 'लोकप्रिय शिल्प' : 'Popular Crafts'}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {POPULAR_SEARCH_CRAFTS.map((craft) => (
                        <button
                          key={craft}
                          onClick={() => setQuery(craft)}
                          className="px-3 py-1.5 rounded-xl bg-walnut-dark border border-walnut-light/40 text-xs sm:text-sm text-taupe hover:text-ivory hover:border-terracotta/50 transition-colors"
                        >
                          {craft}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Popular Pan-India Destinations */}
                  <div>
                    <div className="flex items-center gap-2 text-xs font-semibold text-olive-light uppercase tracking-wider mb-3">
                      <MapPin size={14} />
                      {language === 'hi' ? 'लोकप्रिय स्थान' : 'Pan-India Craft Regions'}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {POPULAR_SEARCH_LOCATIONS.map((loc) => (
                        <button
                          key={loc}
                          onClick={() => setQuery(loc.split(',')[0])}
                          className="px-3 py-1.5 rounded-xl bg-walnut-dark border border-walnut-light/40 text-xs sm:text-sm text-taupe hover:text-ivory hover:border-olive/50 transition-colors"
                        >
                          {loc}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : !hasResults ? (
                /* NO RESULTS */
                <div className="text-center py-10">
                  <Package size={40} className="text-taupe/40 mx-auto mb-3" />
                  <p className="text-ivory text-base font-medium mb-1">
                    {language === 'hi'
                      ? `"${query}" के लिए कोई परिणाम नहीं मिला`
                      : `No results found for "${query}"`}
                  </p>
                  <p className="text-taupe text-sm mb-5">
                    {language === 'hi'
                      ? 'शिल्प का नाम, शहर या कारीगर खोजने का प्रयास करें।'
                      : 'Try searching by craft type, artisan name, city, or state.'}
                  </p>
                  <button
                    onClick={() => handleSearchSubmit('')}
                    className="btn-primary text-xs sm:text-sm"
                  >
                    {language === 'hi' ? 'सभी उत्पाद देखें' : 'View All Crafts'} <ArrowRight size={14} />
                  </button>
                </div>
              ) : (
                /* RESULTS LIST */
                <div className="space-y-6">
                  {/* Matching Products */}
                  {searchResults.products.length > 0 && (
                    <div>
                      <div className="flex items-center justify-between text-xs font-semibold text-terracotta uppercase tracking-wider mb-3">
                        <span>{language === 'hi' ? 'उत्पाद' : 'Matching Crafts'} ({searchResults.products.length})</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {searchResults.products.map((product) => {
                          const artisan = demoArtisans.find((a) => a.id === product.artisanId);
                          return (
                            <div
                              key={product.id}
                              onClick={() => handleSelectProduct(product.id)}
                              className="flex items-center gap-3 p-2.5 rounded-xl bg-walnut-dark/80 hover:bg-walnut-light/50 border border-walnut-light/30 transition-all cursor-pointer group"
                            >
                              <img
                                src={product.imageUrl}
                                alt={product.titleEn}
                                className="w-14 h-14 rounded-lg object-cover shrink-0"
                              />
                              <div className="min-w-0 flex-1">
                                <h4 className="text-sm font-medium text-ivory group-hover:text-terracotta transition-colors truncate">
                                  {language === 'hi' ? product.titleHi : product.titleEn}
                                </h4>
                                <p className="text-xs text-taupe truncate">
                                  {artisan?.name} · {product.originRegion}
                                </p>
                                <p className="text-xs text-terracotta-light font-medium mt-0.5">
                                  ₹{product.priceMin} – ₹{product.priceMax}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Matching Artisans */}
                  {searchResults.artisans.length > 0 && (
                    <div>
                      <div className="flex items-center justify-between text-xs font-semibold text-olive-light uppercase tracking-wider mb-3">
                        <span>{language === 'hi' ? 'कारीगर' : 'Artisans'} ({searchResults.artisans.length})</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {searchResults.artisans.map((artisan) => (
                          <div
                            key={artisan.id}
                            onClick={() => handleSearchSubmit(artisan.name)}
                            className="flex items-center gap-3 p-3 rounded-xl bg-walnut-dark/80 hover:bg-walnut-light/50 border border-walnut-light/30 transition-all cursor-pointer group"
                          >
                            <div className="w-10 h-10 rounded-full bg-terracotta/20 border border-terracotta/30 flex items-center justify-center text-terracotta font-serif text-sm font-semibold shrink-0">
                              {artisan.name.charAt(0)}
                            </div>
                            <div className="min-w-0 flex-1">
                              <h4 className="text-sm font-medium text-ivory group-hover:text-terracotta transition-colors truncate">
                                {language === 'hi' ? artisan.nameHi : artisan.name}
                              </h4>
                              <p className="text-xs text-taupe truncate">
                                {artisan.craftType} · {artisan.location}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Matching Locations */}
                  {searchResults.locations.length > 0 && (
                    <div>
                      <div className="flex items-center justify-between text-xs font-semibold text-taupe uppercase tracking-wider mb-3">
                        <span>{language === 'hi' ? 'क्षेत्र एवं शहर' : 'Craft Hubs'} ({searchResults.locations.length})</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {searchResults.locations.map((loc) => (
                          <button
                            key={`${loc.city}-${loc.state}`}
                            onClick={() => handleSearchSubmit(loc.city)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-walnut-dark border border-walnut-light/40 text-xs text-ivory hover:border-terracotta transition-colors"
                          >
                            <MapPin size={12} className="text-terracotta" />
                            <span>{loc.city}, {loc.state}</span>
                            <span className="text-[10px] text-taupe/60">({loc.region})</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Footer Summary */}
            {query.trim() && (
              <div className="border-t border-walnut-light/40 p-3 px-5 bg-walnut-dark/60 flex items-center justify-between">
                <span className="text-xs text-taupe">
                  Press <kbd className="px-1.5 py-0.5 bg-walnut rounded text-[10px] border border-walnut-light text-ivory font-mono">ENTER</kbd> for all results
                </span>
                <button
                  onClick={() => handleSearchSubmit(query.trim())}
                  className="text-xs font-medium text-terracotta hover:text-terracotta-light flex items-center gap-1"
                >
                  {language === 'hi' ? 'सभी देखें' : 'View all matches'} <ArrowRight size={12} />
                </button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
