'use client';

import { motion, type HTMLMotionProps } from 'framer-motion';
import { forwardRef } from 'react';

interface CardProps extends Omit<HTMLMotionProps<'div'>, 'ref' | 'children'> {
  variant?: 'default' | 'glass' | 'elevated' | 'interactive';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  children?: React.ReactNode;
}

const variantClasses = {
  default: 'bg-white border border-surface-200 shadow-card',
  glass: 'glass shadow-glass',
  elevated: 'bg-white shadow-elevated',
  interactive:
    'bg-white border border-surface-200 shadow-card hover:shadow-elevated hover:border-surface-300 cursor-pointer',
};

const paddingClasses = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};

export const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      variant = 'default',
      padding = 'md',
      children,
      className = '',
      ...props
    },
    ref
  ) => {
    return (
      <motion.div
        ref={ref}
        className={`
          rounded-2xl transition-all duration-300
          ${variantClasses[variant]}
          ${paddingClasses[padding]}
          ${className}
        `}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);

Card.displayName = 'Card';
