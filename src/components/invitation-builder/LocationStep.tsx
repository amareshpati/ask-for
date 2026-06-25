'use client';

import { useState } from 'react';
import { Input } from '@/components/ui';
import { LOCATION_OPTIONS } from '@/lib/types';
import { Plus, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const LOCATION_EMOJIS: Record<string, string> = {
  Restaurant: '🍽️', Café: '☕', Bar: '🍸', Hotel: '🏨',
  Beach: '🏖️', Mountain: '⛰️', Park: '🌳', 'Road Trip': '🚗',
  'Sunset Point': '🌅', Rooftop: '🏙️', Movie: '🎬', Arcade: '🕹️',
};

interface LocationStepProps {
  value: string;
  onChange: (value: string) => void;
}

export function LocationStep({ value, onChange }: LocationStepProps) {
  // Parse current list from value (JSON array string). Default to LOCATION_OPTIONS if empty.
  let activeOptions: string[] = [];
  try {
    activeOptions = value ? JSON.parse(value) : [];
  } catch {
    activeOptions = [];
  }

  if (activeOptions.length === 0) {
    activeOptions = [...LOCATION_OPTIONS];
  }

  const [customInput, setCustomInput] = useState('');
  const [error, setError] = useState('');

  const handleAddOption = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = customInput.trim();
    if (!trimmed) return;

    // Capitalize first letter for consistency
    const formatted = trimmed.charAt(0).toUpperCase() + trimmed.slice(1);

    if (activeOptions.includes(formatted)) {
      setError('Option already exists!');
      return;
    }

    setError('');
    const updated = [...activeOptions, formatted];
    onChange(JSON.stringify(updated));
    setCustomInput('');
  };

  const handleRemoveOption = (optionToRemove: string) => {
    if (activeOptions.length <= 1) {
      setError('You must keep at least one location option!');
      return;
    }
    setError('');
    const updated = activeOptions.filter((opt) => opt !== optionToRemove);
    onChange(JSON.stringify(updated));
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="text-5xl mb-4">📍</div>
        <h2 className="text-2xl md:text-3xl font-bold text-surface-900 mb-2">
          Location Options
        </h2>
        <p className="text-surface-500">
          Review location options for your surprise. Remove any you dislike, or add custom destinations!
        </p>
      </div>

      {/* Add option form */}
      <form onSubmit={handleAddOption} className="flex gap-2 max-w-md mx-auto items-end">
        <div className="flex-1">
          <Input
            label="Add custom location"
            value={customInput}
            onChange={(e) => {
              setCustomInput(e.target.value);
              setError('');
            }}
            placeholder="e.g. Art Gallery, Bowling Alley..."
          />
        </div>
        <button
          type="submit"
          className="flex h-[46px] w-[46px] items-center justify-center rounded-xl bg-gradient-to-br from-date-pink to-date-purple text-white shadow-button hover:opacity-90 transition-opacity cursor-pointer flex-shrink-0 mb-[1px]"
          title="Add option"
        >
          <Plus className="w-5 h-5" />
        </button>
      </form>

      {error && (
        <p className="text-sm text-center text-error font-medium">{error}</p>
      )}

      {/* Options grid */}
      <div className="flex flex-wrap gap-2 justify-center max-w-xl mx-auto p-4 bg-white/40 backdrop-blur-md rounded-2xl border border-surface-200/50 shadow-inner">
        <AnimatePresence>
          {activeOptions.map((location) => (
            <motion.div
              key={location}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold bg-gradient-to-r from-date-pink/10 to-date-purple/10 text-date-purple border border-date-purple/30 shadow-sm"
            >
              {LOCATION_EMOJIS[location] && <span className="text-base">{LOCATION_EMOJIS[location]}</span>}
              <span>{location}</span>
              <button
                type="button"
                onClick={() => handleRemoveOption(location)}
                className="p-0.5 rounded-full hover:bg-date-purple/20 text-date-purple/60 hover:text-date-purple cursor-pointer transition-colors ml-1"
                title={`Remove ${location}`}
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
