import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LogOut, ShieldOff, ChevronLeft, AlertCircle, RefreshCw } from 'lucide-react';
import { useApp, demoArtisans } from '@/lib/store';
import { fadeUp } from '@/lib/animations';

export function ArtisanProductDetail() {
  const { productId } = useParams();
  const { t, language, user, products, updateProduct, deleteProduct, logout, secureLogout, isOnline } = useApp();
  const navigate = useNavigate();
  const product = products.find((p) => p.id === productId && p.artisanId === user?.artisanId);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="text-taupe mx-auto mb-3" size={32} />
          <p className="text-taupe mb-4">{language === 'hi' ? 'ड्राफ्ट नहीं मिला।' : 'Draft not found.'}</p>
          <Link to="/artisan/products" className="btn-primary">{t('common.back')}</Link>
        </div>
      </div>
    );
  }

  const artisan = demoArtisans.find((a) => a.id === product.artisanId);

  return (
    <div className="min-h-screen bg-hero grain-overlay warm-vignette py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-taupe hover:text-ivory text-sm">
            <ChevronLeft size={16} /> {t('common.back')}
          </button>
          <div className="flex gap-2">
            <button onClick={() => { logout(); navigate('/'); }} className="btn-ghost"><LogOut size={14} /> {t('nav.logout')}</button>
            <button onClick={() => { secureLogout(); navigate('/'); }} className="btn-ghost text-terracotta"><ShieldOff size={14} /> {t('nav.secureLogout')}</button>
          </div>
        </div>

        <motion.div variants={fadeUp} initial="hidden" animate="visible" className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <img src={product.imageUrl} alt={product.titleEn} className="w-full rounded-2xl shadow-xl max-h-96 object-contain bg-walnut-dark" />
          </div>
          <div>
            <span className={`text-xs px-2 py-1 rounded-full ${product.status === 'published' ? 'bg-olive/20 text-olive-light' : 'bg-walnut-light/30 text-taupe'}`}>{product.status}</span>
            <h1 className="font-serif text-2xl text-ivory mt-2">{language === 'hi' ? product.titleHi : product.titleEn}</h1>
            <p className="text-taupe mt-2 text-sm">{language === 'hi' ? product.descriptionHi : product.descriptionEn}</p>
            <p className="text-terracotta-light mt-3">₹{product.priceMin}–₹{product.priceMax}</p>

            <div className="mt-4 space-y-2 text-sm">
              <p className="text-taupe"><span className="text-ivory">{t('workflow.confirm.materials')}:</span> {product.material}</p>
              <p className="text-taupe"><span className="text-ivory">{t('workflow.confirm.technique')}:</span> {product.technique}</p>
              <p className="text-taupe"><span className="text-ivory">{t('workflow.confirm.dimensions')}:</span> {product.dimensions}</p>
              <p className="text-taupe"><span className="text-ivory">{t('workflow.confirm.origin')}:</span> {product.originRegion}</p>
              <p className="text-taupe"><span className="text-ivory">{t('workflow.confirm.stock')}:</span> {product.stockQuantity}</p>
              <p className="text-taupe"><span className="text-ivory">AI {t('workflow.ai.confidence')}:</span> {Math.round(product.aiConfidence * 100)}%</p>
            </div>

            <div className="flex gap-3 mt-6">
              {product.status === 'published' ? (
                <button onClick={() => updateProduct(product.id, { status: 'paused' })} className="btn-secondary">{t('admin.unpublish')}</button>
              ) : (
                <button onClick={() => { updateProduct(product.id, { status: 'published', publishedAt: new Date().toISOString() }); }} className="btn-primary" disabled={!isOnline}>
                  {t('workflow.confirm.publish')}
                </button>
              )}
              <button onClick={() => { if (confirm('Delete this product?')) { deleteProduct(product.id); navigate('/artisan/products'); } }} className="btn-ghost text-terracotta">
                {language === 'hi' ? 'हटाएं' : 'Delete'}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
