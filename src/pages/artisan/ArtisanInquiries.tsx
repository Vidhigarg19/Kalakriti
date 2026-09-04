import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LogOut, ShieldOff, MessageSquare, ChevronLeft, Check, Clock } from 'lucide-react';
import { useApp } from '@/lib/store';
import { fadeUp, staggerContainer, staggerItem } from '@/lib/animations';

export function ArtisanInquiries() {
  const { t, language, user, inquiries, products, updateInquiryStatus, logout, secureLogout } = useApp();
  const navigate = useNavigate();
  const myInquiries = inquiries.filter((i) => i.artisanId === user?.artisanId);

  return (
    <div className="min-h-screen bg-hero grain-overlay warm-vignette py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-taupe hover:text-ivory text-sm mb-2">
              <ChevronLeft size={16} /> {t('common.back')}
            </button>
            <h1 className="font-serif text-3xl text-ivory">{t('artisan.inquiries')}</h1>
          </div>
          <div className="flex gap-2">
            <button onClick={() => { logout(); navigate('/'); }} className="btn-ghost"><LogOut size={14} /> {t('nav.logout')}</button>
            <button onClick={() => { secureLogout(); navigate('/'); }} className="btn-ghost text-terracotta"><ShieldOff size={14} /> {t('nav.secureLogout')}</button>
          </div>
        </div>

        {myInquiries.length === 0 ? (
          <div className="card-surface p-12 text-center">
            <MessageSquare className="text-taupe/40 mx-auto mb-4" size={40} />
            <p className="text-taupe">{language === 'hi' ? 'कोई पूछताछ नहीं।' : 'No inquiries yet.'}</p>
          </div>
        ) : (
          <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-4">
            {myInquiries.map((inq) => {
              const product = products.find((p) => p.id === inq.productId);
              return (
                <motion.div key={inq.id} variants={staggerItem} className="card-surface p-5">
                  <div className="flex items-start gap-4">
                    {product && <img src={product.imageUrl} alt="" className="w-16 h-16 rounded-lg object-cover shrink-0" />}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-ivory font-medium">{inq.buyerName}</h3>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${inq.status === 'new' ? 'bg-terracotta/20 text-terracotta-light' : inq.status === 'responded' ? 'bg-olive/20 text-olive-light' : 'bg-walnut-light/30 text-taupe'}`}>
                          {inq.status}
                        </span>
                      </div>
                      <p className="text-sm text-taupe mb-2">{inq.message}</p>
                      <p className="text-xs text-taupe/60">{inq.buyerContact} · {new Date(inq.createdAt).toLocaleDateString()}</p>
                      {inq.status === 'new' && (
                        <button onClick={() => updateInquiryStatus(inq.id, 'responded')} className="btn-primary mt-3 text-sm">
                          <Check size={14} /> {language === 'hi' ? 'जवाब दिया' : 'Mark Responded'}
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </div>
    </div>
  );
}
