import { useState } from 'react';
import { TrendingUp, PiggyBank, Plane, HelpCircle, CheckCircle2, XCircle, ShieldCheck } from 'lucide-react';
import { KnodleIcon } from './KnodleLogo';

export default function BeforeAfterSection() {
  const [activeTab, setActiveTab] = useState<'both' | 'before' | 'after'>('both');

  return (
    <section className="bg-[#f8f9fb] py-20 md:py-28 px-4 sm:px-6 border-b border-[#e5e5e5]">
      <div className="max-w-[1140px] mx-auto text-center space-y-4 mb-16">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#000000] max-w-[800px] mx-auto leading-tight">
          Finance apps show you the past. <br className="hidden sm:inline" />
          We shape your future.
        </h2>
        <p className="text-base sm:text-lg text-[#000000]/65 max-w-[620px] mx-auto leading-relaxed">
          Stop looking at pie charts of money you&apos;ve already spent. Start making decisions that get you closer to your goals.
        </p>
      </div>

      <div className="max-w-[1140px] mx-auto">
        <h3 className="text-2xl sm:text-3xl font-bold text-center mb-10 text-[#000000] tracking-tight">
          Your whole financial life, finally in one place.
        </h3>

        {/* 2-Column Comparison Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Card 1: BEFORE */}
          <div className="bg-[#ffffff] border border-[#e5e5e5] rounded-[32px] p-6 sm:p-8 shadow-sm flex flex-col items-center justify-between min-h-[420px] relative overflow-hidden group">
            {/* Top Badge */}
            <div className="w-full flex items-center justify-between z-20">
              <span className="bg-red-100 text-red-700 font-bold px-3 py-1 rounded-full text-xs flex items-center gap-1">
                <XCircle className="w-3.5 h-3.5" />
                Before Knodle
              </span>
              <span className="text-xs text-neutral-400 font-medium">Reactive tracking</span>
            </div>

            {/* Messy Visual Graphic */}
            <div className="relative w-full max-w-[320px] h-[240px] my-6 flex items-center justify-center">
              {/* Messy Scattered Cards */}
              {/* Card 1 - Black */}
              <div className="absolute top-4 left-2 w-48 h-28 bg-[#1a1a1a] rounded-xl shadow-lg border border-[#333333] transform -rotate-12 flex flex-col justify-between p-3.5 transition-transform group-hover:-rotate-16">
                <div className="flex justify-between items-center text-[10px] text-white/50">
                  <span>Credit Card 1</span>
                  <span>••• 4012</span>
                </div>
                <div>
                  <div className="w-16 h-2 bg-white/20 rounded mb-1" />
                  <div className="w-24 h-1.5 bg-red-400/60 rounded" />
                </div>
              </div>

              {/* Card 2 - Blue */}
              <div className="absolute top-12 right-2 w-48 h-28 bg-blue-600 rounded-xl shadow-lg border border-blue-500 transform rotate-8 flex flex-col justify-between p-3.5 transition-transform group-hover:rotate-12">
                <div className="flex justify-between items-center text-[10px] text-white/70">
                  <span>Savings Acc</span>
                  <span>••• 8831</span>
                </div>
                <div>
                  <div className="w-20 h-2 bg-white/30 rounded mb-1" />
                  <div className="w-12 h-1.5 bg-white/20 rounded" />
                </div>
              </div>

              {/* Card 3 - Emerald */}
              <div className="absolute bottom-2 left-8 w-48 h-28 bg-emerald-700 rounded-xl shadow-lg border border-emerald-600 transform -rotate-3 flex flex-col justify-between p-3.5 transition-transform group-hover:-rotate-6">
                <div className="flex justify-between items-center text-[10px] text-white/70">
                  <span>Super / 401k</span>
                  <span>••• 1920</span>
                </div>
                <div>
                  <div className="w-14 h-2 bg-white/30 rounded" />
                </div>
              </div>

              {/* Confusing center overlay */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-16 h-16 rounded-full bg-white/80 backdrop-blur-sm shadow-md flex items-center justify-center border border-neutral-200">
                  <HelpCircle className="w-8 h-8 text-neutral-400" />
                </div>
              </div>
            </div>

            {/* Bottom summary note */}
            <div className="w-full bg-neutral-50 rounded-xl p-3 border border-neutral-200 text-center">
              <p className="text-xs text-neutral-600 font-medium">
                4 different banking apps, confusing pie charts, manual Excel spreadsheets.
              </p>
            </div>
          </div>

          {/* Card 2: WITH KNODLE (AFTER) */}
          <div className="bg-[#ffffff] border-2 border-[#c1ff72] rounded-[32px] p-6 sm:p-8 shadow-xl shadow-black/5 flex flex-col items-center justify-between min-h-[420px] relative overflow-hidden group">
            {/* Top Badge */}
            <div className="w-full flex items-center justify-between z-20">
              <span className="bg-[#c1ff72] text-[#000000] font-bold px-3 py-1 rounded-full text-xs flex items-center gap-1 shadow-sm">
                <CheckCircle2 className="w-3.5 h-3.5" />
                With Knodle
              </span>
              <span className="text-xs text-emerald-800 font-semibold bg-emerald-50 px-2 py-0.5 rounded">
                Proactive Coaching
              </span>
            </div>

            {/* Clean Node Map Mini Graphic */}
            <div className="relative w-full max-w-[320px] h-[240px] my-6 flex items-center justify-center">
              {/* Clean SVG lines */}
              <svg className="absolute inset-0 w-full h-full text-neutral-300 pointer-events-none" viewBox="0 0 300 240">
                <line x1="150" y1="120" x2="150" y2="40" stroke="#cfc4c5" strokeWidth="2" strokeDasharray="4,4" />
                <line x1="150" y1="120" x2="60" y2="190" stroke="#cfc4c5" strokeWidth="2" strokeDasharray="4,4" />
                <line x1="150" y1="120" x2="240" y2="190" stroke="#c1ff72" strokeWidth="3" strokeDasharray="5,3" />
              </svg>

              {/* Super Node */}
              <div className="absolute top-2 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-[#000000] text-[#ffffff] flex items-center justify-center shadow-md transition-transform group-hover:scale-110">
                <TrendingUp className="w-5 h-5 text-[#c1ff72]" />
              </div>

              {/* Savings Node */}
              <div className="absolute bottom-2 left-4 w-12 h-12 rounded-full bg-[#000000] text-[#ffffff] flex items-center justify-center shadow-md transition-transform group-hover:scale-110">
                <PiggyBank className="w-5 h-5 text-white" />
              </div>

              {/* Euro Summer Goal Node */}
              <div className="absolute bottom-1 right-2 w-16 h-16 rounded-full bg-[#c1ff72] text-[#000000] flex flex-col items-center justify-center animate-pulse shadow-lg transition-transform group-hover:scale-110">
                <Plane className="w-5 h-5 text-black mb-0.5" />
                <span className="text-[9px] font-bold">Goal</span>
              </div>

              {/* Central 'You' / Avatar Node */}
              <div className="absolute w-16 h-16 rounded-full bg-black border-2 border-white flex flex-col items-center justify-center z-10 shadow-lg">
                <KnodleIcon className="w-6 h-6 mb-0.5" bgVariant="lime" />
                <span className="text-[8px] bg-[#c1ff72] text-black px-1 rounded font-bold">Safe</span>
              </div>
            </div>

            {/* Bottom summary note */}
            <div className="w-full bg-[#c1ff72]/20 rounded-xl p-3 border border-[#c1ff72]/60 text-center">
              <p className="text-xs text-neutral-900 font-bold flex items-center justify-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-black" />
                One unified map. Real-time nudges before you overspend.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
