import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, ShieldCheck, Mic, Camera, Heart, Users, Hand } from 'lucide-react';
import { useApp } from '@/lib/store';
import { WorkflowStrip } from '@/components/Footer';
import { fadeUp, staggerContainer, staggerItem, softFloat } from '@/lib/animations';
import { demoArtisans } from '@/data/seed';

export function HomePage() {
  const { t, language, products } = useApp();
  const publishedProducts = products.filter((p) => p.status === 'published');

  return (
    <div className="bg-hero grain-overlay warm-vignette">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        {/* Background texture */}
        <div className="absolute inset-0 weave-texture opacity-30" />
        <div className="absolute inset-0 warm-vignette" />

        {/* Warm light orbs */}
        <motion.div
          className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full bg-terracotta/10 blur-3xl"
          animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-1/4 left-1/4 w-80 h-80 rounded-full bg-olive/10 blur-3xl"
          animate={{ scale: [1, 1.15, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left: Text block (~45%) */}
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="lg:max-w-[45%]"
            >
              <motion.h1
                variants={fadeUp}
                className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold text-ivory leading-[1.1] text-balance"
              >
                Crafts that{' '}
                <span className="italic text-terracotta">{t('hero.titleHighlight')}</span>
                {' '}for themselves
              </motion.h1>

              <motion.p
                variants={fadeUp}
                className="mt-6 text-lg text-taupe/90 leading-relaxed max-w-md"
              >
                {t('hero.subtitle')}
              </motion.p>

              <motion.div
                variants={fadeUp}
                className="mt-8 flex flex-wrap gap-4"
              >
                <Link to="/catalog" className="btn-primary group">
                  {t('hero.cta.explore')}
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link to="/auth/artisan" className="btn-secondary group">
                  {t('hero.cta.sell')}
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
            </motion.div>

            {/* Right: Image cluster */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="relative hidden lg:block"
            >
              <div className="relative w-full max-w-md mx-auto">
                <motion.div
                  variants={softFloat}
                  initial="hidden"
                  animate="visible"
                  className="relative z-20 rounded-2xl overflow-hidden shadow-2xl border border-walnut-light/30"
                >
                  <img
                    src="https://images.pexels.com/photos/28303415/pexels-photo-28303415.jpeg?auto=compress&cs=tinysrgb&w=600"
                    alt="Handwoven textile"
                    className="w-full h-[400px] object-cover"
                    loading="eager"
                  />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6, duration: 0.8 }}
                  className="absolute -bottom-8 -left-8 w-40 h-40 rounded-xl overflow-hidden shadow-xl border border-walnut-light/30 z-10"
                >
                  <img
                    src="https://images.pexels.com/photos/14367748/pexels-photo-14367748.jpeg?auto=compress&cs=tinysrgb&w=300"
                    alt="Bamboo basket"
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8, duration: 0.8 }}
                  className="absolute -top-6 -right-6 w-32 h-32 rounded-lg overflow-hidden shadow-xl border border-walnut-light/30 z-30"
                >
                  <img
                    src="https://images.pexels.com/photos/6786952/pexels-photo-6786952.jpeg?auto=compress&cs=tinysrgb&w=300"
                    alt="Embroidered textile"
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Workflow Strip */}
      <section id="how-it-works" className="py-16 bg-walnut-dark/50 border-y border-walnut-light/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h2 className="font-serif text-2xl md:text-3xl text-ivory mb-2">
              {language === 'hi' ? 'कैसे काम करता है' : 'How It Works'}
            </h2>
            <p className="text-taupe text-sm">
              {language === 'hi'
                ? 'दिखाएं → बोलें → AI → पुष्टि → बेचें'
                : 'Show → Speak → AI → Confirm → Sell'}
            </p>
          </motion.div>
          <WorkflowStrip />
        </div>
      </section>

      {/* Social Impact Purpose */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center"
        >
          <motion.div variants={staggerItem} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-olive/20 border border-olive/30 text-olive-light text-sm mb-6">
            <Heart size={14} />
            {language === 'hi' ? 'सामाजिक प्रभाव' : 'Social Impact'}
          </motion.div>
          <motion.h2 variants={staggerItem} className="section-heading mb-6">
            {language === 'hi'
              ? 'हम कारीगरों को ई-कॉमर्स विक्रेता नहीं बनाते।'
              : "We don't teach artisans to become e-commerce sellers."}
          </motion.h2>
          <motion.p variants={staggerItem} className="text-lg text-taupe leading-relaxed">
            {language === 'hi'
              ? 'हम ई-कॉमर्स को कारीगरों के संवाद के तरीके के अनुसार ढालते हैं। आवाज़ और दृश्य पर आधारित, टाइपिंग पर नहीं।'
              : 'We make e-commerce adapt to the way artisans naturally communicate. Voice and visual first, not typing.'}
          </motion.p>
        </motion.div>
      </section>

      {/* Craft Categories */}
      <section className="py-16 bg-walnut-dark/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="section-heading text-center mb-12"
          >
            {language === 'hi' ? 'शिल्प श्रेणियां' : 'Craft Categories'}
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: Hand, titleEn: 'Wool & Fiber', titleHi: 'ऊन और फाइबर', desc: 'Shawls, stoles, caps, cushion covers' },
              { icon: ShieldCheck, titleEn: 'Bamboo Craft', titleHi: 'बांस शिल्प', desc: 'Baskets, containers, decorative pieces' },
              { icon: Sparkles, titleEn: 'Textile Art', titleHi: 'कपड़ा कला', desc: 'Embroidery, wall hangings, decorative textiles' },
            ].map((cat, i) => (
              <motion.div
                key={i}
                variants={staggerItem}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="card-surface p-6 hover:border-terracotta/50 transition-colors group"
              >
                <div className="w-12 h-12 rounded-xl bg-terracotta/20 flex items-center justify-center text-terracotta mb-4 group-hover:scale-110 transition-transform">
                  <cat.icon size={24} />
                </div>
                <h3 className="font-serif text-xl text-ivory mb-2">
                  {language === 'hi' ? cat.titleHi : cat.titleEn}
                </h3>
                <p className="text-sm text-taupe">{cat.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="flex items-end justify-between mb-10"
        >
          <div>
            <h2 className="section-heading">{language === 'hi' ? 'विशेष उत्पाद' : 'Featured Crafts'}</h2>
            <p className="text-taupe mt-2">{t('catalog.subtitle')}</p>
          </div>
          <Link to="/catalog" className="hidden sm:flex items-center gap-1 text-terracotta hover:text-terracotta-light text-sm font-medium">
            {language === 'hi' ? 'सभी देखें' : 'View all'} <ArrowRight size={14} />
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {publishedProducts.slice(0, 3).map((product, i) => {
            const artisan = demoArtisans.find((a) => a.id === product.artisanId);
            return (
              <motion.div
                key={product.id}
                variants={staggerItem}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                <Link to={`/catalog/${product.id}`} className="block group">
                  <div className="relative overflow-hidden rounded-2xl mb-4 shadow-xl">
                    <img
                      src={product.imageUrl}
                      alt={language === 'hi' ? product.titleHi : product.titleEn}
                      className="w-full h-72 object-cover group-hover:scale-105 transition-transform duration-700"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-hero/60 to-transparent" />
                    {product.isDemo && (
                      <span className="absolute top-3 left-3 px-2 py-0.5 bg-olive/80 text-ivory text-xs rounded-full">
                        {t('common.demoContent')}
                      </span>
                    )}
                  </div>
                  <h3 className="font-serif text-lg text-ivory group-hover:text-terracotta transition-colors">
                    {language === 'hi' ? product.titleHi : product.titleEn}
                  </h3>
                  <p className="text-sm text-taupe mt-1">{artisan?.name} · {artisan?.location}</p>
                  <p className="text-sm text-terracotta-light mt-2">
                    ₹{product.priceMin}–₹{product.priceMax}
                  </p>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Artisan Voice Stories */}
      <section className="py-16 bg-walnut-dark/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="section-heading text-center mb-12"
          >
            {language === 'hi' ? 'कारीगर आवाज़' : 'Artisan Voices'}
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {demoArtisans.slice(0, 3).map((artisan, i) => (
              <motion.div
                key={artisan.id}
                variants={staggerItem}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="card-surface p-6"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-terracotta/20 border border-terracotta/30 flex items-center justify-center text-terracotta font-serif text-lg">
                    {artisan.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-medium text-ivory">
                      {language === 'hi' ? artisan.nameHi : artisan.name}
                    </h3>
                    <p className="text-xs text-taupe">{artisan.location} · {language === 'hi' ? artisan.craftTypeHi : artisan.craftType}</p>
                  </div>
                </div>
                <p className="text-sm text-taupe leading-relaxed italic">
                  "{language === 'hi' ? artisan.bioHi : artisan.bio}"
                </p>
                <div className="mt-3">
                  <span className="text-xs text-olive-light">{t('common.demoContent')}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Ethical AI */}
      <section className="py-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center"
        >
          <motion.div variants={staggerItem} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-terracotta/20 border border-terracotta/30 text-terracotta-light text-sm mb-6">
            <ShieldCheck size={14} />
            {language === 'hi' ? 'नैतिक AI' : 'Ethical AI'}
          </motion.div>
          <motion.h2 variants={staggerItem} className="section-heading mb-6">
            {language === 'hi' ? 'AI केवल तथ्य निकालता है, रचता नहीं' : 'AI extracts facts. It never invents.'}
          </motion.h2>
          <motion.p variants={staggerItem} className="text-lg text-taupe leading-relaxed mb-8">
            {language === 'hi'
              ? 'हम केवल कारीगर द्वारा बोले गए या दृश्य से समर्थित तथ्यों को निकालते हैं। कभी प्रमाणन, विरासत स्थिति, या गुणवत्ता गारंटी नहीं बनाते। मूल्य मार्गदर्शन है, अधिकार नहीं।'
              : 'We extract only facts explicitly spoken by the artisan or visually supported. We never invent certifications, heritage status, or quality guarantees. Pricing is guidance, never an authoritative valuation.'}
          </motion.p>
          <motion.div variants={staggerItem} className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-10">
            {[
              { icon: Mic, label: language === 'hi' ? 'आवाज़ पहले' : 'Voice First', desc: language === 'hi' ? 'टाइपिंग ज़रूरी नहीं' : 'No typing required' },
              { icon: ShieldCheck, label: language === 'hi' ? 'सुरक्षित पहचान' : 'Secure Identity', desc: language === 'hi' ? 'साझा फोन सुरक्षित' : 'Shared phone safe' },
              { icon: Users, label: language === 'hi' ? 'कारीगर स्वामित्व' : 'Artisan Ownership', desc: language === 'hi' ? 'हर बदलाव कारीगर की मंज़ूरी से' : 'Every change artisan-approved' },
            ].map((item, i) => (
              <div key={i} className="text-center">
                <div className="w-12 h-12 rounded-xl bg-walnut-light/50 border border-walnut-light flex items-center justify-center text-terracotta mx-auto mb-3">
                  <item.icon size={20} />
                </div>
                <h4 className="text-sm font-medium text-ivory mb-1">{item.label}</h4>
                <p className="text-xs text-taupe">{item.desc}</p>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* Partnership CTA */}
      <section className="py-20 bg-walnut-dark/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <h2 className="section-heading mb-4">
              {language === 'hi' ? 'साझेदारी करें' : 'Partner With Us'}
            </h2>
            <p className="text-taupe text-lg mb-8 max-w-2xl mx-auto">
              {language === 'hi'
                ? 'एनजीओ, सरकारी कार्यक्रम, और कारीगर समूहों के साथ मिलकर काम करते हैं।'
                : 'We work with NGOs, government programs, and artisan clusters to bring crafts online.'}
            </p>
            <Link to="/partners" className="btn-primary">
              {language === 'hi' ? 'संपर्क करें' : 'Get in Touch'} <ArrowRight size={18} />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
