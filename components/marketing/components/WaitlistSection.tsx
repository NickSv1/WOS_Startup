import { useState, type FormEvent } from 'react';
import confetti from 'canvas-confetti';
import { Check, ArrowRight, ShieldCheck } from 'lucide-react';
import { grantDemoAccess, goToDemo } from '@/lib/demoAccess';

export default function WaitlistSection() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleJoin = async (e: FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;

    setIsSubmitting(true);
    setError('');
    try {
      await grantDemoAccess(email);
      setSubmitted(true);
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#c1ff72', '#ffffff', '#b7f569', '#333333'],
        });
      } catch {
        // ignore
      }
      window.setTimeout(() => goToDemo(), 700);
    } catch {
      setError('Could not unlock the demo. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <section 
      id="waitlist-section"
      className="bg-[#000000] py-20 md:py-28 px-4 sm:px-6 relative overflow-hidden"
    >
      <div className="max-w-[820px] mx-auto text-center space-y-6 relative z-10">
        <div className="inline-flex items-center gap-2 bg-neutral-900 border border-neutral-800 px-3.5 py-1 rounded-full text-xs font-bold text-[#c1ff72]">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Live demo access</span>
        </div>

        <h2 className="text-3xl sm:text-5xl md:text-6xl font-bold text-[#ffffff] tracking-tight leading-tight">
          Ready to stop tracking <br className="hidden sm:inline" />
          and start acting?
        </h2>

        <p className="text-base sm:text-lg text-neutral-400 max-w-lg mx-auto">
          Modest fixed platform fee + a small percentage of your verified net savings.
        </p>

        {/* Waitlist Box */}
        <div className="bg-[#111111] border border-neutral-800 rounded-3xl p-6 sm:p-10 shadow-2xl mt-6">
          {!submitted ? (
            <form onSubmit={handleJoin} className="space-y-4 max-w-md mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                autoComplete="email"
                className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-4 py-4 text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-[#c1ff72] text-base"
              />

              {error ? <p className="text-sm text-red-400">{error}</p> : null}

              <button
                id="waitlist-submit-btn"
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#c1ff72] text-black font-bold text-base py-4 rounded-xl hover:bg-[#aff05a] active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-[#c1ff72]/10"
              >
                <span>{isSubmitting ? 'Unlocking the demo…' : 'Try it live'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center gap-2 text-xs text-neutral-400">
                <ShieldCheck className="w-4 h-4 text-[#c1ff72]" />
                <span>Enter your email to open the interactive demo.</span>
              </div>
            </form>
          ) : (
            <div className="space-y-4 max-w-md mx-auto">
              <div className="w-14 h-14 rounded-full bg-[#c1ff72] text-black flex items-center justify-center mx-auto">
                <Check className="w-8 h-8 stroke-[3]" />
              </div>
              <h3 className="text-2xl font-bold text-white">You&apos;re in</h3>
              <p className="text-sm text-neutral-400">Opening the live demo…</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
