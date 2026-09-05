import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, Camera, Mic, CheckCircle, Store, ArrowRight } from 'lucide-react';
import { useApp } from '@/lib/store';
import kalakritiLogo from '@/assets/kalakriti-logo.png';

export function WorkflowStrip() {
  const { t } = useApp();

  const steps = [
    { icon: Camera, label: t('workflow.show') },
    { icon: Mic, label: t('workflow.speak') },
    { icon: Sparkles, label: t('workflow.ai') },
    { icon: CheckCircle, label: t('workflow.confirm') },
    { icon: Store, label: t('workflow.sell') },
  ];

  return (
    <div className="flex items-center justify-center gap-2 sm:gap-4 md:gap-6 flex-wrap">
      {steps.map((step, i) => (
        <div key={i} className="flex items-center gap-2 sm:gap-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="flex flex-col items-center gap-2"
          >
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-walnut-light/50 border border-walnut-light flex items-center justify-center text-terracotta">
              <step.icon size={20} />
            </div>
            <span className="text-xs sm:text-sm text-taupe font-medium">{step.label}</span>
          </motion.div>
          {i < steps.length - 1 && (
            <ArrowRight className="text-walnut-light hidden sm:block" size={16} />
          )}
        </div>
      ))}
    </div>
  );
}

export function Footer() {
  const { t } = useApp();

  return (
    <footer className="bg-hero border-t border-walnut-light/30 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <Link to="/" className="inline-block mb-3">
              <img
                src={kalakritiLogo}
                alt="Kalakriti+"
                className="h-16 sm:h-20 w-auto max-w-[260px] sm:max-w-[340px] object-contain"
                loading="lazy"
              />
            </Link>
            <p className="text-sm text-taupe max-w-md leading-relaxed">
              {t('hero.subtitle')}
            </p>
            <div className="mt-4">
              <Link to="/auth" className="btn-primary text-sm">
                {t('hero.cta.sell')} <ArrowRight size={14} />
              </Link>
            </div>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-ivory mb-3">Explore</h4>
            <ul className="space-y-2">
              <li><Link to="/catalog" className="text-sm text-taupe hover:text-terracotta transition-colors">{t('nav.explore')}</Link></li>
              <li><Link to="/about" className="text-sm text-taupe hover:text-terracotta transition-colors">{t('nav.about')}</Link></li>
              <li><Link to="/partners" className="text-sm text-taupe hover:text-terracotta transition-colors">{t('nav.partnerships')}</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-ivory mb-3">Account</h4>
            <ul className="space-y-2">
              <li><Link to="/auth" className="text-sm text-taupe hover:text-terracotta transition-colors">{t('nav.signIn')}</Link></li>
              <li><Link to="/auth/artisan" className="text-sm text-taupe hover:text-terracotta transition-colors">{t('auth.role.artisan')}</Link></li>
              <li><Link to="/auth/buyer" className="text-sm text-taupe hover:text-terracotta transition-colors">{t('auth.role.buyer')}</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-10 pt-6 border-t border-walnut-light/30 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-taupe/60">
            © 2026 Kalakriti+. {t('common.demoContent')}.
          </p>
          <p className="text-xs text-taupe/60">
            Built for SIH demonstration · Pan-India craft marketplace
          </p>
        </div>
      </div>
    </footer>
  );
}
