import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Share2, MapPin, ChevronLeft, X, Play, Pause, Check, ArrowRight, ShoppingBag, Volume2 } from 'lucide-react';
import { useApp } from '@/lib/store';
import { demoArtisans } from '@/data/seed';
import { fadeUp, staggerContainer, staggerItem } from '@/lib/animations';
import type { Inquiry } from '@/types';

export function ProductDetailPage() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { t, language, products, favorites, toggleFavorite, addInquiry } = useApp();
  const [showEnhanced, setShowEnhanced] = useState(true);
  const [showInquiry, setShowInquiry] = useState(false);
  const [inquirySent, setInquirySent] = useState(false);
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [inquiryForm, setInquiryForm] = useState({ name: '', contact: '', message: '' });

  const product = products.find((p) => p.id === productId);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-taupe text-lg mb-4">{t('common.error')}</p>
          <Link to="/catalog" className="btn-primary">{t('common.back')}</Link>
        </div>
      </div>
    );
  }

  const artisan = demoArtisans.find((a) => a.id === product.artisanId);
  const isFav = favorites.includes(product.id);
  const related = products
    .filter((p) => p.id !== product.id && p.status === 'published' && (p.category === product.category || p.craftType === product.craftType))
    .slice(0, 3);

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try { await navigator.share({ title: product.titleEn, url }); } catch {}
    } else {
      navigator.clipboard?.writeText(url);
    }
  };

  const handleSubmitInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    const inquiry: Inquiry = {
      id: `inquiry-${Date.now()}`,
      productId: product.id,
      artisanId: product.artisanId,
      buyerName: inquiryForm.name,
      buyerContact: inquiryForm.contact,
      message: inquiryForm.message,
      status: 'new',
      createdAt: new Date().toISOString(),
    };
    addInquiry(inquiry);
    setInquirySent(true);
    setInquiryForm({ name: '', contact: '', message: '' });
    setTimeout(() => { setInquirySent(false); setShowInquiry(false); }, 2500);
  };

  return (
    <div className="min-h-screen bg-hero grain-overlay warm-vignette py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-taupe hover:text-ivory mb-6 text-sm">
          <ChevronLeft size={16} /> {t('common.back')}
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image Gallery */}
          <motion.div variants={fadeUp} initial="hidden" animate="visible">
            <div className="relative overflow-hidden rounded-2xl shadow-2xl">
              <img
                src={product.imageUrl}
                alt={language === 'hi' ? product.titleHi : product.titleEn}
                className="w-full h-[500px] object-cover"
              />
              {product.isDemo && (
                <span className="absolute top-4 left-4 px-3 py-1 bg-olive/80 text-ivory text-xs rounded-full">
                  {t('common.demoContent')}
                </span>
              )}
            </div>
            {(product.originalImageUrl || product.enhancedImageUrl) && (
              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => setShowEnhanced(false)}
                  className={`px-4 py-2 rounded-lg text-sm transition-colors ${!showEnhanced ? 'bg-terracotta text-ivory' : 'bg-walnut text-taupe'}`}
                >
                  {t('product.originalToggle')}
                </button>
                <button
                  onClick={() => setShowEnhanced(true)}
                  className={`px-4 py-2 rounded-lg text-sm transition-colors ${showEnhanced ? 'bg-terracotta text-ivory' : 'bg-walnut text-taupe'}`}
                >
                  {t('product.enhancedToggle')}
                </button>
              </div>
            )}
          </motion.div>

          {/* Product Info */}
          <motion.div variants={staggerContainer} initial="hidden" animate="visible">
            <motion.h1 variants={staggerItem} className="font-serif text-3xl md:text-4xl font-semibold text-ivory mb-2">
              {language === 'hi' ? product.titleHi : product.titleEn}
            </motion.h1>
            <motion.p variants={staggerItem} className="text-taupe leading-relaxed mb-4">
              {language === 'hi' ? product.descriptionHi : product.descriptionEn}
            </motion.p>

            <motion.div variants={staggerItem} className="flex items-center gap-4 mb-6">
              <span className="text-2xl font-serif text-terracotta-light">
                ₹{product.priceMin}–₹{product.priceMax}
              </span>
              <span className="text-sm text-taupe">{t('product.priceRange')}</span>
            </motion.div>

            <motion.div variants={staggerItem} className="flex items-center gap-2 mb-6">
              <span className={`px-3 py-1 rounded-full text-sm ${product.stockQuantity && product.stockQuantity > 0 ? 'bg-olive/20 text-olive-light' : 'bg-terracotta-dark/30 text-terracotta-light'}`}>
                {product.stockQuantity && product.stockQuantity > 0 ? t('product.inStock') : t('product.soldOut')}
              </span>
              {product.isDemo && <span className="text-xs text-taupe/60">{t('common.demoContent')}</span>}
            </motion.div>

            {/* Actions */}
            <motion.div variants={staggerItem} className="flex flex-wrap gap-3 mb-8">
              <button onClick={() => setShowInquiry(true)} className="btn-primary">
                <ShoppingBag size={16} /> {t('product.inquire')}
              </button>
              <button onClick={() => toggleFavorite(product.id)} className="btn-secondary">
                <Heart size={16} className={isFav ? 'fill-terracotta text-terracotta' : ''} />
                {isFav ? t('product.favorited') : t('product.favorite')}
              </button>
              <button onClick={handleShare} className="btn-ghost">
                <Share2 size={16} /> {t('product.share')}
              </button>
            </motion.div>

            {/* Details */}
            <motion.div variants={staggerItem} className="card-surface p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-taupe/60 uppercase tracking-wide">{t('product.materials')}</p>
                  <p className="text-sm text-ivory">{product.material}</p>
                </div>
                <div>
                  <p className="text-xs text-taupe/60 uppercase tracking-wide">{t('product.technique')}</p>
                  <p className="text-sm text-ivory">{product.technique}</p>
                </div>
                <div>
                  <p className="text-xs text-taupe/60 uppercase tracking-wide">{t('product.dimensions')}</p>
                  <p className="text-sm text-ivory">{product.dimensions}</p>
                </div>
                <div>
                  <p className="text-xs text-taupe/60 uppercase tracking-wide">{t('product.origin')}</p>
                  <p className="text-sm text-ivory">{product.originRegion}</p>
                </div>
                <div>
                  <p className="text-xs text-taupe/60 uppercase tracking-wide">{t('product.makingTime')}</p>
                  <p className="text-sm text-ivory">{product.productionTime || '10–14 days'}</p>
                </div>
                <div>
                  <p className="text-xs text-taupe/60 uppercase tracking-wide">{t('product.availability')}</p>
                  <p className="text-sm text-ivory">{product.stockQuantity} available</p>
                </div>
              </div>
              <div>
                <p className="text-xs text-taupe/60 uppercase tracking-wide mb-1">{t('product.care')}</p>
                <p className="text-sm text-ivory">{language === 'hi' ? product.careInstructionsHi : product.careInstructionsEn}</p>
              </div>
              <div>
                <p className="text-xs text-taupe/60 uppercase tracking-wide mb-1">{t('product.artisanStory')}</p>
                <p className="text-sm text-ivory italic leading-relaxed">"{language === 'hi' ? product.storyHi : product.storyEn}"</p>
              </div>
            </motion.div>

            {/* Audio Story Preview */}
            <motion.div variants={staggerItem} className="card-surface p-4 mt-4 flex items-center gap-3">
              <button
                onClick={() => setAudioPlaying(!audioPlaying)}
                className="w-10 h-10 rounded-full bg-terracotta flex items-center justify-center text-ivory hover:bg-terracotta-dark transition-colors"
              >
                {audioPlaying ? <Pause size={18} /> : <Play size={18} />}
              </button>
              <div className="flex-1">
                <p className="text-sm text-ivory">{t('product.audioStory')}</p>
                <div className="flex items-center gap-1 mt-1">
                  {[...Array(20)].map((_, i) => (
                    <div
                      key={i}
                      className={`w-1 rounded-full ${audioPlaying ? 'bg-terracotta animate-pulse' : 'bg-walnut-light'}`}
                      style={{ height: `${8 + Math.random() * 16}px` }}
                    />
                  ))}
                </div>
              </div>
              <Volume2 size={16} className="text-taupe" />
            </motion.div>
          </motion.div>
        </div>

        {/* Artisan Profile */}
        {artisan && (
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="card-surface p-6 mt-8">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-full bg-terracotta/20 border border-terracotta/30 flex items-center justify-center text-terracotta font-serif text-2xl shrink-0">
                {artisan.name.charAt(0)}
              </div>
              <div>
                <h3 className="font-serif text-xl text-ivory">{language === 'hi' ? artisan.nameHi : artisan.name}</h3>
                <div className="flex items-center gap-1 text-sm text-taupe mt-1">
                  <MapPin size={12} /> {artisan.location} · {language === 'hi' ? artisan.craftTypeHi : artisan.craftType}
                </div>
                <p className="text-sm text-taupe mt-3 leading-relaxed italic">"{language === 'hi' ? artisan.bioHi : artisan.bio}"</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Related Products */}
        {related.length > 0 && (
          <div className="mt-12">
            <h2 className="font-serif text-2xl text-ivory mb-6">{t('product.relatedProducts')}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {related.map((p) => (
                <Link key={p.id} to={`/catalog/${p.id}`} className="group">
                  <div className="relative overflow-hidden rounded-2xl shadow-xl mb-3">
                    <img src={p.imageUrl} alt={p.titleEn} className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-700" loading="lazy" />
                    <div className="absolute inset-0 bg-gradient-to-t from-hero/60 to-transparent" />
                  </div>
                  <h3 className="font-serif text-lg text-ivory group-hover:text-terracotta-light transition-colors">
                    {language === 'hi' ? p.titleHi : p.titleEn}
                  </h3>
                  <p className="text-sm text-terracotta-light mt-1">₹{p.priceMin}–₹{p.priceMax}</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Inquiry Drawer */}
      <AnimatePresence>
        {showInquiry && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowInquiry(false)}
              className="fixed inset-0 bg-black/50 z-50"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25 }}
              className="fixed right-0 top-0 bottom-0 w-full sm:w-96 bg-walnut border-l border-walnut-light z-50 p-6 overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-serif text-xl text-ivory">{t('inquiry.title')}</h2>
                <button onClick={() => setShowInquiry(false)} className="text-taupe hover:text-ivory">
                  <X size={20} />
                </button>
              </div>

              {inquirySent ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 rounded-full bg-olive/20 flex items-center justify-center mx-auto mb-4">
                    <Check size={32} className="text-olive-light" />
                  </div>
                  <p className="text-ivory">{t('inquiry.success')}</p>
                </div>
              ) : (
                <form onSubmit={handleSubmitInquiry} className="space-y-4">
                  <div>
                    <label className="text-sm text-taupe mb-1 block">{t('inquiry.name')}</label>
                    <input
                      type="text"
                      required
                      value={inquiryForm.name}
                      onChange={(e) => setInquiryForm({ ...inquiryForm, name: e.target.value })}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-taupe mb-1 block">{t('inquiry.contact')}</label>
                    <input
                      type="text"
                      required
                      value={inquiryForm.contact}
                      onChange={(e) => setInquiryForm({ ...inquiryForm, contact: e.target.value })}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-taupe mb-1 block">{t('inquiry.message')}</label>
                    <textarea
                      required
                      rows={4}
                      value={inquiryForm.message}
                      onChange={(e) => setInquiryForm({ ...inquiryForm, message: e.target.value })}
                      className="input-field resize-none"
                    />
                  </div>
                  <div className="flex gap-3">
                    <button type="submit" className="btn-primary flex-1">
                      {t('inquiry.submit')} <ArrowRight size={16} />
                    </button>
                    <button type="button" onClick={() => setShowInquiry(false)} className="btn-secondary">
                      {t('inquiry.cancel')}
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
