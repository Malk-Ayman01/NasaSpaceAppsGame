import React, { useState } from 'react';
import { Play, BookOpen, Compass, Info, Radio, Sparkles, Download } from 'lucide-react';
import { sounds } from '../audio/SoundManager';

interface MainMenuProps {
  onStartGame: () => void;
  onOpenFieldGuide: () => void;
}

export const MainMenu: React.FC<MainMenuProps> = ({ onStartGame, onOpenFieldGuide }) => {
  const [showBriefing, setShowBriefing] = useState(false);
  const [showControls, setShowControls] = useState(false);

  const handleStart = () => {
    sounds.playObjectiveStinger();
    onStartGame();
  };

  return (
    <div className="relative w-full h-full flex flex-col justify-between p-6 sm:p-12 overflow-hidden select-none bg-black">
      {/* Background NASA Mars Image with gradient overlays */}
      <div className="absolute inset-0 z-0">
        <img
          src="/assets/nasa/jezero_crater.jpg"
          alt="Jezero Crater"
          className="w-full h-full object-cover object-center filter brightness-40 contrast-125 scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0c0706] via-[#0c0706]/70 to-[#0c0706]/40" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(12,7,6,0.8)_100%)]" />
      </div>

      {/* Top Bar Header */}
      <div className="relative z-10 flex items-center justify-between border-b border-orange-950/60 pb-4">
        <div className="flex items-center gap-3">
          <span className="w-3 h-3 rounded-full bg-red-500 animate-ping" />
          <span className="font-mono-hud text-xs sm:text-sm font-bold tracking-widest text-orange-400 uppercase">
            ARES PROGRAM // NASA JEZERO CRATER EXPEDITION
          </span>
        </div>

        <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-orange-950/40 border border-orange-500/30 text-xs font-mono-hud text-orange-300">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>PERSEVERANCE 2020 EXPLORATION AREA</span>
        </div>
      </div>

      {/* Center Branding & Mission 1 Selector */}
      <div className="relative z-10 my-auto flex flex-col items-center text-center max-w-3xl mx-auto py-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-red-950/60 border border-red-500/50 text-red-300 text-xs font-mono-hud font-bold uppercase mb-3 shadow-lg">
          <Radio className="w-3.5 h-3.5 animate-pulse text-red-400" />
          <span>GTA V Mission Architecture // 2D Top-Down Mars Simulation</span>
        </div>

        <h1 className="font-title text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-white uppercase drop-shadow-2xl">
          MARS MISSION
        </h1>
        <h2 className="font-title text-xl sm:text-3xl font-bold tracking-widest text-amber-400 uppercase drop-shadow mt-1">
          Mission 1: The Lost Signal
        </h2>

        <p className="font-mono-hud text-xs sm:text-sm text-slate-300 max-w-xl mt-4 leading-relaxed">
          Earth is facing a resource crisis. As Commander Alex Vance at Jezero Crater, your base has lost contact with NASA's Deep Space Network. An approaching dust storm leaves only minutes to retrieve replacement parts, drive the rover through treacherous basalt fields, and restore the relay.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 mt-8 w-full max-w-md">
          <button
            onClick={handleStart}
            className="w-full sm:flex-1 py-4 px-6 rounded-2xl bg-amber-500 hover:bg-amber-400 text-black font-mono-hud text-sm font-bold tracking-wider uppercase transition-all shadow-2xl flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
          >
            <Play className="w-5 h-5 fill-current" />
            <span>Launch Mission 1</span>
          </button>

          <button
            onClick={onOpenFieldGuide}
            className="w-full sm:w-auto py-4 px-6 rounded-2xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700 text-slate-200 font-mono-hud text-xs font-bold transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer"
          >
            <BookOpen className="w-4 h-4 text-purple-400" />
            <span>Field Guide</span>
          </button>
        </div>

        {/* Secondary Info Toggles */}
        <div className="flex flex-wrap items-center justify-center gap-4 mt-6">
          <button
            onClick={() => setShowBriefing(true)}
            className="flex items-center gap-1.5 text-xs font-mono-hud text-slate-400 hover:text-amber-300 transition-colors cursor-pointer"
          >
            <Info className="w-3.5 h-3.5" />
            <span>Story & Setting</span>
          </button>
          <span className="text-slate-600">|</span>
          <button
            onClick={() => setShowControls(true)}
            className="flex items-center gap-1.5 text-xs font-mono-hud text-slate-400 hover:text-amber-300 transition-colors cursor-pointer"
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Controls & Mechanics</span>
          </button>
          <span className="text-slate-600">|</span>
          <a
            href="/mars-mission-game.zip"
            download="mars-mission-game.zip"
            className="flex items-center gap-1.5 text-xs font-mono-hud text-amber-400 hover:text-amber-300 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Project ZIP</span>
          </a>
        </div>
      </div>

      {/* Footer Team & NASA Attribution */}
      <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between text-[11px] font-mono-hud text-slate-500 border-t border-slate-900 pt-3 gap-2">
        <div>BUILT WITH PHASER 3 ARCADE PHYSICS & REACT // 100% CLIENT-SIDE</div>
        <div>REAL NASA PERSEVERANCE & JEZERO CRATER DATA // NO AI GAMEPLAY LOOPS</div>
      </div>

      {/* Story & Setting Modal */}
      {showBriefing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg rounded-2xl bg-slate-950 border border-slate-700 p-6 text-white shadow-2xl">
            <h3 className="font-title text-xl font-bold uppercase text-amber-400 mb-2">
              Mission 1 Narrative Briefing
            </h3>
            <p className="font-mono-hud text-xs text-slate-300 leading-relaxed mb-4">
              The human Mars exploration program has established the Ares-1 habitat inside Jezero Crater—the same ancient river delta explored by NASA's Perseverance rover.
              <br /><br />
              During Sol 248, a severe electrical fault in the high-frequency communications relay tower severed all contact with Earth. At the same time, orbiters detected a global dust storm advancing toward Jezero Crater.
              <br /><br />
              You control Commander Alex Vance. Your objective is simple: leave the habitat, grab a replacement power coupler, drive the 6-wheel rover across the basalt rock field, repair the relay tower, and escape back to the habitat before the dust storm traps you outdoors.
            </p>
            <button
              onClick={() => setShowBriefing(false)}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-mono-hud font-bold cursor-pointer"
            >
              Close Briefing
            </button>
          </div>
        </div>
      )}

      {/* Controls & Mechanics Modal */}
      {showControls && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg rounded-2xl bg-slate-950 border border-slate-700 p-6 text-white shadow-2xl">
            <h3 className="font-title text-xl font-bold uppercase text-amber-400 mb-2">
              Controls & Physics Rules
            </h3>
            <div className="grid grid-cols-2 gap-2 text-xs font-mono-hud mb-4">
              <div className="p-2 rounded bg-slate-900 border border-slate-800">
                <div className="text-slate-400">Walk / Drive:</div>
                <div className="text-amber-300 font-bold">WASD or Arrow Keys</div>
              </div>
              <div className="p-2 rounded bg-slate-900 border border-slate-800">
                <div className="text-slate-400">Interaction / Board:</div>
                <div className="text-amber-300 font-bold">[E] Key</div>
              </div>
              <div className="p-2 rounded bg-slate-900 border border-slate-800">
                <div className="text-slate-400">Dialogue Advance:</div>
                <div className="text-amber-300 font-bold">[SPACE] or [ENTER]</div>
              </div>
              <div className="p-2 rounded bg-slate-900 border border-slate-800">
                <div className="text-slate-400">Oxygen Recovery:</div>
                <div className="text-emerald-400 font-bold">Safe inside Habitat</div>
              </div>
            </div>
            <p className="font-mono-hud text-xs text-slate-400 leading-relaxed mb-4">
              • Oxygen drains at 0.15%/s outdoors and 0.30%/s during the dust storm.<br />
              • Rover battery drains at 0.20%/s on flat ground and 0.40%/s on rough dunes.<br />
              • Colliding with rocks reduces rover condition by 10%. If condition hits 0%, the rover stops and you must proceed on foot!
            </p>
            <button
              onClick={() => setShowControls(false)}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-mono-hud font-bold cursor-pointer"
            >
              Close Controls
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
