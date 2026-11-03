import React from 'react';
import { MissionStats } from '../types/game';
import {
  Trophy,
  RotateCcw,
  BookOpen,
  Clock,
  Wind,
  Battery,
  Shield,
  Radio,
  ExternalLink,
  Lock,
} from 'lucide-react';

interface MissionCompleteModalProps {
  stats: MissionStats;
  onReplay: () => void;
  onOpenFieldGuide: () => void;
}

export const MissionCompleteModal: React.FC<MissionCompleteModalProps> = ({
  stats,
  onReplay,
  onOpenFieldGuide,
}) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}m ${secs < 10 ? '0' : ''}${secs}s`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-lg animate-in fade-in duration-300">
      <div className="relative w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-3xl bg-gradient-to-b from-slate-900 via-slate-950 to-black border-2 border-emerald-500/70 p-6 sm:p-8 text-white shadow-2xl">
        {/* GTA V STYLE MISSION PASSED BANNER */}
        <div className="text-center pb-6 border-b border-slate-800">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/50 mb-3">
            <Trophy className="w-8 h-8" />
          </div>
          <div className="font-mono-hud text-xs tracking-widest text-emerald-400 font-bold uppercase mb-1">
            // STATUS: SUCCESSFUL EVA RECOVERY //
          </div>
          <h1 className="font-title text-3xl sm:text-5xl font-black tracking-wider uppercase text-white drop-shadow-md">
            MISSION COMPLETED
          </h1>
          <p className="font-mono-hud text-xs sm:text-sm text-slate-400 mt-1">
            Mission 1: The Lost Signal // Jezero Crater Delta Sector
          </p>
        </div>

        {/* DRAMATIC MYSTERY CLIFFHANGER */}
        <div className="my-6 p-4 rounded-2xl bg-amber-950/30 border border-amber-500/40 text-center">
          <div className="flex items-center justify-center gap-2 text-amber-400 text-xs font-mono-hud font-bold mb-1">
            <Radio className="w-4 h-4 animate-pulse" />
            <span>UNIDENTIFIED TRANSMISSION DETECTED</span>
          </div>
          <p className="font-title text-base sm:text-lg font-bold text-amber-200 tracking-wide italic">
            “Signal recovered. But we are not alone out here…”
          </p>
          <p className="text-xs font-mono-hud text-slate-400 mt-1">
            Downlink established with Deep Space Network, but anomalous carrier pulses are echoing from deep within Jezero Crater.
          </p>
        </div>

        {/* MISSION PERFORMANCE METRICS */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
          {/* Time Taken */}
          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
            <div className="flex items-center gap-2 text-xs font-mono-hud text-slate-400 mb-1">
              <Clock className="w-4 h-4 text-sky-400" />
              <span>TIME TAKEN</span>
            </div>
            <div className="font-title text-lg font-bold text-white">
              {formatTime(stats.elapsedSeconds)}
            </div>
          </div>

          {/* Remaining Oxygen */}
          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
            <div className="flex items-center gap-2 text-xs font-mono-hud text-slate-400 mb-1">
              <Wind className="w-4 h-4 text-sky-400" />
              <span>FINAL OXYGEN</span>
            </div>
            <div className="font-title text-lg font-bold text-sky-300">
              {Math.round(stats.finalOxygen)}%
            </div>
          </div>

          {/* Rover Battery */}
          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
            <div className="flex items-center gap-2 text-xs font-mono-hud text-slate-400 mb-1">
              <Battery className="w-4 h-4 text-amber-400" />
              <span>ROVER BATTERY</span>
            </div>
            <div className="font-title text-lg font-bold text-amber-300">
              {Math.round(stats.finalBattery)}%
            </div>
          </div>

          {/* Rover Integrity */}
          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
            <div className="flex items-center gap-2 text-xs font-mono-hud text-slate-400 mb-1">
              <Shield className="w-4 h-4 text-emerald-400" />
              <span>ROVER INTEGRITY</span>
            </div>
            <div className="font-title text-lg font-bold text-emerald-300">
              {Math.round(stats.finalCondition)}%
            </div>
          </div>

          {/* Rock Impacts */}
          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
            <div className="flex items-center gap-2 text-xs font-mono-hud text-slate-400 mb-1">
              <Shield className="w-4 h-4 text-red-400" />
              <span>ROCK IMPACTS</span>
            </div>
            <div className="font-title text-lg font-bold text-slate-200">
              {stats.rockCollisions} hits
            </div>
          </div>

          {/* NASA Discoveries */}
          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
            <div className="flex items-center gap-2 text-xs font-mono-hud text-slate-400 mb-1">
              <BookOpen className="w-4 h-4 text-purple-400" />
              <span>NASA SCIENCE</span>
            </div>
            <div className="font-title text-lg font-bold text-purple-300">
              {stats.factsDiscovered} / {stats.totalFacts} Unlocked
            </div>
          </div>
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-800">
          <button
            onClick={onOpenFieldGuide}
            className="w-full sm:w-auto px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-mono-hud text-xs font-bold transition-all flex items-center justify-center gap-2 border border-slate-700 cursor-pointer"
          >
            <BookOpen className="w-4 h-4 text-amber-400" />
            <span>Open NASA Field Guide</span>
          </button>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={onReplay}
              className="flex-1 sm:flex-initial px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-mono-hud text-xs font-bold transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Replay Mission 1</span>
            </button>

            <button
              disabled
              className="flex-1 sm:flex-initial px-5 py-3 rounded-xl bg-slate-800/60 border border-slate-700/50 text-slate-500 font-mono-hud text-xs font-bold flex items-center justify-center gap-2 cursor-not-allowed opacity-80"
              title="Mission 2 is currently in development"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Mission 2: Coming Soon</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
