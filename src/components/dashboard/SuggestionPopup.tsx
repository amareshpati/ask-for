'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lightbulb, Send, Trash2, Edit3, Sparkles, Check } from 'lucide-react';
import { Button, Input, Textarea, Modal } from '@/components/ui';

interface Suggestion {
  id: string;
  category: string;
  title: string;
  description: string;
  status: string;
  created_at: string;
  updated_at: string;
}

type SuggestionCategory = 'feature' | 'bug' | 'improvement' | 'general';

const CATEGORIES: { value: SuggestionCategory; label: string; emoji: string; color: string }[] = [
  { value: 'feature', label: 'Feature Request', emoji: '✨', color: 'from-violet-500 to-purple-600' },
  { value: 'bug', label: 'Bug Report', emoji: '🐛', color: 'from-accent-500 to-accent-600' },
  { value: 'improvement', label: 'Improvement', emoji: '🚀', color: 'from-blue-500 to-cyan-600' },
  { value: 'general', label: 'General', emoji: '💬', color: 'from-emerald-500 to-emerald-600' },
];

const STATUS_BADGES: Record<string, { label: string; color: string }> = {
  pending: { label: 'Pending', color: 'bg-amber-500/10 text-amber-400 border border-amber-500/20' },
  reviewed: { label: 'Reviewed', color: 'bg-blue-500/10 text-blue-400 border border-blue-500/20' },
  planned: { label: 'Planned', color: 'bg-violet-500/10 text-violet-400 border border-violet-500/20' },
  completed: { label: 'Completed', color: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' },
};

interface SuggestionPopupProps {
  externalOpen?: boolean;
  onExternalOpenChange?: (open: boolean) => void;
  /** When rendering in the profile modal, set initialTab to 'history' */
  initialTab?: 'new' | 'history';
}

export function SuggestionPopup({ externalOpen, onExternalOpenChange, initialTab }: SuggestionPopupProps = {}) {
  const [internalOpen, setInternalOpen] = useState(false);

  const isOpen = externalOpen !== undefined ? externalOpen : internalOpen;
  const setIsOpen = (open: boolean) => {
    if (onExternalOpenChange) onExternalOpenChange(open);
    setInternalOpen(open);
  };
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Form fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<SuggestionCategory>('feature');

  // Edit mode
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editCategory, setEditCategory] = useState<SuggestionCategory>('feature');

  // View mode toggle
  const [activeTab, setActiveTab] = useState<'new' | 'history'>(initialTab || 'new');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchSuggestions = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/suggestions');
      if (res.ok) {
        const data = await res.json();
        setSuggestions(data);
      }
    } catch {
      console.error('Failed to fetch suggestions');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      fetchSuggestions();
    }
  }, [isOpen, fetchSuggestions]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/suggestions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description, category }),
      });

      if (res.ok) {
        setTitle('');
        setDescription('');
        setCategory('feature');
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
        fetchSuggestions();
      }
    } catch {
      console.error('Failed to submit suggestion');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdate = async (id: string) => {
    if (!editTitle.trim() || !editDescription.trim()) return;

    try {
      const res = await fetch(`/api/suggestions/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: editTitle,
          description: editDescription,
          category: editCategory,
        }),
      });

      if (res.ok) {
        setEditingId(null);
        fetchSuggestions();
      }
    } catch {
      console.error('Failed to update suggestion');
    }
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      const res = await fetch(`/api/suggestions/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setSuggestions((prev) => prev.filter((s) => s.id !== id));
      }
    } catch {
      console.error('Failed to delete suggestion');
    } finally {
      setDeletingId(null);
    }
  };

  const startEdit = (suggestion: Suggestion) => {
    setEditingId(suggestion.id);
    setEditTitle(suggestion.title);
    setEditDescription(suggestion.description);
    setEditCategory(suggestion.category as SuggestionCategory);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <>
      {/* Floating Suggestion Button */}
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1, type: 'spring', stiffness: 200 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-gradient-to-br from-accent-500 to-accent-700 text-white shadow-glow-sm flex items-center justify-center cursor-pointer hover:shadow-glow transition-shadow"
        title="Share your suggestion"
      >
        <Lightbulb className="w-6 h-6" />
      </motion.button>

      {/* Suggestion Modal */}
      <Modal
        isOpen={isOpen}
        onClose={() => {
          setIsOpen(false);
          setEditingId(null);
          setShowSuccess(false);
        }}
        title="💡 Suggestions & Feedback"
        maxWidth="max-w-lg"
      >
        <div className="space-y-5">
          {/* Tabs */}
          <div className="flex gap-1 p-1 bg-white/[0.04] rounded-xl border border-white/[0.08]">
            <button
              onClick={() => setActiveTab('new')}
              className={`
                flex-1 py-2 px-4 rounded-lg text-sm font-semibold transition-all cursor-pointer
                ${activeTab === 'new'
                  ? 'bg-white/[0.08] text-surface-100 shadow-sm'
                  : 'text-surface-400 hover:text-surface-200'
                }
              `}
            >
              <span className="flex items-center justify-center gap-2">
                <Sparkles className="w-4 h-4" />
                New Suggestion
              </span>
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`
                flex-1 py-2 px-4 rounded-lg text-sm font-semibold transition-all cursor-pointer
                ${activeTab === 'history'
                  ? 'bg-white/[0.08] text-surface-100 shadow-sm'
                  : 'text-surface-400 hover:text-surface-200'
                }
              `}
            >
              <span className="flex items-center justify-center gap-2">
                📋
                My Suggestions
                {suggestions.length > 0 && (
                  <span className="inline-flex items-center justify-center w-5 h-5 text-[10px] font-bold bg-accent-500/10 text-accent-400 rounded-full">
                    {suggestions.length}
                  </span>
                )}
              </span>
            </button>
          </div>

          {/* New Suggestion Form */}
          <AnimatePresence mode="wait">
            {activeTab === 'new' && (
              <motion.form
                key="new-form"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                onSubmit={handleSubmit}
                className="space-y-4"
              >
                {/* Category Selector */}
                <div>
                  <label className="text-xs font-semibold text-surface-400 uppercase tracking-wider mb-2 block">
                    Category
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {CATEGORIES.map((cat) => (
                      <button
                        key={cat.value}
                        type="button"
                        onClick={() => setCategory(cat.value)}
                        className={`
                          flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer border
                          ${category === cat.value
                            ? 'border-accent-500 bg-accent-500/10 text-surface-100'
                            : 'border-white/[0.08] hover:border-white/[0.12] text-surface-400 hover:text-surface-200 bg-white/[0.02]'
                          }
                        `}
                      >
                        <span className="text-base">{cat.emoji}</span>
                        <span>{cat.label}</span>
                        {category === cat.value && (
                          <Check className="w-3.5 h-3.5 text-accent-400 ml-auto" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                <Input
                  label="Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Brief summary of your suggestion"
                  maxLength={120}
                />

                <Textarea
                  label="Description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your idea, bug, or feedback in detail..."
                  rows={4}
                  maxLength={1000}
                />

                {/* Character count */}
                <p className="text-xs text-surface-500 text-right">
                  {description.length}/1000
                </p>

                {/* Success message */}
                <AnimatePresence>
                  {showSuccess && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="flex items-center gap-2 px-4 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium"
                    >
                      <Check className="w-4 h-4" />
                      Thanks for your suggestion! We&apos;ll review it soon 🎉
                    </motion.div>
                  )}
                </AnimatePresence>

                <Button
                  type="submit"
                  variant="primary"
                  fullWidth
                  isLoading={isSubmitting}
                  disabled={!title.trim() || !description.trim()}
                  icon={<Send className="w-4 h-4" />}
                >
                  Submit Suggestion
                </Button>
              </motion.form>
            )}

            {/* Suggestion History */}
            {activeTab === 'history' && (
              <motion.div
                key="history"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-3"
              >
                {isLoading ? (
                  <div className="space-y-3">
                    {[1, 2].map((i) => (
                      <div key={i} className="bg-white/[0.04] rounded-xl h-20 animate-pulse border border-white/[0.06]" />
                    ))}
                  </div>
                ) : suggestions.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="text-4xl mb-3">💡</div>
                    <p className="text-surface-300 text-sm font-medium">
                      No suggestions yet
                    </p>
                    <p className="text-surface-500 text-xs mt-1">
                      Share your ideas to help us improve!
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2 max-h-[50vh] overflow-y-auto pr-1">
                    {suggestions.map((suggestion) => {
                      const isEditing = editingId === suggestion.id;
                      const catInfo = CATEGORIES.find((c) => c.value === suggestion.category);
                      const statusBadge = STATUS_BADGES[suggestion.status] || STATUS_BADGES.pending;

                      return (
                        <motion.div
                          key={suggestion.id}
                          layout
                          className="bg-white/[0.04] rounded-xl border border-white/[0.08] overflow-hidden"
                        >
                          {isEditing ? (
                            /* Edit form */
                            <div className="p-4 space-y-3">
                              <div className="grid grid-cols-2 gap-2">
                                {CATEGORIES.map((cat) => (
                                  <button
                                    key={cat.value}
                                    type="button"
                                    onClick={() => setEditCategory(cat.value)}
                                    className={`
                                      flex items-center gap-1.5 px-2.5 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer border
                                      ${editCategory === cat.value
                                        ? 'border-accent-500 bg-accent-500/10 text-surface-100'
                                        : 'border-white/[0.08] hover:border-white/[0.12] text-surface-400 hover:text-surface-200 bg-white/[0.02]'
                                      }
                                    `}
                                  >
                                    <span>{cat.emoji}</span>
                                    <span>{cat.label}</span>
                                  </button>
                                ))}
                              </div>

                              <Input
                                label="Title"
                                value={editTitle}
                                onChange={(e) => setEditTitle(e.target.value)}
                                maxLength={120}
                              />

                              <Textarea
                                label="Description"
                                value={editDescription}
                                onChange={(e) => setEditDescription(e.target.value)}
                                rows={3}
                                maxLength={1000}
                              />

                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  variant="primary"
                                  onClick={() => handleUpdate(suggestion.id)}
                                  disabled={!editTitle.trim() || !editDescription.trim()}
                                  icon={<Check className="w-3.5 h-3.5" />}
                                >
                                  Save
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => setEditingId(null)}
                                >
                                  Cancel
                                </Button>
                              </div>
                            </div>
                          ) : (
                            /* View mode */
                            <div className="p-4">
                              <div className="flex items-start justify-between gap-3">
                                <div className="min-w-0 flex-1">
                                  <div className="flex items-center gap-2 flex-wrap mb-1">
                                    <span className="text-sm">{catInfo?.emoji}</span>
                                    <h4 className="text-sm font-semibold text-surface-100 truncate">
                                      {suggestion.title}
                                    </h4>
                                  </div>
                                  <p className="text-xs text-surface-400 line-clamp-2 mb-2">
                                    {suggestion.description}
                                  </p>
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${statusBadge.color}`}>
                                      {statusBadge.label}
                                    </span>
                                    <span className="text-[10px] text-surface-500">
                                      {formatDate(suggestion.created_at)}
                                    </span>
                                  </div>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-1 flex-shrink-0">
                                  <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => startEdit(suggestion)}
                                    className="p-1.5 rounded-lg hover:bg-white/[0.06] text-surface-400 hover:text-surface-200 transition-colors cursor-pointer"
                                    title="Edit"
                                  >
                                    <Edit3 className="w-3.5 h-3.5" />
                                  </motion.button>
                                  <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => handleDelete(suggestion.id)}
                                    disabled={deletingId === suggestion.id}
                                    className="p-1.5 rounded-lg hover:bg-red-500/10 text-surface-400 hover:text-red-400 transition-colors cursor-pointer disabled:opacity-50"
                                    title="Delete"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </motion.button>
                                </div>
                              </div>
                            </div>
                          )}
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </Modal>
    </>
  );
}
