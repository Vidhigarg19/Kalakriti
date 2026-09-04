import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, SlidersHorizontal, X, Heart, MapPin, ArrowRight } from 'lucide-react';
import { useApp } from '@/lib/store';
import { demoArtisans, categories, craftTypes, regions } from '@/data/seed';
import { fadeUp, staggerContainer, staggerItem } from '@/lib/animations';

export function CatalogPage() {
  const { t, language, products, favorites, toggleFavorite } = useApp();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [craftType, setCraftType] = useState('');
  const [region, setRegion] = useState('');
  const [sort, setSort] = useState('newest');
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    let result = products.filter((p) => p.status === 'published');
    if (search) {
      const q = search.toLowerCase();
      result = result.filter((p) =>
        p.titleEn.toLowerCase().includes(q) ||
        p.titleHi.includes(search) ||
        p.descriptionEn.toLowerCase().includes(q) ||
        p.craftType.toLowerCase().includes(q) ||
        p.originRegion.toLowerCase().includes(q)
      );
    }
    if (category) result = result.filter((p) => p.category === category);
    if (craftType) result = result.filter((p) => p.craftType === craftType);
    if (region) result = result.filter((p) => p.originRegion === region);
    if (sort === 'priceLow') result = [...result].sort((a, b) => a.priceMin - b.priceMin);
    else if (sort === 'priceHigh') result = [...result].sort((a, b) => b.priceMin - a.priceMin);
    else result = [...result].sort((a, b) => new Date(b.publishedAt || '').getTime() - new Date(a.publishedAt || '').getTime());
    return result;
  }, [products, search, category, craftType, region, sort]);

  const clearFilters = () => {
    setCategory('');
    setCraftType('');
    setRegion('');
    setSearch('');
  };

  const hasFilters = category || craftType || region || search;

  return (
    <div className="min-h-screen bg-hero grain-overlay warm-vignette py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div variants={fadeUp} initial="hidden" animate="visible" className="mb-8">
          <h1 className="font-serif text-3xl md:text-4xl font-semibold text-ivory mb-2">{t('catalog.title')}</h1>
          <p className="text-taupe">{t('catalog.subtitle')}</p>
        </motion.div>

        {/* Search & Sort Bar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-taupe/50" size={18} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t('catalog.search')}
              className="input-field pl-10"
            />
          </div>
          <select value={sort} onChange={(e) => setSort(e.target.value)} className="input-field sm:w-48">
            <option value="newest">{t('catalog.sort.newest')}</option>
            <option value="priceLow">{t('catalog.sort.priceLow')}</option>
            <option value="priceHigh">{t('catalog.sort.priceHigh')}</option>
          </select>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="btn-secondary sm:w-auto"
          >
            <SlidersHorizontal size={16} />
            {t('catalog.filter.priceRange')}
          </button>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            className="card-surface p-4 mb-6 grid grid-cols-1 sm:grid-cols-3 gap-4"
          >
            <div>
              <label className="text-sm text-taupe mb-1 block">{t('catalog.filter.category')}</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)} className="input-field">
                <option value="">{t('common.all')}</option>
                {categories.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm text-taupe mb-1 block">{t('catalog.filter.craftType')}</label>
              <select value={craftType} onChange={(e) => setCraftType(e.target.value)} className="input-field">
                <option value="">{t('common.all')}</option>
                {craftTypes.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm text-taupe mb-1 block">{t('catalog.filter.region')}</label>
              <select value={region} onChange={(e) => setRegion(e.target.value)} className="input-field">
                <option value="">{t('common.all')}</option>
                {regions.map((r) => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            {hasFilters && (
              <button onClick={clearFilters} className="text-sm text-terracotta hover:text-terracotta-light flex items-center gap-1">
                <X size={14} /> {t('common.clear')}
              </button>
            )}
          </motion.div>
        )}

        <p className="text-sm text-taupe mb-4">{filtered.length} {t('catalog.results')}</p>

        {/* Editorial Gallery - asymmetric grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-taupe text-lg">{t('catalog.empty')}</p>
            {hasFilters && (
              <button onClick={clearFilters} className="btn-primary mt-4">{t('common.clear')}</button>
            )}
          </div>
        ) : (
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filtered.map((product, i) => {
              const artisan = demoArtisans.find((a) => a.id === product.artisanId);
              const isFav = favorites.includes(product.id);
              const isTall = i % 5 === 0 || i % 5 === 3;
              return (
                <motion.div
                  key={product.id}
                  variants={staggerItem}
                  className={isTall ? 'sm:row-span-2' : ''}
                >
                  <Link to={`/catalog/${product.id}`} className="group block h-full">
                    <div className="relative overflow-hidden rounded-2xl shadow-xl mb-3 h-full">
                      <img
                        src={product.imageUrl}
                        alt={language === 'hi' ? product.titleHi : product.titleEn}
                        className={`w-full object-cover group-hover:scale-105 transition-transform duration-700 ${isTall ? 'h-[420px]' : 'h-[280px]'}`}
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-hero/80 via-transparent to-transparent" />
                      {product.isDemo && (
                        <span className="absolute top-3 left-3 px-2 py-0.5 bg-olive/80 text-ivory text-xs rounded-full">
                          {t('common.demoContent')}
                        </span>
                      )}
                      <button
                        onClick={(e) => { e.preventDefault(); toggleFavorite(product.id); }}
                        className="absolute top-3 right-3 w-9 h-9 rounded-full bg-walnut/60 backdrop-blur-sm flex items-center justify-center hover:bg-walnut transition-colors"
                      >
                        <Heart size={16} className={isFav ? 'fill-terracotta text-terracotta' : 'text-ivory'} />
                      </button>
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <h3 className="font-serif text-lg text-ivory group-hover:text-terracotta-light transition-colors">
                          {language === 'hi' ? product.titleHi : product.titleEn}
                        </h3>
                        <div className="flex items-center gap-1 text-xs text-taupe mt-1">
                          <MapPin size={12} /> {artisan?.location}
                        </div>
                        <p className="text-sm text-terracotta-light mt-2">
                          ₹{product.priceMin}–₹{product.priceMax}
                        </p>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </div>
    </div>
  );
}
