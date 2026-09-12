import React, { useState, useEffect } from 'react';
import { CONSTANTS, ReactionDTO } from '@watchparty/shared';

interface ReactionParticle {
  id: string;
  emoji: string;
  username: string;
  leftPercent: number;
}

interface ReactionsOverlayProps {
  incomingReaction: ReactionDTO | null;
  onSendReaction: (emoji: string) => void;
}

export const ReactionsOverlay: React.FC<ReactionsOverlayProps> = ({
  incomingReaction,
  onSendReaction,
}) => {
  const [particles, setParticles] = useState<ReactionParticle[]>([]);

  // Add floating particle when a reaction is received
  useEffect(() => {
    if (!incomingReaction) return;

    const newParticle: ReactionParticle = {
      id: incomingReaction.id || Math.random().toString(),
      emoji: incomingReaction.emoji,
      username: incomingReaction.username,
      leftPercent: 15 + Math.random() * 70, // Random horizontal position between 15% and 85%
    };

    setParticles((prev) => [...prev.slice(-15), newParticle]);

    const timer = setTimeout(() => {
      setParticles((prev) => prev.filter((p) => p.id !== newParticle.id));
    }, 2400);

    return () => clearTimeout(timer);
  }, [incomingReaction]);

  return (
    <>
      {/* Floating Particles Area (Overlaid on top of video container) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
        {particles.map((particle) => (
          <div
            key={particle.id}
            style={{ left: `${particle.leftPercent}%`, bottom: '20%' }}
            className="absolute animate-floating-emoji flex flex-col items-center"
          >
            <span className="text-3xl sm:text-4xl filter drop-shadow-lg select-none">
              {particle.emoji}
            </span>
            <span className="text-[10px] font-bold text-black bg-white border-2 border-black px-1.5 py-0.5 select-none uppercase mt-1">
              {particle.username}
            </span>
          </div>
        ))}
      </div>

      {/* Quick Reactions Bar */}
      <div className="flex items-center justify-center gap-1.5 sm:gap-2 p-2 bg-white border-4 border-black">
        <span className="text-xs font-bold text-black uppercase mr-1 hidden sm:inline">React:</span>
        {CONSTANTS.ALLOWED_EMOJIS.map((emoji) => (
          <button
            key={emoji}
            onClick={() => onSendReaction(emoji)}
            className="text-xl sm:text-2xl p-1.5 hover:bg-gray-100 border-2 border-transparent hover:border-black hover:scale-125 active:scale-95 transition-all select-none"
          >
            {emoji}
          </button>
        ))}
      </div>
    </>
  );
};
