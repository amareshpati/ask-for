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
            ? 'bg-gradient-to-r from-date-pink to-date-purple text-white shadow-button'
            : 'bg-surface-100 text-surface-700 border border-surface-200 hover:bg-surface-200 hover:border-surface-300'
        }
      `}
    >
      {emoji && <span className="text-base">{emoji}</span>}
      {label}
    </motion.button>
  );
}
