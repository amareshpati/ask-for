'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AnimatedBackground, Button, Confetti, Chip } from '@/components/ui';
import { PlayfulButton } from './PlayfulButton';
import { Heart, Calendar, Clock, ArrowLeft, Check } from 'lucide-react';
import { TIME_SLOTS, type PublicInvitation } from '@/lib/types';
import { formatDate } from '@/lib/utils';

const FOOD_EMOJIS: Record<string, string> = {
  Pizza: '🍕', Burger: '🍔', Pasta: '🍝', Coffee: '☕', Tea: '🍵',
  Boba: '🧋', Beer: '🍺', Wine: '🍷', 'Ice Cream': '🍨', Sushi: '🍣',
  Ramen: '🍜', Tacos: '🌮', Chocolate: '🍫', Cake: '🎂',
  Smoothie: '🥤', Cocktails: '🍹',
};

const LOCATION_EMOJIS: Record<string, string> = {
  Restaurant: '🍽️', Café: '☕', Bar: '🍸', Hotel: '🏨',
  Beach: '🏖️', Mountain: '⛰️', Park: '🌳', 'Road Trip': '🚗',
  'Sunset Point': '🌅', Rooftop: '🏙️', Movie: '🎬', Arcade: '🕹️',
};

type JourneyScreen =
  | 'welcome'
  | 'greeting'
  | 'food'
  | 'location'
  | 'transition'
  | 'question'
  | 'date-picker'
  | 'time-picker'
  | 'confirm'
  | 'success-yes'
  | 'success-maybe'
  | 'success-no';

interface InvitationJourneyProps {
  invitation: PublicInvitation;
}

const screenVariants = {
  enter: { opacity: 0, y: 40, scale: 0.98 },
  center: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -40, scale: 0.98 },
};

export function InvitationJourney({ invitation }: InvitationJourneyProps) {
  const [screen, setScreen] = useState<JourneyScreen>('welcome');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [selectedFoods, setSelectedFoods] = useState<string[]>([]);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Parse food and location options lists
  let foodOptions: string[] = [];
  try {
    foodOptions = invitation.favourite_food ? JSON.parse(invitation.favourite_food) : [];
    if (!Array.isArray(foodOptions)) {
      foodOptions = [invitation.favourite_food];
    }
  } catch {
    foodOptions = invitation.favourite_food ? [invitation.favourite_food] : [];
  }

  let locationOptions: string[] = [];
  try {
    locationOptions = invitation.favourite_location ? JSON.parse(invitation.favourite_location) : [];
    if (!Array.isArray(locationOptions)) {
      locationOptions = [invitation.favourite_location];
    }
  } catch {
    locationOptions = invitation.favourite_location ? [invitation.favourite_location] : [];
  }

  // Auto-advance from welcome to greeting
  useEffect(() => {
    if (screen === 'welcome') {
      const timer = setTimeout(() => setScreen('greeting'), 2500);
      return () => clearTimeout(timer);
    }
    if (screen === 'transition') {
      const timer = setTimeout(() => setScreen('question'), 2000);
      return () => clearTimeout(timer);
    }
  }, [screen]);

  const submitResponse = useCallback(
    async (response: 'yes' | 'maybe' | 'no', date?: string, time?: string) => {
      setIsSubmitting(true);
      try {
        const res = await fetch(`/api/invitations/${invitation.unique_slug}/respond`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            response,
            selected_date: date || undefined,
            selected_time_slot: time || undefined,
            selected_food: selectedFoods.join(', ') || undefined,
            selected_location: selectedLocations.join(', ') || undefined,
          }),
        });

        if (res.ok) {
          if (response === 'yes') {
            setShowConfetti(true);
            setScreen('success-yes');
          } else if (response === 'maybe') {
            setScreen('success-maybe');
          } else {
            setScreen('success-no');
          }
        } else {
          alert('Something went wrong. Please try again.');
        }
      } catch {
        alert('Something went wrong. Please try again.');
      } finally {
        setIsSubmitting(false);
      }
    },
    [invitation.unique_slug, selectedFoods, selectedLocations]
  );

  // Generate calendar dates (next 60 days)
  const calendarDates = Array.from({ length: 60 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i + 1);
    return date.toISOString().split('T')[0];
  });

  const renderScreen = () => {
    switch (screen) {
      case 'welcome':
        return (
          <motion.div
            key="welcome"
            variants={screenVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="text-center space-y-6"
          >
            <motion.div
              animate={{ scale: [1, 1.2, 1], rotate: [0, 5, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-7xl md:text-8xl"
            >
              💌
            </motion.div>
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-3xl md:text-4xl font-bold text-surface-900"
            >
              You have a special message
            </motion.h1>
            <motion.div
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-surface-400 text-sm"
            >
              Loading something magical...
            </motion.div>
          </motion.div>
        );

      case 'greeting':
        return (
          <motion.div
            key="greeting"
            variants={screenVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="text-center space-y-8"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
              className="text-6xl"
            >
              👋
            </motion.div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-surface-900 mb-3">
                Hey {invitation.recipient_name}!
              </h1>
              <p className="text-lg text-surface-500 max-w-md mx-auto leading-relaxed">
                {invitation.welcome_message}
              </p>
            </div>
            <Button onClick={() => setScreen('food')} size="lg">
              Continue ✨
            </Button>
          </motion.div>
        );

      case 'food': {
        const toggleFoodSelection = (food: string) => {
          setSelectedFoods((prev) =>
            prev.includes(food) ? prev.filter((f) => f !== food) : [...prev, food]
          );
        };

        return (
          <motion.div
            key="food"
            variants={screenVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="text-center space-y-8"
          >
            <motion.div
              initial={{ rotate: -20 }}
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-6xl"
            >
              🍽️
            </motion.div>
            <div className="space-y-4">
              <h2 className="text-2xl md:text-3xl font-bold text-surface-900 leading-tight">
                Pick Your Favourite Food & Drinks
              </h2>
              <p className="text-surface-500 text-sm max-w-sm mx-auto">
                Choose one or more options that you would love!
              </p>
              
              <div className="flex flex-wrap gap-2 justify-center max-w-md mx-auto pt-2">
                {foodOptions.map((food) => {
                  const isSelected = selectedFoods.includes(food);
                  return (
                    <Chip
                      key={food}
                      label={food}
                      emoji={FOOD_EMOJIS[food] || '✨'}
                      selected={isSelected}
                      onClick={() => toggleFoodSelection(food)}
                    />
                  );
                })}
              </div>
            </div>
            <Button
              onClick={() => setScreen('location')}
              disabled={selectedFoods.length === 0}
              size="lg"
            >
              Continue 🎉
            </Button>
          </motion.div>
        );
      }

      case 'location': {
        const toggleLocationSelection = (location: string) => {
          setSelectedLocations((prev) =>
            prev.includes(location) ? prev.filter((l) => l !== location) : [...prev, location]
          );
        };

        return (
          <motion.div
            key="location"
            variants={screenVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="text-center space-y-8"
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-6xl"
            >
              📍
            </motion.div>
            <div className="space-y-4">
              <h2 className="text-2xl md:text-3xl font-bold text-surface-900 leading-tight">
                Where Would You Like to Go?
              </h2>
              <p className="text-surface-500 text-sm max-w-sm mx-auto">
                Choose one or more destinations you prefer!
              </p>
              
              <div className="flex flex-wrap gap-2 justify-center max-w-md mx-auto pt-2">
                {locationOptions.map((location) => {
                  const isSelected = selectedLocations.includes(location);
                  return (
                    <Chip
                      key={location}
                      label={location}
                      emoji={LOCATION_EMOJIS[location] || '✨'}
                      selected={isSelected}
                      onClick={() => toggleLocationSelection(location)}
                    />
                  );
                })}
              </div>
            </div>
            <Button
              onClick={() => setScreen('transition')}
              disabled={selectedLocations.length === 0}
              size="lg"
            >
              Sounds amazing! 💫
            </Button>
          </motion.div>
        );
      }

      case 'transition':
        return (
          <motion.div
            key="transition"
            variants={screenVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="text-center space-y-6"
          >
            {/* Floating hearts */}
            <div className="relative h-40 flex items-center justify-center">
              {[...Array(7)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute text-2xl md:text-3xl"
                  initial={{
                    opacity: 0,
                    y: 50,
                    x: (i - 3) * 30,
                  }}
                  animate={{
                    opacity: [0, 1, 0],
                    y: -80,
                    x: (i - 3) * 40,
                  }}
                  transition={{
                    duration: 2,
                    delay: i * 0.2,
                    repeat: Infinity,
                  }}
                >
                  {['❤️', '💕', '💖', '💗', '💝', '💘', '✨'][i]}
                </motion.div>
              ))}
            </div>
            <motion.p
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="text-lg text-surface-500 font-medium"
            >
              Something special is coming...
            </motion.p>
          </motion.div>
        );

      case 'question':
        return (
          <motion.div
            key="question"
            variants={screenVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="text-center space-y-8"
          >
            <motion.div
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-6xl md:text-7xl"
            >
              💕
            </motion.div>
            <div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-surface-900 leading-tight max-w-lg mx-auto">
                {invitation.final_question}
              </h2>
            </div>

            {/* Answer buttons */}
            <div className="flex flex-col items-center gap-4 pt-4 max-w-xs mx-auto">
              {/* Yes button — always clickable */}
              <Button
                size="lg"
                fullWidth
                onClick={() => setScreen('date-picker')}
                icon={<Heart className="w-5 h-5" fill="currentColor" />}
                className="text-lg"
              >
                Yes! ❤️
              </Button>

              {/* Maybe — playful */}
              <PlayfulButton
                onClick={() => submitResponse('maybe')}
                dodgeCount={4}
                className="w-full px-8 py-4 rounded-2xl bg-amber-100 text-amber-800 font-semibold text-lg hover:bg-amber-200 transition-colors border border-amber-200"
              >
                🤔 Maybe Later
              </PlayfulButton>

              {/* No — playful */}
              <PlayfulButton
                onClick={() => submitResponse('no')}
                dodgeCount={6}
                className="w-full px-8 py-4 rounded-2xl bg-surface-100 text-surface-600 font-semibold text-lg hover:bg-surface-200 transition-colors border border-surface-200"
              >
                ❌ No
              </PlayfulButton>
            </div>
          </motion.div>
        );

      case 'date-picker':
        return (
          <motion.div
            key="date-picker"
            variants={screenVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="space-y-6"
          >
            <div className="text-center">
              <Calendar className="w-10 h-10 text-date-purple mx-auto mb-3" />
              <h2 className="text-2xl md:text-3xl font-bold text-surface-900 mb-2">
                Pick a Date
              </h2>
              <p className="text-surface-500">
                When would you like to go?
              </p>
            </div>

            <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-4 border border-surface-200/60 shadow-card max-h-64 overflow-y-auto">
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {!mounted ? (
                  Array.from({ length: 12 }).map((_, i) => (
                    <div key={i} className="p-3 rounded-xl bg-surface-50 border border-surface-200 animate-pulse h-16" />
                  ))
                ) : (
                  calendarDates.slice(0, 30).map((date) => {
                    const d = new Date(date + 'T00:00:00');
                    const isSelected = selectedDate === date;
                    return (
                      <motion.button
                        key={date}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSelectedDate(date)}
                        className={`
                          p-3 rounded-xl text-center transition-all cursor-pointer
                          ${
                            isSelected
                              ? 'bg-gradient-to-br from-date-pink to-date-purple text-white shadow-button'
                              : 'bg-surface-50 hover:bg-surface-100 text-surface-700 border border-surface-200'
                          }
                        `}
                      >
                        <div className="text-xs font-medium opacity-70">
                          {d.toLocaleDateString('en-US', { weekday: 'short' })}
                        </div>
                        <div className="text-lg font-bold">{d.getDate()}</div>
                        <div className="text-xs opacity-70">
                          {d.toLocaleDateString('en-US', { month: 'short' })}
                        </div>
                      </motion.button>
                    );
                  })
                )}
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                variant="ghost"
                onClick={() => setScreen('question')}
                icon={<ArrowLeft className="w-4 h-4" />}
              >
                Back
              </Button>
              <Button
                fullWidth
                onClick={() => setScreen('time-picker')}
                disabled={!selectedDate}
              >
                Continue
              </Button>
            </div>
          </motion.div>
        );

      case 'time-picker':
        return (
          <motion.div
            key="time-picker"
            variants={screenVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="space-y-6"
          >
            <div className="text-center">
              <Clock className="w-10 h-10 text-date-purple mx-auto mb-3" />
              <h2 className="text-2xl md:text-3xl font-bold text-surface-900 mb-2">
                Pick a Time
              </h2>
              <p className="text-surface-500">
                What time works best?
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {TIME_SLOTS.map((slot) => {
                const isSelected = selectedTime === slot.label;
                return (
                  <motion.button
                    key={slot.label}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setSelectedTime(slot.label)}
                    className={`
                      p-4 rounded-2xl text-left transition-all cursor-pointer
                      ${
                        isSelected
                          ? 'bg-gradient-to-br from-date-pink to-date-purple text-white shadow-button'
                          : 'bg-white/80 hover:bg-white border border-surface-200/60 text-surface-700'
                      }
                    `}
                  >
                    <div className="text-2xl mb-1">{slot.icon}</div>
                    <div className="font-semibold">{slot.label}</div>
                    <div className={`text-sm ${isSelected ? 'text-white/80' : 'text-surface-400'}`}>
                      {slot.description}
                    </div>
                  </motion.button>
                );
              })}
            </div>

            <div className="flex gap-3">
              <Button
                variant="ghost"
                onClick={() => setScreen('date-picker')}
                icon={<ArrowLeft className="w-4 h-4" />}
              >
                Back
              </Button>
              <Button
                fullWidth
                onClick={() => setScreen('confirm')}
                disabled={!selectedTime}
              >
                Continue
              </Button>
            </div>
          </motion.div>
        );

      case 'confirm':
        return (
          <motion.div
            key="confirm"
            variants={screenVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="space-y-6"
          >
            <div className="text-center">
              <div className="text-5xl mb-4">✨</div>
              <h2 className="text-2xl md:text-3xl font-bold text-surface-900 mb-2">
                Confirm Your Date
              </h2>
              <p className="text-surface-500">
                Here&apos;s your plan — does everything look perfect?
              </p>
            </div>

            <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-surface-200/60 shadow-card space-y-4">
              {[
                { emoji: '🍽️', label: 'Your Food Choices', value: selectedFoods.join(', ') },
                { emoji: '📍', label: 'Your Location Choices', value: selectedLocations.join(', ') },
                { emoji: '📅', label: 'Date', value: selectedDate ? formatDate(selectedDate) : '' },
                { emoji: '⏰', label: 'Time', value: selectedTime },
              ].map((item, i) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <span className="text-xl">{item.emoji}</span>
                  <div>
                    <div className="text-xs text-surface-400 font-medium">{item.label}</div>
                    <div className="font-semibold text-surface-900">{item.value}</div>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="flex gap-3">
              <Button
                variant="ghost"
                onClick={() => setScreen('time-picker')}
                icon={<ArrowLeft className="w-4 h-4" />}
              >
                Back
              </Button>
              <Button
                fullWidth
                onClick={() => submitResponse('yes', selectedDate, selectedTime)}
                isLoading={isSubmitting}
                icon={<Check className="w-5 h-5" />}
                className="text-lg"
              >
                Confirm ❤️
              </Button>
            </div>
          </motion.div>
        );

      case 'success-yes':
        return (
          <motion.div
            key="success-yes"
            variants={screenVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="text-center space-y-6"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200 }}
              className="text-7xl md:text-8xl"
            >
              🎉
            </motion.div>
            <h2 className="text-3xl md:text-4xl font-black text-surface-900">
              It&apos;s a Date!
            </h2>
            <p className="text-lg text-surface-500 max-w-md mx-auto leading-relaxed">
              Awesome! Your response has been sent. Hope you both have an amazing date! ❤️
            </p>
            <motion.div
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-sm text-surface-400"
            >
              This invitation has been completed
            </motion.div>
          </motion.div>
        );

      case 'success-maybe':
        return (
          <motion.div
            key="success-maybe"
            variants={screenVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="text-center space-y-6"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200 }}
              className="text-7xl md:text-8xl"
            >
              🤗
            </motion.div>
            <h2 className="text-3xl md:text-4xl font-bold text-surface-900">
              Thank You
            </h2>
            <p className="text-lg text-surface-500 max-w-md mx-auto leading-relaxed">
              Thank you for your honesty. Maybe another time ❤️
            </p>
          </motion.div>
        );

      case 'success-no':
        return (
          <motion.div
            key="success-no"
            variants={screenVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="text-center space-y-6"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200 }}
              className="text-7xl md:text-8xl"
            >
              🙏
            </motion.div>
            <h2 className="text-3xl md:text-4xl font-bold text-surface-900">
              Thank You
            </h2>
            <p className="text-lg text-surface-500 max-w-md mx-auto leading-relaxed">
              Thank you for your honesty. I truly appreciate your time. Wishing you all the best ❤️
            </p>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <main className="min-h-dvh relative flex items-center justify-center px-6 py-12">
      <AnimatedBackground theme="date" intensity={1.2} />
      <Confetti trigger={showConfetti} />

      <div className="relative z-10 w-full max-w-lg">
        <AnimatePresence mode="wait">
          {renderScreen()}
        </AnimatePresence>
      </div>
    </main>
  );
}
