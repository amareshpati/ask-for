'use client';

import { useCallback, useEffect, useRef } from 'react';

interface ConfettiProps {
  trigger?: boolean;
  duration?: number;
}

export function Confetti({ trigger = false, duration = 5000 }: ConfettiProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);

  const fireConfetti = useCallback(async () => {
    try {
      const confetti = (await import('canvas-confetti')).default;
      const end = Date.now() + duration;

      const colors = ['#ff6b9d', '#c44dff', '#ff4757', '#ffa502', '#2ed573', '#1e90ff'];

      const frame = () => {
        confetti({
          particleCount: 3,
          angle: 60,
          spread: 55,
          origin: { x: 0, y: 0.7 },
          colors,
        });
        confetti({
          particleCount: 3,
          angle: 120,
          spread: 55,
          origin: { x: 1, y: 0.7 },
          colors,
        });

        if (Date.now() < end) {
          animationRef.current = requestAnimationFrame(frame);
        }
      };

      frame();
    } catch {
      // Silently fail if confetti can't load
    }
  }, [duration]);

  useEffect(() => {
    if (trigger) {
      fireConfetti();
    }
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [trigger, fireConfetti]);

  return <canvas ref={canvasRef} className="pointer-events-none fixed inset-0 z-[100]" />;
}
