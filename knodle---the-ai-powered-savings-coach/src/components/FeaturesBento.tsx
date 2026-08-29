import { useState } from 'react';
import { Layers, Zap, TrendingDown, Check, ArrowRight } from 'lucide-react';

interface FeaturesBentoProps {
  onOpenWaitlist: () => void;
}

export default function FeaturesBento({ onOpenWaitlist }: FeaturesBentoProps) {
  const [activeDemo, setActiveDemo] = useState<number | null>(null);
  const [cancelledSub, setCancelledSub] = useState<boolean>(false);

  return (
    <section className="bg-[#ffffff] py-20 md:py-28 px-4 sm:px-6 border-b border-[#e5e5e5]">
      <div className="max-w-[1140px] mx-auto text-center mb-16">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#000000]">
          Everything you need to save.
        </h2>
        <p className="text-base sm:text-lg text-[#000000]/60 mt-3 max-w-lg mx-auto">
          Purpose-built financial intelligence designed to cut waste and accelerate your biggest goals.
        </p>
      </div>

      <div className="max-w-[1140px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
        {/* Card 1: AI Categorization */}
        <div 
          onMouseEnter={() => setActiveDemo(1)}
          className="bg-[#f8f9fb] p-6 sm:p-8 rounded-[32px] border border-[#e5e5e5] hover:border-black/30 hover:shadow-lg transition-all flex flex-col justify-between space-y-6 group"
        >
          <div>
            <div className="w-12 h-12 rounded-2xl bg-white border border-neutral-200 flex items-center justify-center mb-5 group-hover:bg-black group-hover:text-[#c1ff72] transition-colors shadow-sm">
              <Layers className="w-6 h-6 text-black group-hover:text-[#c1ff72]" />
            </div>
            <h4 className="text-xl font-bold text-black mb-2">AI Categorization</h4>
            <p className="text-sm text-[#000000]/65 leading-relaxed">
              No more manual tagging. Our AI understands merchant metadata and categorizes transactions instantly with 99.4% precision.
            </p>
          </div>

          {/* Interactive Micro-Widget */}
          <div className="bg-white rounded-2xl p-3.5 border border-neutral-200 space-y-2 text-xs shadow-xs">
            <div className="flex items-center justify-between text-neutral-500 font-semibold">
              <span>Live Merchant Parsing</span>
              <span className="text-emerald-600 font-bold">Auto-detected</span>
            </div>
            <div className="flex items-center justify-between bg-neutral-50 p-2 rounded-xl">
              <div>
                <p className="font-bold text-black text-xs">SQ *BAKERY SURRY HILLS</p>
                <p className="text-[10px] text-neutral-400">Card ending in 4102</p>
              </div>
              <span className="bg-[#c1ff72] text-black font-bold text-[10px] px-2 py-0.5 rounded-full">
                Dining & Coffee ($7.50)
              </span>
            </div>
          </div>
        </div>

        {/* Card 2: Fast Syncing */}
        <div 
          onMouseEnter={() => setActiveDemo(2)}
          className="bg-[#f8f9fb] p-6 sm:p-8 rounded-[32px] border border-[#e5e5e5] hover:border-black/30 hover:shadow-lg transition-all flex flex-col justify-between space-y-6 group"
        >
          <div>
            <div className="w-12 h-12 rounded-2xl bg-white border border-neutral-200 flex items-center justify-center mb-5 group-hover:bg-black group-hover:text-[#c1ff72] transition-colors shadow-sm">
              <Zap className="w-6 h-6 text-black group-hover:text-[#c1ff72]" />
            </div>
            <h4 className="text-xl font-bold text-black mb-2">Fast Syncing</h4>
            <p className="text-sm text-[#000000]/65 leading-relaxed">
              Connects to 10,000+ banks globally via ultra-secure, government-regulated Open Banking protocols.
            </p>
          </div>

          {/* Interactive Micro-Widget */}
          <div className="bg-white rounded-2xl p-3.5 border border-neutral-200 space-y-2 text-xs shadow-xs">
            <div className="flex items-center justify-between text-neutral-500 font-semibold">
              <span>Global Bank Coverage</span>
              <span className="text-black font-bold">10,000+ Inst.</span>
            </div>
            <div className="flex items-center justify-around py-1.5 border-t border-neutral-100 font-bold text-[11px] text-neutral-700">
              <span className="bg-neutral-100 px-2 py-1 rounded">CBA</span>
              <span className="bg-neutral-100 px-2 py-1 rounded">ANZ</span>
              <span className="bg-neutral-100 px-2 py-1 rounded">NAB</span>
              <span className="bg-neutral-100 px-2 py-1 rounded">Chase</span>
              <span className="bg-neutral-100 px-2 py-1 rounded">+9,996</span>
            </div>
          </div>
        </div>

        {/* Card 3: Subscription Tracking */}
        <div 
          onMouseEnter={() => setActiveDemo(3)}
          className="bg-[#f8f9fb] p-6 sm:p-8 rounded-[32px] border border-[#e5e5e5] hover:border-black/30 hover:shadow-lg transition-all flex flex-col justify-between space-y-6 group"
        >
          <div>
            <div className="w-12 h-12 rounded-2xl bg-white border border-neutral-200 flex items-center justify-center mb-5 group-hover:bg-black group-hover:text-[#c1ff72] transition-colors shadow-sm">
              <TrendingDown className="w-6 h-6 text-black group-hover:text-[#c1ff72]" />
            </div>
            <h4 className="text-xl font-bold text-black mb-2">Subscription Tracking</h4>
            <p className="text-sm text-[#000000]/65 leading-relaxed">
              Find and eliminate forgotten recurring payments, duplicate subscriptions, and quiet price hikes.
            </p>
          </div>

          {/* Interactive Micro-Widget */}
          <div className="bg-white rounded-2xl p-3.5 border border-neutral-200 space-y-2 text-xs shadow-xs">
            <div className="flex items-center justify-between text-neutral-500 font-semibold">
              <span>Detected Subscriptions</span>
              <span className="text-amber-700 font-bold">1 Inactive</span>
            </div>
            <div className="flex items-center justify-between bg-neutral-50 p-2 rounded-xl">
              <div>
                <p className="font-bold text-black text-xs">Climbing Gym App</p>
                <p className="text-[10px] text-amber-700 font-medium">0 uses in 45 days ($39/mo)</p>
              </div>
              {cancelledSub ? (
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-1 rounded-md flex items-center gap-1">
                  <Check className="w-3 h-3" /> Saved!
                </span>
              ) : (
                <button
                  onClick={() => setCancelledSub(true)}
                  className="bg-black hover:bg-neutral-800 text-white font-bold text-[10px] px-2.5 py-1 rounded-md transition-all cursor-pointer"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
