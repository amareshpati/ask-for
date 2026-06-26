'use client';

import { Textarea } from '@/components/ui';

interface WelcomeStepProps {
  value: string;
  onChange: (value: string) => void;
}

export function WelcomeStep({ value, onChange }: WelcomeStepProps) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="text-5xl mb-4">✉️</div>
        <h2 className="text-2xl md:text-3xl font-bold text-surface-100 mb-2 font-[family-name:var(--font-display)]">
          Welcome Message
        </h2>
        <p className="text-surface-500">
          This is the first thing they&apos;ll see when opening your invitation
        </p>
      </div>

      <Textarea
        label="Your welcome message"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={4}
        maxLength={500}
      />

      <p className="text-xs text-surface-400 text-right">
        {value.length}/500
      </p>
    </div>
  );
}
