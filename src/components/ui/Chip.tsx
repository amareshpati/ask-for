'use client';

import { motion } from 'framer-motion';

interface ChipProps {
  label: string;
  selected?: boolean;
  onClick?: () => void;
  emoji?: string;
  disabled?: boolean;
}

export function Chip({ label, selected = false, onClick, emoji, disabled = false }: ChipProps) {
  return (
    <motion.button
      type="button"
      whileHover={{ scale: disabled ? 1 : 1.05 }}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
      onClick={onClick}
      disabled={disabled}
      className={`
        inline-flex items-center gap-2 px-4 py-2.5
        rounded-full text-sm font-medium
        transition-all duration-200 ease-out
        cursor-pointer
        disabled:opacity-50 disabled:cursor-not-allowed
        ${
          selected
            ? 'bg-gradient-to-r from-accent-500 to-accent-600 text-white shadow-button'
            : 'bg-white/[0.06] text-surface-300 border border-white/[0.1] hover:bg-white/[0.1] hover:border-white/[0.15]'
        }
      `}
    >
      {emoji && <span className="text-base">{emoji}</span>}
      {label}
    </motion.button>
  );
}
