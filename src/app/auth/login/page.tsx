'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';
import { Sparkles, Mail, Lock, Chrome } from 'lucide-react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { Button, Input, AnimatedBackground } from '@/components/ui';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/dashboard';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const supabase = createClient();

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(error.message);
      } else {
        router.push(redirect);
        router.refresh();
      }
    } catch {
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback?redirect=${redirect}`,
        },
      });

      if (error) {
        setError(error.message);
        setIsGoogleLoading(false);
      }
    } catch {
      setError('An unexpected error occurred');
      setIsGoogleLoading(false);
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
              Welcome back
            </h1>
            <p className="text-surface-500 text-sm">
              Sign in to create magical invitations
            </p>
          </div>

          {/* Google Login */}
          <Button
            variant="secondary"
            size="lg"
            fullWidth
            onClick={handleGoogleLogin}
            isLoading={isGoogleLoading}
            icon={<Chrome className="w-5 h-5" />}
            className="mb-6"
          >
            Continue with Google
          </Button>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/[0.08]" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-surface-900/80 px-4 text-surface-500 font-medium">
                or continue with email
              </span>
            </div>
          </div>

          {/* Email Form */}
          <form onSubmit={handleEmailLogin} className="space-y-4">
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={<Mail className="w-4 h-4" />}
              required
              autoComplete="email"
            />

            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              icon={<Lock className="w-4 h-4" />}
              required
              autoComplete="current-password"
            />

            <div className="flex justify-end">
              <Link
                href="/auth/forgot-password"
                className="text-xs font-semibold text-accent-400 hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            {error && (
              <motion.p
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-error text-center bg-error/10 rounded-lg py-2 px-3"
              >
                {error}
              </motion.p>
            )}

            <Button
              type="submit"
              size="lg"
              fullWidth
              isLoading={isLoading}
            >
              Sign In
            </Button>
          </form>

          <p className="text-center text-sm text-surface-500 mt-6">
            Don&apos;t have an account?{' '}
            <Link
              href="/auth/signup"
              className="text-accent-400 font-semibold hover:underline"
            >
              Sign up
            </Link>
          </p>
        </div>
      </motion.div>
    </main>
  );
}
