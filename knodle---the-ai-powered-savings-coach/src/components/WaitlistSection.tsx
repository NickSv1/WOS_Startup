import { useState, type FormEvent } from 'react';
import confetti from 'canvas-confetti';
import { CheckCircle2, Check, Copy, Share2, Users, ArrowRight, Award, ShieldCheck } from 'lucide-react';
import { WaitlistSubmission } from '../types';

export default function WaitlistSection() {
  const [email, setEmail] = useState('');
  const [submission, setSubmission] = useState<WaitlistSubmission | null>(null);
  const [copied, setCopied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#c1ff72', '#ffffff', '#b7f569', '#333333'],
      });
    } catch {
      // ignore in iframe environments if restricted
    }
  };

  const handleJoin = (e: FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;

    setIsSubmitting(true);
    setTimeout(() => {
      const username = email.split('@')[0].replace(/[^a-zA-Z0-9]/g, '').toLowerCase() || 'saver';
      const newSubmission: WaitlistSubmission = {
        email,
        position: 247,
        refCode: `knodle.ai/ref/${username}`,
        invitesCount: 0,
        targetInvites: 3,
      };
      setSubmission(newSubmission);
      setIsSubmitting(false);
      triggerConfetti();
    }, 400);
  };

  const handleCopyLink = () => {
    if (!submission) return;
    navigator.clipboard.writeText(submission.refCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSimulateInvite = () => {
    if (!submission) return;
    if (submission.invitesCount < submission.targetInvites) {
      const nextInvites = submission.invitesCount + 1;
      const nextPos = Math.max(12, submission.position - 78);
      setSubmission({
        ...submission,
        invitesCount: nextInvites,
        position: nextPos,
      });
      triggerConfetti();
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
          <span>Priority Beta Access</span>
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
          {!submission ? (
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

              <button
                id="waitlist-submit-btn"
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#c1ff72] text-black font-bold text-base py-4 rounded-xl hover:bg-[#aff05a] active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-[#c1ff72]/10"
              >
                <span>{isSubmitting ? 'Securing your spot...' : 'Get early beta access'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center gap-2 text-xs text-neutral-400">
                <ShieldCheck className="w-4 h-4 text-[#c1ff72]" />
                <span>Zero spam. Built at Weekend of Startups.</span>
              </div>
            </form>
          ) : (
            <div className="space-y-6 max-w-md mx-auto animate-in fade-in zoom-in-95 duration-300">
              <div className="w-14 h-14 rounded-full bg-[#c1ff72] text-black flex items-center justify-center mx-auto">
                <Check className="w-8 h-8 stroke-[3]" />
              </div>

              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-[#c1ff72]">
                  Spot Reserved
                </span>
                <h3 className="text-2xl font-bold text-white mt-1">
                  You are #{submission.position} in line!
                </h3>
                <p className="text-xs text-neutral-400 mt-1">
                  Invites go out every Friday.
                </p>
              </div>

              {/* Referral Boost card */}
              <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 text-left space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-neutral-300 flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-[#c1ff72]" />
                    Skip the line
                  </span>
                  <span className="text-[#c1ff72] font-bold">
                    {submission.invitesCount}/{submission.targetInvites} referrals
                  </span>
                </div>

                <div className="h-2 w-full bg-neutral-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#c1ff72] transition-all duration-500 rounded-full"
                    style={{
                      width: `${(submission.invitesCount / submission.targetInvites) * 100}%`,
                    }}
                  />
                </div>

                <p className="text-[11px] text-neutral-400">
                  Invite 3 friends to jump 100 spots and unlock instant beta access next Monday.
                </p>

                {/* Shareable Link Box */}
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="text"
                    readOnly
                    value={submission.refCode}
                    className="flex-1 bg-black border border-neutral-700 rounded-lg px-3 py-2 text-xs text-neutral-300 font-mono select-all"
                  />
                  <button
                    onClick={handleCopyLink}
                    className="bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-bold px-3 py-2 rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-[#c1ff72]" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>

                {/* Simulation trigger */}
                <div className="pt-2 text-center">
                  <button
                    onClick={handleSimulateInvite}
                    disabled={submission.invitesCount >= submission.targetInvites}
                    className="text-[11px] text-[#c1ff72] hover:underline font-semibold cursor-pointer disabled:opacity-50"
                  >
                    {submission.invitesCount < submission.targetInvites
                      ? '+ Simulate 1 friend signing up with your link'
                      : '🎉 Priority VIP Beta status unlocked!'}
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <p className="text-xs text-neutral-400">
                  We sent a confirmation receipt to <strong className="text-white">{submission.email}</strong>.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
