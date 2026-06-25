'use client';

import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import Link from 'next/link';
import { AnimatedBackground, Button } from '@/components/ui';

export default function NotFound() {
  return (
    <main className="min-h-dvh relative flex items-center justify-center px-6">
      <AnimatedBackground theme="neutral" intensity={0.5} />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 text-center max-w-md"
      >
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="text-8xl mb-6"
        >
          🔮
        </motion.div>
        <h1 className="text-4xl font-black text-surface-900 mb-3">
          404
        </h1>
        <p className="text-lg text-surface-500 mb-8">
          Oops! This page doesn&apos;t exist.
        </p>
        <Link href="/">
          <Button icon={<Sparkles className="w-4 h-4" />}>
            Go Home
          </Button>
        </Link>
      </motion.div>
    </main>
  );
}
