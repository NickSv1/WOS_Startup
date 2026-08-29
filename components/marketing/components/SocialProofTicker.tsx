import React from 'react';
import { SwyftxLogo, UQIESLogo, VenturesLogo } from './PartnerLogos';
import { Trophy, Rocket, ArrowRight, ShieldCheck, Zap } from 'lucide-react';

interface SocialProofTickerProps {
  onOpenWaitlist: () => void;
}

export default function SocialProofTicker({ onOpenWaitlist }: SocialProofTickerProps) {
  return (
    <section 
      id="partners-section"
      className="bg-[#090822] text-[#ffffff] py-14 sm:py-18 overflow-hidden relative border-y border-[#1e1b4b]"
    >
      {/* Subtle ambient indigo background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[250px] bg-indigo-600/10 blur-[100px] pointer-events-none" />

      <div className="max-w-[1140px] mx-auto px-4 sm:px-6 relative z-10">
        {/* Top Tag & Event Announcement */}
        <div className="text-center max-w-[760px] mx-auto mb-10 sm:mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 bg-[#171442] border border-[#2b2568] px-3.5 py-1.5 rounded-full text-xs font-semibold text-neutral-200">
            <Trophy className="w-3.5 h-3.5 text-[#c1ff72]" />
            <span>Weekend of Startups Showcase</span>
          </div>

          <h2 className="text-2xl sm:text-4xl md:text-[40px] font-bold tracking-tight text-white leading-tight">
            Built at Weekend of Startups
          </h2>

          <p className="text-sm sm:text-base text-neutral-300 max-w-[600px] mx-auto leading-relaxed">
            Knodle was built and validated during Weekend of Startups in official partnership with leading Australian tech ecosystems and founders.
          </p>
        </div>

        {/* Partner Logos Dark Navy Canvas */}
        <div className="bg-[#0f0c33] border border-[#25205c] rounded-2xl sm:rounded-3xl p-6 sm:p-10 shadow-2xl">
          <div className="text-center text-xs uppercase tracking-[0.2em] text-neutral-400 font-semibold mb-6 sm:mb-8">
            In Partnership With
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10 items-center justify-items-center">
            {/* Swyftx */}
            <div className="flex flex-col items-center justify-center p-4 rounded-xl hover:bg-white/5 transition-all w-full max-w-[240px]">
              <SwyftxLogo className="h-9 sm:h-10 text-white" />
              <span className="text-[11px] text-neutral-400 font-medium mt-2">
                Australia's Top Crypto Exchange
              </span>
            </div>

            {/* UQIES */}
            <div className="flex flex-col items-center justify-center p-4 rounded-xl hover:bg-white/5 transition-all w-full max-w-[240px]">
              <UQIESLogo className="h-12 sm:h-14" />
              <span className="text-[11px] text-neutral-400 font-medium mt-2">
                Premier Student Entrepreneurship
              </span>
            </div>

            {/* UQ Ventures */}
            <div className="flex flex-col items-center justify-center p-4 rounded-xl hover:bg-white/5 transition-all w-full max-w-[240px]">
              <VenturesLogo className="h-9 sm:h-10" />
              <span className="text-[11px] text-neutral-400 font-medium mt-2">
                University of Queensland Ventures
              </span>
            </div>
          </div>

          {/* Bottom Fast Stats / Trust Strip */}
          <div className="mt-8 pt-6 border-t border-[#25205c] flex flex-wrap items-center justify-between gap-4 text-xs text-neutral-300">
            <div className="flex items-center gap-2">
              <Rocket className="w-4 h-4 text-[#c1ff72]" />
              <span>54-hour rapid prototype to private beta</span>
            </div>

            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#c1ff72]" />
              <span>Performance-aligned shared savings model</span>
            </div>

            <button
              onClick={onOpenWaitlist}
              className="inline-flex items-center gap-1.5 font-bold text-[#c1ff72] hover:text-white transition-colors cursor-pointer ml-auto sm:ml-0"
            >
              <span>Try it live</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
