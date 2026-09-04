import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, LogOut, ChevronLeft, ShoppingBag } from 'lucide-react';
import { useApp } from '@/lib/store';
import { demoArtisans } from '@/data/seed';
import { fadeUp, staggerContainer, staggerItem } from '@/lib/animations';

export function BuyerFavorites() {
  const { t, language, user, products, favorites, toggleFavorite, logout } = useApp();
  const navigate = useNavigate();
  const favProducts = products.filter((p) => favorites.includes(p.id) && p.status === 'published');

  return (
    <div className="min-h-screen bg-hero grain-overlay warm-vignette py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <button onClick={() => navigate('/')} className="flex items-center gap-1 text-taupe hover:text-ivory text-sm mb-2">
              <ChevronLeft size={16} /> {t('common.back')}
            </button>
            <h1 className="font-serif text-3xl text-ivory">{t('buyer.favorites')}</h1>
          </div>
          <button onClick={() => { logout(); navigate('/'); }} className="btn-ghost"><LogOut size={14} /> {t('nav.logout')}</button>
        </div>

        {favProducts.length === 0 ? (
          <div className="card-surface p-12 text-center">
            <Heart className="text-taupe/40 mx-auto mb-4" size={40} />
            <p className="text-taupe">{t('buyer.noFavorites')}</p>
            <Link to="/catalog" className="btn-primary mt-4"><ShoppingBag size={16} /> {t('nav.explore')}</Link>
          </div>
        ) : (
          <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {favProducts.map((p) => {
              const artisan = demoArtisans.find((a) => a.id === p.artisanId);
              return (
                <motion.div key={p.id} variants={staggerItem}>
                  <Link to={`/catalog/${p.id}`} className="group block">
                    <div className="relative overflow-hidden rounded-2xl shadow-xl mb-3">
                      <img src={p.imageUrl} alt={p.titleEn} className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-700" loading="lazy" />
                      <button onClick={(e) => { e.preventDefault(); toggleFavorite(p.id); }} className="absolute top-3 right-3 w-9 h-9 rounded-full bg-walnut/60 backdrop-blur-sm flex items-center justify-center">
                        <Heart size={16} className="fill-terracotta text-terracotta" />
                      </button>
                    </div>
                    <h3 className="font-serif text-lg text-ivory group-hover:text-terracotta-light">{language === 'hi' ? p.titleHi : p.titleEn}</h3>
                    <p className="text-sm text-taupe">{artisan?.name} · {artisan?.location}</p>
                    <p className="text-sm text-terracotta-light mt-1">₹{p.priceMin}–₹{p.priceMax}</p>
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
