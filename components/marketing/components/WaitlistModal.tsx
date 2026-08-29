import { useState, type FormEvent } from 'react';
import confetti from 'canvas-confetti';
import { X, ArrowRight, ShieldCheck } from 'lucide-react';
import KnodleLogo from './KnodleLogo';
import { grantDemoAccess, goToDemo } from '@/lib/demoAccess';

interface WaitlistModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function WaitlistModal({ isOpen, onClose }: WaitlistModalProps) {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;

    setBusy(true);
    setError('');
    try {
      await grantDemoAccess(email);
      setSubmitted(true);
      try {
        confetti({
          particleCount: 60,
          spread: 60,
          origin: { y: 0.5 },
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

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div
        className="bg-[#111111] text-white border border-[#333333] w-full max-w-lg rounded-3xl p-6 sm:p-8 relative shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-neutral-800 hover:bg-neutral-700 text-neutral-300 flex items-center justify-center transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {!submitted ? (
          <div>
            <div className="mb-5">
              <KnodleLogo variant="light" className="mb-3" />
              <h3 className="text-2xl font-bold tracking-tight text-white">
                Try Knodle live
              </h3>
              <p className="text-sm text-neutral-400 mt-1">
                Enter your email to unlock the interactive demo.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                required
                autoFocus
                autoComplete="email"
                className="w-full bg-[#000000] border border-[#333333] rounded-xl px-4 py-3.5 text-base text-white placeholder:text-neutral-500 focus:outline-none focus:border-[#c1ff72]"
              />

              {error ? <p className="text-sm text-red-400">{error}</p> : null}

              <button
                type="submit"
                disabled={busy}
                className="w-full bg-[#c1ff72] text-black font-bold py-3.5 rounded-xl hover:bg-[#b0f55c] active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md text-base disabled:opacity-70"
              >
                <span>{busy ? 'Unlocking…' : 'Open the demo'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <div className="mt-5 pt-4 border-t border-neutral-800 flex items-center justify-between text-[11px] text-neutral-500">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#c1ff72]" /> We only use this to grant demo access
              </span>
              <span>No spam</span>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 space-y-3">
            <h3 className="text-2xl font-bold text-[#c1ff72]">You&apos;re in</h3>
            <p className="text-sm text-neutral-300">Opening the live demo…</p>
          </div>
        )}
      </div>
    </div>
  );
}
