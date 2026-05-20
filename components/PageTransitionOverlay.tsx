import React from 'react';
import { motion } from 'framer-motion';

export default function PageTransitionOverlay() {
  return (
    <motion.div
      initial={{ y: '-100%' }}
      animate={{ y: '0%' }}
      exit={{ y: '100%' }}
      transition={{ duration: 0.8, ease: [0.2, 0.8, 0.2, 1] }}
      className="pointer-events-none fixed inset-0 z-50 bg-gradient-to-b from-black/90 via-[#021126]/60 to-transparent"
    />
  );
}
