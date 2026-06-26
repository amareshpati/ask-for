'use client';

import { motion } from 'framer-motion';

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
  labels?: string[];
}

export function ProgressBar({ currentStep, totalSteps, labels }: ProgressBarProps) {
  const progress = ((currentStep + 1) / totalSteps) * 100;

  return (
    <div className="w-full">
      {/* Step indicators */}
      <div className="flex items-center justify-between mb-2">
        {Array.from({ length: totalSteps }).map((_, index) => (
          <div key={index} className="flex flex-col items-center">
            <motion.div
              initial={false}
              animate={{
                scale: index === currentStep ? 1.2 : 1,
                backgroundColor:
                  index <= currentStep
                    ? 'var(--color-accent-500)'
                    : 'var(--color-surface-700)',
              }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className={`
                w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold
                ${
                  index <= currentStep
                    ? 'text-white shadow-glow-sm'
                    : 'text-surface-500'
                }
              `}
            >
              {index < currentStep ? (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                index + 1
              )}
            </motion.div>
            {labels && labels[index] && (
              <span className="text-[10px] text-surface-500 mt-1 hidden sm:block">
                {labels[index]}
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Progress bar */}
      <div className="w-full h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-accent-500 to-accent-400 rounded-full shadow-glow-sm"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ type: 'spring', stiffness: 100, damping: 20 }}
        />
      </div>
    </div>
  );
}
