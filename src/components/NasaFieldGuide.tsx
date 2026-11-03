import React, { useState } from 'react';
import { NASA_FACTS } from '../data/nasaContent';
import { EducationalFact } from '../types/game';
import { BookOpen, ExternalLink, X, ShieldCheck, Sparkles } from 'lucide-react';

interface NasaFieldGuideProps {
  unlockedFactIds: string[];
  onClose: () => void;
}

export const NasaFieldGuide: React.FC<NasaFieldGuideProps> = ({ unlockedFactIds, onClose }) => {
  const [selectedFact, setSelectedFact] = useState<EducationalFact>(NASA_FACTS[0]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col rounded-3xl bg-slate-950 border border-slate-700 shadow-2xl text-white overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-slate-800 bg-slate-900/80">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-title text-xl sm:text-2xl font-bold uppercase tracking-wider text-white">
                NASA Jezero Crater Field Guide
              </h2>
              <p className="font-mono-hud text-xs text-slate-400">
                Official NASA Mars 2020 Perseverance Science & Mission Data
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body: Two Column Layout */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* Left: Fact List Sidebar */}
          <div className="w-full md:w-80 border-b md:border-b-0 md:border-r border-slate-800 p-3 sm:p-4 overflow-y-auto flex flex-col gap-2 shrink-0 bg-slate-950/50">
            <div className="text-[10px] font-mono-hud font-bold text-slate-500 uppercase tracking-widest px-2 py-1">
              DISCOVERIES ({unlockedFactIds.length} / {NASA_FACTS.length})
            </div>

            {NASA_FACTS.map((fact) => {
              const isUnlocked = unlockedFactIds.includes(fact.id);
              const isSelected = selectedFact.id === fact.id;

              return (
                <button
                  key={fact.id}
                  onClick={() => setSelectedFact(fact)}
                  className={`w-full text-left p-3 rounded-xl font-mono-hud transition-all flex flex-col gap-1 cursor-pointer border ${
                    isSelected
                      ? 'bg-amber-500/15 border-amber-500/80 shadow-md'
                      : 'bg-slate-900/60 border-slate-800 hover:bg-slate-900 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-amber-400 tracking-wider uppercase">
                      {fact.category}
                    </span>
                    {isUnlocked && (
                      <span className="flex items-center gap-1 text-[9px] text-emerald-400">
                        <ShieldCheck className="w-3 h-3" />
                        <span>DISCOVERED</span>
                      </span>
                    )}
                  </div>
                  <div className="font-title text-sm font-bold text-slate-100 line-clamp-1">
                    {fact.title}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right: Detailed Fact Content */}
          <div className="flex-1 p-4 sm:p-6 overflow-y-auto flex flex-col gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 text-[10px] font-mono-hud font-bold uppercase">
                  {selectedFact.category}
                </span>
                <span className="text-xs font-mono-hud text-slate-400">
                  {selectedFact.subtitle}
                </span>
              </div>
              <h3 className="font-title text-2xl font-bold text-white">
                {selectedFact.title}
              </h3>
            </div>

            {/* Photo */}
            <div className="rounded-2xl overflow-hidden border border-slate-800 bg-black">
              <img
                src={selectedFact.imageSrc}
                alt={selectedFact.title}
                className="w-full h-56 sm:h-64 object-cover object-center"
              />
              <div className="p-2.5 bg-slate-950 text-[11px] font-mono-hud text-slate-400 border-t border-slate-800">
                {selectedFact.imageCaption}
              </div>
            </div>

            {/* Scientific Explanation */}
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
              <div className="flex items-center gap-2 text-xs font-mono-hud font-bold text-sky-400 mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>OFFICIAL NASA SCIENCE:</span>
              </div>
              <p className="font-mono-hud text-xs sm:text-sm text-slate-200 leading-relaxed">
                {selectedFact.nasaFact}
              </p>
            </div>

            {/* In-Game Context */}
            <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-600/30">
              <div className="text-xs font-mono-hud font-bold text-amber-400 mb-1">
                IN-GAME MISSION APPLICATION:
              </div>
              <p className="font-mono-hud text-xs text-amber-200/90 leading-relaxed">
                {selectedFact.gameContext}
              </p>
            </div>

            {/* Source Citation */}
            <div className="pt-2 flex items-center justify-between">
              <a
                href={selectedFact.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs font-mono-hud text-sky-400 hover:text-sky-300 underline"
              >
                <span>NASA Reference: {selectedFact.sourceName}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <span className="text-[10px] font-mono-hud text-slate-500">
                NASA Jet Propulsion Laboratory & Mars Exploration Program
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
