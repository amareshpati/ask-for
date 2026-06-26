'use client';

import { forwardRef, type TextareaHTMLAttributes, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, className = '', id, ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false);
    const inputId = id || label.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="relative w-full">
        <div className="relative">
          <textarea
            ref={ref}
            id={inputId}
            rows={4}
            className={`
              peer w-full bg-white/[0.05] border-2 rounded-xl
              px-4 pt-6 pb-3 text-base text-surface-100
              placeholder-transparent resize-none
              transition-all duration-200 ease-out
              focus:outline-none
              ${
                error
                  ? 'border-error/50 focus:border-error'
                  : isFocused
                    ? 'border-accent-500/50 focus:border-accent-500'
                    : 'border-white/[0.08] hover:border-white/[0.15]'
              }
              ${className}
            `}
            placeholder={label}
            onFocus={(e) => {
              setIsFocused(true);
              props.onFocus?.(e);
            }}
            onBlur={(e) => {
              setIsFocused(false);
              props.onBlur?.(e);
            }}
            {...props}
          />
          <label
            htmlFor={inputId}
            className={`
              absolute left-4 top-4
              text-surface-500 text-base
              transition-all duration-200 ease-out
              pointer-events-none
              peer-focus:top-1.5 peer-focus:text-xs peer-focus:font-medium
              peer-[:not(:placeholder-shown)]:top-1.5 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:font-medium
              ${
                error
                  ? 'peer-focus:text-error'
                  : 'peer-focus:text-accent-400'
              }
            `}
          >
            {label}
          </label>
        </div>
        <AnimatePresence>
          {error && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className="mt-1.5 text-sm text-error pl-1"
            >
              {error}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
