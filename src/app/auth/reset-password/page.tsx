'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Lock, CheckCircle, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button, Input, AnimatedBackground } from '@/components/ui';

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSessionValid, setIsSessionValid] = useState<boolean | null>(null);

  const supabase = createClient();

  useEffect(() => {
    // Check if there is an active session (set automatically by Supabase recovery redirection)
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        setError('Invalid or expired password reset link. Please request a new one.');
        setIsSessionValid(false);
      } else {
        setIsSessionValid(true);
      }
    });
  }, [supabase]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!password) {
      setError('Password cannot be empty');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: password,
      });

      if (error) {
        setError(error.message);
      } else {
        setSuccess('Your password has been reset successfully!');
        // Sign out to clean up recovery session, then user can sign in with new credentials
        await supabase.auth.signOut();
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
          <Sparkles className="w-7 h-7 text-accent-400" />
          <span className="text-2xl font-bold tracking-tight text-surface-100 font-[family-name:var(--font-display)]">
            AskFor
          </span>
        </Link>

        {/* Card */}
        <div className="bg-surface-900/80 backdrop-blur-2xl border border-white/[0.08] rounded-3xl shadow-elevated p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-surface-100 mb-2 font-[family-name:var(--font-display)]">
              Reset Password
            </h1>
            <p className="text-surface-500 text-sm">
              Enter your new secure password below
            </p>
          </div>

          {success ? (
            <div className="space-y-6 text-center">
              <div className="flex justify-center text-emerald-400">
                <CheckCircle className="w-12 h-12" />
              </div>
              <div className="p-4 bg-emerald-500/10 text-emerald-300 rounded-2xl border border-emerald-500/20 text-sm font-medium leading-relaxed">
                {success}
              </div>
              <Button
                onClick={() => router.push('/auth/login')}
                fullWidth
                icon={<ArrowRight className="w-4 h-4" />}
              >
                Go to Sign In
              </Button>
            </div>
          ) : isSessionValid === false ? (
            <div className="space-y-6 text-center">
              <div className="p-4 bg-red-500/10 text-red-300 rounded-2xl border border-red-500/20 text-sm font-medium leading-relaxed">
                {error}
              </div>
              <Button
                onClick={() => router.push('/auth/forgot-password')}
                fullWidth
                variant="secondary"
              >
                Request New Link
              </Button>
            </div>
          ) : isSessionValid === null ? (
            <div className="py-8 text-center text-surface-500 font-medium animate-pulse">
              Verifying security session...
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="New Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                icon={<Lock className="w-4 h-4" />}
                required
                autoComplete="new-password"
                placeholder="At least 6 characters"
              />

              <Input
                label="Confirm New Password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                icon={<Lock className="w-4 h-4" />}
                required
                autoComplete="new-password"
                placeholder="Confirm password"
              />

              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-error text-center bg-error/10 rounded-lg py-2 px-3 font-medium"
                >
                  {error}
                </motion.p>
              )}

              <Button
                type="submit"
                size="lg"
                fullWidth
                isLoading={isLoading}
                className="mt-6"
              >
                Reset Password
              </Button>
            </form>
          )}
        </div>
      </motion.div>
    </main>
  );
}
