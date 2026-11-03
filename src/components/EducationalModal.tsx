import React from 'react';
import { EducationalFact } from '../types/game';
import { ExternalLink, CheckCircle, ShieldCheck, Sparkles } from 'lucide-react';
import { sounds } from '../audio/SoundManager';

interface EducationalModalProps {
  fact: EducationalFact;
  onClose: () => void;
}

export const EducationalModal: React.FC<EducationalModalProps> = ({ fact, onClose }) => {
  const handleClose = () => {
    sounds.playPickup();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-amber-500/60 shadow-2xl p-5 sm:p-6 text-slate-100">
        {/* Top Header Badge */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="flex items-center justify-center w-6 h-6 rounded-md bg-amber-500/20 text-amber-400 font-bold text-xs">
              <Sparkles className="w-3.5 h-3.5" />
            </span>
            <span className="font-mono-hud text-xs font-bold text-amber-400 tracking-wider uppercase">
              NASA Planetary Science Archive // {fact.category}
            </span>
          </div>

          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-[10px] font-mono-hud">
            <ShieldCheck className="w-3 h-3" />
            <span>VERIFIED NASA FACT</span>
          </div>
        </div>

        {/* Title */}
        <div className="mt-3">
          <h2 className="font-title text-xl sm:text-2xl font-bold text-white tracking-wide">
            {fact.title}
          </h2>
          <p className="font-mono-hud text-xs text-amber-300/80 mt-0.5">
            {fact.subtitle}
          </p>
        </div>

        {/* Official NASA Image */}
        <div className="mt-4 rounded-xl overflow-hidden border border-slate-700 bg-black shadow-inner">
          <img
            src={fact.imageSrc}
            alt={fact.title}
            className="w-full h-48 sm:h-56 object-cover object-center"
            onError={(e) => {
              // Graceful fallback to colored canvas container if image not cached
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
          <div className="p-2.5 bg-slate-950/90 border-t border-slate-800 text-[11px] font-mono-hud text-slate-400">
            {fact.imageCaption}
          </div>
        </div>

        {/* Authentic NASA Scientific Fact */}
        <div className="mt-4 p-3.5 rounded-xl bg-slate-800/50 border border-slate-700/60">
          <div className="flex items-center gap-1.5 text-xs font-mono-hud font-bold text-sky-400 mb-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
            <span>OFFICIAL NASA SCIENCE:</span>
          </div>
          <p className="font-mono-hud text-xs sm:text-sm text-slate-200 leading-relaxed">
            {fact.nasaFact}
          </p>
        </div>

        {/* In-Game Context (Fictional Gameplay Integration) */}
        <div className="mt-3 p-3 rounded-xl bg-amber-950/20 border border-amber-600/30">
          <div className="flex items-center gap-1.5 text-xs font-mono-hud font-bold text-amber-400 mb-1">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            <span>MISSION CONNECTION:</span>
          </div>
          <p className="font-mono-hud text-xs text-amber-200/80 leading-relaxed">
            {fact.gameContext}
          </p>
        </div>

        {/* Source citation & Continue Button */}
        <div className="mt-5 pt-3 border-t border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <a
            href={fact.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-[11px] font-mono-hud text-sky-400 hover:text-sky-300 underline"
          >
            <span>Source: {fact.sourceName}</span>
            <ExternalLink className="w-3 h-3" />
          </a>

          <button
            onClick={handleClose}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-mono-hud text-xs font-bold transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer"
          >
            <CheckCircle className="w-4 h-4" />
            <span>Resume Mission</span>
          </button>
        </div>
      </div>
    </div>
  );
};
