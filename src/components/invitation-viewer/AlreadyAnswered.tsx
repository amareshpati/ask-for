'use client';

import { motion } from 'framer-motion';
import { AnimatedBackground } from '@/components/ui';

export function AlreadyAnswered() {
  return (
    <main className="min-h-dvh relative flex items-center justify-center px-6 py-12 theme-recipient">
      <AnimatedBackground theme="neutral" intensity={0.5} />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 text-center max-w-md"
      >
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="text-7xl mb-6"
        >
          💌
        </motion.div>
        <h1 className="text-3xl font-bold text-surface-900 mb-3">
          Already Answered
        </h1>
        <p className="text-lg text-surface-500 leading-relaxed">
          This invitation has already been answered. Thank you for visiting!
        </p>
        <div className="mt-8">
          <a
            href="/"
            className="text-date-purple font-semibold hover:underline"
          >
            Create your own invitation →
          </a>
        </div>
      </motion.div>
    </main>
  );
}
