'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { copyToClipboard, getInviteUrl, canUseWebShare, webShare } from '@/lib/utils';
import { X, Copy, Check, Share2, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui';

interface ShareDialogProps {
  isOpen: boolean;
  onClose: () => void;
  slug: string;
  recipientName: string;
}

const SHARE_PLATFORMS = [
  {
    name: 'WhatsApp',
    icon: '💬',
    getUrl: (url: string, text: string) =>
      `https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}`,
  },
  {
    name: 'Telegram',
    icon: '✈️',
    getUrl: (url: string, text: string) =>
      `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
  },
  {
    name: 'X (Twitter)',
    icon: '🐦',
    getUrl: (url: string, text: string) =>
      `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
  },
  {
    name: 'Facebook',
    icon: '👤',
    getUrl: (url: string) =>
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
  },
];

export function ShareDialog({ isOpen, onClose, slug, recipientName }: ShareDialogProps) {
  const [copied, setCopied] = useState(false);
  const url = getInviteUrl(slug);
  const shareText = `I have something special for you, ${recipientName}! 💕`;

  const handleCopy = useCallback(async () => {
    const success = await copyToClipboard(url);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [url]);

  const handleNativeShare = useCallback(async () => {
    await webShare({
      title: `A special invitation for ${recipientName}`,
      text: shareText,
      url,
    });
  }, [url, recipientName, shareText]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="relative z-10 w-full max-w-md bg-white rounded-3xl shadow-elevated overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 pt-6 pb-2">
              <h2 className="text-lg font-bold text-surface-900">Share Invitation</h2>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="p-2 rounded-full hover:bg-surface-100 text-surface-400 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </motion.button>
            </div>

            <div className="px-6 pb-6 pt-2">
              {/* URL Copy */}
              <div className="flex items-center gap-2 bg-surface-50 rounded-xl p-3 mb-6 border border-surface-200">
                <ExternalLink className="w-4 h-4 text-surface-400 flex-shrink-0" />
                <span className="text-sm text-surface-600 truncate flex-1 font-mono">
                  {url}
                </span>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-surface-200 text-sm font-medium text-surface-700 hover:bg-surface-100 transition-colors cursor-pointer"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-success" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      Copy
                    </>
                  )}
                </motion.button>
              </div>

              {/* Native Share */}
              {canUseWebShare() && (
                <Button
                  variant="primary"
                  fullWidth
                  onClick={handleNativeShare}
                  icon={<Share2 className="w-4 h-4" />}
                  className="mb-4"
                >
                  Share via Device
                </Button>
              )}

              {/* Social platforms */}
              <div className="grid grid-cols-2 gap-3">
                {SHARE_PLATFORMS.map((platform) => (
                  <motion.a
                    key={platform.name}
                    href={platform.getUrl(url, shareText)}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl bg-surface-50 border border-surface-200 hover:bg-surface-100 transition-colors"
                  >
                    <span className="text-xl">{platform.icon}</span>
                    <span className="text-sm font-medium text-surface-700">
                      {platform.name}
                    </span>
                  </motion.a>
                ))}
              </div>

              {/* Instagram note */}
              <p className="text-xs text-surface-400 text-center mt-4">
                For Instagram, copy the link and share it in your DMs or story.
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
