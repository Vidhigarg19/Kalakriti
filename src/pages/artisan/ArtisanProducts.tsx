import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, LogOut, ShieldOff, Package } from 'lucide-react';
import { useApp, demoArtisans } from '@/lib/store';
import { fadeUp, staggerContainer, staggerItem } from '@/lib/animations';

export function ArtisanProducts() {
  const { t, language, user, products, logout, secureLogout } = useApp();
  const navigate = useNavigate();
  const artisan = demoArtisans.find((a) => a.id === user?.artisanId);
  const myProducts = products.filter((p) => p.artisanId === user?.artisanId);

  return (
    <div className="min-h-screen bg-hero grain-overlay warm-vignette py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-serif text-3xl text-ivory">{t('artisan.myProducts')}</h1>
            <p className="text-taupe text-sm mt-1">{artisan?.name} · {myProducts.length} {t('catalog.results')}</p>
          </div>
          <div className="flex gap-2">
            <Link to="/artisan/products/new" className="btn-primary"><Plus size={16} /> {t('artisan.addProduct')}</Link>
            <button onClick={() => { logout(); navigate('/'); }} className="btn-ghost"><LogOut size={14} /> {t('nav.logout')}</button>
            <button onClick={() => { secureLogout(); navigate('/'); }} className="btn-ghost text-terracotta"><ShieldOff size={14} /> {t('nav.secureLogout')}</button>
          </div>
        </div>

        {myProducts.length === 0 ? (
          <div className="card-surface p-12 text-center">
            <Package className="text-taupe/40 mx-auto mb-4" size={40} />
            <p className="text-taupe">{language === 'hi' ? 'अभी कोई उत्पाद नहीं।' : 'No products yet.'}</p>
            <Link to="/artisan/products/new" className="btn-primary mt-4"><Plus size={14} /> {t('artisan.addProduct')}</Link>
          </div>
        ) : (
          <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {myProducts.map((p) => (
              <motion.div key={p.id} variants={staggerItem}>
                <Link to={`/artisan/products/${p.id}`} className="group block">
                  <div className="relative overflow-hidden rounded-2xl shadow-xl mb-3">
                    <img src={p.imageUrl} alt={p.titleEn} className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-700" loading="lazy" />
                    <span className={`absolute top-3 left-3 px-2 py-0.5 text-xs rounded-full ${p.status === 'published' ? 'bg-olive/80 text-ivory' : 'bg-walnut-light/80 text-taupe'}`}>
                      {p.status}
                    </span>
                  </div>
                  <h3 className="font-serif text-lg text-ivory group-hover:text-terracotta-light">{language === 'hi' ? p.titleHi : p.titleEn}</h3>
                  <p className="text-sm text-terracotta-light mt-1">₹{p.priceMin}–₹{p.priceMax}</p>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
