import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Globe, LogOut, ShieldCheck, ChevronDown } from 'lucide-react';
import { useApp } from '@/lib/store';
import kalakritiLogo from '@/assets/kalakriti-logo.png';

export function Navigation() {
  const { t, language, setLanguage, user, logout } = useApp();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);

  const navLinks = [
    { to: '/catalog', label: t('nav.explore') },
    { to: '/#how-it-works', label: t('nav.howItWorks') },
    { to: '/about', label: t('nav.about') },
    { to: '/partners', label: t('nav.partnerships') },
  ];

  const isActive = (path: string) => {
    if (path.startsWith('/#')) return false;
    return location.pathname === path;
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-hero/80 backdrop-blur-md border-b border-walnut-light/30">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <img
              src={kalakritiLogo}
              alt="Kalakriti+"
              className="h-12 sm:h-14 w-auto max-w-[220px] sm:max-w-[280px] object-contain"
              loading="eager"
            />
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  isActive(link.to)
                    ? 'text-terracotta'
                    : 'text-taupe hover:text-ivory hover:bg-walnut-light/50'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {/* Language toggle */}
            <div className="relative">
              <button
                onClick={() => setLangOpen(!langOpen)}
                className="flex items-center gap-1 px-2 py-1.5 text-sm text-taupe hover:text-ivory rounded-lg hover:bg-walnut-light/50 transition-colors"
                aria-label="Language toggle"
              >
                <Globe size={16} />
                <span className="uppercase">{language}</span>
                <ChevronDown size={14} />
              </button>
              <AnimatePresence>
                {langOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="absolute right-0 mt-2 w-32 bg-walnut border border-walnut-light rounded-xl shadow-xl overflow-hidden"
                  >
                    <button
                      onClick={() => { setLanguage('en'); setLangOpen(false); }}
                      className={`w-full px-4 py-2 text-left text-sm hover:bg-walnut-light transition-colors ${language === 'en' ? 'text-terracotta' : 'text-taupe'}`}
                    >
                      English
                    </button>
                    <button
                      onClick={() => { setLanguage('hi'); setLangOpen(false); }}
                      className={`w-full px-4 py-2 text-left text-sm hover:bg-walnut-light transition-colors devanagari ${language === 'hi' ? 'text-terracotta' : 'text-taupe'}`}
                    >
                      हिंदी
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Auth */}
            {user ? (
              <div className="hidden md:flex items-center gap-2">
                <Link
                  to={user.role === 'artisan' ? '/artisan/dashboard' : user.role === 'buyer' ? '/buyer/favorites' : user.role === 'facilitator' ? '/facilitator' : '/admin'}
                  className="px-3 py-1.5 text-sm text-taupe hover:text-ivory rounded-lg hover:bg-walnut-light/50 transition-colors"
                >
                  {t('nav.dashboard')}
                </Link>
                <button
                  onClick={() => { logout(); navigate('/'); }}
                  className="flex items-center gap-1 px-3 py-1.5 text-sm text-taupe hover:text-terracotta rounded-lg hover:bg-walnut-light/50 transition-colors"
                >
                  <LogOut size={14} />
                  {t('nav.logout')}
                </button>
              </div>
            ) : (
              <Link
                to="/auth"
                className="hidden md:flex items-center gap-1.5 px-4 py-1.5 text-sm font-medium text-ivory bg-terracotta hover:bg-terracotta-dark rounded-lg transition-colors"
              >
                <ShieldCheck size={14} />
                {t('nav.signIn')}
              </Link>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 text-taupe hover:text-ivory"
              aria-label="Menu"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden overflow-hidden"
            >
              <div className="py-3 space-y-1 border-t border-walnut-light/30">
                {navLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setMobileOpen(false)}
                    className="block px-3 py-2 text-sm text-taupe hover:text-ivory hover:bg-walnut-light/50 rounded-lg"
                  >
                    {link.label}
                  </Link>
                ))}
                {user ? (
                  <>
                    <Link
                      to={user.role === 'artisan' ? '/artisan/dashboard' : user.role === 'buyer' ? '/buyer/favorites' : user.role === 'facilitator' ? '/facilitator' : '/admin'}
                      onClick={() => setMobileOpen(false)}
                      className="block px-3 py-2 text-sm text-taupe hover:text-ivory hover:bg-walnut-light/50 rounded-lg"
                    >
                      {t('nav.dashboard')}
                    </Link>
                    <button
                      onClick={() => { logout(); navigate('/'); setMobileOpen(false); }}
                      className="block w-full text-left px-3 py-2 text-sm text-taupe hover:text-terracotta hover:bg-walnut-light/50 rounded-lg"
                    >
                      {t('nav.logout')}
                    </button>
                  </>
                ) : (
                  <Link
                    to="/auth"
                    onClick={() => setMobileOpen(false)}
                    className="block px-3 py-2 text-sm text-terracotta hover:text-ivory hover:bg-walnut-light/50 rounded-lg"
                  >
                    {t('nav.signIn')}
                  </Link>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}
