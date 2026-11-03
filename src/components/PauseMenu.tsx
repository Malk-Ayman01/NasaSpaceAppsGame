import React from 'react';
import { Play, RotateCcw, Volume2, VolumeX, BookOpen, X, Keyboard, Compass, Download } from 'lucide-react';
import { sounds } from '../audio/SoundManager';

interface PauseMenuProps {
  onResume: () => void;
  onRestart: () => void;
  onOpenFieldGuide: () => void;
}

export const PauseMenu: React.FC<PauseMenuProps> = ({
  onResume,
  onRestart,
  onOpenFieldGuide,
}) => {
  const [isMuted, setIsMuted] = React.useState(sounds.getMuted());

  const handleToggleSound = () => {
    const muted = sounds.toggleMute();
    setIsMuted(muted);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-3xl bg-slate-950 border border-slate-700 p-6 sm:p-8 text-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-amber-400" />
            <h2 className="font-title text-xl font-bold uppercase tracking-wider text-white">
              Mission Paused
            </h2>
          </div>
          <button
            onClick={onResume}
            className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Controls Reference */}
        <div className="my-5 p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center gap-2 text-xs font-mono-hud font-bold text-amber-400 mb-3">
            <Keyboard className="w-4 h-4" />
            <span>OPERATIONAL CONTROLS:</span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs font-mono-hud">
            <div className="flex items-center justify-between p-2 rounded bg-black/40">
              <span className="text-slate-400">Walk / Drive:</span>
              <span className="text-amber-300 font-bold">WASD / Arrows</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded bg-black/40">
              <span className="text-slate-400">Interact / Enter:</span>
              <span className="text-amber-300 font-bold">[E]</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded bg-black/40">
              <span className="text-slate-400">Advance Radio:</span>
              <span className="text-amber-300 font-bold">[SPACE] / [ENTER]</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded bg-black/40">
              <span className="text-slate-400">Oxygen Refill:</span>
              <span className="text-emerald-400 font-bold">Inside Habitat</span>
            </div>
          </div>
        </div>

        {/* Navigation Action Buttons */}
        <div className="flex flex-col gap-3">
          <button
            onClick={onResume}
            className="w-full py-3 px-5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-mono-hud text-xs font-bold uppercase tracking-wider transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Resume Mission</span>
          </button>

          <button
            onClick={onOpenFieldGuide}
            className="w-full py-2.5 px-5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-mono-hud text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <BookOpen className="w-4 h-4 text-purple-400" />
            <span>NASA Planetary Science Field Guide</span>
          </button>

          <a
            href="/mars-mission-game.zip"
            download="mars-mission-game.zip"
            className="w-full py-2.5 px-5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/50 text-amber-300 font-mono-hud text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Download className="w-4 h-4 text-amber-400" />
            <span>Download Project ZIP Archive</span>
          </a>

          <div className="flex items-center gap-3">
            <button
              onClick={handleToggleSound}
              className="flex-1 py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 font-mono-hud text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
              <span>{isMuted ? 'Audio: Muted' : 'Audio: Active'}</span>
            </button>

            <button
              onClick={onRestart}
              className="flex-1 py-2.5 px-4 rounded-xl bg-red-950/60 hover:bg-red-900/80 border border-red-600/60 text-red-300 font-mono-hud text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Restart Mission</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
