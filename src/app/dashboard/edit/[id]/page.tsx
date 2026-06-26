'use client';

import { useState, useEffect, use } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ArrowRight, Check, Sparkles, Loader2 } from 'lucide-react';
import { Button, ProgressBar, AnimatedBackground } from '@/components/ui';
import { RecipientStep } from '@/components/invitation-builder/RecipientStep';
import { WelcomeStep } from '@/components/invitation-builder/WelcomeStep';
import { FoodStep } from '@/components/invitation-builder/FoodStep';
import { LocationStep } from '@/components/invitation-builder/LocationStep';
import { QuestionStep } from '@/components/invitation-builder/QuestionStep';
import { ReviewStep } from '@/components/invitation-builder/ReviewStep';
import { FOOD_OPTIONS, LOCATION_OPTIONS, type CreateInvitationData } from '@/lib/types';

const STEP_LABELS = ['Name', 'Message', 'Food', 'Place', 'Question', 'Review'];

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 300 : -300,
    opacity: 0,
  }),
};

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function EditInvitationPage({ params }: PageProps) {
  const { id } = use(params);
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState<CreateInvitationData>({
    type: 'date',
    recipient_name: '',
    welcome_message: 'I have something special to ask you...',
    favourite_food: JSON.stringify(FOOD_OPTIONS),
    favourite_location: JSON.stringify(LOCATION_OPTIONS),
    final_question: 'Will you go on a date with me?',
  });

  useEffect(() => {
    setIsLoading(true);
    fetch(`/api/invitations/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then((data) => {
        // If the invitation already has responses, we should block editing
        if (data.invitation_responses && (Array.isArray(data.invitation_responses) ? data.invitation_responses.length > 0 : !!data.invitation_responses)) {
          alert('Cannot edit an invitation that already has responses!');
          router.push('/dashboard');
          return;
        }

        setFormData({
          type: data.type,
          recipient_name: data.recipient_name,
          welcome_message: data.welcome_message,
          favourite_food: data.favourite_food,
          favourite_location: data.favourite_location,
          final_question: data.final_question,
        });
        setIsLoading(false);
      })
      .catch(() => {
        alert('Failed to load invitation details.');
        router.push('/dashboard');
      });
  }, [id, router]);

  const updateField = (field: keyof CreateInvitationData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    setDirection(1);
    setStep((s) => Math.min(s + 1, 5));
  };

  const prevStep = () => {
    setDirection(-1);
    setStep((s) => Math.max(s - 1, 0));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/invitations/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        router.push('/dashboard');
        router.refresh();
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to update invitation');
      }
    } catch {
      alert('Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isStepValid = (): boolean => {
    switch (step) {
      case 0: return formData.recipient_name.trim().length > 0;
      case 1: return formData.welcome_message.trim().length > 0;
      case 2: return formData.favourite_food.trim().length > 0;
      case 3: return formData.favourite_location.trim().length > 0;
      case 4: return formData.final_question.trim().length > 0;
      case 5: return true;
      default: return false;
    }
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <RecipientStep
            value={formData.recipient_name}
            onChange={(v) => updateField('recipient_name', v)}
            onNext={nextStep}
          />
        );
      case 1:
        return (
          <WelcomeStep
            value={formData.welcome_message}
            onChange={(v) => updateField('welcome_message', v)}
          />
        );
      case 2:
        return (
          <FoodStep
            value={formData.favourite_food}
            onChange={(v) => updateField('favourite_food', v)}
          />
        );
      case 3:
        return (
          <LocationStep
            value={formData.favourite_location}
            onChange={(v) => updateField('favourite_location', v)}
          />
        );
      case 4:
        return (
          <QuestionStep
            value={formData.final_question}
            onChange={(v) => updateField('final_question', v)}
            recipientName={formData.recipient_name}
          />
        );
      case 5:
        return <ReviewStep data={formData} />;
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <main className="min-h-dvh relative flex flex-col items-center justify-center">
        <AnimatedBackground theme="date" intensity={0.6} />
        <div className="relative z-10 text-center space-y-4">
          <Loader2 className="w-10 h-10 animate-spin text-date-purple mx-auto" />
          <p className="text-surface-500 font-medium animate-pulse">Loading invitation details...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-dvh relative flex flex-col">
      <AnimatedBackground theme="date" intensity={0.6} />

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-6 py-5 md:px-12">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => router.push('/dashboard')}
          className="flex items-center gap-2 text-surface-400 hover:text-surface-200 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm font-medium hidden sm:inline">Dashboard</span>
        </motion.button>

        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-date-purple" />
          <span className="text-sm font-semibold text-surface-300">
            Edit Invitation
          </span>
        </div>
      </header>

      {/* Progress */}
      <div className="relative z-10 px-6 md:px-12 max-w-2xl mx-auto w-full">
        <ProgressBar
          currentStep={step}
          totalSteps={6}
          labels={STEP_LABELS}
        />
      </div>

      {/* Step content */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-6 py-8">
        <div className="w-full max-w-lg">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={step}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              {renderStep()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation */}
      <div className="relative z-10 px-6 py-6 md:px-12">
        <div className="max-w-lg mx-auto flex items-center justify-between gap-4">
          <Button
            variant="ghost"
            onClick={prevStep}
            disabled={step === 0}
            icon={<ArrowLeft className="w-4 h-4" />}
          >
            Back
          </Button>

          {step < 5 ? (
            <Button
              onClick={nextStep}
              disabled={!isStepValid()}
              icon={<ArrowRight className="w-4 h-4" />}
            >
              Continue
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              isLoading={isSubmitting}
              icon={<Check className="w-4 h-4" />}
              className="from-emerald-500 to-green-500"
            >
              Save Changes
            </Button>
          )}
        </div>
      </div>
    </main>
  );
}
