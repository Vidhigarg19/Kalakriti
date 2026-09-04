import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, LogOut, ChevronLeft, Check, X, AlertCircle, ScrollText, FileWarning } from 'lucide-react';
import { useApp } from '@/lib/store';
import { fadeUp, staggerContainer, staggerItem } from '@/lib/animations';
import type { AuditLog } from '@/types';

export function AdminPage() {
  const { t, language, user, products, auditLogs, addAuditLog, updateProduct, logout } = useApp();
  const navigate = useNavigate();
  const [tab, setTab] = useState<'moderation' | 'failures' | 'audit'>('moderation');
  const [overrideTarget, setOverrideTarget] = useState<string | null>(null);
  const [overrideReason, setOverrideReason] = useState('');

  // Products with low confidence or uncertain fields for moderation
  const moderationItems = products.filter((p) => p.status === 'review' || (p.aiConfidence < 0.85 && p.status === 'published'));
  const failures = products.filter((p) => p.status === 'processing');
  const aiWarnings = products.filter((p) => p.uncertainFields.length > 0 && p.status === 'published');

  const handleApprove = (id: string) => {
    updateProduct(id, { status: 'published' });
    addAuditLog({
      id: `audit-${Date.now()}`,
      actorId: user?.id || 'admin',
      actorRole: 'admin',
      action: 'approve',
      targetType: 'product',
      targetId: id,
      timestamp: new Date().toISOString(),
    });
  };

  const handleReject = (id: string) => {
    updateProduct(id, { status: 'paused' });
    addAuditLog({
      id: `audit-${Date.now()}`,
      actorId: user?.id || 'admin',
      actorRole: 'admin',
      action: 'reject',
      targetType: 'product',
      targetId: id,
      timestamp: new Date().toISOString(),
    });
  };

  const handleOverride = () => {
    if (!overrideTarget || !overrideReason) return;
    updateProduct(overrideTarget, { status: 'published', uncertainFields: [] });
    addAuditLog({
      id: `audit-${Date.now()}`,
      actorId: user?.id || 'admin',
      actorRole: 'admin',
      action: 'override',
      targetType: 'product',
      targetId: overrideTarget,
      reason: overrideReason,
      timestamp: new Date().toISOString(),
    });
    setOverrideTarget(null);
    setOverrideReason('');
  };

  const tabs = [
    { key: 'moderation' as const, label: t('admin.moderation'), icon: Shield, count: moderationItems.length },
    { key: 'failures' as const, label: t('admin.processingFailures'), icon: FileWarning, count: failures.length },
    { key: 'audit' as const, label: t('admin.auditLogs'), icon: ScrollText, count: auditLogs.length },
  ];

  return (
    <div className="min-h-screen bg-hero grain-overlay warm-vignette py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <button onClick={() => navigate('/')} className="flex items-center gap-1 text-taupe hover:text-ivory text-sm mb-2">
              <ChevronLeft size={16} /> {t('common.back')}
            </button>
            <h1 className="font-serif text-3xl text-ivory">{t('admin.title')}</h1>
          </div>
          <button onClick={() => { logout(); navigate('/'); }} className="btn-ghost"><LogOut size={14} /> {t('nav.logout')}</button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto no-scrollbar">
          {tabs.map((tb) => (
            <button
              key={tb.key}
              onClick={() => setTab(tb.key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-colors whitespace-nowrap ${tab === tb.key ? 'bg-terracotta text-ivory' : 'bg-walnut text-taupe hover:text-ivory'}`}
            >
              <tb.icon size={16} />
              {tb.label}
              {tb.count > 0 && <span className="px-1.5 py-0.5 bg-terracotta/20 text-terracotta-light text-xs rounded-full">{tb.count}</span>}
            </button>
          ))}
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          {tab === 'moderation' && (
            <motion.div key="mod" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {moderationItems.length === 0 && aiWarnings.length === 0 ? (
                <div className="card-surface p-8 text-center">
                  <Check className="text-olive-light mx-auto mb-3" size={32} />
                  <p className="text-taupe">{language === 'hi' ? 'सब कुछ ठीक है।' : 'All clear.'}</p>
                </div>
              ) : (
                <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-4">
                  {moderationItems.map((p) => (
                    <motion.div key={p.id} variants={staggerItem} className="card-surface p-4 flex items-center gap-4">
                      <img src={p.imageUrl} alt="" className="w-16 h-16 rounded-lg object-cover shrink-0" />
                      <div className="flex-1">
                        <h3 className="text-sm text-ivory">{p.titleEn}</h3>
                        <p className="text-xs text-taupe mt-1">AI {t('workflow.ai.confidence')}: {Math.round(p.aiConfidence * 100)}%</p>
                        {p.uncertainFields.length > 0 && (
                          <p className="text-xs text-terracotta-light mt-1">{t('admin.aiWarnings')}: {p.uncertainFields.join(', ')}</p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => handleApprove(p.id)} className="btn-secondary text-sm"><Check size={14} /> {t('admin.approve')}</button>
                        <button onClick={() => handleReject(p.id)} className="btn-ghost text-terracotta text-sm"><X size={14} /> {t('admin.reject')}</button>
                        <button onClick={() => setOverrideTarget(p.id)} className="btn-ghost text-sm">{t('admin.override')}</button>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </motion.div>
          )}

          {tab === 'failures' && (
            <motion.div key="fail" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {failures.length === 0 ? (
                <div className="card-surface p-8 text-center">
                  <Check className="text-olive-light mx-auto mb-3" size={32} />
                  <p className="text-taupe">{language === 'hi' ? 'कोई विफलता नहीं।' : 'No failures.'}</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {failures.map((p) => (
                    <div key={p.id} className="card-surface p-4 flex items-center gap-3">
                      <AlertCircle size={20} className="text-terracotta" />
                      <div className="flex-1">
                        <p className="text-sm text-ivory">{p.titleEn}</p>
                        <p className="text-xs text-taupe">{language === 'hi' ? 'प्रसंस्करण विफल।' : 'Processing failed.'}</p>
                      </div>
                      <button onClick={() => updateProduct(p.id, { status: 'review' })} className="btn-secondary text-sm">{t('common.retry')}</button>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {tab === 'audit' && (
            <motion.div key="audit" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {auditLogs.length === 0 ? (
                <div className="card-surface p-8 text-center">
                  <ScrollText className="text-taupe/40 mx-auto mb-3" size={32} />
                  <p className="text-taupe">{language === 'hi' ? 'कोई ऑडिट लॉग नहीं।' : 'No audit logs.'}</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {auditLogs.map((log) => (
                    <div key={log.id} className="card-surface p-3 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-walnut-light/50 flex items-center justify-center text-terracotta shrink-0">
                        <Shield size={16} />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-ivory">{log.action} · {log.targetType}</p>
                        <p className="text-xs text-taupe">{log.actorRole} · {new Date(log.timestamp).toLocaleString()}</p>
                        {log.reason && <p className="text-xs text-terracotta-light mt-1">{log.reason}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Override Modal */}
        <AnimatePresence>
          {overrideTarget && (
            <>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOverrideTarget(null)} className="fixed inset-0 bg-black/50 z-50" />
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-walnut border border-walnut-light rounded-2xl p-6 z-50">
                <h2 className="font-serif text-xl text-ivory mb-4">{t('admin.override')}</h2>
                <label className="text-sm text-taupe mb-1 block">{language === 'hi' ? 'कारण' : 'Reason'}</label>
                <textarea required rows={3} value={overrideReason} onChange={(e) => setOverrideReason(e.target.value)} className="input-field resize-none mb-4" placeholder={language === 'hi' ? 'ओवरराइड का कारण बताइए' : 'Provide a reason for override'} />
                <div className="flex gap-3">
                  <button onClick={handleOverride} disabled={!overrideReason} className="btn-primary flex-1">{t('admin.override')}</button>
                  <button onClick={() => setOverrideTarget(null)} className="btn-secondary">{t('common.cancel')}</button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
