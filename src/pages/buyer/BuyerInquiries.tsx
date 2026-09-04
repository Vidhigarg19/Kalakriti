import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LogOut, ChevronLeft, MessageSquare, ShoppingBag } from 'lucide-react';
import { useApp } from '@/lib/store';
import { fadeUp, staggerContainer, staggerItem } from '@/lib/animations';

export function BuyerInquiries() {
  const { t, language, user, inquiries, products, logout } = useApp();
  const navigate = useNavigate();
  // For demo, show all inquiries as buyer inquiries
  const myInquiries = inquiries.slice(0, 4);

  return (
    <div className="min-h-screen bg-hero grain-overlay warm-vignette py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <button onClick={() => navigate('/')} className="flex items-center gap-1 text-taupe hover:text-ivory text-sm mb-2">
              <ChevronLeft size={16} /> {t('common.back')}
            </button>
            <h1 className="font-serif text-3xl text-ivory">{t('buyer.inquiries')}</h1>
          </div>
          <button onClick={() => { logout(); navigate('/'); }} className="btn-ghost"><LogOut size={14} /> {t('nav.logout')}</button>
        </div>

        {myInquiries.length === 0 ? (
          <div className="card-surface p-12 text-center">
            <MessageSquare className="text-taupe/40 mx-auto mb-4" size={40} />
            <p className="text-taupe">{t('buyer.noInquiries')}</p>
            <Link to="/catalog" className="btn-primary mt-4"><ShoppingBag size={16} /> {t('nav.explore')}</Link>
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
                      <Link to={product ? `/catalog/${product.id}` : '#'} className="text-ivory font-medium hover:text-terracotta-light">
                        {product ? (language === 'hi' ? product.titleHi : product.titleEn) : 'Product'}
                      </Link>
                      <p className="text-sm text-taupe mt-1">{inq.message}</p>
                      <p className="text-xs text-taupe/60 mt-1">{new Date(inq.createdAt).toLocaleDateString()} · {inq.status}</p>
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
