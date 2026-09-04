import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Target, Calendar, Mic, ShieldCheck, Users, HandHeart, ArrowRight } from 'lucide-react';
import { useApp } from '@/lib/store';
import { fadeUp, staggerContainer, staggerItem } from '@/lib/animations';

export function AboutPage() {
  const { t, language } = useApp();

  const sections = [
    {
      icon: Target,
      title: t('about.mission'),
      content: language === 'hi'
        ? 'कलाकृति+ कारीगरों को अपनी भाषा में दिखाने, बोलने और बेचने में मदद करता है। हम ई-कॉमर्स को कारीगरों के संवार के तरीके के अनुसार ढालते हैं।'
        : 'Kalakriti+ helps artisans show, speak, and sell in their own language. We make e-commerce adapt to the way artisans naturally communicate.',
    },
    {
      icon: Calendar,
      title: t('about.problem'),
      content: language === 'hi'
        ? 'कारीगर साल भर ऑनलाइन नहीं बेच सकते क्योंकि उनके पास फोटोग्राफी, अंग्रेज़ी लेखन, डिजिटल सूचीकरण, और मूल्य निर्धारण की जानकारी नहीं है। वे केवल दिल्ली हाट, सुरजकुंड मेला, और शिल्प समागम जैसे मेलों में बेच सकते हैं।'
        : 'Artisans cannot sell online year-round because they lack photography skills, English writing, digital cataloging knowledge, and pricing confidence. They can only sell at fairs like Dilli Haat, Surajkund Mela, and Shilp Samagam.',
    },
    {
      icon: Mic,
      title: t('about.voiceFirst'),
      content: language === 'hi'
        ? 'आवाज़ और दृश्य पर आधारित, टाइपिंग पर नहीं। कारीगर अपना उत्पाद दिखाता है, उसके बारे में बोलता है, और AI उसे समझकर सूची बनाता है।'
        : 'Voice and visual first, not typing. The artisan shows their product, speaks about it naturally, and AI understands and creates the listing.',
    },
    {
      icon: ShieldCheck,
      title: t('about.ethicalAI'),
      content: language === 'hi'
        ? 'AI केवल कारीगर द्वारा बोले गए या दृश्य से समर्थित तथ्य निकालता है। कभी प्रमाणन, विरासत स्थिति, या गुणवत्ता गारंटी नहीं बनाता। मूल्य मार्गदर्शन है, अधिकार नहीं।'
        : 'AI extracts only facts explicitly spoken by the artisan or visually supported. It never invents certifications, heritage status, or quality guarantees. Pricing is guidance, never an authoritative valuation.',
    },
    {
      icon: Users,
      title: t('about.artisanAgency'),
      content: language === 'hi'
        ? 'हर बदलाव कारीगर की मंज़ूरी से। कारीगर अपनी सामग्री, अपनी कहानी, और अपनी कीमत तय करता है। AI सिर्फ़ मदद करता है, निर्णय नहीं लेता।'
        : 'Every change requires artisan approval. The artisan decides their materials, their story, and their price. AI only assists, it does not decide.',
    },
    {
      icon: HandHeart,
      title: t('about.partnership'),
      content: language === 'hi'
        ? 'हम एनजीओ, सरकारी कार्यक्रम, और कारीगर समूहों के साथ मिलकर काम करते हैं ताकि कारीगरों तक मुफ़्त ऑनबोर्डिंग पहुंच सके।'
        : 'We work with NGOs, government programs, and artisan clusters to provide free onboarding to artisans.',
    },
  ];

  return (
    <div className="min-h-screen bg-hero grain-overlay warm-vignette py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <motion.div variants={fadeUp} initial="hidden" animate="visible" className="text-center mb-12">
          <h1 className="font-serif text-4xl md:text-5xl font-semibold text-ivory mb-4">{t('about.title')}</h1>
          <p className="text-taupe text-lg leading-relaxed">
            {language === 'hi'
              ? 'कलाकृति+ एक AI-संचालित कारीगर सूचीकरण और डिजिटल बिक्री मंच है।'
              : 'Kalakriti+ is an AI-powered artisan cataloging and digital selling platform.'}
          </p>
        </motion.div>

        <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-6">
          {sections.map((section, i) => (
            <motion.div key={i} variants={staggerItem} className="card-surface p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-terracotta/20 border border-terracotta/30 flex items-center justify-center text-terracotta shrink-0">
                  <section.icon size={24} />
                </div>
                <div>
                  <h2 className="font-serif text-xl text-ivory mb-2">{section.title}</h2>
                  <p className="text-taupe leading-relaxed">{section.content}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mt-12">
          <Link to="/partners" className="btn-primary">
            {t('nav.partnerships')} <ArrowRight size={18} />
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
