import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Users, LogOut, ChevronLeft, Clock, Plus, X, ShieldCheck } from 'lucide-react';
import { useApp, demoArtisans } from '@/lib/store';
import { fadeUp, staggerContainer, staggerItem } from '@/lib/animations';

export function FacilitatorPage() {
  const { t, language, user, logout } = useApp();
  const navigate = useNavigate();
  const [delegations, setDelegations] = useState<{ id: string; artisanId: string; expiresAt: number }[]>([
    { id: 'del-1', artisanId: 'artisan-001', expiresAt: Date.now() + 42 * 60 * 1000 },
  ]);
  const [showAdd, setShowAdd] = useState(false);

  const assignedArtisans = demoArtisans.slice(0, 3);

  const startOnboarding = (artisanId: string) => {
    const id = `del-${Date.now()}`;
    setDelegations([...delegations, { id, artisanId, expiresAt: Date.now() + 60 * 60 * 1000 }]);
    setShowAdd(false);
  };

  const endAccess = (id: string) => {
    setDelegations(delegations.filter((d) => d.id !== id));
  };

  const formatTimeLeft = (ms: number) => {
    const mins = Math.floor(ms / 60000);
    const secs = Math.floor((ms % 60000) / 1000);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-hero grain-overlay warm-vignette py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <button onClick={() => navigate('/')} className="flex items-center gap-1 text-taupe hover:text-ivory text-sm mb-2">
              <ChevronLeft size={16} /> {t('common.back')}
            </button>
            <h1 className="font-serif text-3xl text-ivory">{t('facilitator.title')}</h1>
            <p className="text-taupe text-sm mt-1">{t('facilitator.mode')} · {user?.name}</p>
          </div>
          <button onClick={() => { logout(); navigate('/'); }} className="btn-ghost"><LogOut size={14} /> {t('nav.logout')}</button>
        </div>

        {/* Assigned Artisans */}
        <div className="mb-8">
          <h2 className="font-serif text-xl text-ivory mb-4">{t('facilitator.assignedArtisans')}</h2>
          <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {assignedArtisans.map((a) => (
              <motion.div key={a.id} variants={staggerItem} className="card-surface p-4">
                <div className="w-10 h-10 rounded-full bg-terracotta/20 flex items-center justify-center text-terracotta font-serif text-lg mb-3">
                  {a.name.charAt(0)}
                </div>
                <h3 className="text-ivory font-medium text-sm">{language === 'hi' ? a.nameHi : a.name}</h3>
                <p className="text-xs text-taupe mt-1">{a.location} · {a.craftType}</p>
                <button onClick={() => startOnboarding(a.id)} className="btn-secondary mt-3 text-xs w-full">
                  <Plus size={12} /> {t('facilitator.startOnboarding')}
                </button>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Active Delegations */}
        <div>
          <h2 className="font-serif text-xl text-ivory mb-4">{t('facilitator.activeDelegations')}</h2>
          {delegations.length === 0 ? (
            <div className="card-surface p-8 text-center">
              <Users className="text-taupe/40 mx-auto mb-3" size={32} />
              <p className="text-taupe text-sm">{language === 'hi' ? 'कोई सक्रिय प्रतिनिधित्व नहीं।' : 'No active delegations.'}</p>
            </div>
          ) : (
            <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-4">
              {delegations.map((del) => {
                const artisan = demoArtisans.find((a) => a.id === del.artisanId);
                const timeLeft = del.expiresAt - Date.now();
                if (timeLeft <= 0) { endAccess(del.id); return null; }
                return (
                  <motion.div key={del.id} variants={staggerItem} className="card-surface p-5">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <ShieldCheck size={20} className="text-olive-light" />
                        <div>
                          <p className="text-sm text-ivory">{t('facilitator.helping')}: {artisan ? (language === 'hi' ? artisan.nameHi : artisan.name) : ''}</p>
                          <p className="text-xs text-taupe">{t('facilitator.permissions')}: Create draft, Upload media, Record audio, Edit draft</p>
                        </div>
                      </div>
                      <button onClick={() => endAccess(del.id)} className="btn-ghost text-terracotta text-sm">
                        <X size={14} /> {t('facilitator.endAccess')}
                      </button>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock size={14} className="text-terracotta-light" />
                      <span className="text-taupe">{t('facilitator.expiration')}:</span>
                      <span className="text-ivory font-mono">{formatTimeLeft(timeLeft)}</span>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
