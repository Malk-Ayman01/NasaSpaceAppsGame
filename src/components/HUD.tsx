import React, { useEffect, useState } from 'react';
import { GameResources, MissionStage, Waypoint } from '../types/game';
import {
  Wind,
  Battery,
  ShieldAlert,
  Zap,
  Radio,
  BookOpen,
  Volume2,
  VolumeX,
  Compass,
  AlertTriangle,
  Menu,
} from 'lucide-react';
import { sounds } from '../audio/SoundManager';

interface HUDProps {
  resources: GameResources;
  stage: MissionStage;
  waypoint: Waypoint | null;
  interactionPrompt: string | null;
  warningMessage: string | null;
  discoveredFactsCount: number;
  totalFactsCount: number;
  onOpenFieldGuide: () => void;
  onOpenPauseMenu: () => void;
}

export const HUD: React.FC<HUDProps> = ({
  resources,
  stage,
  waypoint,
  interactionPrompt,
  warningMessage,
  discoveredFactsCount,
  totalFactsCount,
  onOpenFieldGuide,
  onOpenPauseMenu,
}) => {
  const [isMuted, setIsMuted] = useState(sounds.getMuted());
  const [lastObjective, setLastObjective] = useState<string>('');
  const [showObjectiveBanner, setShowObjectiveBanner] = useState(false);

  // Determine current stage objective text
  const getObjectiveText = (): string => {
    switch (stage) {
      case 'stage_1_leave_habitat':
        return 'Exit Ares-1 Habitat and inspect surroundings';
      case 'stage_2_collect_coupler':
        return 'Retrieve replacement power coupler from supply crate';
      case 'stage_3_drive_rover':
        return 'Board the Mars Rover at depot';
      case 'stage_4_repair_relay':
        return resources.hasCoupler
          ? 'Navigate through rock field and repair communications relay'
          : 'Collect power coupler to repair communications relay';
      case 'stage_5_escape_storm':
        return 'EMERGENCY: Evacuate back to Ares-1 Habitat before dust storm engulfs sector!';
      case 'cinematic_ending':
        return 'Mission Accomplished: Habitat airlock secured';
      default:
        return 'Explore Jezero Crater';
    }
  };

  const currentObjective = getObjectiveText();

  useEffect(() => {
    if (currentObjective !== lastObjective && currentObjective !== '') {
      setLastObjective(currentObjective);
      setShowObjectiveBanner(true);
      const timer = setTimeout(() => setShowObjectiveBanner(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [currentObjective, lastObjective]);

  const handleToggleSound = () => {
    const muted = sounds.toggleMute();
    setIsMuted(muted);
  };

  const isLowOxygen = resources.oxygen < 25 && !resources.isInsideHabitat;
  const isLowBattery = resources.battery < 20 && resources.isInRover;
  const isDamagedRover = resources.condition < 30;

  return (
    <div className="pointer-events-none absolute inset-0 z-30 flex flex-col justify-between p-4 sm:p-6 overflow-hidden">
      {/* 1. TOP HEADER & TELEMETRY */}
      <div className="flex items-start justify-between w-full">
        {/* Left: Mission & Location Stamp */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
            <span className="font-mono-hud text-xs tracking-wider text-red-400 font-bold uppercase">
              NASA JEZERO CRATER // EVA-01
            </span>
          </div>
          <h1 className="font-title text-xl sm:text-2xl font-bold tracking-wider text-slate-100 uppercase drop-shadow-md">
            Mission 1: The Lost Signal
          </h1>
          <div className="flex items-center gap-3 text-xs font-mono-hud text-slate-400">
            <span>SOL 248</span>
            <span>|</span>
            <span className="text-amber-300">
              {resources.isInsideHabitat ? 'HABITAT SAFE HAVEN' : resources.isDustStormActive ? 'STORM VISIBILITY REDUCED' : 'SURFACE AMBIENT'}
            </span>
          </div>
        </div>

        {/* Right: Quick Action Controls */}
        <div className="pointer-events-auto flex items-center gap-2">
          <button
            onClick={onOpenFieldGuide}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-700/80 hover:border-amber-500/80 hover:bg-slate-800 text-xs font-mono-hud text-slate-200 transition-all shadow-lg backdrop-blur"
            title="Open NASA Field Guide"
          >
            <BookOpen className="w-4 h-4 text-amber-400" />
            <span className="hidden md:inline">NASA Field Guide</span>
            <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-bold">
              {discoveredFactsCount}/{totalFactsCount}
            </span>
          </button>

          <button
            onClick={handleToggleSound}
            className="p-2 rounded-lg bg-slate-900/80 border border-slate-700/80 hover:border-slate-500 hover:bg-slate-800 text-slate-300 transition-all shadow-lg backdrop-blur"
            title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
          </button>

          <button
            onClick={onOpenPauseMenu}
            className="p-2 rounded-lg bg-slate-900/80 border border-slate-700/80 hover:border-slate-500 hover:bg-slate-800 text-slate-300 transition-all shadow-lg backdrop-blur"
            title="Pause Menu & Controls"
          >
            <Menu className="w-4 h-4 text-slate-300" />
          </button>
        </div>
      </div>

      {/* 2. GTA V STYLE ANIMATED OBJECTIVE BANNER */}
      <div className="w-full flex flex-col items-center justify-center my-auto">
        {showObjectiveBanner && (
          <div className="animate-in fade-in zoom-in-95 duration-300 flex flex-col items-center bg-black/85 border-y-2 border-amber-500 px-6 sm:px-12 py-3 shadow-2xl backdrop-blur-md max-w-2xl text-center">
            <span className="font-mono-hud text-xs tracking-widest text-amber-400 font-bold uppercase mb-1">
              // OBJECTIVE UPDATED //
            </span>
            <span className="font-title text-base sm:text-xl font-bold tracking-wide text-white uppercase">
              {currentObjective}
            </span>
          </div>
        )}

        {/* Warning Toast message if any */}
        {warningMessage && (
          <div className="mt-3 flex items-center gap-2 px-4 py-2 rounded-lg bg-red-950/90 border border-red-500/80 text-red-200 font-mono-hud text-xs shadow-xl animate-bounce backdrop-blur">
            <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{warningMessage}</span>
          </div>
        )}
      </div>

      {/* 3. INTERACTION PROMPT PILL (FLOATING CENTER-BOTTOM) */}
      <div className="w-full flex justify-center mb-2">
        {interactionPrompt && (
          <div className="pointer-events-auto px-5 py-2.5 rounded-full bg-slate-900/95 border-2 border-amber-400 text-white font-mono-hud text-sm font-bold tracking-wider shadow-2xl flex items-center gap-2.5 animate-pulse backdrop-blur">
            <span className="inline-block w-2 h-2 rounded-full bg-amber-400" />
            <span>{interactionPrompt}</span>
          </div>
        )}
      </div>

      {/* 4. BOTTOM BAR: RADAR MINIMAP (LEFT) & GAUGES / INVENTORY (RIGHT) */}
      <div className="flex items-end justify-between w-full">
        {/* LEFT: GTA-STYLE RADAR MINIMAP */}
        <div className="relative w-36 h-36 sm:w-44 sm:h-44 rounded-full bg-slate-950/90 border-2 border-slate-700/90 shadow-2xl overflow-hidden backdrop-blur-md flex items-center justify-center">
          {/* Radar Grid Circles */}
          <div className="absolute inset-2 rounded-full border border-slate-800/80 pointer-events-none" />
          <div className="absolute inset-6 rounded-full border border-slate-800/60 pointer-events-none" />
          <div className="absolute inset-10 rounded-full border border-slate-800/40 pointer-events-none" />
          {/* Crosshairs */}
          <div className="absolute w-full h-[1px] bg-slate-800/60" />
          <div className="absolute h-full w-[1px] bg-slate-800/60" />

          {/* Compass labels */}
          <span className="absolute top-1 text-[9px] font-mono-hud font-bold text-slate-400">N</span>
          <span className="absolute bottom-1 text-[9px] font-mono-hud font-bold text-slate-500">S</span>
          <span className="absolute left-1.5 text-[9px] font-mono-hud font-bold text-slate-500">W</span>
          <span className="absolute right-1.5 text-[9px] font-mono-hud font-bold text-slate-500">E</span>

          {/* Center Player Blip */}
          <div className="w-3 h-3 rounded-full bg-white shadow-lg shadow-white/80 border border-slate-900 z-10 flex items-center justify-center">
            <div className="w-1 h-1 rounded-full bg-sky-400" />
          </div>

          {/* Waypoint Indicator in Radar */}
          {waypoint && (
            <div
              className="absolute z-20 flex flex-col items-center justify-center animate-pulse"
              style={{
                transform: `translate(${Math.min(55, Math.max(-55, (waypoint.x - (resources.isInRover ? 700 : 350)) / 25))}px, ${Math.min(55, Math.max(-55, (waypoint.y - (resources.isInRover ? 520 : 550)) / 25))}px)`,
              }}
            >
              <div className="w-2.5 h-2.5 rotate-45 bg-amber-400 border border-amber-200 shadow-md shadow-amber-400/80" />
            </div>
          )}

          {/* Waypoint distance badge */}
          {waypoint && (
            <div className="absolute bottom-2 px-2 py-0.5 rounded bg-black/80 border border-amber-500/50 text-[10px] font-mono-hud font-bold text-amber-300">
              {waypoint.distanceMeters}m
            </div>
          )}
        </div>

        {/* RIGHT: VITAL RESOURCES & INVENTORY */}
        <div className="flex flex-col gap-2 items-end">
          {/* OXYGEN METER */}
          <div
            className={`flex items-center gap-3 px-3 py-2 rounded-xl bg-slate-950/85 border backdrop-blur-md shadow-xl transition-all ${
              isLowOxygen ? 'border-red-500/90 shadow-red-500/20 animate-pulse' : 'border-slate-800'
            }`}
          >
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-sky-950/60 border border-sky-500/40 text-sky-400">
              <Wind className="w-4 h-4" />
            </div>
            <div className="flex flex-col w-28 sm:w-36">
              <div className="flex justify-between items-center text-[11px] font-mono-hud mb-1">
                <span className="text-slate-400 font-bold uppercase">O2 Life Support</span>
                <span className={isLowOxygen ? 'text-red-400 font-bold' : 'text-sky-300 font-bold'}>
                  {Math.round(resources.oxygen)}%
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className={`h-full transition-all duration-200 rounded-full ${
                    resources.oxygen > 50
                      ? 'bg-sky-400'
                      : resources.oxygen > 25
                      ? 'bg-amber-400'
                      : 'bg-red-500'
                  }`}
                  style={{ width: `${Math.max(0, Math.min(100, resources.oxygen))}%` }}
                />
              </div>
            </div>
          </div>

          {/* ROVER TELEMETRY (SLIDES IN WHEN IN ROVER OR RECENTLY DAMAGED) */}
          {(resources.isInRover || resources.condition < 100) && (
            <div className="flex flex-col gap-2 p-2.5 rounded-xl bg-slate-950/85 border border-slate-800 backdrop-blur-md shadow-xl">
              {/* Battery Meter */}
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-amber-950/60 border border-amber-500/40 text-amber-400">
                  <Battery className="w-4 h-4" />
                </div>
                <div className="flex flex-col w-28 sm:w-36">
                  <div className="flex justify-between items-center text-[10px] font-mono-hud mb-0.5">
                    <span className="text-slate-400 font-bold uppercase">Rover Battery</span>
                    <span className={isLowBattery ? 'text-red-400 font-bold' : 'text-amber-300 font-bold'}>
                      {Math.round(resources.battery)}%
                    </span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className={`h-full transition-all duration-200 rounded-full ${
                        resources.battery > 40 ? 'bg-amber-400' : 'bg-red-500'
                      }`}
                      style={{ width: `${Math.max(0, Math.min(100, resources.battery))}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Rover Hull Condition */}
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-emerald-950/60 border border-emerald-500/40 text-emerald-400">
                  <ShieldAlert className="w-4 h-4" />
                </div>
                <div className="flex flex-col w-28 sm:w-36">
                  <div className="flex justify-between items-center text-[10px] font-mono-hud mb-0.5">
                    <span className="text-slate-400 font-bold uppercase">Chassis Integrity</span>
                    <span className={isDamagedRover ? 'text-red-400 font-bold' : 'text-emerald-300 font-bold'}>
                      {Math.round(resources.condition)}%
                    </span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className={`h-full transition-all duration-200 rounded-full ${
                        resources.condition > 50 ? 'bg-emerald-400' : resources.condition > 25 ? 'bg-amber-400' : 'bg-red-500'
                      }`}
                      style={{ width: `${Math.max(0, Math.min(100, resources.condition))}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* INVENTORY SLOT */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-950/80 border border-slate-800 backdrop-blur-md">
            <Zap className={`w-3.5 h-3.5 ${resources.hasCoupler ? 'text-cyan-400' : 'text-slate-600'}`} />
            <span className="text-[10px] font-mono-hud uppercase tracking-wider text-slate-300">
              Power Coupler:
            </span>
            <span
              className={`text-[10px] font-mono-hud font-bold px-1.5 py-0.5 rounded ${
                resources.hasCoupler ? 'bg-cyan-500/20 text-cyan-300' : 'bg-slate-800 text-slate-500'
              }`}
            >
              {resources.hasCoupler ? 'INSTALLED (1/1)' : 'EMPTY (0/1)'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
