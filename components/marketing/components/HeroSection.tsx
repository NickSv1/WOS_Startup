import { useState, type FormEvent } from 'react';
import confetti from 'canvas-confetti';
import { TrendingUp, PiggyBank, CreditCard, Plane, ArrowRight, Activity, Check } from 'lucide-react';
import { KnodleIcon } from './KnodleLogo';
import { grantDemoAccess, goToDemo } from '@/lib/demoAccess';

export default function HeroSection() {
  const [activeNode, setActiveNode] = useState<string | null>('euro');
  const [email, setEmail] = useState('');
  const [joined, setJoined] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const handleJoin = async (e: FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;

    setBusy(true);
    setError('');
    try {
      await grantDemoAccess(email);
      setJoined(true);
      try {
        confetti({
          particleCount: 70,
          spread: 65,
          origin: { y: 0.35 },
          colors: ['#c1ff72', '#ffffff', '#b7f569', '#333333'],
        });
      } catch {
        // ignore
      }
      window.setTimeout(() => goToDemo(), 700);
    } catch {
      setError('Could not unlock the demo. Please try again.');
      setBusy(false);
    }
  };

  const nodeDetails: Record<string, { title: string; subtitle: string; status: string; advice: string }> = {
    super: {
      title: 'Superannuation',
      subtitle: '$48,250 · Balanced Growth',
      status: '+7.4% YTD (On Target)',
      advice: 'Employer contribution cleared yesterday. Retirement trajectory on track.',
    },
    savings: {
      title: 'High-Yield Savings',
      subtitle: '$12,400 · 5.10% p.a.',
      status: '+$420 interest earned this year',
      advice: 'Emergency buffer fully funded (3.5 months of living expenses).',
    },
    everyday: {
      title: 'Everyday Spending',
      subtitle: '$420 Safe-to-Spend this week',
      status: 'Spent $135 of $420',
      advice: '3 days remaining in cycle. Dining out budget has $85 buffer remaining.',
    },
    euro: {
      title: 'Euro Summer Goal 🏖️',
      subtitle: '$3,250 of $5,000 (65%)',
      status: 'Target: July 15 · 7 weeks left',
      advice: 'Knodle optimized your coffee and lunch micro-habits. You are 1 week ahead of plan!',
    },
    you: {
      title: 'Your Command Center',
      subtitle: 'Net Worth: $63,900',
      status: 'Coaching Score: 94/100',
      advice: 'All accounts unified via Open Banking. Knodle is monitoring cashflow in real time.',
    },
  };

  return (
    <section 
      id="hero-section"
      className="bg-gradient-to-b from-[#f8f9fb] via-[#ffffff] to-[#ffffff] text-[#000000] w-full pt-28 sm:pt-36 md:pt-44 pb-12 sm:pb-16 px-3 sm:px-6 relative overflow-hidden"
    >
      {/* Background ambient accents */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-b from-[#c1ff72]/20 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-[1140px] mx-auto text-center w-full relative z-10 space-y-5 sm:space-y-6 md:space-y-8">
        {/* Subtle pill tag */}
        <div className="inline-flex items-center gap-2 bg-neutral-100 border border-neutral-200 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full text-xs font-semibold text-neutral-800">
          <span className="w-2 h-2 rounded-full bg-[#c1ff72] animate-pulse" />
          <span>Private Beta Rolling Out Weekly</span>
        </div>

        {/* Main Display Headline */}
        <h1 className="text-3xl sm:text-5xl md:text-[64px] font-bold tracking-tight text-[#000000] leading-[1.12] sm:leading-[1.08] max-w-[920px] mx-auto px-2">
          Every finance app tracks you.{' '}
          <span className="block sm:inline text-black">
            Knodle <span className="underline decoration-[#c1ff72] decoration-4 underline-offset-4">coaches you.</span>
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-lg md:text-xl text-[#000000]/70 max-w-[620px] mx-auto leading-relaxed px-3">
          The AI-powered savings coach that keeps you on track without the boring spreadsheets.
        </p>

        {/* Email gate for the live demo */}
        <div className="pt-2 px-4 sm:px-0 max-w-[540px] mx-auto">
          {!joined ? (
            <form onSubmit={handleJoin} className="flex flex-col sm:flex-row items-stretch gap-2.5">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                autoComplete="email"
                aria-label="Email address"
                className="flex-1 min-w-0 bg-white border border-[#d4d4d4] rounded-xl px-4 py-3.5 sm:py-4 text-base text-black placeholder:text-neutral-500 shadow-sm focus:outline-none focus:border-black focus:ring-2 focus:ring-[#c1ff72] transition-all"
              />
              <button
                id="hero-try-live-btn"
                type="submit"
                disabled={busy}
                className="shrink-0 bg-[#000000] text-[#c1ff72] font-bold text-base px-6 py-3.5 sm:py-4 rounded-xl hover:bg-[#1a1a1a] active:scale-95 transition-all shadow-lg shadow-black/10 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
              >
                <span>{busy ? 'Unlocking…' : 'Try it live'}</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </form>
          ) : (
            <div className="flex items-center justify-center gap-2.5 bg-[#c1ff72]/25 border border-[#c1ff72] rounded-xl px-4 py-3.5 sm:py-4 text-sm font-semibold text-black">
              <Check className="w-5 h-5 shrink-0" />
              <span>You&apos;re in — opening the live demo…</span>
            </div>
          )}

          {error ? <p className="mt-2 text-sm text-red-600">{error}</p> : null}

          <div className="mt-3.5 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-sm">
            <span className="text-neutral-500 text-xs">Enter your email to unlock the interactive demo.</span>
            <a
              href="#afford-section"
              className="font-semibold text-neutral-700 hover:text-black transition-colors flex items-center gap-1"
            >
              <span>Try interactive calculator</span>
              <span>↓</span>
            </a>
          </div>
        </div>

        {/* Interactive Money Map Visual Node Graph */}
        <div className="mt-10 sm:mt-12 md:mt-16 relative w-full max-w-[820px] mx-auto min-h-[360px] sm:min-h-[420px] bg-white border border-[#e5e5e5] rounded-[24px] sm:rounded-[32px] p-4 sm:p-8 shadow-xl shadow-black/5 flex flex-col items-center justify-between">
          <div className="w-full flex items-center justify-between border-b border-neutral-100 pb-2.5 sm:pb-3 text-xs font-semibold text-neutral-500">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <Activity className="w-3.5 h-3.5 text-black" />
              <span className="text-[11px] sm:text-xs">Interactive Money Map (Tap any node)</span>
            </div>
            <span className="bg-[#c1ff72]/30 text-neutral-900 px-2 py-0.5 rounded-full font-bold text-[10px] sm:text-xs">Live Graph</span>
          </div>

          {/* Node Diagram Canvas Area */}
          <div className="relative w-full h-[250px] sm:h-[300px] flex items-center justify-center my-auto overflow-hidden">
            {/* SVG Connecting Lines */}
            <svg 
              className="absolute inset-0 w-full h-full pointer-events-none" 
              viewBox="0 0 800 300"
              preserveAspectRatio="none"
            >
              {/* You (400, 150) to Super (180, 60) */}
              <line x1="400" y1="150" x2="180" y2="60" stroke="#cfc4c5" strokeWidth="2" strokeDasharray="5,5" />
              {/* You (400, 150) to Savings (180, 240) */}
              <line x1="400" y1="150" x2="180" y2="240" stroke="#cfc4c5" strokeWidth="2" strokeDasharray="5,5" />
              {/* You (400, 150) to Everyday (620, 60) */}
              <line x1="400" y1="150" x2="620" y2="60" stroke="#cfc4c5" strokeWidth="2" strokeDasharray="5,5" />
              {/* You (400, 150) to Euro Summer (620, 240) - Glowing Highlight */}
              <line x1="400" y1="150" x2="620" y2="240" stroke="#c1ff72" strokeWidth="3.5" strokeDasharray="6,4" className="animate-pulse" />
            </svg>

            {/* Super Node (Top Left) */}
            <button
              onClick={() => setActiveNode('super')}
              className={`absolute top-1 left-0 sm:left-12 w-16 h-16 sm:w-24 sm:h-24 rounded-full bg-white border ${
                activeNode === 'super' ? 'border-black ring-3 sm:ring-4 ring-black/10 scale-105' : 'border-[#e5e5e5]'
              } flex flex-col items-center justify-center shadow-md hover:shadow-lg transition-all z-20 cursor-pointer group`}
            >
              <TrendingUp className="w-4 h-4 sm:w-6 sm:h-6 text-neutral-600 group-hover:text-black sm:mb-1" />
              <span className="text-[11px] sm:text-xs font-bold text-neutral-800">Super</span>
              <span className="text-[9px] sm:text-[10px] text-neutral-500 hidden sm:inline">$48.2k</span>
            </button>

            {/* Savings Node (Bottom Left) */}
            <button
              onClick={() => setActiveNode('savings')}
              className={`absolute bottom-1 left-0 sm:left-12 w-16 h-16 sm:w-24 sm:h-24 rounded-full bg-white border ${
                activeNode === 'savings' ? 'border-black ring-3 sm:ring-4 ring-black/10 scale-105' : 'border-[#e5e5e5]'
              } flex flex-col items-center justify-center shadow-md hover:shadow-lg transition-all z-20 cursor-pointer group`}
            >
              <PiggyBank className="w-4 h-4 sm:w-6 sm:h-6 text-neutral-600 group-hover:text-black sm:mb-1" />
              <span className="text-[11px] sm:text-xs font-bold text-neutral-800">Savings</span>
              <span className="text-[9px] sm:text-[10px] text-neutral-500 hidden sm:inline">$12.4k</span>
            </button>

            {/* Everyday Node (Top Right) */}
            <button
              onClick={() => setActiveNode('everyday')}
              className={`absolute top-1 right-0 sm:right-12 w-16 h-16 sm:w-24 sm:h-24 rounded-full bg-white border ${
                activeNode === 'everyday' ? 'border-black ring-3 sm:ring-4 ring-black/10 scale-105' : 'border-[#e5e5e5]'
              } flex flex-col items-center justify-center shadow-md hover:shadow-lg transition-all z-20 cursor-pointer group`}
            >
              <CreditCard className="w-4 h-4 sm:w-6 sm:h-6 text-neutral-600 group-hover:text-black sm:mb-1" />
              <span className="text-[11px] sm:text-xs font-bold text-neutral-800">Everyday</span>
              <span className="text-[9px] sm:text-[10px] text-neutral-500 hidden sm:inline">$420/wk</span>
            </button>

            {/* Euro Summer Goal Node (Bottom Right - High Energy Lime) */}
            <button
              onClick={() => setActiveNode('euro')}
              className={`absolute bottom-0 right-0 sm:right-10 w-24 h-24 sm:w-36 sm:h-36 rounded-full bg-[#c1ff72] text-[#000000] flex flex-col items-center justify-center shadow-xl ${
                activeNode === 'euro' ? 'ring-3 sm:ring-4 ring-[#c1ff72] ring-offset-2 scale-105' : ''
              } border-2 border-white z-20 cursor-pointer transition-all pulse-glow-effect`}
            >
              <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-black/10 flex items-center justify-center mb-0.5 sm:mb-1">
                <Plane className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-black" />
              </div>
              <span className="font-bold text-[10px] sm:text-sm text-center px-1 sm:px-2 leading-tight">Euro Summer</span>
              <span className="text-[8px] sm:text-xs font-semibold bg-black text-white px-1.5 py-0.5 rounded-full mt-0.5 sm:mt-1">
                65% saved
              </span>
            </button>

            {/* Central 'You' / Knodle Coach Core Node */}
            <button
              onClick={() => setActiveNode('you')}
              className={`w-18 h-18 sm:w-24 sm:h-24 rounded-full bg-black text-white flex flex-col items-center justify-center shadow-2xl z-30 border-3 sm:border-4 border-white ${
                activeNode === 'you' ? 'ring-3 sm:ring-4 ring-black/20 scale-105' : ''
              } cursor-pointer transition-transform hover:scale-105`}
            >
              <KnodleIcon className="w-5 h-5 sm:w-7 sm:h-7 mb-0.5" bgVariant="lime" />
              <span className="font-bold text-[10px] sm:text-xs text-white">You</span>
              <span className="text-[8px] sm:text-[9px] text-[#c1ff72] font-semibold">Active Coach</span>
            </button>
          </div>

          {/* Active Node Live Micro-Insight Banner */}
          {activeNode && (
            <div className="w-full bg-[#f8f9fb] border border-[#e5e5e5] rounded-xl sm:rounded-2xl p-3 sm:p-4 text-left transition-all mt-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-xs sm:text-sm text-black">{nodeDetails[activeNode].title}</span>
                  <span className="text-[10px] sm:text-xs bg-neutral-200 text-neutral-800 px-2 py-0.5 rounded-md font-medium">
                    {nodeDetails[activeNode].subtitle}
                  </span>
                </div>
                <p className="text-xs text-neutral-600 mt-1">{nodeDetails[activeNode].advice}</p>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] sm:text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg shrink-0">
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>{nodeDetails[activeNode].status}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
