'use client';

import { Input } from '@/components/ui';
import { User } from 'lucide-react';

interface RecipientStepProps {
  value: string;
  onChange: (value: string) => void;
  onNext: () => void;
}

export function RecipientStep({ value, onChange, onNext }: RecipientStepProps) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="text-5xl mb-4">💝</div>
        <h2 className="text-2xl md:text-3xl font-bold text-surface-900 mb-2">
          Who is this for?
        </h2>
        <p className="text-surface-500">
          Enter the name of your special someone
        </p>
      </div>

      <Input
        label="Recipient's Name"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        icon={<User className="w-4 h-4" />}
        placeholder="e.g. Sarah"
        autoFocus
        onKeyDown={(e) => {
          if (e.key === 'Enter' && value.trim()) onNext();
        }}
      />
    </div>
  );
}
