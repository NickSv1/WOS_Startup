"use client";

import { motion } from "framer-motion";
import { LogoMark } from "@/components/Logo";

export function PhoneLock({ hovered }: { hovered: boolean }) {
  return (
    <div
      id="phone-lock"
      className="relative h-full w-full overflow-hidden bg-gradient-to-b from-[#1c1c1e] via-[#2c2c2e] to-[#0a0a0a] text-white"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          background:
            "radial-gradient(ellipse at 30% 20%, rgba(193,255,114,0.18), transparent 50%), radial-gradient(ellipse at 80% 80%, rgba(255,122,61,0.12), transparent 45%)",
        }}
      />
      <div className="relative flex h-full flex-col px-5 pt-14">
        <div className="text-center">
          <div className="text-[17px] font-medium tracking-wide text-white/80">Saturday, 29 August</div>
          <div className="mt-1 text-[72px] font-thin leading-none tabular tracking-tight">9:41</div>
        </div>

        <motion.button
          id="knodle-notif"
          type="button"
          initial={{ y: -12, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.35, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className={`mt-10 w-full rounded-[22px] bg-white/90 p-3.5 text-left text-black shadow-2xl backdrop-blur-xl transition ${
            hovered ? "scale-[1.03] shadow-[0_0_0_6px_rgba(193,255,114,0.35)]" : ""
          }`}
        >
          <div className="mb-1.5 flex items-center gap-2">
            <LogoMark size={22} />
            <span className="text-[12px] font-bold uppercase tracking-wider">Knodle</span>
            <span className="ml-auto text-[11px] text-neutral-400">now</span>
          </div>
          <p className="text-[15px] font-semibold leading-snug">Sydney Trip is off track</p>
          <p className="mt-0.5 text-[13px] leading-snug text-neutral-600">
            It&apos;s slipped 2 weeks. Tap to get back on the date.
          </p>
        </motion.button>

        <div className="mt-auto pb-6 text-center text-[11px] text-white/35">Swipe up to unlock</div>
      </div>
    </div>
  );
}
