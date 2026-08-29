import { useState, type FormEvent } from 'react';
import confetti from 'canvas-confetti';
import { ArrowRight, Check } from 'lucide-react';
import { grantDemoAccess, goToDemo } from '@/lib/demoAccess';
import { ProductDemo } from '@/components/demo/ProductDemo';

export default function HeroSection() {
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
      window.setTimeout(() => goToDemo(), 2400);
    } catch {
      setError('Could not join the waitlist. Please try again.');
      setBusy(false);
    }
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
            <form name="contact" method="POST" data-netlify="true" onSubmit={handleJoin} className="flex flex-col sm:flex-row items-stretch gap-2.5">
              <input type="hidden" name="form-name" value="contact" />
              <label className="sr-only" htmlFor="hero-email">Email</label>
              <input
                id="hero-email"
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@email.com"
                required
                autoComplete="email"
                className="flex-1 min-w-0 bg-white border border-[#d4d4d4] rounded-xl px-4 py-3.5 sm:py-4 text-base text-black placeholder:text-neutral-500 shadow-sm focus:outline-none focus:border-black focus:ring-2 focus:ring-[#c1ff72] transition-all"
              />
              <button
                id="hero-try-live-btn"
                type="submit"
                disabled={busy}
                className="shrink-0 bg-[#000000] text-[#c1ff72] font-bold text-base px-6 py-3.5 sm:py-4 rounded-xl hover:bg-[#1a1a1a] active:scale-95 transition-all shadow-lg shadow-black/10 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
              >
                <span>{busy ? 'Joining…' : 'Join the waitlist'}</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </form>
          ) : (
            <div className="flex flex-col items-center justify-center gap-1.5 bg-[#c1ff72]/25 border border-[#c1ff72] rounded-xl px-4 py-4 sm:py-5 text-black">
              <div className="flex items-center gap-2 text-base font-bold">
                <Check className="w-5 h-5 shrink-0" />
                <span>You&apos;re on the waitlist</span>
              </div>
              <p className="text-sm font-medium text-neutral-700">
                We&apos;ve got {email}. Opening the live demo…
              </p>
            </div>
          )}

          {error ? <p className="mt-2 text-sm text-red-600">{error}</p> : null}

          <div className="mt-3.5 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-sm">
            <span className="text-neutral-500 text-xs">Email only — you&apos;ll join the waitlist and jump straight into the demo.</span>
            <a
              href="#afford-section"
              className="font-semibold text-neutral-700 hover:text-black transition-colors flex items-center gap-1"
            >
              <span>Try interactive calculator</span>
              <span>↓</span>
            </a>
          </div>
        </div>

        {/* Self-running product tour */}
        <div className="mt-10 sm:mt-12 md:mt-16 w-full">
          <ProductDemo />
        </div>
      </div>
    </section>
  );
}
