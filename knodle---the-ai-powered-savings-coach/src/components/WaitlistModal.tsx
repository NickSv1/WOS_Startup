import { useState, type FormEvent } from 'react';
import confetti from 'canvas-confetti';
import { X, Check, ArrowRight, ShieldCheck, Copy, Award } from 'lucide-react';
import KnodleLogo from './KnodleLogo';

interface WaitlistModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function WaitlistModal({ isOpen, onClose }: WaitlistModalProps) {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);
  const [position, setPosition] = useState(247);

  if (!isOpen) return null;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;

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
  };

  const handleCopy = () => {
    const userPrefix = email.split('@')[0] || 'saver';
    navigator.clipboard.writeText(`knodle.ai/ref/${userPrefix}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div 
        className="bg-[#111111] text-white border border-[#333333] w-full max-w-lg rounded-3xl p-6 sm:p-8 relative shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
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
                Join the Knodle Private Beta
              </h3>
              <p className="text-sm text-neutral-400 mt-1">
                Get early access to the AI coach that transforms your savings.
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

              <button
                type="submit"
                className="w-full bg-[#c1ff72] text-black font-bold py-3.5 rounded-xl hover:bg-[#b0f55c] active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md text-base"
              >
                <span>Get Early Invite</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <div className="mt-5 pt-4 border-t border-neutral-800 flex items-center justify-between text-[11px] text-neutral-500">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#c1ff72]" /> 256-bit SSL Security
              </span>
              <span>Invites sent every Friday</span>
            </div>
          </div>
        ) : (
          <div className="text-center py-4 space-y-5">
            <div className="w-12 h-12 rounded-full bg-[#c1ff72]/20 border border-[#c1ff72] text-[#c1ff72] flex items-center justify-center mx-auto">
              <Award className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-2xl font-bold text-[#c1ff72]">
                You&apos;re in! Position #{position}
              </h3>
              <p className="text-sm text-neutral-300 mt-1">
                We sent a verification link to <strong className="text-white">{email}</strong>.
              </p>
            </div>

            <div className="bg-black p-4 rounded-2xl border border-neutral-800 text-left space-y-2">
              <span className="text-xs font-bold text-neutral-400">Your Line-Skip Link:</span>
              <div className="flex gap-2">
                <input
                  type="text"
                  readOnly
                  value={`knodle.ai/ref/${email.split('@')[0] || 'saver'}`}
                  className="flex-1 bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-xs text-white"
                />
                <button
                  onClick={handleCopy}
                  className="bg-[#333333] hover:bg-neutral-700 text-white text-xs font-bold px-3 py-2 rounded-lg flex items-center gap-1 cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-[#c1ff72]" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>

            <button
              onClick={onClose}
              className="bg-neutral-800 hover:bg-neutral-700 text-white text-sm font-semibold px-6 py-2.5 rounded-xl transition-all cursor-pointer"
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
