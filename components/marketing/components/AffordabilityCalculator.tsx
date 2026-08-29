import { useState, useId, type FormEvent } from 'react';
import { affordabilityPresets } from '../data/landingData';
import { Target, ArrowRight, Clock, AlertTriangle, ShieldCheck, DollarSign, Percent, TrendingUp } from 'lucide-react';

interface AffordabilityCalculatorProps {
  onOpenWaitlist: () => void;
}

export default function AffordabilityCalculator({ onOpenWaitlist }: AffordabilityCalculatorProps) {
  const [amount, setAmount] = useState<number>(120);
  const [item, setItem] = useState<string>('New sneakers');
  const [hasCalculated, setHasCalculated] = useState<boolean>(true);
  const amountInputId = useId();
  const itemInputId = useId();

  // Dynamic calculations based on target goal ($5,000 Euro Summer, $120/wk planned savings)
  const weeklySavingRate = 120;
  const delayWeeks = Math.max(1, Math.round(amount / weeklySavingRate));
  const suggestedWaitWeeks = Math.max(1, Math.min(3, Math.ceil(amount / (weeklySavingRate * 0.75))));
  
  // Progress calculations
  const baseProgress = 65; // Euro summer current progress %
  const impactPenalty = Math.min(25, Math.round((amount / 5000) * 100));
  const nowProgress = Math.max(30, baseProgress - impactPenalty);
  const waitProgress = Math.min(95, baseProgress + 15);

  const handlePreset = (presetAmount: number, presetItem: string) => {
    setAmount(presetAmount);
    setItem(presetItem);
    setHasCalculated(true);
  };

  const handleCalculate = (e: FormEvent) => {
    e.preventDefault();
    setHasCalculated(true);
  };

  return (
    <section 
      id="afford-section" 
      className="bg-[#ffffff] py-14 sm:py-20 md:py-24 px-4 sm:px-6 border-t border-[#e5e5e5]"
    >
      <div className="max-w-[860px] mx-auto space-y-8">
        <div className="bg-[#ffffff] border border-[#e5e5e5] rounded-[24px] sm:rounded-[32px] p-5 sm:p-10 shadow-xl shadow-black/5 relative overflow-hidden">
          {/* Header */}
          <div className="text-center mb-7 sm:mb-8">
            <div className="inline-flex items-center gap-1.5 bg-[#c1ff72]/30 text-neutral-900 text-xs font-bold px-3 py-1 rounded-full mb-3">
              <Target className="w-3.5 h-3.5" />
              <span>Real-Time Decision Engine</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-bold text-[#000000] tracking-tight">
              Can I afford it?
            </h2>
            <p className="text-sm sm:text-base text-[#000000]/60 mt-1.5 sm:mt-2">
              Ask Knodle before you buy. See the true impact on your goals in seconds.
            </p>
          </div>

          {/* Quick Preset Chips */}
          <div className="mb-6">
            <p className="text-xs font-semibold text-neutral-500 mb-2 text-center">Try popular scenarios:</p>
            <div className="flex flex-wrap items-center justify-center gap-2">
              {affordabilityPresets.map((preset) => (
                <button
                  key={preset.item}
                  onClick={() => handlePreset(preset.amount, preset.item)}
                  className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-all cursor-pointer ${
                    amount === preset.amount && item === preset.item
                      ? 'bg-black text-[#c1ff72] border-black font-semibold shadow-sm'
                      : 'bg-neutral-50 text-neutral-700 border-neutral-200 hover:bg-neutral-100'
                  }`}
                >
                  {preset.item} (${preset.amount})
                </button>
              ))}
            </div>
          </div>

          {/* Form Inputs */}
          <form onSubmit={handleCalculate} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label 
                  htmlFor={itemInputId}
                  className="block text-xs font-bold text-neutral-700 mb-1.5 uppercase tracking-wider"
                >
                  What do you want to buy?
                </label>
                <input
                  id={itemInputId}
                  type="text"
                  value={item}
                  onChange={(e) => setItem(e.target.value)}
                  placeholder="e.g. Flight to Bali"
                  className="w-full bg-[#f8f9fb] border border-[#e5e5e5] rounded-xl px-4 py-3 text-sm font-medium text-black focus:outline-none focus:ring-2 focus:ring-black focus:bg-white transition-all"
                  required
                />
              </div>

              <div>
                <label 
                  htmlFor={amountInputId}
                  className="block text-xs font-bold text-neutral-700 mb-1.5 uppercase tracking-wider"
                >
                  Price in AUD ($)
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-neutral-500 text-sm">
                    $
                  </span>
                  <input
                    id={amountInputId}
                    type="number"
                    min="1"
                    step="1"
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="w-full bg-[#f8f9fb] border border-[#e5e5e5] rounded-xl pl-8 pr-4 py-3 text-sm font-medium text-black focus:outline-none focus:ring-2 focus:ring-black focus:bg-white transition-all"
                    required
                  />
                </div>
              </div>
            </div>

            <button
              id="calc-submit-btn"
              type="submit"
              className="w-full bg-black text-[#c1ff72] font-bold text-sm py-3.5 rounded-xl hover:bg-neutral-900 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-black/5"
            >
              <span>Calculate Goal Impact</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Results Comparison Grid */}
          {hasCalculated && (
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Option A: Buy Now */}
              <div className="p-4 sm:p-6 rounded-2xl border border-amber-200 bg-amber-50/70 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-bold text-sm text-amber-950 flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4 text-amber-600" />
                      If you buy it today
                    </span>
                    <span className="text-[11px] font-bold text-amber-800 bg-amber-200/80 px-2 py-0.5 rounded">
                      +{delayWeeks} {delayWeeks === 1 ? 'week' : 'weeks'} delay
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-amber-900 leading-relaxed">
                    Pushes your <strong className="font-semibold text-black">Euro Summer</strong> target date back by approximately {delayWeeks} {delayWeeks === 1 ? 'week' : 'weeks'}.
                  </p>
                </div>

                <div>
                  <div className="flex justify-between text-xs text-amber-900/70 font-semibold mb-1.5">
                    <span>Goal Velocity</span>
                    <span>{nowProgress}% Pace</span>
                  </div>
                  <div className="h-2.5 w-full bg-amber-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-amber-500 transition-all duration-500 rounded-full"
                      style={{ width: `${nowProgress}%` }}
                    />
                  </div>
                  <p className="text-[11px] text-amber-800 mt-2">
                    Takes ${amount} out of this month&apos;s buffer allocation.
                  </p>
                </div>
              </div>

              {/* Option B: Knodle Pick (Wait 2 Weeks) */}
              <div className="p-4 sm:p-6 rounded-2xl border-2 border-[#c1ff72] bg-[#c1ff72]/15 relative flex flex-col justify-between space-y-4 shadow-sm">
                <div className="absolute -top-3.5 right-4 bg-[#000000] text-[#c1ff72] text-[11px] font-bold tracking-wide px-3 py-1 rounded-full shadow-sm flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Knodle Pick</span>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-bold text-sm text-[#000000] flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-emerald-700" />
                      If you wait {suggestedWaitWeeks} {suggestedWaitWeeks === 1 ? 'week' : 'weeks'}
                    </span>
                    <span className="text-xs font-bold bg-[#c1ff72] text-black px-2 py-0.5 rounded">
                      On Track
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-[#000000] font-medium leading-relaxed">
                    You stay <strong className="font-bold">perfectly on track</strong> for Euro Summer while banking automated surplus.
                  </p>
                </div>

                <div>
                  <div className="flex justify-between text-xs text-neutral-800 font-semibold mb-1.5">
                    <span>Goal Velocity</span>
                    <span className="font-bold text-emerald-800">{waitProgress}% (Optimal)</span>
                  </div>
                  <div className="h-2.5 w-full bg-neutral-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-[#000000] transition-all duration-500 rounded-full"
                      style={{ width: `${waitProgress}%` }}
                    />
                  </div>
                  <p className="text-[11px] text-neutral-700 mt-2 font-medium">
                    💡 Tip: Skip dining out twice this weekend to afford &apos;{item}&apos; next Friday without guilt.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Micro Action CTA */}
          <div className="mt-8 text-center pt-4 border-t border-neutral-100">
            <button
              onClick={onOpenWaitlist}
              className="text-xs sm:text-sm font-semibold text-neutral-800 hover:text-black inline-flex items-center gap-1.5 underline decoration-[#c1ff72] decoration-2 underline-offset-4 cursor-pointer"
            >
              <span>Want Knodle to automate decisions like this for all your accounts?</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Business Model / Shared Savings Banner (Morfless Aligned Model) */}
        <div className="bg-[#f8f9fb] border border-[#e5e5e5] rounded-[24px] p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-[520px]">
              <div className="inline-flex items-center gap-1.5 bg-black text-[#c1ff72] text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                <Percent className="w-3 h-3" />
                <span>Shared Savings Model</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-black tracking-tight">
                A simple fixed fee + percentage of what you actually save.
              </h3>
              <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                Like high-performance financial coaches, our incentives are 100% aligned with your wallet. We charge a modest fixed platform fee plus a small percentage of your verified net savings. If Knodle doesn&apos;t save you money, you pay no success fee.
              </p>
            </div>

            <div className="w-full md:w-auto bg-white border border-neutral-200 rounded-2xl p-4 sm:p-5 shrink-0 space-y-3 min-w-[240px]">
              <div className="flex items-center justify-between text-xs font-semibold text-neutral-500 pb-2 border-b border-neutral-100">
                <span>Pricing Structure</span>
                <span className="text-emerald-600 font-bold">100% Aligned</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-extrabold text-black">$4</span>
                <span className="text-xs text-neutral-500 font-medium">/mo fixed</span>
                <span className="text-neutral-400 mx-1">+</span>
                <span className="text-base font-bold text-emerald-700">5%</span>
                <span className="text-xs text-neutral-500 font-medium">saved</span>
              </div>
              <p className="text-[11px] text-neutral-500 leading-tight">
                Save $1,000 → you keep $950+ in pure net profit.
              </p>
              <button
                onClick={onOpenWaitlist}
                className="w-full bg-black hover:bg-neutral-900 text-[#c1ff72] font-bold text-xs py-2 rounded-lg transition-all cursor-pointer text-center"
              >
                Try it live
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
