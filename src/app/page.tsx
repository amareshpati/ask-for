'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Plane, Sparkles, ArrowRight, User, Lock, LogOut } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AnimatedBackground, Modal, Input, Button } from '@/components/ui';
import { createClient } from '@/lib/supabase/client';

type Theme = 'neutral' | 'date' | 'travel';

export default function LandingPage() {
  const router = useRouter();
  const [activeTheme, setActiveTheme] = useState<Theme>('neutral');
  const [user, setUser] = useState<any>(null);
  const [hasInvitations, setHasInvitations] = useState<boolean>(false);
  const supabase = createClient();

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      if (user) {
        // Query to check if the user already has any invitations
        supabase
          .from('invitations')
          .select('id', { count: 'exact', head: true })
          .then(({ count }) => {
            setHasInvitations(!!count && count > 0);
          });
      }
    });
  }, [supabase]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setIsProfileOpen(false);
    router.refresh();
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (!newPassword) {
      setPasswordError('Password cannot be empty');
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }

    setIsUpdatingPassword(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        setPasswordError(error.message);
      } else {
        setPasswordSuccess('Password updated successfully!');
        setNewPassword('');
        setConfirmPassword('');
      }
    } catch {
      setPasswordError('An unexpected error occurred.');
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  return (
    <main className="min-h-dvh relative overflow-hidden">
      <AnimatePresence mode="wait">
        <AnimatedBackground key={activeTheme} theme={activeTheme} intensity={1.5} />
      </AnimatePresence>

      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="relative z-10 flex items-center justify-between px-6 py-5 md:px-12"
      >
        <Link href="/" className="flex items-center gap-2 hover:opacity-85 transition-opacity">
          <Sparkles className="w-6 h-6 text-date-purple" />
          <span className="text-xl font-bold tracking-tight text-surface-900">
            AskFor
          </span>
        </Link>
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <Link
                href="/dashboard"
                className="text-sm font-medium text-surface-600 hover:text-surface-900 transition-colors px-4 py-2 rounded-full hover:bg-white/60 backdrop-blur-sm"
              >
                Dashboard
              </Link>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsProfileOpen(true)}
                className="p-2 rounded-xl text-surface-400 hover:text-surface-600 hover:bg-white/60 backdrop-blur-sm transition-colors cursor-pointer"
                title="Profile Settings"
              >
                <User className="w-5 h-5" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSignOut}
                className="p-2 rounded-xl text-surface-400 hover:text-surface-600 hover:bg-white/60 backdrop-blur-sm transition-colors cursor-pointer"
                title="Sign Out"
              >
                <LogOut className="w-5 h-5" />
              </motion.button>
            </>
          ) : (
            <Link
              href="/auth/login"
              className="text-sm font-medium text-surface-600 hover:text-surface-900 transition-colors px-4 py-2 rounded-full hover:bg-white/60 backdrop-blur-sm"
            >
              Sign In
            </Link>
          )}
        </div>
      </motion.header>

      {/* Hero */}
      <div className="relative z-10 flex flex-col items-center justify-center px-6 pt-12 pb-8 md:pt-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.7 }}
          className="text-center max-w-2xl mx-auto mb-12 md:mb-16"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
            className="inline-flex items-center gap-2 bg-white/60 backdrop-blur-md border border-white/30 rounded-full px-4 py-1.5 mb-6"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-date-pink opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-date-pink" />
            </span>
            <span className="text-xs font-medium text-surface-600">
              Create magical moments
            </span>
          </motion.div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight text-surface-900 leading-[1.1] mb-4">
            Ask with{' '}
            <span className="gradient-text-date">Style</span>
          </h1>
          <p className="text-lg md:text-xl text-surface-500 max-w-md mx-auto leading-relaxed">
            Create beautiful, interactive invitations that make asking someone
            special an unforgettable experience.
          </p>
        </motion.div>

        {/* Cards */}
        <div className="w-full max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {/* Date Card */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.7 }}
            onHoverStart={() => setActiveTheme('date')}
            onHoverEnd={() => setActiveTheme('neutral')}
            onFocus={() => setActiveTheme('date')}
            onBlur={() => setActiveTheme('neutral')}
          >
            <Link
              href={
                user
                  ? hasInvitations
                    ? "/dashboard"
                    : "/dashboard/create?flow=date"
                  : "/auth/login?flow=date"
              }
              className="block group"
            >
              <motion.div
                whileHover={{ scale: 1.03, y: -8 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                className="relative overflow-hidden rounded-3xl bg-white/70 backdrop-blur-xl border border-white/40 shadow-card hover:shadow-elevated p-8 md:p-10 h-full"
              >
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-date-pink/5 via-date-purple/5 to-date-rose/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Floating decoration */}
                <motion.div
                  className="absolute top-4 right-4 text-4xl"
                  animate={{ rotate: [0, 10, -10, 0], y: [0, -5, 5, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                >
                  ✨
                </motion.div>

                <div className="relative z-10">
                  <motion.div
                    className="w-16 h-16 rounded-2xl bg-gradient-to-br from-date-pink to-date-purple flex items-center justify-center mb-6 shadow-button"
                    whileHover={{ rotate: [0, -10, 10, 0] }}
                    transition={{ duration: 0.5 }}
                  >
                    <Heart className="w-8 h-8 text-white" fill="white" />
                  </motion.div>

                  <h2 className="text-2xl md:text-3xl font-bold text-surface-900 mb-3">
                    Ask for a Date
                  </h2>
                  <p className="text-surface-500 mb-6 leading-relaxed">
                    Create a beautiful, animated invitation to ask someone
                    special on a date. Make it memorable.
                  </p>

                  <div className="inline-flex items-center gap-2 text-date-purple font-semibold group-hover:gap-3 transition-all">
                    Get started
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </motion.div>
            </Link>
          </motion.div>

          {/* Travel Card */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.7 }}
            onHoverStart={() => setActiveTheme('travel')}
            onHoverEnd={() => setActiveTheme('neutral')}
            onFocus={() => setActiveTheme('travel')}
            onBlur={() => setActiveTheme('neutral')}
          >
            <Link
              href={user ? "/dashboard?tab=travel" : "/auth/login?redirect=/dashboard?tab=travel"}
              className="block group"
            >
              <motion.div
                whileHover={{ scale: 1.03, y: -8 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                className="relative overflow-hidden rounded-3xl bg-white/70 backdrop-blur-xl border border-white/40 shadow-card hover:shadow-elevated p-8 md:p-10 h-full"
              >
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-travel-blue/5 via-travel-cyan/5 to-travel-sky/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Coming soon badge */}
                <div className="absolute top-4 right-4">
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-travel-blue/10 text-travel-blue border border-travel-blue/20">
                    Coming Soon
                  </span>
                </div>

                <div className="relative z-10 opacity-60">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-travel-blue to-travel-cyan flex items-center justify-center mb-6 shadow-button">
                    <Plane className="w-8 h-8 text-white" />
                  </div>

                  <h2 className="text-2xl md:text-3xl font-bold text-surface-900 mb-3">
                    Ask for a Trip
                  </h2>
                  <p className="text-surface-500 mb-6 leading-relaxed">
                    Plan a surprise travel adventure together. Create
                    excitement with an interactive invitation.
                  </p>

                  <div className="inline-flex items-center gap-2 text-travel-blue font-semibold group-hover:gap-3 transition-all">
                    Get started
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </motion.div>
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="relative z-10 text-center py-8 mt-12"
      >
        <p className="text-sm text-surface-400">
          Made with{' '}
          <motion.span
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="inline-block"
          >
            ❤️
          </motion.span>{' '}
          for special moments
        </p>
      </motion.footer>

      {/* Profile Settings Modal */}
      <Modal
        isOpen={isProfileOpen}
        onClose={() => {
          setIsProfileOpen(false);
          setPasswordError('');
          setPasswordSuccess('');
          setNewPassword('');
          setConfirmPassword('');
        }}
        title="Profile Settings"
        maxWidth="max-w-md"
      >
        <div className="space-y-6">
          {/* User Details */}
          <div className="p-4 rounded-2xl bg-surface-50 border border-surface-200/60">
            <span className="text-xs font-semibold text-surface-400 uppercase tracking-wider">
              Email Address
            </span>
            <div className="flex items-center gap-2 mt-1.5 text-surface-900 font-medium">
              <User className="w-4 h-4 text-surface-400" />
              <span>{user?.email || 'Loading...'}</span>
            </div>
          </div>

          {/* Password Edit Form */}
          <form onSubmit={handleUpdatePassword} className="space-y-4 pt-2">
            <div className="flex items-center gap-2 mb-2 text-surface-900 font-bold">
              <Lock className="w-5 h-5 text-date-purple" />
              <h3>Change Password</h3>
            </div>
            
            <Input
              type="password"
              label="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />

            <Input
              type="password"
              label="Confirm New Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />

            {passwordError && (
              <p className="text-sm text-error font-medium">{passwordError}</p>
            )}

            {passwordSuccess && (
              <p className="text-sm text-emerald-600 font-medium">{passwordSuccess}</p>
            )}

            <Button
              type="submit"
              variant="primary"
              fullWidth
              isLoading={isUpdatingPassword}
              className="mt-2"
            >
              Update Password
            </Button>
          </form>

          {/* Sign Out Action */}
          <div className="pt-4 border-t border-surface-200/60">
            <Button
              variant="ghost"
              fullWidth
              onClick={handleSignOut}
              className="text-error hover:bg-red-50 hover:text-red-700 transition-colors border border-red-200/60"
              icon={<LogOut className="w-4 h-4" />}
            >
              Sign Out
            </Button>
          </div>
        </div>
      </Modal>
    </main>
  );
}
