'use client';

import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'success';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'ref' | 'children'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  icon?: React.ReactNode;
  fullWidth?: boolean;
  children?: React.ReactNode;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-gradient-to-r from-accent-500 to-accent-600 text-white shadow-button hover:shadow-glow-sm shimmer-hover',
  secondary:
    'bg-white/[0.06] text-surface-200 border border-white/[0.1] hover:bg-white/[0.1] hover:border-white/[0.15]',
  ghost:
    'bg-transparent text-surface-300 hover:bg-white/[0.06] hover:text-surface-100',
  danger:
    'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-button hover:shadow-glow-sm',
  success:
    'bg-gradient-to-r from-emerald-600 to-emerald-700 text-white shadow-button hover:shadow-glow-sm',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-4 py-2 text-sm rounded-lg gap-1.5',
  md: 'px-6 py-3 text-base rounded-xl gap-2',
  lg: 'px-8 py-4 text-lg rounded-2xl gap-2.5',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      isLoading = false,
      icon,
      fullWidth = false,
      children,
      className = '',
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: disabled || isLoading ? 1 : 1.02 }}
        whileTap={{ scale: disabled || isLoading ? 1 : 0.98 }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        className={`
          inline-flex items-center justify-center font-semibold
          transition-all duration-200 ease-out
          disabled:opacity-50 disabled:cursor-not-allowed
          cursor-pointer
          ${variantClasses[variant]}
          ${sizeClasses[size]}
          ${fullWidth ? 'w-full' : ''}
          ${className}
        `}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <svg
            className="animate-spin h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
        ) : icon ? (
          <span className="flex-shrink-0">{icon}</span>
        ) : null}
        {children}
      </motion.button>
    );
  }
);

Button.displayName = 'Button';
