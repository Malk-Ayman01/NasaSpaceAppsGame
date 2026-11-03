import React from 'react';
import { RotateCcw, Skull, AlertTriangle } from 'lucide-react';

interface GameOverModalProps {
  onRestart: () => void;
  reason?: string;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  onRestart,
  reason = 'Suit primary oxygen reserve reached 0% before reaching habitat safe zone.',
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-red-950/85 backdrop-blur-md animate-in fade-in duration-300">
      <div className="relative w-full max-w-lg rounded-3xl bg-slate-950 border-2 border-red-600/80 p-6 sm:p-8 text-white shadow-2xl text-center">
        {/* Skull / Warning Icon */}
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-red-600/20 text-red-500 border border-red-500/50 mb-4 animate-pulse">
          <Skull className="w-8 h-8" />
        </div>

        <div className="font-mono-hud text-xs tracking-widest text-red-500 font-bold uppercase mb-1">
          // EVA CRITICAL TELEMETRY LOSS //
        </div>
        <h1 className="font-title text-3xl sm:text-4xl font-black tracking-wider uppercase text-white drop-shadow-md">
          MISSION FAILED
        </h1>

        <div className="my-5 p-4 rounded-xl bg-red-900/30 border border-red-500/40 text-left">
          <div className="flex items-center gap-2 text-xs font-mono-hud font-bold text-red-400 mb-1">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>INCIDENT REPORT:</span>
          </div>
          <p className="font-mono-hud text-xs text-red-200 leading-relaxed">
            {reason}
          </p>
        </div>

        <p className="font-mono-hud text-xs text-slate-400 mb-6">
          Tip: Oxygen refills to 100% when standing inside the Ares-1 habitat airlock ring. When the dust storm hits, outdoor oxygen consumption doubles!
        </p>

        <button
          onClick={onRestart}
          className="w-full py-3.5 px-6 rounded-xl bg-red-600 hover:bg-red-500 text-white font-mono-hud text-sm font-bold tracking-wider uppercase transition-all shadow-xl flex items-center justify-center gap-2 cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Restart Mission 1</span>
        </button>
      </div>
    </div>
  );
};
