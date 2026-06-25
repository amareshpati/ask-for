'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';

interface PlayfulButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  className?: string;
  dodgeCount?: number;
}

export function PlayfulButton({
  children,
  onClick,
  className = '',
  dodgeCount = 5,
}: PlayfulButtonProps) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dodgesRemaining, setDodgesRemaining] = useState(dodgeCount);
  const [isSettled, setIsSettled] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const dodge = useCallback(() => {
    if (dodgesRemaining <= 0) return;

    const button = buttonRef.current;
    if (!button) return;

    const buttonRect = button.getBoundingClientRect();
    
    // Calculate the button's base layout position (where it is before translation) relative to viewport
    const originalLeft = buttonRect.left - position.x;
    const originalTop = buttonRect.top - position.y;

    const padding = 24;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    const minX = padding;
    const maxX = Math.max(padding, viewportWidth - buttonRect.width - padding);
    const minY = padding;
    const maxY = Math.max(padding, viewportHeight - buttonRect.height - padding);

    // Generate random target position inside the viewport
    let targetLeft = minX + Math.random() * (maxX - minX);
    let targetTop = minY + Math.random() * (maxY - minY);

    // Avoid spawning directly under the cursor / current button position
    const distThreshold = 120;
    const dx = targetLeft - buttonRect.left;
    const dy = targetTop - buttonRect.top;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < distThreshold) {
      // Shift coordinates away from current spot
      const rangeX = maxX - minX || 1;
      const rangeY = maxY - minY || 1;
      targetLeft = minX + ((targetLeft - minX + distThreshold) % rangeX);
      targetTop = minY + ((targetTop - minY + distThreshold) % rangeY);
    }

    const newX = targetLeft - originalLeft;
    const newY = targetTop - originalTop;

    setPosition({ x: newX, y: newY });
    setDodgesRemaining((d) => d - 1);
  }, [dodgesRemaining, position.x, position.y]);

  useEffect(() => {
    if (dodgesRemaining <= 0) {
      setIsSettled(true);
      setPosition({ x: 0, y: 0 });
    }
  }, [dodgesRemaining]);

  const handleInteraction = () => {
    if (isSettled) {
      onClick();
    } else {
      dodge();
    }
  };

  // For desktop: dodge on mouse enter
  const handleMouseEnter = () => {
    if (!isSettled) {
      dodge();
    }
  };

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ minHeight: '80px', minWidth: '200px' }}
    >
      <motion.button
        ref={buttonRef}
        animate={{
          x: position.x,
          y: position.y,
          scale: isSettled ? 1 : [1, 1.1, 1],
        }}
        transition={{
          type: 'spring',
          stiffness: 400,
          damping: 25,
          scale: {
            type: 'tween',
            duration: 0.3,
            ease: 'easeInOut',
          },
        }}
        onMouseEnter={handleMouseEnter}
        onClick={handleInteraction}
        className={`relative z-10 cursor-pointer ${className}`}
        whileHover={isSettled ? { scale: 1.05 } : {}}
        whileTap={isSettled ? { scale: 0.95 } : {}}
      >
        {children}
      </motion.button>
    </div>
  );
}
