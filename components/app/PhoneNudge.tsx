"use client";

import { useEffect, useState } from "react";
import { LogoMark } from "@/components/Logo";
import type { SmsResult } from "@/lib/twilio";

export interface NudgeState {
  message: string;
  sms: SmsResult;
  amount: number;
}

/**
 * The demo payoff, mirrored on screen: a phone mock that buzzes and shows the
 * exact SMS Knodle just sent. If Twilio isn't configured (or signal fails), this
 * on-screen copy is the fallback so the moment always lands.
 */
export function PhoneNudge({
  nudge,
  loading,
  onClose,
}: {
  nudge: NudgeState | null;
  loading: boolean;
  onClose: () => void;
}) {
  const [buzz, setBuzz] = useState(false);

  useEffect(() => {
    if (nudge) {
      setBuzz(true);
      const t = setTimeout(() => setBuzz(false), 700);
      return () => clearTimeout(t);
    }
  }, [nudge]);

  if (!nudge && !loading) return null;

  return (
    <div className="pointer-events-none fixed bottom-6 right-6 z-40">
      <div
        className={`pointer-events-auto w-[300px] rounded-[2.2rem] border-[6px] border-black bg-black p-2 shadow-2xl ${
          buzz ? "animate-buzz" : ""
        }`}
      >
        {/* screen */}
        <div className="relative h-[420px] overflow-hidden rounded-[1.7rem] bg-gradient-to-b from-neutral-900 to-black">
          {/* notch */}
          <div className="absolute left-1/2 top-2 h-5 w-24 -translate-x-1/2 rounded-full bg-black" />

          <div className="flex h-full flex-col items-center px-3 pt-14 text-white">
            <div className="text-center">
              <div className="text-5xl font-thin tabular">9:41</div>
              <div className="text-xs text-neutral-400">Friday, 29 August</div>
            </div>

            {loading ? (
              <div className="mt-10 flex flex-col items-center gap-3 text-neutral-400">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-neutral-600 border-t-lime" />
                <span className="text-xs">Sending nudge…</span>
              </div>
            ) : nudge ? (
              <div className="mt-8 w-full animate-fade-up">
                <div className="rounded-2xl bg-white/95 p-3 text-black shadow-lg backdrop-blur">
                  <div className="mb-1.5 flex items-center gap-2">
                    <LogoMark size={20} />
                    <span className="text-[11px] font-bold">Knodle</span>
                    <span className="ml-auto text-[10px] text-neutral-400">now</span>
                  </div>
                  <p className="text-[13px] leading-snug">{nudge.message}</p>
                </div>
                <div className="mt-3 text-center text-[10px] text-neutral-400">
                  {nudge.sms.sent
                    ? `✅ Sent via SMS to ${maskPhone(nudge.sms.to)}`
                    : "📱 On-screen preview · Twilio not configured"}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
      {nudge && (
        <button
          onClick={onClose}
          className="pointer-events-auto mx-auto mt-2 block rounded-full bg-white px-3 py-1 text-xs font-medium text-neutral-600 shadow transition hover:bg-neutral-50"
        >
          Dismiss
        </button>
      )}
    </div>
  );
}

function maskPhone(p?: string): string {
  if (!p) return "your phone";
  return p.slice(0, 4) + "•••" + p.slice(-3);
}
