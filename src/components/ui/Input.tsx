'use client';

import { forwardRef, type InputHTMLAttributes, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, className = '', id, type, ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const inputId = id || label.toLowerCase().replace(/\s+/g, '-');

    const isPassword = type === 'password';
    const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

    return (
      <div className="relative w-full">
        <div className="relative">
          {icon && (
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-500 z-10 pointer-events-none">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            type={inputType}
            className={`
              peer w-full bg-white/[0.05] border-2 rounded-xl
              px-4 pt-6 pb-2 text-base text-surface-100
              placeholder-transparent
              transition-all duration-200 ease-out
              focus:outline-none
              ${icon ? 'pl-12' : 'pl-4'}
              ${isPassword ? 'pr-12' : 'pr-4'}
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
              absolute top-4
              text-surface-500 text-base
              transition-all duration-200 ease-out
              pointer-events-none
              peer-focus:top-1.5 peer-focus:text-xs peer-focus:font-medium
              peer-[:not(:placeholder-shown)]:top-1.5 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:font-medium
              ${icon ? 'left-12' : 'left-4'}
              ${
                error
                  ? 'peer-focus:text-error'
                  : 'peer-focus:text-accent-400'
              }
            `}
          >
            {label}
          </label>

          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-surface-500 hover:text-surface-300 focus:outline-none z-10 cursor-pointer p-1 rounded-lg hover:bg-white/[0.06] transition-colors"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          )}
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

Input.displayName = 'Input';
