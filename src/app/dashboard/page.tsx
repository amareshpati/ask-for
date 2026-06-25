'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Plus, LogOut, Sparkles, Share2, Trash2, Copy, Check,
  Heart, Clock, MessageCircle, ChevronDown, Eye, User, Lock, Plane, Edit, Lightbulb,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { Button, AnimatedBackground, Modal, Input } from '@/components/ui';
import { ShareDialog } from '@/components/dashboard/ShareDialog';
import { SuggestionPopup } from '@/components/dashboard/SuggestionPopup';
import {
  type InvitationWithResponse,
  type InvitationStatus,
} from '@/lib/types';
import {
  formatDateTime,
  getInviteUrl,
  copyToClipboard,
  getResponseEmoji,
} from '@/lib/utils';

const statusConfig: Record<InvitationStatus, { label: string; color: string; icon: React.ReactNode }> = {
  draft: { label: 'Draft', color: 'bg-surface-200 text-surface-600', icon: <Clock className="w-3.5 h-3.5" /> },
  shared: { label: 'Shared', color: 'bg-blue-100 text-blue-700', icon: <Share2 className="w-3.5 h-3.5" /> },
  responded: { label: 'Responded', color: 'bg-emerald-100 text-emerald-700', icon: <MessageCircle className="w-3.5 h-3.5" /> },
};

export default function DashboardPage() {
  const router = useRouter();
  const supabase = createClient();

  const [invitations, setInvitations] = useState<InvitationWithResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [shareInvitation, setShareInvitation] = useState<InvitationWithResponse | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Profile settings states
  const [user, setUser] = useState<any>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [isSuggestionOpen, setIsSuggestionOpen] = useState(false);

  // Dashboard theme settings (Date vs Travel dashboard)
  const [dashboardTheme, setDashboardTheme] = useState<'date' | 'travel'>('date');
  const filteredInvitations = invitations.filter((inv) => inv.type === dashboardTheme);

  const formatOptions = (val: string) => {
    try {
      const parsed = JSON.parse(val);
      if (Array.isArray(parsed)) {
        return parsed.join(', ');
      }
    } catch {}
    return val;
  };

  const fetchInvitations = useCallback(async () => {
    try {
      const res = await fetch('/api/invitations');
      if (res.ok) {
        const data = await res.json();
        setInvitations(data);
      }
    } catch {
      console.error('Failed to fetch invitations');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInvitations();
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });

    // Check if URL query parameter requests the travel tab
    const params = new URLSearchParams(window.location.search);
    if (params.get('tab') === 'travel') {
      setDashboardTheme('travel');
    }
  }, [fetchInvitations, supabase]);

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

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      const res = await fetch(`/api/invitations/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setInvitations((prev) => prev.filter((inv) => inv.id !== id));
      }
    } catch {
      console.error('Failed to delete');
    } finally {
      setDeletingId(null);
    }
  };

  const handleCopyLink = async (slug: string, id: string) => {
    const success = await copyToClipboard(getInviteUrl(slug));
    if (success) {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);

      // Mark as shared if draft
      const inv = invitations.find((i) => i.id === id);
      if (inv && inv.status === 'draft') {
        await fetch(`/api/invitations/${id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: 'shared' }),
        });
        fetchInvitations();
      }
    }
  };

  const handleShare = (inv: InvitationWithResponse) => {
    setShareInvitation(inv);
    // Mark as shared if draft
    if (inv.status === 'draft') {
      fetch(`/api/invitations/${inv.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'shared' }),
      }).then(() => fetchInvitations());
    }
  };

  return (
    <main className="min-h-dvh relative">
      <AnimatedBackground theme={dashboardTheme} intensity={dashboardTheme === 'date' ? 1.0 : 0.5} />

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-6 py-5 md:px-12 border-b border-surface-200/50 bg-white/40 backdrop-blur-xl">
        <Link href="/" className="flex items-center gap-2 hover:opacity-85 transition-opacity">
          <Sparkles className="w-6 h-6 text-date-purple" />
          <span className="text-xl font-bold tracking-tight text-surface-900">
            AskFor
          </span>
        </Link>
        <div className="flex items-center gap-3">
          <Button
            variant="primary"
            size="sm"
            onClick={() => {
              if (dashboardTheme === 'travel') {
                alert('Travel invitations are not active yet! Coming soon ❤️');
              } else {
                router.push('/dashboard/create?flow=date');
              }
            }}
            icon={<Plus className="w-4 h-4" />}
          >
            <span className="hidden sm:inline">New Invitation</span>
            <span className="sm:hidden">New</span>
          </Button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsProfileOpen(true)}
            className="p-2 rounded-xl text-surface-400 hover:text-surface-600 hover:bg-surface-100 transition-colors cursor-pointer"
            title="Profile Settings"
          >
            <User className="w-5 h-5" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSignOut}
            className="p-2 rounded-xl text-surface-400 hover:text-surface-600 hover:bg-surface-100 transition-colors cursor-pointer"
            title="Sign Out"
          >
            <LogOut className="w-5 h-5" />
          </motion.button>
        </div>
      </header>

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 py-8 md:py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-black tracking-tight text-surface-900 mb-2">
            {dashboardTheme === 'date' ? 'Date Dashboard' : 'Travel Dashboard'}
          </h1>
          <p className="text-surface-500">
            {dashboardTheme === 'date'
              ? 'Manage and share your romantic surprise invitations'
              : 'Manage and share your surprise travel invitations'}
          </p>
        </motion.div>

        {/* Dashboard Tabs */}
        <div className="flex gap-2 p-1 bg-white/60 backdrop-blur-md rounded-2xl border border-surface-200/50 max-w-xs sm:max-w-sm mb-8 shadow-sm">
          <button
            onClick={() => setDashboardTheme('date')}
            className={`
              flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all cursor-pointer
              ${
                dashboardTheme === 'date'
                  ? 'bg-white text-date-purple shadow-sm'
                  : 'text-surface-500 hover:text-surface-800'
              }
            `}
          >
            <Heart className="w-4 h-4" fill={dashboardTheme === 'date' ? 'currentColor' : 'none'} />
            Date
          </button>
          <button
            onClick={() => setDashboardTheme('travel')}
            className={`
              flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all cursor-pointer
              ${
                dashboardTheme === 'travel'
                  ? 'bg-white text-travel-blue shadow-sm'
                  : 'text-surface-500 hover:text-surface-800'
              }
            `}
          >
            <Plane className="w-4 h-4" />
            Travel
          </button>
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="grid gap-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white/60 rounded-2xl h-32 animate-pulse border border-surface-200/50"
              />
            ))}
          </div>
        )}

        {/* Empty state */}
        {!isLoading && filteredInvitations.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20"
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="text-6xl mb-6"
            >
              {dashboardTheme === 'date' ? '💌' : '✈️'}
            </motion.div>
            <h2 className="text-xl font-bold text-surface-900 mb-2">
              {dashboardTheme === 'date' ? 'No date invitations yet' : 'No travel invitations yet'}
            </h2>
            <p className="text-surface-500 mb-6">
              {dashboardTheme === 'date'
                ? "Create your first romantic invitation and make someone's day special!"
                : 'Create your first surprise travel adventure invitation!'}
            </p>
            <Button
              onClick={() => {
                if (dashboardTheme === 'travel') {
                  alert('Travel invitations are not active yet! Coming soon ❤️');
                } else {
                  router.push('/dashboard/create?flow=date');
                }
              }}
              icon={<Plus className="w-4 h-4" />}
            >
              Create {dashboardTheme === 'date' ? 'Date' : 'Travel'} Invitation
            </Button>
          </motion.div>
        )}

        {/* Invitation list */}
        <div className="grid gap-4">
          <AnimatePresence>
            {filteredInvitations.map((inv, index) => {
              const response = Array.isArray(inv.invitation_responses)
                ? inv.invitation_responses?.[0]
                : (inv.invitation_responses || undefined);
              const displayStatus: InvitationStatus = response ? 'responded' : inv.status;
              const status = statusConfig[displayStatus];
              const isExpanded = expandedId === inv.id;

              return (
                <motion.div
                  key={inv.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ delay: index * 0.05, duration: 0.4 }}
                  layout
                  className="bg-white/80 backdrop-blur-xl border border-surface-200/60 rounded-2xl shadow-card hover:shadow-elevated transition-shadow overflow-hidden"
                >
                  {/* Main row */}
                  <div className="p-5 sm:p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-4 min-w-0 flex-1">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-date-pink to-date-purple flex items-center justify-center flex-shrink-0">
                          <Heart className="w-5 h-5 text-white" fill="white" />
                        </div>
                        <div className="min-w-0">
                          <h3 className="font-semibold text-surface-900 truncate">
                            {inv.recipient_name}
                          </h3>
                          <p className="text-sm text-surface-500 mt-0.5 truncate">
                            &ldquo;{inv.final_question}&rdquo;
                          </p>
                          <div className="flex items-center gap-3 mt-2 flex-wrap">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${status.color}`}>
                              {status.icon}
                              {status.label}
                            </span>
                            {response && (
                              <span className="text-sm">
                                {getResponseEmoji(response.response)}{' '}
                                <span className="text-surface-500 capitalize">{response.response}</span>
                              </span>
                            )}
                            <span className="text-xs text-surface-400">
                              {formatDateTime(inv.created_at)}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-1 flex-shrink-0">
                        {!response && (
                          <>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handleCopyLink(inv.unique_slug, inv.id)}
                              className="p-2 rounded-lg hover:bg-surface-100 text-surface-400 hover:text-surface-600 transition-colors cursor-pointer"
                              title="Copy link"
                            >
                              {copiedId === inv.id ? (
                                <Check className="w-4 h-4 text-success" />
                              ) : (
                                <Copy className="w-4 h-4" />
                              )}
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handleShare(inv)}
                              className="p-2 rounded-lg hover:bg-surface-100 text-surface-400 hover:text-surface-600 transition-colors cursor-pointer"
                              title="Share"
                            >
                              <Share2 className="w-4 h-4" />
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => router.push(`/dashboard/edit/${inv.id}`)}
                              className="p-2 rounded-lg hover:bg-surface-100 text-surface-400 hover:text-surface-600 transition-colors cursor-pointer"
                              title="Edit"
                            >
                              <Edit className="w-4 h-4" />
                            </motion.button>
                          </>
                        )}
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => setExpandedId(isExpanded ? null : inv.id)}
                          className="p-2 rounded-lg hover:bg-surface-100 text-surface-400 hover:text-surface-600 transition-colors cursor-pointer"
                          title="Details"
                        >
                          <motion.div animate={{ rotate: isExpanded ? 180 : 0 }}>
                            <ChevronDown className="w-4 h-4" />
                          </motion.div>
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleDelete(inv.id)}
                          disabled={deletingId === inv.id}
                          className="p-2 rounded-lg hover:bg-red-50 text-surface-400 hover:text-error transition-colors cursor-pointer disabled:opacity-50"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </motion.button>
                      </div>
                    </div>
                  </div>

                  {/* Expanded details */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 sm:px-6 pb-5 sm:pb-6 pt-0 border-t border-surface-100">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                            <div>
                              <span className="text-xs font-medium text-surface-400 uppercase tracking-wider">Welcome Message</span>
                              <p className="text-sm text-surface-700 mt-1">{inv.welcome_message}</p>
                            </div>
                            <div>
                              <span className="text-xs font-medium text-surface-400 uppercase tracking-wider">Food Options</span>
                              <p className="text-sm text-surface-700 mt-1">{formatOptions(inv.favourite_food)}</p>
                            </div>
                            <div>
                              <span className="text-xs font-medium text-surface-400 uppercase tracking-wider">Location Options</span>
                              <p className="text-sm text-surface-700 mt-1">{formatOptions(inv.favourite_location)}</p>
                            </div>
                            {response && (
                              <>
                                <div>
                                  <span className="text-xs font-medium text-surface-400 uppercase tracking-wider">Response</span>
                                  <p className="text-sm text-surface-700 mt-1 capitalize">
                                    {getResponseEmoji(response.response)} {response.response}
                                  </p>
                                </div>
                                <div>
                                  <span className="text-xs font-medium text-surface-400 uppercase tracking-wider">Responded At</span>
                                  <p className="text-sm text-surface-700 mt-1">
                                    {formatDateTime(response.responded_at)}
                                  </p>
                                </div>
                                {response.selected_date && (
                                  <div>
                                    <span className="text-xs font-medium text-surface-400 uppercase tracking-wider">Selected Date</span>
                                    <p className="text-sm text-surface-700 mt-1">
                                      {response.selected_date} — {response.selected_time_slot}
                                    </p>
                                  </div>
                                )}
                                {response.selected_food && (
                                  <div>
                                    <span className="text-xs font-medium text-surface-400 uppercase tracking-wider">Chosen Food</span>
                                    <p className="text-sm text-surface-700 mt-1">
                                      {response.selected_food}
                                    </p>
                                  </div>
                                )}
                                {response.selected_location && (
                                  <div>
                                    <span className="text-xs font-medium text-surface-400 uppercase tracking-wider">Chosen Location</span>
                                    <p className="text-sm text-surface-700 mt-1">
                                      {response.selected_location}
                                    </p>
                                  </div>
                                )}
                              </>
                            )}
                          </div>

                          {/* Preview link */}
                          <div className="mt-4 pt-4 border-t border-surface-100">
                            <a
                              href={`/invite/${inv.unique_slug}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 text-sm text-date-purple hover:underline font-medium"
                            >
                              <Eye className="w-4 h-4" />
                              Preview Invitation
                            </a>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      {/* Share Dialog */}
      {shareInvitation && (
        <ShareDialog
          isOpen={!!shareInvitation}
          onClose={() => setShareInvitation(null)}
          slug={shareInvitation.unique_slug}
          recipientName={shareInvitation.recipient_name}
        />
      )}

      {/* Suggestion Popup */}
      <SuggestionPopup
        externalOpen={isSuggestionOpen}
        onExternalOpenChange={setIsSuggestionOpen}
      />

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

          {/* My Suggestions */}
          <div className="pt-4 border-t border-surface-200/60">
            <button
              onClick={() => {
                setIsProfileOpen(false);
                setIsSuggestionOpen(true);
              }}
              className="w-full flex items-center gap-3 p-4 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/60 hover:border-amber-300 transition-all cursor-pointer group"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center flex-shrink-0 shadow-sm">
                <Lightbulb className="w-4.5 h-4.5 text-white" />
              </div>
              <div className="text-left">
                <span className="text-sm font-semibold text-surface-900 group-hover:text-amber-700 transition-colors">
                  My Suggestions
                </span>
                <p className="text-xs text-surface-500 mt-0.5">
                  View, edit, or submit new feedback
                </p>
              </div>
            </button>
          </div>

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
