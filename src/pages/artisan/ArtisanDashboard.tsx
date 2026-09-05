import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  MapPin,
  BadgeCheck,
  Mic,
  FileText,
  Sparkles,
  UploadCloud,
  Eye,
  Heart,
  ShoppingBag,
  ShoppingCart,
  Package,
  IndianRupee,
  ChevronRight,
  ChevronDown,
} from 'lucide-react';
import { useApp, demoArtisans } from '@/lib/store';
import { fadeUp, staggerContainer, staggerItem } from '@/lib/animations';

// Adjust these paths/filenames if yours differ (e.g. src/assets/images/...)
import artisanHandsImg from '@/assets/artisan-hands.png';
import avatarPlaceholderImg from '@/assets/avatar-placeholder.png';

export function ArtisanDashboard() {
  const { t, language, user, products, inquiries } = useApp();
  const navigate = useNavigate();

  const artisan = demoArtisans.find((a) => a.id === user?.artisanId);
  const myProducts = products.filter((p) => p.artisanId === user?.artisanId);
  const published = myProducts.filter((p) => p.status === 'published');
  const myInquiries = inquiries.filter((i) => i.artisanId === user?.artisanId);

  const totalEarnings = published.reduce(
    (sum, p) => sum + (p.suggestedPrice || p.priceMin) * (p.stockQuantity || 1),
    0
  );
  const thisMonthEarnings = Math.floor(totalEarnings * 0.3);
  const totalProducts = myProducts.length;
  const totalOrders = myInquiries.length;
  const productViews = Math.floor(published.length * 47 + 89);
  const totalLikes = Math.floor(published.length * 8 + 12);

  const formatINR = (amount: number) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);

  const formatNumber = (num: number) => new Intl.NumberFormat('en-IN').format(num);

  const earningsTrend = [
    { month: 'Jan', value: Math.floor(totalEarnings * 0.06) },
    { month: 'Feb', value: Math.floor(totalEarnings * 0.09) },
    { month: 'Mar', value: Math.floor(totalEarnings * 0.13) },
    { month: 'Apr', value: Math.floor(totalEarnings * 0.16) },
    { month: 'May', value: Math.floor(totalEarnings * 0.11) },
    { month: 'Jun', value: Math.floor(totalEarnings * 0.19) },
    { month: 'Jul', value: Math.floor(totalEarnings * 0.14) },
    { month: 'Aug', value: Math.floor(totalEarnings * 0.2) },
    { month: 'Sep', value: Math.floor(thisMonthEarnings) },
  ];
  const maxTrendValue = Math.max(...earningsTrend.map((e) => e.value), 1);

  // Stable per-product placeholder stats (no real "views/likes/cart" fields yet)
  const productStat = (seed: number) => ({
    views: 120 + seed * 61,
    likes: 15 + seed * 9,
    carts: 8 + seed * 5,
  });

  const greeting = (() => {
    const hour = new Date().getHours();
    if (hour < 12) return language === 'hi' ? 'सुप्रभात' : 'Good Morning';
    if (hour < 17) return language === 'hi' ? 'नमस्कार' : 'Good Afternoon';
    return language === 'hi' ? 'शुभ संध्या' : 'Good Evening';
  })();

  const artisanName = artisan ? (language === 'hi' ? artisan.nameHi : artisan.name) : user?.name;

  return (
    <>
      {/* Hero */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="relative card-surface overflow-hidden mb-6"
      >
        <div className="absolute inset-0 weave-texture opacity-20" aria-hidden="true" />
        <img
          src={artisanHandsImg}
          alt=""
          aria-hidden="true"
          className="absolute right-0 top-0 h-full w-1/2 object-cover opacity-70 [mask-image:linear-gradient(to_right,transparent,black_35%)]"
        />
        <div className="relative flex flex-col sm:flex-row sm:items-center gap-6 p-6 sm:p-8">
          <img
            src={(artisan as any)?.avatarUrl || avatarPlaceholderImg}
            alt={artisanName}
            className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-2 border-terracotta/40 shrink-0"
          />
          <div className="flex-1 min-w-0">
            <p className="text-taupe text-sm">{greeting},</p>
            <h1 className="font-serif text-3xl sm:text-4xl text-ivory flex items-center gap-2">
              {artisanName} <span className="text-terracotta text-2xl">✳</span>
            </h1>
            <p className="text-taupe text-sm mt-1">
              {language === 'hi'
                ? 'आपकी कला एक बेहतर कल को प्रेरित करती है'
                : 'Your craft inspires a brighter tomorrow'}{' '}
              <span className="text-terracotta">✳</span>
            </p>
            <div className="flex flex-wrap items-center gap-2.5 mt-4">
              <span className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full bg-walnut-dark/60 border border-walnut-light/20 text-taupe">
                <MapPin size={12} />
                {artisan?.location || '—'}
              </span>
              <span className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full bg-olive/20 text-olive-light">
                <BadgeCheck size={12} />
                Verified Artisan
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
      >
        {[
          {
            icon: Package,
            value: formatNumber(totalProducts),
            label: 'Total Products',
            delta: '+3 this month',
            color: 'text-olive-light',
            bg: 'bg-olive/20',
            highlight: false,
          },
          {
            icon: ShoppingBag,
            value: formatNumber(totalOrders),
            label: 'Total Orders',
            delta: '+12% from last month',
            color: 'text-terracotta-light',
            bg: 'bg-terracotta/20',
            highlight: false,
          },
          {
            icon: Eye,
            value: formatNumber(productViews),
            label: 'Product Views',
            delta: '+28% from last month',
            color: 'text-amber-light',
            bg: 'bg-amber/20',
            highlight: false,
          },
          {
            icon: IndianRupee,
            value: formatINR(totalEarnings),
            label: 'Total Earnings',
            delta: '+18% from last month',
            color: 'text-ivory',
            bg: 'bg-ivory/15',
            highlight: true,
          },
        ].map((stat, i) => (
          <motion.div
            key={i}
            variants={staggerItem}
            className={`relative p-5 rounded-2xl ${
              stat.highlight
                ? 'bg-gradient-to-br from-terracotta to-terracotta-dark text-ivory'
                : 'card-surface'
            }`}
          >
            <div className="flex items-start justify-between">
              <div
                className={`w-11 h-11 rounded-xl flex items-center justify-center ${stat.bg} ${
                  stat.highlight ? 'text-ivory' : stat.color
                }`}
              >
                <stat.icon size={20} />
              </div>
              <ChevronRight
                size={16}
                className={stat.highlight ? 'text-ivory/70' : 'text-taupe/50'}
              />
            </div>
            <p className="font-serif text-2xl sm:text-3xl mt-3 text-ivory">{stat.value}</p>
            <p className={`text-xs mt-0.5 ${stat.highlight ? 'text-ivory/80' : 'text-taupe'}`}>
              {stat.label}
            </p>
            <p className={`text-[11px] mt-1.5 ${stat.highlight ? 'text-ivory/70' : 'text-olive-light'}`}>
              {stat.delta}
            </p>
          </motion.div>
        ))}
      </motion.div>

      {/* Voice panel + Earnings panel */}
      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6 mb-6">
        {/* Add New Product - voice panel */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="card-surface p-6 sm:p-8 relative overflow-hidden"
        >
          <div className="flex flex-col sm:flex-row sm:items-center gap-6">
            <div className="flex-1">
              <h2 className="font-serif text-2xl sm:text-3xl text-ivory">
                {t('artisan.addProduct') || 'Add New Product'}
              </h2>
              <p className="text-taupe text-sm mt-2 max-w-sm">
                {language === 'hi'
                  ? 'बस अपने शिल्प के बारे में बोलें, और हम आपकी एक सुंदर उत्पाद सूची बनाने में मदद करेंगे।'
                  : "Just speak about your craft, and we'll help you create a beautiful product listing."}
              </p>

              <div className="flex flex-wrap gap-5 mt-6">
                {[
                  { icon: FileText, label: 'Describe your product' },
                  { icon: Sparkles, label: 'Our AI creates the listing for you' },
                  { icon: UploadCloud, label: 'Review & publish in seconds' },
                ].map((step) => (
                  <div key={step.label} className="flex flex-col items-center text-center gap-2 w-24">
                    <div className="w-11 h-11 rounded-full bg-walnut-dark/60 border border-walnut-light/20 flex items-center justify-center text-terracotta">
                      <step.icon size={18} />
                    </div>
                    <p className="text-[11px] text-taupe leading-tight">{step.label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col items-center gap-3 shrink-0">
              <button
                onClick={() => navigate('/artisan/products/new')}
                aria-label={t('artisan.addProduct') || 'Add product by voice'}
                className="relative w-24 h-24 rounded-full bg-gradient-to-br from-terracotta to-terracotta-dark flex items-center justify-center text-ivory shadow-[0_0_50px_rgba(193,80,46,0.35)] hover:shadow-[0_0_65px_rgba(193,80,46,0.5)] transition-shadow"
              >
                <span className="absolute inset-0 rounded-full border-2 border-terracotta/30 animate-ping" />
                <Mic size={34} />
              </button>
              <p className="text-sm text-ivory/80">Tap and speak</p>
              <p className="text-[11px] text-taupe/60 italic max-w-[10rem]">
                e.g. "A handpainted Madhubani wall art..."
              </p>
            </div>
          </div>
        </motion.div>

        {/* Earnings panel */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="card-surface p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-serif text-lg text-ivory">Total Earnings</h2>
            <button className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-walnut-dark/50 border border-walnut-light/20 text-taupe">
              This Month <ChevronDown size={12} />
            </button>
          </div>

          <p className="font-serif text-3xl text-ivory">{formatINR(totalEarnings)}</p>
          <p className="text-xs text-olive-light mt-1">↑ 18% from last month</p>

          <div className="h-28 mt-5 flex items-end gap-1.5">
            {earningsTrend.map((point) => (
              <div
                key={point.month}
                className="flex-1 rounded-t bg-gradient-to-t from-terracotta to-terracotta-light"
                style={{
                  height: `${Math.max((point.value / maxTrendValue) * 100, 6)}%`,
                }}
                title={`${point.month}: ${formatINR(point.value)}`}
              />
            ))}
          </div>

          <div className="grid grid-cols-3 gap-2 mt-6 pt-5 border-t border-walnut-light/20">
            <div className="text-center">
              <p className="text-lg font-serif text-ivory">{formatNumber(totalOrders)}</p>
              <p className="text-[11px] text-taupe mt-0.5 flex items-center justify-center gap-1">
                <ShoppingBag size={11} /> Orders
              </p>
            </div>
            <div className="text-center">
              <p className="text-lg font-serif text-ivory">{formatNumber(productViews)}</p>
              <p className="text-[11px] text-taupe mt-0.5 flex items-center justify-center gap-1">
                <Eye size={11} /> Views
              </p>
            </div>
            <div className="text-center">
              <p className="text-lg font-serif text-ivory">{formatNumber(totalLikes)}</p>
              <p className="text-[11px] text-taupe mt-0.5 flex items-center justify-center gap-1">
                <Heart size={11} /> Likes
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Recent Products + story card */}
      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6">
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-serif text-xl text-ivory">{t('artisan.recentProducts') || 'Recent Products'}</h2>
            <Link
              to="/artisan/products"
              className="flex items-center gap-1 text-sm text-terracotta hover:text-terracotta-light transition-colors"
            >
              View All <ChevronRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {myProducts.slice(0, 3).map((p, i) => {
              const stat = productStat(i);
              return (
                <Link
                  key={p.id}
                  to={`/artisan/products/${p.id}`}
                  className="card-surface overflow-hidden group hover:border-terracotta/50 transition-colors"
                >
                  <div className="relative aspect-[4/3]">
                    <img
                      src={p.imageUrl}
                      alt={p.titleEn}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                    <span
                      className={`absolute top-2 left-2 text-[10px] px-2 py-0.5 rounded-full ${
                        p.status === 'published'
                          ? 'bg-olive/90 text-ivory'
                          : p.status === 'draft'
                            ? 'bg-amber/90 text-walnut-dark'
                            : 'bg-terracotta/90 text-ivory'
                      }`}
                    >
                      {p.status === 'published' ? 'Active' : p.status}
                    </span>
                  </div>
                  <div className="p-4">
                    <h3 className="text-sm text-ivory truncate group-hover:text-terracotta-light transition-colors">
                      {language === 'hi' ? p.titleHi : p.titleEn}
                    </h3>
                    <p className="text-terracotta-light text-sm mt-1">
                      {formatINR(p.suggestedPrice || p.priceMin)}
                    </p>
                    <div className="flex items-center gap-3 mt-3 pt-3 border-t border-walnut-light/20 text-[11px] text-taupe">
                      <span className="flex items-center gap-1">
                        <Eye size={12} /> {stat.views}
                      </span>
                      <span className="flex items-center gap-1">
                        <Heart size={12} /> {stat.likes}
                      </span>
                      <span className="flex items-center gap-1">
                        <ShoppingCart size={12} /> {stat.carts}
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}

            {myProducts.length === 0 && (
              <div className="sm:col-span-3 card-surface p-10 text-center">
                <Package className="text-taupe/40 mx-auto mb-4" size={40} />
                <p className="text-taupe text-sm mb-4">
                  {language === 'hi'
                    ? 'अभी कोई उत्पाद नहीं। अपनी पहली कृति जोड़ना शुरू करें!'
                    : 'No products yet. Start by adding your first creation!'}
                </p>
                <Link to="/artisan/products/new" className="btn-primary inline-flex">
                  {t('artisan.addProduct') || 'Add Product'}
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Story card */}
        <div className="relative rounded-2xl overflow-hidden min-h-[220px]">
          <img
            src={artisanHandsImg}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-walnut-dark/90 via-walnut-dark/40 to-transparent" />
          <div className="relative h-full flex items-end p-6">
            <p className="font-serif text-2xl text-ivory leading-snug">
              Every craft
              <br />
              has a story.
              <br />
              What's yours?
            </p>
          </div>
        </div>
      </div>
    </>
  );
}