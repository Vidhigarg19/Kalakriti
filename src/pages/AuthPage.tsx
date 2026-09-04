import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, KeyRound, ShieldCheck, ArrowRight, ChevronLeft, User, ShoppingBag, Users, Shield } from 'lucide-react';
import { useApp } from '@/lib/store';
import { demoArtisans } from '@/data/seed';
import { fadeUp, staggerContainer, staggerItem } from '@/lib/animations';
import type { UserRole, Language } from '@/types';

interface AuthPageProps {
  initialRole?: UserRole;
}

export function AuthPage({ initialRole }: AuthPageProps) {
  const { t, language, login, setLanguage } = useApp();
  const navigate = useNavigate();
  const [role, setRole] = useState<UserRole>(initialRole || 'artisan');
  const [step, setStep] = useState<'role' | 'phone' | 'otp' | 'pin'>('role');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [pin, setPin] = useState('');
  const [pinConfirm, setPinConfirm] = useState('');
  const [error, setError] = useState('');

  const roles: { value: UserRole; label: string; icon: typeof User }[] = [
    { value: 'artisan', label: t('auth.role.artisan'), icon: User },
    { value: 'buyer', label: t('auth.role.buyer'), icon: ShoppingBag },
    { value: 'facilitator', label: t('auth.role.facilitator'), icon: Users },
    { value: 'admin', label: t('auth.role.admin'), icon: Shield },
  ];

  const handleSendOtp = () => {
    if (phone.length < 10) { setError('Enter a valid phone number'); return; }
    setError('');
    setStep('otp');
  };

  const handleVerifyOtp = () => {
    if (otp !== '123456') { setError('Demo OTP is 123456'); return; }
    setError('');
    if (role === 'artisan') setStep('pin');
    else completeLogin();
  };

  const handleSetPin = () => {
    if (pin.length < 6) { setError('PIN must be at least 6 digits'); return; }
    if (pin !== pinConfirm) { setError('PINs do not match'); return; }
    setError('');
    completeLogin();
  };

  const completeLogin = () => {
    const artisan = demoArtisans[0];
    const user = {
      id: role === 'artisan' ? artisan.id : `user-${role}-${Date.now()}`,
      role,
      name: role === 'artisan' ? artisan.name : role === 'buyer' ? 'Demo Buyer' : role === 'facilitator' ? 'Demo Facilitator' : 'Admin',
      nameHi: role === 'artisan' ? artisan.nameHi : undefined,
      phone,
      preferredLanguage: language,
      artisanId: role === 'artisan' ? artisan.id : undefined,
    };
    login(user);
    if (role === 'artisan') navigate('/artisan/dashboard');
    else if (role === 'buyer') navigate('/buyer/favorites');
    else if (role === 'facilitator') navigate('/facilitator');
    else navigate('/admin');
  };

  return (
    <div className="min-h-screen bg-hero grain-overlay warm-vignette flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        <motion.div variants={fadeUp} initial="hidden" animate="visible" className="text-center mb-8">
          <h1 className="font-serif text-3xl font-semibold text-ivory mb-2">{t('auth.title')}</h1>
          <p className="text-taupe text-sm">{t('auth.subtitle')}</p>
        </motion.div>

        <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="card-surface p-6 sm:p-8">
          {/* Language toggle */}
          <div className="flex justify-end mb-4 gap-2">
            {(['en', 'hi'] as Language[]).map((l) => (
              <button
                key={l}
                onClick={() => setLanguage(l)}
                className={`px-3 py-1 text-xs rounded-lg uppercase transition-colors ${language === l ? 'bg-terracotta text-ivory' : 'bg-walnut text-taupe'}`}
              >
                {l}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {step === 'role' && (
              <motion.div key="role" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-3">
                  {roles.map((r) => (
                    <motion.button
                      key={r.value}
                      variants={staggerItem}
                      onClick={() => { setRole(r.value); setStep('phone'); }}
                      className={`w-full flex items-center gap-3 p-4 rounded-xl border transition-all ${role === r.value ? 'border-terracotta bg-terracotta/10' : 'border-walnut-light hover:border-walnut-light/50'}`}
                    >
                      <div className="w-10 h-10 rounded-lg bg-walnut-light/50 flex items-center justify-center text-terracotta">
                        <r.icon size={20} />
                      </div>
                      <span className="text-ivory text-sm font-medium">{r.label}</span>
                      <ArrowRight size={16} className="text-taupe ml-auto" />
                    </motion.button>
                  ))}
                </motion.div>
              </motion.div>
            )}

            {step === 'phone' && (
              <motion.div key="phone" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <button onClick={() => setStep('role')} className="flex items-center gap-1 text-taupe hover:text-ivory text-sm mb-4">
                  <ChevronLeft size={14} /> {t('common.back')}
                </button>
                <label className="text-sm text-taupe mb-1 block">{t('auth.phone')}</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-taupe/50" size={18} />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="input-field pl-10"
                    autoFocus
                  />
                </div>
                {error && <p className="text-terracotta-light text-sm mt-2">{error}</p>}
                <button onClick={handleSendOtp} className="btn-primary w-full mt-4">
                  {t('auth.sendOtp')} <ArrowRight size={16} />
                </button>
                <p className="text-xs text-taupe/60 mt-3 text-center">{t('auth.sharedDevice')} · {t('auth.doNotRemember')}</p>
              </motion.div>
            )}

            {step === 'otp' && (
              <motion.div key="otp" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <button onClick={() => setStep('phone')} className="flex items-center gap-1 text-taupe hover:text-ivory text-sm mb-4">
                  <ChevronLeft size={14} /> {t('common.back')}
                </button>
                <label className="text-sm text-taupe mb-1 block">{t('auth.otp')}</label>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 text-taupe/50" size={18} />
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="123456"
                    className="input-field pl-10 tracking-widest text-center text-lg"
                    autoFocus
                  />
                </div>
                <p className="text-xs text-olive-light mt-2 text-center">{t('auth.demoOtpHint')}</p>
                {error && <p className="text-terracotta-light text-sm mt-2">{error}</p>}
                <button onClick={handleVerifyOtp} className="btn-primary w-full mt-4">
                  {t('auth.verifyOtp')} <ShieldCheck size={16} />
                </button>
              </motion.div>
            )}

            {step === 'pin' && (
              <motion.div key="pin" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <label className="text-sm text-taupe mb-1 block">{t('auth.setPin')}</label>
                <input
                  type="password"
                  inputMode="numeric"
                  maxLength={6}
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  placeholder="••••••"
                  className="input-field tracking-widest text-center text-lg mb-3"
                  autoFocus
                />
                <label className="text-sm text-taupe mb-1 block">{t('auth.confirmPin')}</label>
                <input
                  type="password"
                  inputMode="numeric"
                  maxLength={6}
                  value={pinConfirm}
                  onChange={(e) => setPinConfirm(e.target.value)}
                  placeholder="••••••"
                  className="input-field tracking-widest text-center text-lg"
                />
                {error && <p className="text-terracotta-light text-sm mt-2">{error}</p>}
                <button onClick={handleSetPin} className="btn-primary w-full mt-4">
                  {t('auth.savePin')} <ShieldCheck size={16} />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <p className="text-center text-xs text-taupe/60 mt-4">
          {t('auth.logoutNeutral')}
        </p>
        <p className="text-center mt-2">
          <Link to="/" className="text-xs text-taupe hover:text-terracotta">{t('common.back')}</Link>
        </p>
      </div>
    </div>
  );
}
