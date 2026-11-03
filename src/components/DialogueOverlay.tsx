import React, { useState, useEffect, useRef } from 'react';
import { DialogueLine } from '../types/game';
import { sounds } from '../audio/SoundManager';
import { Radio, ChevronRight, FastForward } from 'lucide-react';

interface DialogueOverlayProps {
  dialogues: DialogueLine[];
  onComplete: () => void;
}

export const DialogueOverlay: React.FC<DialogueOverlayProps> = ({ dialogues, onComplete }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const typeIndexRef = useRef(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const currentLine = dialogues[currentIndex];

  useEffect(() => {
    if (!currentLine) return;

    sounds.playRadioBeep();
    setDisplayedText('');
    setIsTyping(true);
    typeIndexRef.current = 0;

    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      if (typeIndexRef.current < currentLine.text.length) {
        setDisplayedText(currentLine.text.slice(0, typeIndexRef.current + 1));
        typeIndexRef.current++;
        if (typeIndexRef.current % 4 === 0) {
          sounds.playTypewriterTick();
        }
      } else {
        setIsTyping(false);
        if (timerRef.current) clearInterval(timerRef.current);
      }
    }, 22);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentIndex, currentLine]);

  const advanceDialogue = () => {
    if (isTyping) {
      // Instantly finish typing current line
      if (timerRef.current) clearInterval(timerRef.current);
      setDisplayedText(currentLine.text);
      setIsTyping(false);
      return;
    }

    if (currentIndex < dialogues.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      onComplete();
    }
  };

  // Keyboard shortcut listener (Space or Enter advances)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'Enter') {
        e.preventDefault();
        advanceDialogue();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, isTyping, dialogues.length]);

  if (!currentLine) return null;

  // Render character portrait icon / avatar
  const renderPortrait = () => {
    switch (currentLine.characterId) {
      case 'alex':
        return (
          <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-orange-950/80 border-2 border-orange-500/70 overflow-hidden flex items-center justify-center shadow-lg">
            {/* Astronaut helmet icon */}
            <div className="w-10 h-10 rounded-full bg-white border-2 border-slate-400 relative flex items-center justify-center">
              <div className="w-8 h-4 bg-amber-400 rounded-b-full border border-amber-600 mt-2" />
            </div>
            <span className="absolute bottom-0 inset-x-0 bg-orange-600/90 text-[9px] font-mono-hud text-center font-bold text-white py-0.5">
              EVA SUIT
            </span>
          </div>
        );
      case 'chen':
        return (
          <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-blue-950/80 border-2 border-blue-500/70 overflow-hidden flex items-center justify-center shadow-lg">
            {/* Mission control headset icon */}
            <div className="w-9 h-11 rounded-t-lg bg-slate-300 border border-slate-500 relative flex items-center justify-center">
              <div className="absolute -top-1 w-11 h-2 bg-slate-700 rounded-t" />
              <div className="w-2 h-2 rounded-full bg-blue-600" />
            </div>
            <span className="absolute bottom-0 inset-x-0 bg-blue-700/90 text-[9px] font-mono-hud text-center font-bold text-white py-0.5">
              CAPCOM
            </span>
          </div>
        );
      case 'soto':
        return (
          <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-emerald-950/80 border-2 border-emerald-500/70 overflow-hidden flex items-center justify-center shadow-lg">
            {/* Chief Engineer icon */}
            <div className="w-10 h-10 rounded-lg bg-slate-200 border-2 border-emerald-400 relative flex items-center justify-center">
              <div className="w-5 h-5 border-2 border-emerald-600 rounded-full flex items-center justify-center text-[10px] font-bold text-emerald-800">
                E
              </div>
            </div>
            <span className="absolute bottom-0 inset-x-0 bg-emerald-700/90 text-[9px] font-mono-hud text-center font-bold text-white py-0.5">
              ENG HAB
            </span>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="pointer-events-auto absolute bottom-6 inset-x-4 sm:inset-x-12 md:inset-x-24 z-40">
      <div className="relative rounded-2xl bg-black/90 border border-amber-500/50 p-4 sm:p-5 shadow-2xl backdrop-blur-md">
        {/* Top Radio Frequency Status Header */}
        <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-amber-400 animate-pulse" />
            <span className="font-mono-hud text-xs font-bold text-amber-400 tracking-wider">
              {currentLine.callsign}
            </span>
          </div>

          {/* Animated audio wave bars */}
          <div className="flex items-center gap-1">
            <span className="w-1 h-3 bg-amber-400 rounded-full animate-pulse" />
            <span className="w-1 h-5 bg-amber-400 rounded-full animate-pulse delay-75" />
            <span className="w-1 h-2 bg-amber-400 rounded-full animate-pulse delay-150" />
            <span className="w-1 h-4 bg-amber-400 rounded-full animate-pulse delay-100" />
          </div>
        </div>

        {/* Content: Portrait + Dialogue text */}
        <div className="flex items-start gap-4 sm:gap-6">
          {renderPortrait()}

          <div className="flex-1 flex flex-col justify-between min-h-[4.5rem]">
            <div>
              <div className="font-title text-sm sm:text-base font-bold text-slate-100 uppercase tracking-wide mb-1">
                {currentLine.speaker}
              </div>
              <p className="font-mono-hud text-xs sm:text-sm text-slate-200 leading-relaxed min-h-[2.5rem]">
                {displayedText}
                {isTyping && <span className="inline-block w-2 h-4 bg-amber-400 ml-1 animate-pulse" />}
              </p>
            </div>

            {/* Bottom Actions */}
            <div className="flex items-center justify-between mt-3 pt-2">
              <span className="text-[10px] font-mono-hud text-slate-400">
                Transmission {currentIndex + 1} of {dialogues.length}
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={advanceDialogue}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-black font-mono-hud text-xs font-bold transition-all shadow-md cursor-pointer"
                >
                  <span>{isTyping ? 'Fast-Forward' : 'Continue'}</span>
                  {isTyping ? <FastForward className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                  <span className="hidden sm:inline text-[10px] opacity-75 ml-1">[SPACE]</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
