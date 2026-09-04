import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Info, X } from 'lucide-react';
import { useApp } from '@/lib/store';

export function DemoBadge() {
  const { t } = useApp();
  const [showPanel, setShowPanel] = useState(false);

  const demoItems = [
    t('demo.otp'),
    t('demo.speech'),
    t('demo.image'),
    t('demo.pricing'),
    t('demo.sms'),
    t('demo.moderation'),
  ];

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={() => setShowPanel(!showPanel)}
        className="flex items-center gap-2 px-3 py-1.5 bg-olive/90 backdrop-blur-sm text-ivory text-xs font-medium rounded-full border border-olive-light/50 shadow-lg hover:bg-olive-dark transition-colors"
      >
        <span className="w-2 h-2 rounded-full bg-ivory animate-pulse" />
        {t('demo.badge')}
        <Info size={12} />
      </button>

      <AnimatePresence>
        {showPanel && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute bottom-12 right-0 w-72 bg-walnut border border-walnut-light rounded-xl shadow-2xl p-4"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-ivory">{t('demo.badge')}</h3>
              <button onClick={() => setShowPanel(false)} className="text-taupe hover:text-ivory">
                <X size={14} />
              </button>
            </div>
            <ul className="space-y-1.5">
              {demoItems.map((item, i) => (
                <li key={i} className="text-xs text-taupe flex items-start gap-2">
                  <span className="text-olive-light mt-0.5">•</span>
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function OfflineBanner() {
  const { isOnline, t } = useApp();

  return (
    <AnimatePresence>
      {!isOnline && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="bg-terracotta-dark text-ivory text-center text-sm py-2 px-4 overflow-hidden"
        >
          {t('common.offline')} — {t('workflow.show.offlineSaved')}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
