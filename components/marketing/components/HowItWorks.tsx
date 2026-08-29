import { Landmark, Flag, BellRing, ArrowRight, ShieldCheck } from 'lucide-react';

interface HowItWorksProps {
  onOpenBankConnect: () => void;
  onOpenWaitlist: () => void;
}

export default function HowItWorks({ onOpenBankConnect, onOpenWaitlist }: HowItWorksProps) {
  return (
    <section 
      id="how-it-works"
      className="bg-[#ffffff] py-20 md:py-28 px-4 sm:px-6 border-b border-[#e5e5e5]"
    >
      <div className="max-w-[1140px] mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-neutral-500 bg-neutral-100 px-3 py-1 rounded-full">
            Simple 3-Step Process
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#000000]">
            How Knodle works for you
          </h2>
          <p className="text-base text-neutral-600">
            Zero tedious spreadsheet maintenance. Just connect, set your focus, and receive timely nudges.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {/* Step 1 */}
          <div className="flex flex-col items-center text-center p-6 sm:p-8 border border-[#e5e5e5] rounded-3xl bg-[#ffffff] shadow-sm hover:shadow-md hover:border-black/30 transition-all relative overflow-hidden group">
            {/* Top Icon Circle */}
            <div className="w-16 h-16 rounded-2xl bg-[#f8f9fb] flex items-center justify-center mb-6 border border-[#e5e5e5] group-hover:scale-110 group-hover:bg-black group-hover:text-[#c1ff72] transition-all">
              <Landmark className="w-8 h-8 text-[#000000] group-hover:text-[#c1ff72] transition-colors" />
            </div>

            {/* Giant Numeral Watermark */}
            <div className="font-bold text-[72px] sm:text-[84px] text-[#f0f1f3] leading-none mb-1 select-none pointer-events-none -mt-4">
              1
            </div>

            <h3 className="text-xl font-bold text-[#000000] mb-2.5">
              Connect your bank
            </h3>
            <p className="text-sm text-[#000000]/65 leading-relaxed mb-6">
              Securely link your accounts in seconds. We handle the heavy lifting of categorizing your transactions.
            </p>

            <button
              onClick={onOpenBankConnect}
              className="mt-auto text-xs font-bold text-neutral-800 hover:text-black inline-flex items-center gap-1.5 bg-neutral-100 hover:bg-neutral-200 px-3 py-1.5 rounded-lg transition-all cursor-pointer"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>See Supported Banks</span>
            </button>
          </div>

          {/* Step 2 */}
          <div className="flex flex-col items-center text-center p-6 sm:p-8 border border-[#e5e5e5] rounded-3xl bg-[#ffffff] shadow-sm hover:shadow-md hover:border-black/30 transition-all relative overflow-hidden group">
            {/* Top Icon Circle */}
            <div className="w-16 h-16 rounded-2xl bg-[#f8f9fb] flex items-center justify-center mb-6 border border-[#e5e5e5] group-hover:scale-110 group-hover:bg-black group-hover:text-[#c1ff72] transition-all">
              <Flag className="w-8 h-8 text-[#000000] group-hover:text-[#c1ff72] transition-colors" />
            </div>

            {/* Giant Numeral Watermark */}
            <div className="font-bold text-[72px] sm:text-[84px] text-[#f0f1f3] leading-none mb-1 select-none pointer-events-none -mt-4">
              2
            </div>

            <h3 className="text-xl font-bold text-[#000000] mb-2.5">
              Set one goal
            </h3>
            <p className="text-sm text-[#000000]/65 leading-relaxed mb-6">
              Focus is power. Pick a single savings target, and let Knodle optimize your daily habits to reach it.
            </p>

            <div className="mt-auto inline-flex items-center gap-1.5 text-xs font-semibold bg-neutral-50 border border-neutral-200 px-3 py-1.5 rounded-lg text-neutral-700">
              <span>e.g., Euro Summer, House, Debt Free</span>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex flex-col items-center text-center p-6 sm:p-8 border-2 border-[#c1ff72] rounded-3xl bg-[#ffffff] shadow-md hover:shadow-xl transition-all relative overflow-hidden group">
            {/* Top Icon Circle */}
            <div className="w-16 h-16 rounded-2xl bg-[#c1ff72]/20 flex items-center justify-center mb-6 border border-[#c1ff72]/50 group-hover:scale-110 group-hover:bg-black group-hover:text-[#c1ff72] transition-all">
              <BellRing className="w-8 h-8 text-[#000000] group-hover:text-[#c1ff72] transition-colors" />
            </div>

            {/* Giant Numeral Watermark */}
            <div className="font-bold text-[72px] sm:text-[84px] text-[#e3f7c4] leading-none mb-1 select-none pointer-events-none -mt-4">
              3
            </div>

            <h3 className="text-xl font-bold text-[#000000] mb-2.5">
              Get Knodled when you drift
            </h3>
            <p className="text-sm text-[#000000]/65 leading-relaxed mb-6">
              Real-time coaching alerts intervene before you overspend. Small course corrections for big results.
            </p>

            <button
              onClick={onOpenWaitlist}
              className="mt-auto text-xs font-bold text-black bg-[#c1ff72] hover:bg-[#b0f55c] px-3.5 py-1.5 rounded-lg transition-all inline-flex items-center gap-1 cursor-pointer"
            >
              <span>Try it live</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
