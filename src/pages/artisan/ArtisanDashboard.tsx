import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Package, MessageSquare, AlertCircle, RefreshCw, LogOut, ShieldOff, Mic, CheckCircle, Clock, CloudOff } from 'lucide-react';
import { useApp, demoArtisans } from '@/lib/store';
import { fadeUp, staggerContainer, staggerItem } from '@/lib/animations';

export function ArtisanDashboard() {
  const { t, language, user, products, inquiries, drafts, syncState, isOnline, logout, secureLogout } = useApp();
  const navigate = useNavigate();

  const artisan = demoArtisans.find((a) => a.id === user?.artisanId);
  const myProducts = products.filter((p) => p.artisanId === user?.artisanId);
  const published = myProducts.filter((p) => p.status === 'published');
  const draftCount = drafts.length;
  const myInquiries = inquiries.filter((i) => i.artisanId === user?.artisanId);
  const newInquiries = myInquiries.filter((i) => i.status === 'new');
  const failures = myProducts.filter((p) => p.status === 'processing');

  const syncColor: Record<string, string> = {
    'synced': 'text-olive-light',
    'syncing': 'text-terracotta-light',
    'queued': 'text-taupe',
    'local-only': 'text-taupe',
    'conflict': 'text-terracotta',
    'failed': 'text-terracotta',
  };

  return (
    <div className="min-h-screen bg-hero grain-overlay warm-vignette py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
          <div>
            <p className="text-taupe text-sm">{t('artisan.greeting')},</p>
            <h1 className="font-serif text-3xl text-ivory">
              {artisan ? (language === 'hi' ? artisan.nameHi : artisan.name) : user?.name}
            </h1>
            <div className="flex items-center gap-2 mt-2">
              <span className={`text-xs flex items-center gap-1 ${syncColor[syncState] || 'text-taupe'}`}>
                <RefreshCw size={12} className={syncState === 'syncing' ? 'animate-spin' : ''} />
                {t(`common.${syncState === 'local-only' ? 'localOnly' : syncState}`)}
              </span>
              {!isOnline && <span className="text-xs text-terracotta flex items-center gap-1"><CloudOff size={12} /> {t('common.offline')}</span>}
            </div>
          </div>
          <div className="flex gap-2">
            <Link to="/artisan/products/new" className="btn-primary">
              <Plus size={16} /> {t('artisan.addProduct')}
            </Link>
            <button onClick={() => { logout(); navigate('/'); }} className="btn-ghost">
              <LogOut size={14} /> {t('nav.logout')}
            </button>
            <button onClick={() => { secureLogout(); navigate('/'); }} className="btn-ghost text-terracotta">
              <ShieldOff size={14} /> {t('nav.secureLogout')}
            </button>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { icon: CheckCircle, label: t('artisan.published'), value: published.length, color: 'text-olive-light', bg: 'bg-olive/20' },
            { icon: Clock, label: t('artisan.drafts'), value: draftCount, color: 'text-taupe', bg: 'bg-walnut-light/30' },
            { icon: MessageSquare, label: t('artisan.newInquiries'), value: newInquiries.length, color: 'text-terracotta-light', bg: 'bg-terracotta/20' },
            { icon: AlertCircle, label: t('artisan.processingFailures'), value: failures.length, color: 'text-terracotta', bg: 'bg-terracotta-dark/20' },
          ].map((stat, i) => (
            <motion.div key={i} variants={staggerItem} className="card-surface p-4">
              <div className={`w-10 h-10 rounded-lg ${stat.bg} flex items-center justify-center ${stat.color} mb-3`}>
                <stat.icon size={20} />
              </div>
              <p className="text-2xl font-serif text-ivory">{stat.value}</p>
              <p className="text-xs text-taupe mt-1">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Voice Onboarding Banner */}
        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="card-surface p-6 mb-8 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-terracotta/20 flex items-center justify-center text-terracotta shrink-0">
            <Mic size={24} />
          </div>
          <div>
            <h3 className="text-ivory font-medium">{t('artisan.voiceOnboarding')}</h3>
            <p className="text-sm text-taupe mt-1">
              {language === 'hi' ? 'दिखाएं → बोलें → AI → पुष्टि → बेचें' : 'Show → Speak → AI → Confirm → Sell'}
            </p>
          </div>
          <Link to="/artisan/products/new" className="btn-secondary ml-auto text-sm">
            <Plus size={14} /> {t('artisan.addProduct')}
          </Link>
        </motion.div>

        {/* Recent Products */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-serif text-xl text-ivory">{t('artisan.recentProducts')}</h2>
              <Link to="/artisan/products" className="text-sm text-terracotta hover:text-terracotta-light">{t('artisan.myProducts')}</Link>
            </div>
            <div className="space-y-3">
              {myProducts.slice(0, 5).map((p) => (
                <Link key={p.id} to={`/artisan/products/${p.id}`} className="card-surface p-4 flex items-center gap-4 hover:border-terracotta/50 transition-colors group">
                  <img src={p.imageUrl} alt={p.titleEn} className="w-16 h-16 rounded-lg object-cover shrink-0" />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm text-ivory truncate group-hover:text-terracotta-light">{language === 'hi' ? p.titleHi : p.titleEn}</h3>
                    <p className="text-xs text-taupe mt-1">₹{p.priceMin}–₹{p.priceMax}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${p.status === 'published' ? 'bg-olive/20 text-olive-light' : 'bg-walnut-light/30 text-taupe'}`}>
                    {p.status}
                  </span>
                </Link>
              ))}
              {myProducts.length === 0 && (
                <div className="card-surface p-8 text-center">
                  <Package className="text-taupe/40 mx-auto mb-3" size={32} />
                  <p className="text-taupe text-sm">{language === 'hi' ? 'अभी कोई उत्पाद नहीं।' : 'No products yet.'}</p>
                  <Link to="/artisan/products/new" className="btn-primary mt-4 text-sm">
                    <Plus size={14} /> {t('artisan.addProduct')}
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <Link to="/artisan/inquiries" className="card-surface p-4 block hover:border-terracotta/50 transition-colors">
              <div className="flex items-center gap-3 mb-2">
                <MessageSquare size={18} className="text-terracotta-light" />
                <h3 className="text-sm text-ivory font-medium">{t('artisan.inquiries')}</h3>
              </div>
              <p className="text-xs text-taupe">{newInquiries.length} {t('artisan.newInquiries').toLowerCase()}</p>
            </Link>
            <Link to="/artisan/profile" className="card-surface p-4 block hover:border-terracotta/50 transition-colors">
              <div className="flex items-center gap-3 mb-2">
                <Package size={18} className="text-olive-light" />
                <h3 className="text-sm text-ivory font-medium">{t('artisan.profile')}</h3>
              </div>
              <p className="text-xs text-taupe">{artisan?.location} · {artisan?.craftType}</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
