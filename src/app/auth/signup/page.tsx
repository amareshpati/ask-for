'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Sparkles, Mail, Lock, User } from 'lucide-react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { Button, Input, AnimatedBackground } from '@/components/ui';

export default function SignupPage() {
  const router = useRouter();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const supabase = createClient();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        setError(error.message);
      } else {
        setSuccess(true);
      }
    } catch {
      setError('An unexpected error occurred');
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
          {success ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-6"
            >
              <div className="text-5xl mb-4">📨</div>
              <h2 className="text-xl font-bold text-surface-100 mb-2 font-[family-name:var(--font-display)]">
                Check your email
              </h2>
              <p className="text-surface-400 text-sm mb-6">
                We sent you a confirmation link. Click it to activate your
                account. If not found, please check your <strong className="text-surface-300">spam/junk folder</strong>. For support, contact{' '}
                <a href="mailto:askfor@devvloper.in" className="text-accent-400 hover:underline font-medium">
                  askfor@devvloper.in
                </a>.
              </p>
              <Link
                href="/auth/login"
                className="text-accent-400 font-semibold hover:underline text-sm"
              >
                Back to login
              </Link>
            </motion.div>
          ) : (
            <>
              <div className="text-center mb-8">
                <h1 className="text-2xl font-bold text-surface-100 mb-2 font-[family-name:var(--font-display)]">
                  Create an account
                </h1>
                <p className="text-surface-500 text-sm">
                  Start creating beautiful invitations
                </p>
              </div>

              <form onSubmit={handleSignup} className="space-y-4">
                <Input
                  label="Your Name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  icon={<User className="w-4 h-4" />}
                  required
                  autoComplete="name"
                />

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
                  autoComplete="new-password"
                  minLength={6}
                />

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
                  Create Account
                </Button>
              </form>

              <p className="text-center text-sm text-surface-500 mt-6">
                Already have an account?{' '}
                <Link
                  href="/auth/login"
                  className="text-accent-400 font-semibold hover:underline"
                >
                  Sign in
                </Link>
              </p>
            </>
          )}
        </div>
      </motion.div>
    </main>
  );
}
