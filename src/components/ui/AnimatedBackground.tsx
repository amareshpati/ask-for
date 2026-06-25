'use client';

import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useEffect, useState } from 'react';

interface AnimatedBackgroundProps {
  theme?: 'date' | 'travel' | 'neutral';
  intensity?: number;
}

interface FloatingElement {
  id: number;
  emoji: string;
  left: string;
  delay: number;
  duration: number;
  scale: number;
  opacity: number;
}

const themes = {
  date: {
    colors: [
      'oklch(0.68 0.18 15 / 0.18)',  // Royal Red
      'oklch(0.62 0.22 285 / 0.20)', // Rich Lavender Purple
      'oklch(0.58 0.24 305 / 0.15)', // Deep Purple/Magenta
      'oklch(0.70 0.16 270 / 0.12)', // Soft Lavender-Blue/Indigo
    ],
    gradient: 'from-royal-red-light via-lavender-light to-lavender-mid/60',
  },
  travel: {
    colors: [
      'oklch(0.6 0.18 250 / 0.15)',
      'oklch(0.7 0.15 200 / 0.12)',
      'oklch(0.75 0.12 220 / 0.1)',
      'oklch(0.5 0.2 270 / 0.08)',
    ],
    gradient: 'from-blue-50 via-cyan-50/50 to-sky-50',
  },
  neutral: {
    colors: [
      'oklch(0.93 0.006 250 / 0.2)',
      'oklch(0.87 0.008 250 / 0.15)',
      'oklch(0.97 0.004 250 / 0.1)',
      'oklch(0.7 0.015 250 / 0.05)',
    ],
    gradient: 'from-surface-50 via-white to-surface-100',
  },
};

export function AnimatedBackground({
  theme = 'neutral',
  intensity = 1,
}: AnimatedBackgroundProps) {
  const [mounted, setMounted] = useState(false);
  const [particles, setParticles] = useState<FloatingElement[]>([]);
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  const springX = useSpring(mouseX, { stiffness: 50, damping: 30 });
  const springY = useSpring(mouseY, { stiffness: 50, damping: 30 });

  const x1 = useTransform(springX, [0, 1], [-20 * intensity, 20 * intensity]);
  const y1 = useTransform(springY, [0, 1], [-20 * intensity, 20 * intensity]);
  const x2 = useTransform(springX, [0, 1], [20 * intensity, -20 * intensity]);
  const y2 = useTransform(springY, [0, 1], [20 * intensity, -20 * intensity]);

  useEffect(() => {
    setMounted(true);

    const emojiList =
      theme === 'date'
        ? ['❤️', '💘', '😘', '🫶', '🤟', '💖', '💕']
        : theme === 'travel'
        ? ['✈️', '☁️', '🌍', '🗺️', '🏝️', '🎈']
        : ['✨', '🎈', '✨', '🌸'];

    const count = 15;
    const generated = Array.from({ length: count }, (_, i) => ({
      id: i,
      emoji: emojiList[Math.floor(Math.random() * emojiList.length)],
      left: `${5 + Math.random() * 90}%`,
      delay: Math.random() * 15,
      duration: 15 + Math.random() * 15, // float time 15s to 30s
      scale: 0.6 + Math.random() * 0.7,
      opacity: 0.08 + Math.random() * 0.12,
    }));
    setParticles(generated);

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX / window.innerWidth);
      mouseY.set(e.clientY / window.innerHeight);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY, theme]);

  const currentTheme = themes[theme];

  if (!mounted) {
    return (
      <div className={`fixed inset-0 -z-10 bg-gradient-to-br ${currentTheme.gradient}`} />
    );
  }

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Base gradient */}
      <motion.div
        className={`absolute inset-0 bg-gradient-to-br ${currentTheme.gradient}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      />

      {/* Animated orbs */}
      <motion.div
        className="absolute w-[600px] h-[600px] rounded-full blur-[100px]"
        style={{
          background: currentTheme.colors[0],
          x: x1,
          y: y1,
          top: '10%',
          left: '20%',
        }}
        animate={{
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      <motion.div
        className="absolute w-[500px] h-[500px] rounded-full blur-[100px]"
        style={{
          background: currentTheme.colors[1],
          x: x2,
          y: y2,
          top: '40%',
          right: '10%',
        }}
        animate={{
          scale: [1.2, 1, 1.2],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      <motion.div
        className="absolute w-[400px] h-[400px] rounded-full blur-[80px]"
        style={{
          background: currentTheme.colors[2],
          top: '60%',
          left: '50%',
        }}
        animate={{
          x: [-30, 30, -30],
          y: [-20, 20, -20],
          scale: [1, 1.3, 1],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Floating love/theme emojis */}
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
        {particles.map((p) => (
          <motion.div
            key={p.id}
            className="absolute bottom-0 text-3xl"
            style={{
              left: p.left,
              scale: p.scale,
              opacity: p.opacity,
            }}
            initial={{ y: '10vh', rotate: 0 }}
            animate={{
              y: '-110vh',
              rotate: [0, 45, -45, 0],
              x: [0, 30, -30, 0],
            }}
            transition={{
              duration: p.duration,
              delay: p.delay,
              repeat: Infinity,
              ease: 'linear',
            }}
          >
            {p.emoji}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
