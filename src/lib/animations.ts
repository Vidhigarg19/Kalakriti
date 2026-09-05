import type { Variants } from 'framer-motion';

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
};

export const slideReveal: Variants = {
  hidden: { opacity: 0, x: -30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: 'easeOut' },
  },
};

export const softFloat: Variants = {
  hidden: { opacity: 0, y: 0 },
  visible: {
    opacity: 1,
    y: [0, -10, 0],
    transition: {
      y: { duration: 6, repeat: Infinity, ease: 'easeInOut' },
      opacity: { duration: 0.8 },
    },
  },
};

export const cardTilt: Variants = {
  rest: { rotateY: 0, rotateX: 0, scale: 1 },
  hover: {
    rotateY: 5,
    rotateX: -5,
    scale: 1.02,
    transition: { duration: 0.3, ease: 'easeOut' },
  },
};

export const pageTransition: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: 'easeOut' },
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: { duration: 0.3, ease: 'easeIn' },
  },
};

export const processingPulse: Variants = {
  hidden: { opacity: 0.5, scale: 0.98 },
  visible: {
    opacity: [0.5, 1, 0.5],
    scale: [0.98, 1, 0.98],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};

export const successBurst: Variants = {
  hidden: { opacity: 0, scale: 0.5 },
  visible: {
    opacity: 1,
    scale: [0.5, 1.2, 1],
    transition: { duration: 0.6, ease: 'easeOut' },
  },
};

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
};

export const potFloat: Variants = {
  hidden: { opacity: 0, y: 20, rotate: 0 },
  visible: {
    opacity: 1,
    y: [0, -8, 0],
    rotate: [-1.2, 0.8, -1.2],
    transition: {
      y: { duration: 7, repeat: Infinity, ease: 'easeInOut' },
      rotate: { duration: 7, repeat: Infinity, ease: 'easeInOut' },
      opacity: { duration: 0.8, ease: 'easeOut' },
    },
  },
};

export const basketFloat: Variants = {
  hidden: { opacity: 0, y: 20, rotate: 0 },
  visible: {
    opacity: 1,
    y: [0, 10, 0],
    rotate: [1, -0.5, 1],
    transition: {
      y: { duration: 9, repeat: Infinity, ease: 'easeInOut', delay: 0.3 },
      rotate: { duration: 9, repeat: Infinity, ease: 'easeInOut', delay: 0.3 },
      opacity: { duration: 0.9, ease: 'easeOut', delay: 0.2 },
    },
  },
};

export const shawlWave: Variants = {
  hidden: { opacity: 0, y: 20, rotate: 0, scaleY: 1 },
  visible: {
    opacity: 1,
    y: [0, -5, 0],
    rotate: [-2.5, 1.8, -2.5],
    scaleY: [1, 1.018, 1],
    transition: {
      y: { duration: 11, repeat: Infinity, ease: 'easeInOut', delay: 0.5 },
      rotate: { duration: 11, repeat: Infinity, ease: 'easeInOut', delay: 0.5 },
      scaleY: { duration: 11, repeat: Infinity, ease: 'easeInOut', delay: 0.5 },
      opacity: { duration: 1, ease: 'easeOut', delay: 0.1 },
    },
  },
};

export const woodFloat: Variants = {
  hidden: { opacity: 0, y: 20, rotate: 0 },
  visible: {
    opacity: 1,
    y: [0, -12, 0],
    rotate: [-3, 2, -3],
    transition: {
      y: { duration: 13, repeat: Infinity, ease: 'easeInOut', delay: 0.8 },
      rotate: { duration: 13, repeat: Infinity, ease: 'easeInOut', delay: 0.8 },
      opacity: { duration: 1, ease: 'easeOut', delay: 0.5 },
    },
  },
};

export const particleDrift: Variants = {
  hidden: { opacity: 0, y: 0, x: 0 },
  visible: (i: number) => ({
    opacity: [0, 0.5 + (i % 3) * 0.1, 0],
    y: [0, -60 - (i % 5) * 8],
    x: [(i % 2 === 0 ? 1 : -1) * (i % 4) * 4, (i % 2 === 0 ? 1 : -1) * ((i % 4) * 4 + 6)],
    transition: {
      duration: 6 + (i % 5),
      repeat: Infinity,
      ease: 'easeInOut',
      delay: (i % 10) * 0.35,
    },
  }),
};

export const potFloatGentle: Variants = {
  hidden: { opacity: 0, y: 30, rotate: 0 },
  visible: {
    opacity: 1,
    y: [0, -5, 0],
    rotate: [-0.5, 0.4, -0.5],
    transition: {
      y: { duration: 9, repeat: Infinity, ease: 'easeInOut' },
      rotate: { duration: 9, repeat: Infinity, ease: 'easeInOut' },
      opacity: { duration: 1, ease: 'easeOut' },
    },
  },
};

export const basketFloatGentle: Variants = {
  hidden: { opacity: 0, y: 30, rotate: 0 },
  visible: {
    opacity: 1,
    y: [0, 7, 0],
    rotate: [0.6, -0.3, 0.6],
    transition: {
      y: { duration: 11, repeat: Infinity, ease: 'easeInOut', delay: 0.4 },
      rotate: { duration: 11, repeat: Infinity, ease: 'easeInOut', delay: 0.4 },
      opacity: { duration: 1, ease: 'easeOut', delay: 0.2 },
    },
  },
};

export const basketFloatGentleB: Variants = {
  hidden: { opacity: 0, y: 30, rotate: 0 },
  visible: {
    opacity: 1,
    y: [0, -6, 0],
    rotate: [-0.7, 0.5, -0.7],
    transition: {
      y: { duration: 13, repeat: Infinity, ease: 'easeInOut', delay: 0.9 },
      rotate: { duration: 13, repeat: Infinity, ease: 'easeInOut', delay: 0.9 },
      opacity: { duration: 1, ease: 'easeOut', delay: 0.35 },
    },
  },
};

export const shawlWaveGentle: Variants = {
  hidden: { opacity: 0, y: 30, rotate: 0, scaleY: 1 },
  visible: {
    opacity: 1,
    y: [0, -3, 0],
    rotate: [-1.4, 1, -1.4],
    scaleY: [1, 1.01, 1],
    scaleX: [1, 1.006, 1],
    transition: {
      y: { duration: 13, repeat: Infinity, ease: 'easeInOut', delay: 0.6 },
      rotate: { duration: 13, repeat: Infinity, ease: 'easeInOut', delay: 0.6 },
      scaleY: { duration: 13, repeat: Infinity, ease: 'easeInOut', delay: 0.6 },
      scaleX: { duration: 13, repeat: Infinity, ease: 'easeInOut', delay: 0.6 },
      opacity: { duration: 1.2, ease: 'easeOut', delay: 0.1 },
    },
  },
};

export const woodFloatGentle: Variants = {
  hidden: { opacity: 0, y: 30, rotate: 0 },
  visible: {
    opacity: 1,
    y: [0, -8, 0],
    rotate: [-1.8, 1.2, -1.8],
    transition: {
      y: { duration: 15, repeat: Infinity, ease: 'easeInOut', delay: 1.0 },
      rotate: { duration: 15, repeat: Infinity, ease: 'easeInOut', delay: 1.0 },
      opacity: { duration: 1, ease: 'easeOut', delay: 0.6 },
    },
  },
};

export const woodFloatGentleB: Variants = {
  hidden: { opacity: 0, y: 30, rotate: 0 },
  visible: {
    opacity: 1,
    y: [0, -10, 0],
    rotate: [2.2, -1.4, 2.2],
    transition: {
      y: { duration: 17, repeat: Infinity, ease: 'easeInOut', delay: 1.3 },
      rotate: { duration: 17, repeat: Infinity, ease: 'easeInOut', delay: 1.3 },
      opacity: { duration: 1, ease: 'easeOut', delay: 0.9 },
    },
  },
};
