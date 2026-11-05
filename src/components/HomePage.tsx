
import React from "react";
import { Rocket, Radio, Satellite, ChevronRight } from "lucide-react";

interface HomePageProps {
  onStart: () => void;
}

export default function HomePage({ onStart }: HomePageProps) {
  return (
    <main className="relative w-full h-full min-h-screen overflow-y-auto bg-[#0c0706] text-[#e5e7eb]">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">
        <img
          src="/assets/nasa/jezero_crater.jpg"
          alt="Mars Jezero Crater"
          className="w-full h-full object-cover brightness-[0.35] contrast-125"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0c0706]/70 via-[#0c0706]/40 to-[#0c0706]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(12,7,6,0.75)_100%)]" />
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <header className="flex items-center justify-between px-6 sm:px-12 py-6 border-b border-red-950/60">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
            <span className="font-mono-hud text-xs sm:text-sm tracking-[0.2em] text-orange-300 font-bold">
              ARES PROGRAM
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-xs font-mono-hud text-[#b8a49e]">
            <Satellite className="w-4 h-4 text-red-400" />
            EARTH // MARS CONNECTION
          </div>
        </header>

        {/* Hero */}
        <section className="flex-1 flex flex-col items-center justify-center text-center px-6 py-20">
          <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-red-500/30 bg-red-950/40 text-red-300 font-mono-hud text-[10px] sm:text-xs tracking-widest mb-8">
            <Radio className="w-4 h-4 animate-pulse" />
            HUMANITY'S NEXT FRONTIER
          </div>

          <p className="font-mono-hud text-xs sm:text-sm tracking-[0.35em] text-[#b8a49e] mb-4">
            WELCOME TO
          </p>

          <h1 className="font-title text-5xl sm:text-7xl md:text-8xl font-black tracking-wider text-white drop-shadow-2xl">
            MARS
            <span className="block text-[#dc6547]">MISSION</span>
          </h1>

          <div className="w-24 h-[2px] bg-[#dc6547] my-7" />

          <h2 className="font-title text-lg sm:text-2xl tracking-[0.2em] text-[#e5a18b] uppercase">
            The Lost Signal
          </h2>

          <p className="max-w-2xl mt-6 text-sm sm:text-base leading-8 text-[#c5b4ae]">
            A mission beyond Earth. A crew stranded on Mars.
            A signal lost in the silence of space.
            Your journey begins at Jezero Crater.
          </p>

          <button
            type="button"
            onClick={onStart}
            className="group mt-10 flex items-center justify-center gap-3 px-10 py-4 bg-[#dc6547] hover:bg-[#ef795b] text-[#0c0706] font-mono-hud font-bold tracking-widest rounded-sm transition-all duration-300 hover:scale-105 shadow-[0_0_35px_rgba(220,101,71,0.25)]"
          >
            <Rocket className="w-5 h-5 group-hover:-translate-y-1 transition-transform" />
            BEGIN EXPEDITION
            <ChevronRight className="w-5 h-5" />
          </button>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-20 w-full max-w-3xl">
            {[
              { label: "LOCATION", value: "JEZERO CRATER" },
              { label: "MISSION YEAR", value: "2038" },
              { label: "PROGRAM", value: "ARES-1" },
            ].map((item) => (
              <div
                key={item.label}
                className="border border-[#49302b] bg-[#0c0706]/70 backdrop-blur-sm p-4"
              >
                <p className="font-mono-hud text-[10px] tracking-widest text-[#9b8580]">
                  {item.label}
                </p>
                <p className="font-mono-hud text-sm font-bold text-[#e5a18b] mt-2">
                  {item.value}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="px-6 sm:px-12 py-4 border-t border-red-950/60 flex flex-col sm:flex-row justify-between gap-2 text-[10px] font-mono-hud text-[#806b65]">
          <span>ARES-1 // MARS EXPLORATION PROGRAM</span>
          <span>MISSION CONTROL // CONNECTION STANDBY</span>
        </footer>
      </div>
    </main>
  );
}
