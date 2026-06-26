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
    logo: (
      <svg className="w-5 h-5 text-[#25D366]" viewBox="0 0 24 24" fill="currentColor">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.458 5.704 1.459h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
      </svg>
    ),
    getUrl: (url: string, text: string) =>
      `https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}`,
  },
  {
    name: 'Telegram',
    logo: (
      <svg className="w-5 h-5 text-[#0088cc]" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-0.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 0 0-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-0.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .24z" />
      </svg>
    ),
    getUrl: (url: string, text: string) =>
      `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
  },
  {
    name: 'Snapchat',
    logo: (
      <svg className="w-5 h-5 text-[#FFFC00]" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12.012 2c-2.868 0-5.518 1.68-5.518 5.753 0 .708.164 1.306.408 1.802-.821.433-1.579 1.096-2.072 1.956-.723 1.258-.584 2.766.425 3.528.483.364 1.077.545 1.7.545.32 0 .647-.048.966-.134.58.784 1.393 1.393 2.378 1.764-.131.464-.206.994-.206 1.547 0 2.215 1.796 4.012 4.012 4.012s4.012-1.797 4.012-4.012c0-.553-.075-1.083-.206-1.547.985-.371 1.799-.98 2.379-1.764.318.086.645.134.965.134.623 0 1.217-.181 1.7-.545 1.009-.762 1.148-2.27.426-3.528-.493-.86-1.251-1.523-2.072-1.956.244-.496.408-1.094.408-1.802C17.53 3.68 14.88 2 12.012 2zm0 1.5c1.996 0 4.012 1.272 4.012 4.253 0 .67-.116 1.332-.341 1.932-.086.23-.058.49.076.696.538.825.508 1.548.106 1.85-.205.154-.531.2-.849.13-.306-.067-.61.025-.838.252a5.534 5.534 0 0 1-3.69 1.636c-1.396 0-2.65-.6-3.69-1.636a.798.798 0 0 0-.838-.252c-.318.07-.644.024-.849-.13-.402-.302-.432-1.025.106-1.85.134-.206.162-.466.076-.696a5.291 5.291 0 0 1-.341-1.932c0-2.981 2.016-4.253 4.012-4.253z" />
      </svg>
    ),
    getUrl: (url: string, text: string) =>
      `https://www.snapchat.com/share?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
  },
  {
    name: 'Instagram',
    logo: (
      <svg className="w-5 h-5 text-[#E1306C]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
      </svg>
    ),
    isCustom: true,
  },
  {
    name: 'X (Twitter)',
    logo: (
      <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
    getUrl: (url: string, text: string) =>
      `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
  },
  {
    name: 'Facebook',
    logo: (
      <svg className="w-5 h-5 text-[#1877F2]" viewBox="0 0 24 24" fill="currentColor">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
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
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="relative z-10 w-full max-w-md bg-surface-900/95 backdrop-blur-2xl border border-white/[0.08] rounded-3xl shadow-elevated overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 pt-6 pb-2">
              <h2 className="text-lg font-bold text-surface-100">Share Invitation</h2>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="p-2 rounded-full hover:bg-white/[0.06] text-surface-400 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </motion.button>
            </div>

            <div className="px-6 pb-6 pt-2">
              {/* URL Copy */}
              <div className="flex items-center gap-2 bg-white/[0.04] rounded-xl p-3 mb-6 border border-white/[0.08]">
                <ExternalLink className="w-4 h-4 text-surface-500 flex-shrink-0" />
                <span className="text-sm text-surface-400 truncate flex-1 font-mono">
                  {url}
                </span>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.06] border border-white/[0.1] text-sm font-medium text-surface-300 hover:bg-white/[0.1] transition-colors cursor-pointer"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
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
                {SHARE_PLATFORMS.map((platform) => {
                  if (platform.isCustom && platform.name === 'Instagram') {
                    return (
                      <motion.button
                        key={platform.name}
                        onClick={async () => {
                          const success = await copyToClipboard(url);
                          if (success) {
                            alert('Link copied! Opening Instagram to share... Paste it in your DMs or Story ❤️');
                          }
                          window.open('https://instagram.com', '_blank');
                        }}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.08] hover:border-white/[0.12] transition-colors text-left w-full cursor-pointer"
                      >
                        <div className="flex-shrink-0 flex items-center justify-center w-6 h-6">{platform.logo}</div>
                        <span className="text-sm font-medium text-surface-300">
                          {platform.name}
                        </span>
                      </motion.button>
                    );
                  }

                  return (
                    <motion.a
                      key={platform.name}
                      href={platform.getUrl ? platform.getUrl(url, shareText) : '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.08] hover:border-white/[0.12] transition-colors"
                    >
                      <div className="flex-shrink-0 flex items-center justify-center w-6 h-6">{platform.logo}</div>
                      <span className="text-sm font-medium text-surface-300">
                        {platform.name}
                      </span>
                    </motion.a>
                  );
                })}
              </div>

              {/* Share note */}
              <p className="text-xs text-surface-500 text-center mt-4">
                You can share the invitation on any platform by copying the link above!
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
