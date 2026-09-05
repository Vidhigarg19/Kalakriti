import { useRef, useEffect, useState } from 'react';
import { motion, useInView, animate } from 'framer-motion';
import { Camera, Mic, Sparkles, BadgeCheck, ShoppingBag } from 'lucide-react';
import { useApp } from '@/lib/store';

// ─── Step data ────────────────────────────────────────────────────────────────

const STEPS = [
  { num: 1, icon: Camera,      titleKey: 'workflow.show',    descKey: 'workflow.show.desc'    },
  { num: 2, icon: Mic,         titleKey: 'workflow.speak',   descKey: 'workflow.speak.desc'   },
  { num: 3, icon: Sparkles,    titleKey: 'workflow.ai',      descKey: 'workflow.ai.desc'      },
  { num: 4, icon: BadgeCheck,  titleKey: 'workflow.confirm', descKey: 'workflow.confirm.desc' },
  { num: 5, icon: ShoppingBag, titleKey: 'workflow.sell',    descKey: 'workflow.sell.desc'    },
] as const;

type StepKey = typeof STEPS[number]['titleKey'] | typeof STEPS[number]['descKey'];

// ─── SVG path helpers ──────────────────────────────────────────────────────────

function buildDesktopPath(width: number, height: number): string {
  const pts = STEPS.map((_, i) => ({
    x: (width / (STEPS.length - 1)) * i,
    y: height / 2 + (i % 2 === 0 ? -14 : 14),
  }));
  let d = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i], p1 = pts[i + 1];
    const cx = (p0.x + p1.x) / 2;
    d += ` C ${cx} ${p0.y}, ${cx} ${p1.y}, ${p1.x} ${p1.y}`;
  }
  return d;
}

function buildMobilePath(segH: number): string {
  const pts = STEPS.map((_, i) => ({
    x: 50 + (i % 2 === 0 ? -10 : 10),
    y: segH * i + segH / 2,
  }));
  let d = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i], p1 = pts[i + 1];
    const cy = (p0.y + p1.y) / 2;
    d += ` C ${p0.x} ${cy}, ${p1.x} ${cy}, ${p1.x} ${p1.y}`;
  }
  return d;
}

// ─── Animated Thread ──────────────────────────────────────────────────────────

interface ThreadProps {
  pathD: string;
  viewBox: string;
  triggered: boolean;
  stepProgress: number;
  isMobile?: boolean;
}

function AnimatedThread({ pathD, viewBox, triggered, stepProgress, isMobile }: ThreadProps) {
  const pathRef     = useRef<SVGPathElement>(null);
  const particleRef = useRef<SVGCircleElement>(null);
  const glowRef     = useRef<SVGCircleElement>(null);
  const [totalLen, setTotalLen] = useState(0);

  useEffect(() => {
    if (pathRef.current) setTotalLen(pathRef.current.getTotalLength());
  }, [pathD]);

  const dashOffset = totalLen > 0 ? totalLen * (1 - stepProgress) : totalLen;

  useEffect(() => {
    if (!pathRef.current || !particleRef.current || !glowRef.current || totalLen === 0 || !triggered) return;
    const path = pathRef.current;
    const pt   = particleRef.current;
    const gl   = glowRef.current;
    const start = performance.now();
    const dur   = 3400;
    let raf: number;
    function tick(now: number) {
      const raw = Math.min((now - start) / dur, 1);
      const t = raw < 0.5 ? 2 * raw * raw : -1 + (4 - 2 * raw) * raw;
      const pos = path.getPointAtLength(t * totalLen);
      pt.setAttribute('cx', String(pos.x));
      pt.setAttribute('cy', String(pos.y));
      gl.setAttribute('cx', String(pos.x));
      gl.setAttribute('cy', String(pos.y));
      const alpha = raw < 0.05 ? raw / 0.05 : raw > 0.92 ? (1 - raw) / 0.08 : 1;
      pt.style.opacity = String(alpha * 0.95);
      gl.style.opacity = String(alpha * 0.45);
      if (raw < 1) raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [triggered, totalLen]);

  return (
    <svg
      viewBox={viewBox}
      preserveAspectRatio="none"
      className="absolute inset-0 w-full h-full pointer-events-none"
      aria-hidden="true"
    >
      <defs>
        <filter id="thread-glow" x="-20%" y="-150%" width="140%" height="400%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="2.5" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <filter id="pt-glow" x="-300%" y="-300%" width="700%" height="700%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="6" />
        </filter>
        <linearGradient id="thread-grad" gradientUnits="userSpaceOnUse" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%"   stopColor="#C1502E" stopOpacity="0.65" />
          <stop offset="35%"  stopColor="#D4A24A" stopOpacity="0.9"  />
          <stop offset="65%"  stopColor="#E8B060" stopOpacity="1"    />
          <stop offset="100%" stopColor="#C1502E" stopOpacity="0.7"  />
        </linearGradient>
      </defs>
      {/* Ghost rail */}
      <path d={pathD} fill="none" stroke="rgba(193,80,46,0.10)" strokeWidth={isMobile ? 2 : 2.5} strokeLinecap="round" />
      {/* Live drawn thread */}
      <path
        ref={pathRef}
        d={pathD}
        fill="none"
        stroke="url(#thread-grad)"
        strokeWidth={isMobile ? 2.5 : 3}
        strokeLinecap="round"
        strokeDasharray={totalLen}
        strokeDashoffset={triggered ? dashOffset : totalLen}
        filter="url(#thread-glow)"
        style={{ transition: triggered ? `stroke-dashoffset 3.4s cubic-bezier(0.25,0.46,0.45,0.94)` : 'none' }}
      />
      {/* Glow halo */}
      <circle ref={glowRef} r={isMobile ? 14 : 18} fill="rgba(212,162,74,0.2)" filter="url(#pt-glow)" cx={0} cy={0} style={{ opacity: 0 }} />
      {/* Bright particle */}
      <circle ref={particleRef} r={isMobile ? 3 : 4} fill="#F0C060" cx={0} cy={0} style={{ opacity: 0 }} />
    </svg>
  );
}

// ─── Step Circle ──────────────────────────────────────────────────────────────

interface StepCircleProps {
  num: number;
  icon: React.ElementType;
  isActive: boolean;
  delay: number;
  triggered: boolean;
  label: string;
  desc: string;
  isMobile?: boolean;
}

function StepCircle({ num, icon: Icon, isActive, delay, triggered, label, desc, isMobile }: StepCircleProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: isMobile ? 0 : 22, x: isMobile ? -14 : 0 }}
      animate={triggered ? { opacity: 1, y: 0, x: 0 } : {}}
      transition={{ duration: 0.65, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={`group flex flex-col items-center text-center ${isMobile ? 'flex-row gap-5 items-start text-left' : ''}`}
    >
      {/* Badge + circle wrapper */}
      <div className={`relative ${isMobile ? 'shrink-0' : 'mb-3'}`}>
        {/* Number badge */}
        <div
          className={`absolute -top-2 -right-2 z-10 w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold font-serif transition-all duration-500 ${
            isActive
              ? 'bg-terracotta text-ivory shadow-[0_0_14px_rgba(193,80,46,0.75)]'
              : 'bg-walnut-light text-taupe'
          }`}
        >
          {num}
        </div>

        {/* Main circle */}
        <motion.div
          whileHover={{ scale: 1.08 }}
          transition={{ duration: 0.28 }}
          className={`relative flex items-center justify-center rounded-full border-2 transition-all duration-500
            ${isMobile ? 'w-16 h-16' : 'w-20 h-20 md:w-[88px] md:h-[88px]'}
            ${isActive
              ? 'border-terracotta bg-walnut'
              : 'border-walnut-light bg-walnut group-hover:border-terracotta/40'
            }`}
          style={isActive ? {
            boxShadow: '0 0 28px rgba(193,80,46,0.42), 0 0 8px rgba(212,162,74,0.32), inset 0 0 18px rgba(212,162,74,0.08)',
          } : undefined}
        >
          {/* Dashed inner ring */}
          <div className={`absolute inset-[5px] rounded-full border border-dashed transition-colors duration-500 ${isActive ? 'border-terracotta/40' : 'border-walnut-light/35 group-hover:border-terracotta/30'}`} />
          {/* Icon */}
          <Icon
            size={isMobile ? 20 : 26}
            className={`relative z-10 transition-all duration-500 ${isActive ? 'text-amber-300 drop-shadow-[0_0_8px_rgba(245,196,80,0.65)]' : 'text-taupe group-hover:text-terracotta-light'}`}
          />
        </motion.div>
      </div>

      {/* Text */}
      <div className={isMobile ? 'pt-1' : ''}>
        <h3 className={`font-serif text-sm md:text-base lg:text-lg font-semibold transition-colors duration-500 ${isActive ? 'text-amber-200' : 'text-taupe/80 group-hover:text-ivory'}`}>
          {label}
        </h3>
        <div className={`mt-1 h-px transition-all duration-500 ${isMobile ? '' : 'mx-auto'} ${isActive ? 'w-8 bg-terracotta/65' : 'w-3 bg-walnut-light group-hover:w-6 group-hover:bg-terracotta/35'}`} />
        <p className="mt-2 text-xs text-taupe/65 leading-snug max-w-[9rem]">
          {desc}
        </p>
      </div>
    </motion.div>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────

export function HowItWorksSection() {
  const { t } = useApp();
  const sectionRef   = useRef<HTMLElement>(null);
  const desktopTrack = useRef<HTMLDivElement>(null);
  const mobileTrack  = useRef<HTMLDivElement>(null);

  const inView = useInView(sectionRef, { once: true, margin: '-80px' });

  const [activeStep,   setActiveStep]   = useState(-1);
  const [progress,     setProgress]     = useState(0);
  const [desktopPath,  setDesktopPath]  = useState('');
  const [desktopVB,    setDesktopVB]    = useState('0 0 1000 80');
  const [mobilePath,   setMobilePath]   = useState('');
  const [mobileVB,     setMobileVB]     = useState('0 0 100 600');

  // Measure and build SVG paths
  useEffect(() => {
    function measure() {
      if (desktopTrack.current) {
        const { width, height } = desktopTrack.current.getBoundingClientRect();
        if (width > 0 && height > 0) {
          setDesktopPath(buildDesktopPath(width, height));
          setDesktopVB(`0 0 ${width} ${height}`);
        }
      }
      if (mobileTrack.current) {
        const { width, height } = mobileTrack.current.getBoundingClientRect();
        if (width > 0 && height > 0) {
          const segH = height / STEPS.length;
          setMobilePath(buildMobilePath(segH));
          setMobileVB(`0 0 ${width} ${height}`);
        }
      }
    }
    // Small delay to let layout paint first
    const t = setTimeout(measure, 80);
    window.addEventListener('resize', measure);
    return () => { clearTimeout(t); window.removeEventListener('resize', measure); };
  }, []);

  // Animation sequence triggered by viewport entry
  useEffect(() => {
    if (!inView) return;
    const stepTimings = [0.5, 1.15, 1.82, 2.48, 3.15]; // seconds

    const ctrl = animate(0, 1, {
      duration: 3.4,
      ease: [0.25, 0.46, 0.45, 0.94],
      onUpdate: (v) => setProgress(v),
    });

    const timers = stepTimings.map((t, i) =>
      setTimeout(() => setActiveStep(i), t * 1000)
    );

    return () => {
      ctrl.stop();
      timers.forEach(clearTimeout);
    };
  }, [inView]);

  return (
    <section
      ref={sectionRef}
      id="how-it-works"
      className="relative py-20 md:py-28 overflow-hidden"
      aria-labelledby="hiw-heading"
    >
      {/* ── Background layers ── */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'linear-gradient(180deg, #15100c 0%, #1f1712 45%, #1a130f 100%)' }}
      />
      <div aria-hidden="true" className="absolute inset-0 weave-texture opacity-30 pointer-events-none" />
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' /%3E%3C/svg%3E\")",
          backgroundSize: '200px 200px',
          opacity: 0.04,
        }}
      />
      {/* Amber spotlight */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 70% 55% at 50% 62%, rgba(212,162,74,0.09) 0%, rgba(193,80,46,0.07) 42%, transparent 68%)' }}
      />

      {/* Floating dust particles */}
      {Array.from({ length: 18 }, (_, i) => (
        <motion.span
          key={i}
          aria-hidden="true"
          className="absolute rounded-full pointer-events-none"
          style={{
            width: `${1 + (i % 3)}px`,
            height: `${1 + (i % 3)}px`,
            top: `${10 + ((i * 47) % 75)}%`,
            left: `${5 + ((i * 61) % 90)}%`,
            background: i % 4 === 0 ? 'rgba(193,80,46,0.45)' : 'rgba(212,195,165,0.55)',
            filter: 'blur(0.3px)',
          }}
          animate={{ y: [0, -(40 + (i % 4) * 8), 0], opacity: [0, 0.5 + (i % 3) * 0.1, 0] }}
          transition={{ duration: 6 + (i % 5), repeat: Infinity, ease: 'easeInOut', delay: (i % 10) * 0.35 }}
        />
      ))}

      {/* Corner decorative text */}
      <p className="absolute top-6 left-6 text-[9px] font-medium tracking-[0.3em] text-taupe/25 uppercase hidden lg:block select-none" aria-hidden="true">
        Local Artisans<br />Global Reach
      </p>
      <p className="absolute top-6 right-6 text-[9px] font-medium tracking-[0.3em] text-taupe/25 uppercase text-right hidden lg:block select-none" aria-hidden="true">
        Tradition<br />Meets<br />Technology
      </p>

      {/* ── Main content ── */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section heading */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="text-center"
        >
          <h2
            id="hiw-heading"
            className="font-serif text-4xl md:text-5xl lg:text-[3.75rem] font-semibold text-ivory leading-tight"
          >
            {t('workflow.heading' as StepKey)}
          </h2>
        </motion.div>

        {/* Decorative divider */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0.3 }}
          animate={inView ? { opacity: 1, scaleX: 1 } : {}}
          transition={{ duration: 0.9, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="flex items-center justify-center gap-3 mt-4 mb-14 md:mb-20"
        >
          <span className="h-px w-12 md:w-24 bg-gradient-to-r from-transparent to-terracotta/55" />
          <span className="text-terracotta text-xl font-serif select-none" aria-hidden="true">✦</span>
          <span className="h-px w-12 md:w-24 bg-gradient-to-l from-transparent to-terracotta/55" />
        </motion.div>

        {/* ── DESKTOP (md+) ── */}
        <div className="hidden md:block">
          <div className="relative">
            {/* Thread SVG layer */}
            <div
              ref={desktopTrack}
              className="absolute left-0 right-0 pointer-events-none"
              style={{ top: '42%', transform: 'translateY(-50%)', height: '80px' }}
            >
              {desktopPath && (
                <AnimatedThread
                  pathD={desktopPath}
                  viewBox={desktopVB}
                  triggered={inView}
                  stepProgress={progress}
                />
              )}
            </div>

            {/* Step circles */}
            <div className="relative z-10 grid grid-cols-5 gap-2">
              {STEPS.map((step, i) => (
                <StepCircle
                  key={step.num}
                  num={step.num}
                  icon={step.icon}
                  isActive={activeStep >= i}
                  delay={0.3 + i * 0.1}
                  triggered={inView}
                  label={t(step.titleKey as StepKey)}
                  desc={t(step.descKey as StepKey)}
                />
              ))}
            </div>
          </div>
        </div>

        {/* ── MOBILE (<md) ── */}
        <div className="md:hidden">
          <div
            ref={mobileTrack}
            className="relative"
            style={{ minHeight: `${STEPS.length * 120}px` }}
          >
            {mobilePath && (
              <AnimatedThread
                pathD={mobilePath}
                viewBox={mobileVB}
                triggered={inView}
                stepProgress={progress}
                isMobile
              />
            )}
            <div className="relative z-10 flex flex-col">
              {STEPS.map((step, i) => (
                <div key={step.num} className="flex items-center h-[120px] pl-[68px]">
                  <StepCircle
                    num={step.num}
                    icon={step.icon}
                    isActive={activeStep >= i}
                    delay={0.3 + i * 0.12}
                    triggered={inView}
                    label={t(step.titleKey as StepKey)}
                    desc={t(step.descKey as StepKey)}
                    isMobile
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom tagline */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 3.7 }}
          className="mt-14 md:mt-20 text-center"
        >
          <div className="inline-flex items-center gap-4">
            <span className="h-px w-8 md:w-16 bg-gradient-to-r from-transparent to-taupe/25" />
            <p className="text-[10px] tracking-[0.35em] text-taupe/40 uppercase font-medium select-none">
              {t('workflow.tagline' as StepKey)}
            </p>
            <span className="h-px w-8 md:w-16 bg-gradient-to-l from-transparent to-taupe/25" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
