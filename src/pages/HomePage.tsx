import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, ShieldCheck, Mic, Camera, Heart, Users, Hand } from 'lucide-react';
import { useApp } from '@/lib/store';
import { HowItWorksSection } from '@/components/HowItWorksSection';
import { fadeUp, staggerContainer, staggerItem, particleDrift } from '@/lib/animations';
import { demoArtisans } from '@/data/seed';
import heroElements from '@/assets/hero-elements.png';

function WindStreaks({ count = 4 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }, (_, i) => (
        <motion.span
          key={i}
          aria-hidden="true"
          className="absolute h-[2px] rounded-full bg-gradient-to-r from-transparent via-ivory/45 to-transparent blur-[1px] pointer-events-none z-[6]"
          style={{
            width: '42%',
            top: `${16 + i * 17}%`,
            left: '-12%',
            transform: 'rotate(-11deg)',
          }}
          animate={{ x: ['0%', '280%'], opacity: [0, 0.55, 0] }}
          transition={{
            duration: 3.4 + i * 0.6,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: i * 0.85,
          }}
        />
      ))}
    </>
  );
}

export function HomePage() {
  const { t, language, products } = useApp();
  const publishedProducts = products.filter((p) => p.status === 'published');

  const particlePositions = useMemo(
    () =>
      Array.from({ length: 32 }, (_, i) => ({
        id: i,
        top: `${15 + ((i * 37) % 70)}%`,
        left: `${5 + ((i * 53) % 90)}%`,
        size: 1 + (i % 3),
        isTerra: i % 5 === 0,
      })),
    [],
  );

  return (
    <div className="bg-hero grain-overlay hero-deep-bg">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-8 pb-14 sm:pt-10 sm:pb-16 lg:pt-12 lg:pb-20">
        {/* Base texture & warm vignette layers */}
        <div className="absolute inset-0 weave-texture opacity-25 pointer-events-none" />
        <div className="absolute inset-0 warm-vignette pointer-events-none" />
        <div className="absolute inset-0 hero-warm-glow pointer-events-none" />

        {/* Cinematic amber light cone behind the object cluster */}
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(circle 520px at 78% 32%, rgba(230, 165, 90, 0.18) 0%, rgba(193, 80, 46, 0.10) 35%, transparent 65%)',
          }}
        />

        {/* Animated ambient orbs of light */}
        <motion.div
          className="absolute top-[22%] right-[14%] w-[30rem] h-[30rem] rounded-full bg-terracotta/15 blur-3xl pointer-events-none"
          animate={{ scale: [1, 1.08, 1], opacity: [0.26, 0.52, 0.26] }}
          transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-[8%] left-[8%] w-[22rem] h-[22rem] rounded-full bg-olive/10 blur-3xl pointer-events-none"
          animate={{ scale: [1, 1.12, 1], opacity: [0.18, 0.34, 0.18] }}
          transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Floating dust particles */}
        {particlePositions.map((p) => (
          <motion.span
            key={p.id}
            variants={particleDrift}
            initial="hidden"
            animate="visible"
            custom={p.id}
            aria-hidden="true"
            className={`absolute dust-dot ${p.isTerra ? 'terracotta' : ''} will-change-transform`}
            style={{
              top: p.top,
              left: p.left,
              width: `${p.size}px`,
              height: `${p.size}px`,
              zIndex: 5,
            }}
          />
        ))}

        <div className="relative w-full z-10 px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            {/* DESKTOP (lg+) */}
            <div className="hidden lg:grid lg:grid-cols-[2fr_3fr] lg:gap-6 lg:items-center">
              {/* ===== TEXT COLUMN ===== */}
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                className="relative z-40 max-w-xl lg:-mt-10"
              >
                <motion.h1
                  variants={fadeUp}
                  className="font-serif text-5xl xl:text-6xl font-semibold text-ivory leading-[1.05] tracking-[-0.015em] text-balance"
                >
                  <span className="block">Crafts that</span>
                  <span className="block mt-1">
                    <span className="italic text-terracotta">{t('hero.titleHighlight')}</span>
                    <span className="text-ivory"> for</span>
                  </span>
                  <span className="block mt-1">themselves.</span>
                </motion.h1>

                <motion.div
                  variants={fadeUp}
                  className="mt-8 flex items-center gap-4 w-full max-w-md"
                  aria-hidden="true"
                >
                  <span className="h-px flex-1 bg-gradient-to-r from-taupe/50 via-taupe/30 to-terracotta/60" />
                  <span className="text-terracotta text-[1.3rem] font-serif select-none">✿</span>
                  <span className="h-px flex-1 bg-gradient-to-l from-taupe/50 via-taupe/30 to-terracotta/60" />
                </motion.div>

                <motion.p
                  variants={fadeUp}
                  className="mt-8 text-lg xl:text-xl text-taupe/90 leading-[1.55] max-w-lg"
                >
                  {t('hero.subtitle')}
                </motion.p>

                <motion.div variants={fadeUp} className="mt-10 flex flex-nowrap gap-3">
                  <Link to="/catalog" className="btn-primary group whitespace-nowrap">
                    {t('hero.cta.explore')}
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link to="/auth/artisan" className="btn-secondary group whitespace-nowrap">
                    {t('hero.cta.sell')}
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                </motion.div>
              </motion.div>

              {/* ===== OBJECT CLUSTER COLUMN (single image) ===== */}
              <div className="relative h-[560px] xl:h-[640px] overflow-visible">
                {/* Warm halo behind the cluster */}
                <div
                  aria-hidden="true"
                  className="absolute inset-0 z-0"
                  style={{
                    background:
                      'radial-gradient(ellipse 65% 65% at 55% 40%, rgba(240, 175, 100, 0.18) 0%, rgba(193, 80, 46, 0.11) 32%, rgba(61, 43, 31, 0.26) 58%, transparent 80%)',
                    filter: 'blur(12px)',
                  }}
                />

                <WindStreaks count={4} />

                <motion.div
                  variants={fadeUp}
                  initial="hidden"
                  animate="visible"
                  className="absolute inset-0 flex items-center justify-center z-[20]"
                >
                  <motion.img
                    src={heroElements}
                    alt="Terracotta pot, bamboo basket, handwoven shawl and carved wooden blocks"
                    loading="eager"
                    animate={{
                      rotate: [-2, -4.5, -1.5, -3.5, -2],
                      y: [0, -14, -4, -16, 0],
                      skewX: [0, 1.4, -0.9, 1.1, 0],
                    }}
                    transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut' }}
                    className="w-[112%] max-w-none h-auto object-contain drop-shadow-[0_34px_60px_rgba(0,0,0,0.66)] will-change-transform select-none pointer-events-none origin-center"
                    style={{
                      filter:
                        'drop-shadow(0 0 30px rgba(230, 150, 90, 0.18)) drop-shadow(0 0 68px rgba(214, 112, 80, 0.10))',
                    }}
                  />
                </motion.div>
              </div>
            </div>

            {/* ===== TABLET (md, lg:hidden) ===== */}
            <div className="hidden md:block lg:hidden">
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                className="relative z-40 max-w-2xl mx-auto text-center md:-mt-6"
              >
                <motion.h1
                  variants={fadeUp}
                  className="font-serif text-6xl font-semibold text-ivory leading-[1.05] tracking-[-0.01em] text-balance"
                >
                  <span className="block">Crafts that</span>
                  <span className="block mt-1">
                    <span className="italic text-terracotta">{t('hero.titleHighlight')}</span>
                    <span className="text-ivory"> for</span>
                  </span>
                  <span className="block mt-1">themselves.</span>
                </motion.h1>
                <motion.div
                  variants={fadeUp}
                  className="mt-6 flex items-center gap-4 w-full max-w-sm mx-auto"
                  aria-hidden="true"
                >
                  <span className="h-px flex-1 bg-gradient-to-r from-taupe/40 to-terracotta/50" />
                  <span className="text-terracotta text-lg font-serif select-none">✿</span>
                  <span className="h-px flex-1 bg-gradient-to-l from-taupe/40 to-terracotta/50" />
                </motion.div>
                <motion.p variants={fadeUp} className="mt-6 text-lg text-taupe/90 leading-relaxed max-w-lg mx-auto">
                  {t('hero.subtitle')}
                </motion.p>
                <motion.div variants={fadeUp} className="mt-8 flex flex-nowrap justify-center gap-3">
                  <Link to="/catalog" className="btn-primary group whitespace-nowrap">
                    {t('hero.cta.explore')}
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link to="/auth/artisan" className="btn-secondary group whitespace-nowrap">
                    {t('hero.cta.sell')}
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                </motion.div>
              </motion.div>

              <div className="relative w-full max-w-2xl mx-auto mt-10 h-[440px] overflow-visible">
                <div
                  aria-hidden="true"
                  className="absolute inset-0 z-0"
                  style={{
                    background:
                      'radial-gradient(ellipse 70% 65% at 60% 40%, rgba(240, 175, 100, 0.16) 0%, rgba(193, 80, 46, 0.10) 35%, rgba(61, 43, 31, 0.28) 60%, transparent 82%)',
                    filter: 'blur(12px)',
                  }}
                />

                <WindStreaks count={3} />

                <motion.div
                  variants={fadeUp}
                  initial="hidden"
                  animate="visible"
                  className="absolute inset-0 flex items-center justify-center z-[20]"
                >
                  <motion.img
                    src={heroElements}
                    alt="Terracotta pot, bamboo basket, handwoven shawl and carved wooden blocks"
                    loading="eager"
                    animate={{
                      rotate: [-2, -4, -1.5, -3, -2],
                      y: [0, -11, -3, -13, 0],
                      skewX: [0, 1.1, -0.7, 0.9, 0],
                    }}
                    transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
                    className="w-[105%] max-w-none h-auto object-contain drop-shadow-[0_28px_50px_rgba(0,0,0,0.64)] will-change-transform select-none pointer-events-none origin-center"
                    style={{
                      filter:
                        'drop-shadow(0 0 26px rgba(230, 150, 90, 0.18)) drop-shadow(0 0 56px rgba(214, 112, 80, 0.10))',
                    }}
                  />
                </motion.div>
              </div>
            </div>

            {/* ===== MOBILE (<md) ===== */}
            <div className="md:hidden w-full max-w-xl mx-auto">
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                className="relative z-20 px-2 -mt-4"
              >
                <motion.h1
                  variants={fadeUp}
                  className="font-serif text-4xl sm:text-5xl font-semibold text-ivory leading-[1.05] tracking-[-0.01em] text-balance"
                >
                  <span className="block">Crafts that</span>
                  <span className="block mt-1">
                    <span className="italic text-terracotta">{t('hero.titleHighlight')}</span>
                    <span className="text-ivory"> for</span>
                  </span>
                  <span className="block mt-1">themselves.</span>
                </motion.h1>
                <motion.div
                  variants={fadeUp}
                  className="mt-6 flex items-center gap-3 w-full max-w-xs"
                  aria-hidden="true"
                >
                  <span className="h-px flex-1 bg-gradient-to-r from-taupe/40 to-terracotta/50" />
                  <span className="text-terracotta text-base font-serif select-none">✿</span>
                  <span className="h-px flex-1 bg-gradient-to-l from-taupe/40 to-terracotta/50" />
                </motion.div>
                <motion.p variants={fadeUp} className="mt-6 text-lg text-taupe/90 leading-relaxed">
                  {t('hero.subtitle')}
                </motion.p>
                <motion.div variants={fadeUp} className="mt-8 flex flex-wrap gap-4">
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

              <div className="relative w-full h-[380px] sm:h-[420px] mt-10 overflow-visible">
                <div
                  aria-hidden="true"
                  className="absolute inset-0 z-0"
                  style={{
                    background:
                      'radial-gradient(ellipse 70% 60% at 60% 45%, rgba(240, 175, 100, 0.14) 0%, rgba(193, 80, 46, 0.10) 35%, rgba(61, 43, 31, 0.25) 60%, transparent 82%)',
                    filter: 'blur(10px)',
                  }}
                />

                <WindStreaks count={3} />

                <motion.div
                  variants={fadeUp}
                  initial="hidden"
                  animate="visible"
                  className="absolute inset-0 flex items-center justify-center z-[20]"
                >
                  <motion.img
                    src={heroElements}
                    alt="Terracotta pot, bamboo basket, handwoven shawl and carved wooden blocks"
                    loading="eager"
                    animate={{
                      rotate: [-1.5, -3.5, -1, -2.8, -1.5],
                      y: [0, -9, -2, -10, 0],
                      skewX: [0, 0.9, -0.6, 0.8, 0],
                    }}
                    transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
                    className="w-[100%] max-w-none h-auto object-contain drop-shadow-[0_22px_40px_rgba(0,0,0,0.6)] will-change-transform select-none pointer-events-none origin-center"
                    style={{
                      filter:
                        'drop-shadow(0 0 22px rgba(230, 150, 90, 0.18)) drop-shadow(0 0 48px rgba(214, 112, 80, 0.10))',
                    }}
                  />
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <HowItWorksSection />

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