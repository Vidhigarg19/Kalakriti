import { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Landmark, HandHeart, Building2, Mail, Send, Check } from 'lucide-react';
import { useApp } from '@/lib/store';
import { fadeUp, staggerContainer, staggerItem } from '@/lib/animations';

export function PartnersPage() {
  const { t, language } = useApp();
  const [form, setForm] = useState({ name: '', email: '', type: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const partnershipTypes = [
    { icon: Users, title: t('partners.ngo'), desc: language === 'hi' ? 'एनजीओ के साथ मिलकर कारीगरों तक मुफ़्त ऑनबोर्डिंग।' : 'Free onboarding for artisans through NGO partnerships.' },
    { icon: Landmark, title: t('partners.govt'), desc: language === 'hi' ? 'सरकारी कार्यक्रमों के साथ साझेदारी।' : 'Partnerships with government craft development programs.' },
    { icon: HandHeart, title: t('partners.cluster'), desc: language === 'hi' ? 'कारीगर समूहों का ऑनबोर्डिंग।' : 'Artisan cluster onboarding and collective support.' },
    { icon: Building2, title: t('partners.b2b'), desc: language === 'hi' ? 'भविष्य में B2B और थोक खरीदारी।' : 'Future scope for B2B and bulk procurement.' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setForm({ name: '', email: '', type: '', message: '' });
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="min-h-screen bg-hero grain-overlay warm-vignette py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <motion.div variants={fadeUp} initial="hidden" animate="visible" className="text-center mb-12">
          <h1 className="font-serif text-4xl md:text-5xl font-semibold text-ivory mb-4">{t('partners.title')}</h1>
          <p className="text-taupe text-lg">
            {language === 'hi'
              ? 'कारीगरों तक पहुंचने के लिए हम साझेदारी करते हैं।'
              : 'We partner to reach artisans where they are.'}
          </p>
        </motion.div>

        <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
          {partnershipTypes.map((pt, i) => (
            <motion.div key={i} variants={staggerItem} className="card-surface p-6">
              <div className="w-12 h-12 rounded-xl bg-olive/20 border border-olive/30 flex items-center justify-center text-olive-light mb-4">
                <pt.icon size={24} />
              </div>
              <h3 className="font-serif text-lg text-ivory mb-2">{pt.title}</h3>
              <p className="text-sm text-taupe">{pt.desc}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Contact Form */}
        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="card-surface p-8 max-w-xl mx-auto">
          <h2 className="font-serif text-2xl text-ivory mb-6">{t('partners.contact')}</h2>
          {submitted ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 rounded-full bg-olive/20 flex items-center justify-center mx-auto mb-4">
                <Check size={32} className="text-olive-light" />
              </div>
              <p className="text-ivory">{language === 'hi' ? 'आपकी पूछताछ भेज दी गई है।' : 'Your inquiry has been submitted.'}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm text-taupe mb-1 block">{t('partners.form.name')}</label>
                <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-field" />
              </div>
              <div>
                <label className="text-sm text-taupe mb-1 block">{t('partners.form.email')}</label>
                <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="input-field" />
              </div>
              <div>
                <label className="text-sm text-taupe mb-1 block">{t('partners.form.type')}</label>
                <select required value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="input-field">
                  <option value="">--</option>
                  <option value="ngo">NGO</option>
                  <option value="government">Government</option>
                  <option value="cluster">Artisan Cluster</option>
                  <option value="b2b">B2B</option>
                </select>
              </div>
              <div>
                <label className="text-sm text-taupe mb-1 block">{t('partners.form.message')}</label>
                <textarea required rows={4} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="input-field resize-none" />
              </div>
              <button type="submit" className="btn-primary w-full">
                <Send size={16} /> {t('partners.form.submit')}
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </div>
  );
}
