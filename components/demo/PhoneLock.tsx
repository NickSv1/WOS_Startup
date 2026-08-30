"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { LogoMark } from "@/components/Logo";
import { uiSpring } from "@/lib/motionTokens";

function LockNotif({
  id,
  hovered,
  title,
  body,
  time,
}: {
  id?: string;
  hovered?: boolean;
  title: string;
  body: string;
  time: string;
}) {
  return (
    <motion.button
      id={id}
      type="button"
      layout
      initial={{ y: -28, opacity: 0, scale: 0.96 }}
      animate={
        hovered
          ? { y: 0, opacity: 1, scale: 1.03, x: [0, -3, 3, -2, 0] }
          : { y: 0, opacity: 1, scale: 1, x: 0 }
      }
      exit={{ y: -12, opacity: 0, scale: 0.96 }}
      transition={{
        y: uiSpring,
        opacity: { duration: 0.45, ease: "easeOut" },
        scale: uiSpring,
        x: { duration: 0.4, delay: 0.2, ease: "easeOut" },
        layout: uiSpring,
      }}
      className={`w-full rounded-[22px] bg-white/90 p-3.5 text-left text-black shadow-2xl backdrop-blur-xl ${
        hovered ? "shadow-[0_0_0_6px_rgba(193,255,114,0.35)]" : ""
      }`}
    >
      <div className="mb-1.5 flex items-center gap-2">
        <LogoMark size={22} />
        <span className="text-[12px] font-bold uppercase tracking-wider">Knodle</span>
        <span className="ml-auto text-[11px] text-neutral-400">{time}</span>
      </div>
      <p className="text-[15px] font-semibold leading-snug">{title}</p>
      <p className="mt-0.5 text-[13px] leading-snug text-neutral-600">{body}</p>
    </motion.button>
  );
}

export function PhoneLock({
  hovered,
  showSaveNotif,
}: {
  hovered: boolean;
  showSaveNotif?: boolean;
}) {
  const reduce = useReducedMotion() === true;

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

        <div className="mt-10 flex flex-col gap-2.5">
          <LockNotif
            title="Last night got a bit spendy"
            body="No stress — I'll shuffle things so you're still good."
            time="now"
          />
          <AnimatePresence>
            {showSaveNotif || reduce ? (
              <LockNotif
                key="save"
                id="knodle-notif"
                hovered={hovered}
                title="A few easy saves just landed"
                body="Tiny swaps, same lifestyle. Tap when you're ready."
                time="now"
              />
            ) : null}
          </AnimatePresence>
        </div>

        <div className="mt-auto pb-6 text-center text-[11px] text-white/35">Swipe up to unlock</div>
      </div>
    </div>
  );
}
