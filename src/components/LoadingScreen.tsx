import { motion } from 'framer-motion';
import loadingLogo from '@/assets/loading-logo.png';

interface LoadingScreenProps {
  onFinish?: () => void;
}

export function LoadingScreen({ onFinish }: LoadingScreenProps) {
  return (
    <motion.div
      key="kalakriti-loader"
      initial={{ opacity: 1 }}
      exit={{
        opacity: 0,
        transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
      }}
      onAnimationComplete={() => onFinish?.()}
      className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden bg-hero"
    >
      <div className="absolute inset-0 grain-overlay opacity-80" />
      <div className="absolute inset-0 weave-texture opacity-25" />
      <div className="absolute inset-0 warm-vignette" />

      <motion.div
        aria-hidden="true"
        className="absolute w-[30rem] h-[30rem] rounded-full bg-terracotta/20 blur-3xl"
        animate={{
          scale: [1, 1.12, 1],
          opacity: [0.25, 0.5, 0.25],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      <motion.div
        aria-hidden="true"
        className="absolute w-[24rem] h-[24rem] rounded-full bg-olive/15 blur-3xl"
        animate={{
          scale: [1.08, 0.95, 1.08],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 0.6,
        }}
      />

      <motion.div
        aria-hidden="true"
        className="absolute top-[14%] left-[14%] sm:top-[18%] sm:left-[16%] w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-terracotta/70"
        animate={{ y: [0, -14, 0], opacity: [0.3, 1, 0.3] }}
        transition={{ duration: 3, repeat: Infinity }}
      />
      <motion.div
        aria-hidden="true"
        className="absolute bottom-[16%] right-[14%] sm:bottom-[20%] sm:right-[18%] w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-taupe/70"
        animate={{ y: [0, 12, 0], opacity: [0.25, 0.9, 0.25] }}
        transition={{ duration: 3.4, repeat: Infinity, delay: 0.4 }}
      />
      <motion.div
        aria-hidden="true"
        className="absolute top-[65%] left-[10%] sm:left-[14%] w-1.5 h-1.5 rounded-full bg-olive-light/70"
        animate={{ y: [0, -8, 0], opacity: [0.2, 0.7, 0.2] }}
        transition={{ duration: 3.8, repeat: Infinity, delay: 0.9 }}
      />
      <motion.div
        aria-hidden="true"
        className="absolute top-[22%] right-[10%] sm:right-[13%] w-1.5 h-1.5 rounded-full bg-terracotta-light/60"
        animate={{ y: [0, 9, 0], opacity: [0.2, 0.65, 0.2] }}
        transition={{ duration: 3.6, repeat: Infinity, delay: 1.3 }}
      />

      <div className="relative z-10 flex flex-col items-center text-center px-6 sm:px-10 max-w-3xl w-full">
        <motion.div
          initial={{ opacity: 0, scale: 0.88, y: 12 }}
          animate={{
            opacity: 1,
            scale: 1,
            y: 0,
          }}
          transition={{
            duration: 0.9,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="w-full max-w-[260px] sm:max-w-[380px] md:max-w-[460px] lg:max-w-[540px]"
        >
          <motion.div
            animate={{
              y: [0, -4, 0],
            }}
            transition={{
              duration: 4.5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="relative"
          >
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -inset-6 sm:-inset-8 rounded-[40px] blur-2xl opacity-60"
              style={{
                background:
                  'radial-gradient(closest-side, rgba(193,80,46,0.35), rgba(92,110,74,0.18), transparent 70%)',
              }}
            />
            <img
              src={loadingLogo}
              alt="Kalakriti+ logo"
              className="relative w-full h-auto drop-shadow-[0_12px_40px_rgba(61,43,31,0.45)]"
              loading="eager"
            />
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, delay: 0.35, ease: 'easeOut' }}
          className="mt-10 sm:mt-12 space-y-3 w-full"
        >
          <p className="font-medium text-lg sm:text-xl md:text-2xl text-ivory/90 text-balance">
            Bringing your craft to life...
          </p>
          <div className="flex items-center justify-center gap-3">
            <span className="h-px w-8 sm:w-12 bg-gradient-to-r from-transparent to-taupe/50" />
            <p className="text-xs sm:text-sm md:text-[15px] text-taupe tracking-wide">
              Preserving tradition. Empowering artisans.
            </p>
            <span className="h-px w-8 sm:w-12 bg-gradient-to-l from-transparent to-taupe/50" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.55 }}
          className="mt-9 sm:mt-10 w-64 sm:w-72 md:w-80"
        >
          <div className="relative h-1.5 rounded-full bg-ivory/10 overflow-hidden">
            <div
              className="absolute inset-0 opacity-70"
              aria-hidden="true"
              style={{
                backgroundImage:
                  'repeating-linear-gradient(90deg, rgba(240,234,224,0.07) 0 2px, transparent 2px 7px)',
              }}
            />
            <motion.div
              className="h-full rounded-full relative"
              style={{
                background:
                  'linear-gradient(90deg, #C1502E 0%, #E07A52 45%, #5C6E4A 100%)',
              }}
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{
                duration: 1.95,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <motion.div
                aria-hidden="true"
                className="absolute top-0 right-0 h-full w-14 rounded-full blur-md opacity-80"
                style={{ background: '#F0EAE0' }}
                animate={{ opacity: [0.45, 0.95, 0.45] }}
                transition={{ duration: 1.25, repeat: Infinity }}
              />
            </motion.div>
          </div>

          <div className="mt-3.5 flex items-center justify-center gap-2 sm:gap-2.5">
            {[0, 1, 2, 3, 4].map((i) => (
              <motion.div
                key={i}
                aria-hidden="true"
                className="w-1.5 h-1.5 rounded-full bg-taupe/35"
                animate={{
                  scale: [1, 1.3, 1],
                  backgroundColor: [
                    'rgba(196,183,166,0.35)',
                    'rgba(193,80,46,0.9)',
                    'rgba(196,183,166,0.35)',
                  ],
                }}
                transition={{
                  duration: 1.25,
                  repeat: Infinity,
                  delay: i * 0.13,
                }}
              />
            ))}
          </div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-5 text-[11px] sm:text-xs text-taupe/65 tracking-[0.16em] uppercase"
        >
          Kalakriti+ · Craft · Culture · Connection
        </motion.p>
      </div>
    </motion.div>
  );
}
