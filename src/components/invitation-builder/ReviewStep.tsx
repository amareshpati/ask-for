'use client';

import { motion } from 'framer-motion';
import { Heart, MessageCircle, UtensilsCrossed, MapPin, HelpCircle } from 'lucide-react';
import type { CreateInvitationData } from '@/lib/types';

interface ReviewStepProps {
  data: CreateInvitationData;
}

const fields = [
  { key: 'recipient_name', label: 'Recipient', icon: Heart, emoji: '💝' },
  { key: 'welcome_message', label: 'Welcome Message', icon: MessageCircle, emoji: '✉️' },
  { key: 'favourite_food', label: 'Favourite Food', icon: UtensilsCrossed, emoji: '🍽️' },
  { key: 'favourite_location', label: 'Favourite Location', icon: MapPin, emoji: '📍' },
  { key: 'final_question', label: 'The Question', icon: HelpCircle, emoji: '💕' },
] as const;

export function ReviewStep({ data }: ReviewStepProps) {
  const getDisplayValue = (key: string, val: string) => {
    if (key === 'favourite_food' || key === 'favourite_location') {
      try {
        const parsed = JSON.parse(val);
        if (Array.isArray(parsed)) {
          return parsed.join(', ');
        }
      } catch {}
    }
    return val;
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="text-5xl mb-4">🎉</div>
        <h2 className="text-2xl md:text-3xl font-bold text-surface-100 mb-2 font-[family-name:var(--font-display)]">
          Review Your Invitation
        </h2>
        <p className="text-surface-500">
          Everything look good? Let&apos;s make it happen!
        </p>
      </div>

      <div className="space-y-3">
        {fields.map((field, index) => (
          <motion.div
            key={field.key}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white/[0.04] backdrop-blur-xl border border-white/[0.08] rounded-2xl p-4 flex items-start gap-4"
          >
            <span className="text-2xl flex-shrink-0">{field.emoji}</span>
            <div className="min-w-0">
              <span className="text-xs font-medium text-surface-400 uppercase tracking-wider">
                {field.label}
              </span>
              <p className="text-surface-200 font-medium mt-0.5 break-words">
                {getDisplayValue(field.key, data[field.key])}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
