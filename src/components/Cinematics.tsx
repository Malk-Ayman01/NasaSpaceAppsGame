import React, { useState, useEffect } from 'react';
import { sounds } from '../audio/SoundManager';
import { FastForward, Play, Radio, AlertOctagon } from 'lucide-react';

interface OpeningCinematicProps {
  onStartMission: () => void;
}

export const OpeningCinematic: React.FC<OpeningCinematicProps> = ({ onStartMission }) => {
  const [step, setStep] = useState<number>(0);

  // Cinematic sequence lines
  const cinematicFrames = [
    {
      title: 'JEZERO CRATER, MARS',
      subtitle: 'ARES-1 HUMAN RESEARCH HABITAT // SOL 248',
      speaker: 'MISSION CONTROL (CAPCOM)',
      text: 'Ares-1, Houston here. Telemetry uplink has dropped dead. The orbital communications relay across the ridge suffered a critical power coupling rupture.',
    },
    {
      title: 'CRITICAL WINDOW',
      subtitle: 'COMMUNICATION SYSTEMS OFFLINE',
      speaker: 'DR. ELENA SOTO (HAB ENGINEER)',
      text: 'Alex, telemetry confirms our local antenna has no carrier wave. Without the ridge relay, we cannot contact Earth or coordinate incoming resupply.',
    },
    {
      title: 'APPROACHING DUST FRONT',
      subtitle: 'METEOROLOGICAL SATELLITE WARNING',
      speaker: 'MISSION CONTROL (CAPCOM)',
      text: 'Doppler satellite imagery shows a massive regional dust storm rapidly converging on Jezero Crater. When it hits, outdoor EVA will become lethal.',
    },
    {
      title: 'CMDR. ALEX VANCE',
      subtitle: 'EVA MISSION SPECIALIST',
      speaker: 'ALEX VANCE',
      text: 'Copy that, Director. I will grab the spare coupler from the depot, take the rover through the basalt field, and restore the relay before we lose our window.',
    },
  ];

  useEffect(() => {
    sounds.playRadioBeep();
  }, [step]);

  const nextStep = () => {
    if (step < cinematicFrames.length - 1) {
      setStep((prev) => prev + 1);
    } else {
      onStartMission();
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'Enter') {
        e.preventDefault();
        nextStep();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [step]);

  const current = cinematicFrames[step];

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-between bg-black text-white p-6 sm:p-12 overflow-hidden select-none">
      {/* Top Letterbox Bar with NASA Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <span className="w-3 h-3 rounded-full bg-red-600 animate-ping" />
          <span className="font-mono-hud text-xs sm:text-sm font-bold tracking-widest text-red-500 uppercase">
            NASA // MARS 2020 EXPLORATION MISSION
          </span>
        </div>

        <button
          onClick={onStartMission}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-slate-900 border border-slate-700 hover:border-amber-400 text-xs font-mono-hud text-slate-300 hover:text-white transition-all cursor-pointer"
        >
          <FastForward className="w-3.5 h-3.5" />
          <span>Skip Cinematic</span>
        </button>
      </div>

      {/* Center Cinematic Display with Real NASA Jezero Image */}
      <div className="my-auto flex flex-col items-center max-w-4xl mx-auto w-full">
        {/* Real NASA Satellite Picture of Jezero Crater */}
        <div className="relative w-full h-64 sm:h-80 md:h-96 rounded-2xl overflow-hidden border-2 border-slate-800 shadow-2xl bg-slate-950">
          <img
            src="/assets/nasa/jezero_crater.jpg"
            alt="NASA Jezero Crater Landing Site"
            className="w-full h-full object-cover filter brightness-90 contrast-110 scale-105 transition-transform duration-10000"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

          {/* Mission Title Card (GTA Style) */}
          <div className="absolute top-6 left-6 right-6">
            <span className="font-mono-hud text-xs tracking-widest text-amber-400 font-bold uppercase drop-shadow">
              MISSION 1 BRIEFING
            </span>
            <h1 className="font-title text-3xl sm:text-5xl font-black tracking-wider text-white uppercase drop-shadow-lg mt-1">
              THE LOST SIGNAL
            </h1>
          </div>

          {/* Location details overlay */}
          <div className="absolute bottom-6 left-6 right-6 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-2">
            <div>
              <div className="font-title text-lg sm:text-xl font-bold text-amber-300 uppercase">
                {current.title}
              </div>
              <div className="font-mono-hud text-xs text-slate-300">
                {current.subtitle}
              </div>
            </div>

            <div className="px-3 py-1 rounded bg-black/75 border border-red-500/50 text-[11px] font-mono-hud text-red-400 flex items-center gap-1.5">
              <AlertOctagon className="w-3.5 h-3.5" />
              <span>STORM ETA: 15 MINUTES</span>
            </div>
          </div>
        </div>

        {/* Radio Transmission Box */}
        <div className="w-full mt-6 p-5 sm:p-6 rounded-2xl bg-slate-950/90 border border-slate-800 shadow-xl backdrop-blur-md">
          <div className="flex items-center gap-2 mb-2">
            <Radio className="w-4 h-4 text-amber-400 animate-pulse" />
            <span className="font-mono-hud text-xs font-bold text-amber-400 tracking-wider">
              {current.speaker}
            </span>
          </div>

          <p className="font-mono-hud text-sm sm:text-base text-slate-100 leading-relaxed min-h-[3.5rem]">
            "{current.text}"
          </p>

          <div className="mt-4 pt-3 border-t border-slate-900 flex justify-between items-center">
            <span className="text-xs font-mono-hud text-slate-500">
              Step {step + 1} of {cinematicFrames.length} // Press [SPACE] or [ENTER] to continue
            </span>

            <button
              onClick={nextStep}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-mono-hud text-xs font-bold transition-all shadow-lg cursor-pointer"
            >
              <span>{step === cinematicFrames.length - 1 ? 'Start Mission' : 'Next'}</span>
              <Play className="w-3.5 h-3.5 fill-current" />
            </button>
          </div>
        </div>
      </div>

      {/* Quick Controls Cheat Sheet at Bottom */}
      <div className="border-t border-slate-800 pt-3 flex flex-wrap items-center justify-between text-xs font-mono-hud text-slate-400">
        <div>CONTROLS: WASD / Arrows = Move & Drive | E = Enter/Exit Rover & Interact</div>
        <div>GOAL: Collect Coupler &rarr; Drive Rover &rarr; Repair Relay &rarr; Evacuate Storm</div>
      </div>
    </div>
  );
};
