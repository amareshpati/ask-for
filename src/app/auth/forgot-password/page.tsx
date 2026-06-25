'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Mail, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { Button, Input, AnimatedBackground } from '@/components/ui';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });

      if (error) {
        setError(error.message);
      } else {
        setSuccess('We have sent a password reset link to your email address.');
        setEmail('');
      }
    } catch {
      setError('An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-dvh relative flex items-center justify-center px-4 py-12">
      <AnimatedBackground theme="date" intensity={0.8} />

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, type: 'spring', stiffness: 200 }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Logo */}
        <Link href="/" className="flex items-center justify-center gap-2 mb-8">
          <Sparkles className="w-7 h-7 text-date-purple" />
          <span className="text-2xl font-bold tracking-tight text-surface-900">
            AskFor
          </span>
        </Link>

        {/* Card */}
        <div className="bg-white/80 backdrop-blur-2xl border border-white/40 rounded-3xl shadow-elevated p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-surface-900 mb-2">
              Forgot Password
            </h1>
            <p className="text-surface-500 text-sm">
              Enter your email to receive a password reset link
            </p>
          </div>

          {success ? (
            <div className="space-y-6 text-center">
              <div className="p-4 bg-emerald-50 text-emerald-800 rounded-2xl border border-emerald-100 text-sm font-medium leading-relaxed">
                {success}
                <div className="mt-2 text-xs text-emerald-600">
                  If not found, please check your <strong>spam/junk folder</strong>.
                </div>
                <div className="mt-2 text-xs text-emerald-600">
                  For support, contact{' '}
                  <a href="mailto:askfor@devvloper.in" className="underline font-semibold">
                    askfor@devvloper.in
                  </a>
                </div>
              </div>
              <Link href="/auth/login" className="inline-flex items-center gap-2 text-date-purple hover:underline font-semibold text-sm">
                <ArrowLeft className="w-4 h-4" />
                Back to Sign In
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                label="Email Address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                icon={<Mail className="w-4 h-4" />}
                required
                autoComplete="email"
                placeholder="you@example.com"
              />

              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-error text-center bg-error/5 rounded-lg py-2 px-3 font-medium"
                >
                  {error}
                </motion.p>
              )}

              <div className="space-y-4">
                <Button
                  type="submit"
                  size="lg"
                  fullWidth
                  isLoading={isLoading}
                >
                  Send Reset Link
                </Button>

                <div className="text-center">
                  <Link href="/auth/login" className="inline-flex items-center gap-2 text-surface-500 hover:text-surface-800 transition-colors text-sm font-semibold">
                    <ArrowLeft className="w-4 h-4" />
                    Back to Sign In
                  </Link>
                </div>
              </div>
            </form>
          )}
        </div>
      </motion.div>
    </main>
  );
}
