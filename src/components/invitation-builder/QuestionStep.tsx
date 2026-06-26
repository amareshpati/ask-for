'use client';

import { Textarea } from '@/components/ui';

interface QuestionStepProps {
  value: string;
  onChange: (value: string) => void;
  recipientName: string;
}

export function QuestionStep({ value, onChange, recipientName }: QuestionStepProps) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="text-5xl mb-4">💕</div>
        <h2 className="text-2xl md:text-3xl font-bold text-surface-100 mb-2 font-[family-name:var(--font-display)]">
          The Big Question
        </h2>
        <p className="text-surface-500">
          What would you like to ask {recipientName || 'them'}?
        </p>
      </div>

      <Textarea
        label="Your question"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={3}
        maxLength={300}
      />

      <p className="text-xs text-surface-400 text-right">
        {value.length}/300
      </p>
    </div>
  );
}
