
import React from "react";
import {
  ArrowLeft,
  Lock,
  Radio,
  Satellite,
  Target,
  ChevronRight,
} from "lucide-react";

interface MissionsPageProps {
  onSelectMission1: () => void;
  onBack: () => void;
}

export default function MissionsPage({
  onSelectMission1,
  onBack,
}: MissionsPageProps) {
  return (
    <main className="relative w-full h-full min-h-screen overflow-y-auto bg-[#0c0706] text-[#e5e7eb]">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">
        <img
          src="/assets/nasa/jezero_crater.jpg"
          alt="Mars surface"
          className="w-full h-full object-cover brightness-[0.2]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0c0706]/80 via-[#0c0706]/80 to-[#0c0706]" />
      </div>

      <div className="relative z-10 min-h-screen flex flex-col px-6 sm:px-12 py-8">
        {/* Header */}
        <header className="flex items-center justify-between border-b border-[#49302b] pb-5">
          <div>
            <div className="flex items-center gap-2 text-red-400 font-mono-hud text-xs tracking-widest">
              <Radio className="w-4 h-4 animate-pulse" />
              ARES-1 // MISSION CONTROL
            </div>
            <h1 className="font-title text-3xl sm:text-5xl font-black mt-3 tracking-wider">
              MISSION SELECT
            </h1>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-xs font-mono-hud text-[#b8a49e]">
            <Satellite className="w-4 h-4 text-[#dc6547]" />
            MARS OPERATIONS
          </div>
        </header>

        {/* Intro */}
        <section className="mt-10 mb-8">
          <p className="font-mono-hud text-xs tracking-widest text-[#dc6547]">
            PERSONNEL CLEARED // MISSION DATABASE
          </p>
          <p className="text-sm text-[#b8a49e] mt-3 max-w-2xl leading-7">
            Select an available operation. Review mission objectives and
            prepare your crew for deployment on the Martian surface.
          </p>
        </section>

        {/* Mission 1 */}
        <section className="max-w-5xl w-full mx-auto">
          <div className="relative overflow-hidden border border-[#a34e38]/70 bg-[#160c09]/90">
            <div className="absolute inset-0">
              <img
                src="/assets/nasa/jezero_crater.jpg"
                alt="Jezero Crater"
                className="w-full h-full object-cover opacity-20"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#0c0706] via-[#0c0706]/90 to-transparent" />
            </div>

            <div className="relative z-10 p-6 sm:p-10">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="px-3 py-1 border border-red-500/40 bg-red-950/50 text-red-300 text-[10px] font-mono-hud tracking-widest">
                  MISSION 01
                </span>

                <span className="flex items-center gap-2 text-[10px] font-mono-hud text-emerald-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  AVAILABLE
                </span>
              </div>

              <div className="max-w-xl mt-8">
                <div className="font-mono-hud text-xs tracking-[0.25em] text-[#dc8067]">
                  J E Z E R O &nbsp; C R A T E R
                </div>

                <h2 className="font-title text-3xl sm:text-5xl font-black text-white mt-3">
                  THE LOST SIGNAL
                </h2>

                <p className="text-sm leading-7 text-[#c5b4ae] mt-5">
                  A critical communications relay has gone offline.
                  With a massive dust storm approaching, your crew must
                  retrieve replacement parts, repair the relay tower,
                  and restore contact with Earth.
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-7">
                  <div className="border border-[#49302b] bg-[#0c0706]/80 p-3">
                    <Target className="w-4 h-4 text-[#dc6547] mb-2" />
                    <p className="text-[9px] font-mono-hud text-[#9b8580]">
                      OBJECTIVE
                    </p>
                    <p className="text-xs font-mono-hud text-[#e5a18b] mt-1">
                      RESTORE SIGNAL
                    </p>
                  </div>

                  <div className="border border-[#49302b] bg-[#0c0706]/80 p-3">
                    <Satellite className="w-4 h-4 text-[#dc6547] mb-2" />
                    <p className="text-[9px] font-mono-hud text-[#9b8580]">
                      LOCATION
                    </p>
                    <p className="text-xs font-mono-hud text-[#e5a18b] mt-1">
                      MARS
                    </p>
                  </div>

                  <div className="border border-[#49302b] bg-[#0c0706]/80 p-3 col-span-2 sm:col-span-1">
                    <Radio className="w-4 h-4 text-[#dc6547] mb-2" />
                    <p className="text-[9px] font-mono-hud text-[#9b8580]">
                      STATUS
                    </p>
                    <p className="text-xs font-mono-hud text-emerald-400 mt-1">
                      READY
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={onSelectMission1}
                  className="mt-8 flex items-center gap-3 px-7 py-4 bg-[#dc6547] hover:bg-[#ef795b] text-[#0c0706] font-mono-hud text-xs font-bold tracking-widest transition-all hover:scale-[1.02]"
                >
                  SELECT MISSION 1
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Classified missions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-5">
            {[2, 3].map((number) => (
              <div
                key={number}
                className="border border-[#38241f] bg-[#120b09]/90 p-5 opacity-60"
              >
                <div className="flex justify-between items-center">
                  <span className="font-mono-hud text-xs text-[#9b8580]">
                    MISSION {String(number).padStart(2, "0")}
                  </span>
                  <Lock className="w-4 h-4 text-[#806b65]" />
                </div>

                <h3 className="font-title text-xl text-[#b8a49e] mt-4">
                  CLASSIFIED OPERATION
                </h3>

                <p className="font-mono-hud text-[10px] text-[#806b65] mt-3 tracking-widest">
                  ACCESS RESTRICTED
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-auto pt-10 flex flex-col sm:flex-row justify-between items-center gap-4">
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-2 text-xs font-mono-hud text-[#b8a49e] hover:text-[#e5a18b] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            BACK TO CREW SELECTION
          </button>

          <span className="text-[10px] font-mono-hud text-[#806b65]">
            ARES-1 // MISSION DATABASE
          </span>
        </footer>
      </div>
    </main>
  );
}
