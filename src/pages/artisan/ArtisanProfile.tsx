import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LogOut, ShieldOff, ChevronLeft, MapPin, Phone, User } from 'lucide-react';
import { useApp, demoArtisans } from '@/lib/store';
import { fadeUp } from '@/lib/animations';

export function ArtisanProfile() {
  const { t, language, user, logout, secureLogout } = useApp();
  const navigate = useNavigate();
  const artisan = demoArtisans.find((a) => a.id === user?.artisanId);

  return (
    <div className="min-h-screen bg-hero grain-overlay warm-vignette py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-taupe hover:text-ivory text-sm">
            <ChevronLeft size={16} /> {t('common.back')}
          </button>
          <div className="flex gap-2">
            <button onClick={() => { logout(); navigate('/'); }} className="btn-ghost"><LogOut size={14} /> {t('nav.logout')}</button>
            <button onClick={() => { secureLogout(); navigate('/'); }} className="btn-ghost text-terracotta"><ShieldOff size={14} /> {t('nav.secureLogout')}</button>
          </div>
        </div>

        <motion.div variants={fadeUp} initial="hidden" animate="visible" className="card-surface p-8">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-20 h-20 rounded-full bg-terracotta/20 border border-terracotta/30 flex items-center justify-center text-terracotta font-serif text-3xl">
              {artisan?.name.charAt(0) || 'A'}
            </div>
            <div>
              <h1 className="font-serif text-2xl text-ivory">{artisan ? (language === 'hi' ? artisan.nameHi : artisan.name) : user?.name}</h1>
              <p className="text-sm text-taupe mt-1">{artisan?.craftType}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-walnut-dark rounded-xl">
              <MapPin size={18} className="text-terracotta" />
              <div>
                <p className="text-xs text-taupe/60">{t('product.origin')}</p>
                <p className="text-sm text-ivory">{artisan?.location}, Uttarakhand</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-walnut-dark rounded-xl">
              <Phone size={18} className="text-terracotta" />
              <div>
                <p className="text-xs text-taupe/60">{t('auth.phone')}</p>
                <p className="text-sm text-ivory">{user?.phone || artisan?.phone}</p>
              </div>
            </div>
            <div className="p-3 bg-walnut-dark rounded-xl">
              <p className="text-xs text-taupe/60 mb-1">{t('product.artisanStory')}</p>
              <p className="text-sm text-ivory italic">"{artisan ? (language === 'hi' ? artisan.bioHi : artisan.bio) : ''}"</p>
            </div>
          </div>

          <div className="mt-6 p-3 bg-olive/10 rounded-xl">
            <p className="text-xs text-olive-light">{t('common.demoContent')}</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
