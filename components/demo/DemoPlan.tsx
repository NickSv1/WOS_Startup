"use client";

import { useEffect, useState } from "react";
import {
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from "framer-motion";
import { COMMAND_TEXT, NEW_GOAL } from "@/lib/demoScript";
import { longEase, replanStaggerMs, typeCharMs, typeCharMsFast, typePauseMs, typePauseMsFast, uiSpring } from "@/lib/motionTokens";

export function AnimatedDollar({
  value,
  pulse,
  delay = 0,
}: {
  value: number;
  pulse?: boolean;
  delay?: number;
}) {
  const reduce = useReducedMotion() === true;
  const mv = useMotionValue(reduce ? value : 0);
  const rounded = useTransform(mv, (v) => `$${Math.round(v)}`);

  useEffect(() => {
    if (reduce) {
      mv.set(value);
      return;
    }
    const t = window.setTimeout(() => {
      animate(mv, value, { duration: 0.6, ease: "easeOut" });
    }, delay);
    return () => window.clearTimeout(t);
  }, [delay, mv, reduce, value]);

  return (
    <motion.span
      className="tabular inline-block text-[10px] font-bold leading-none"
      animate={pulse ? { scale: [1, 1.1, 1], color: ["#111111", "#65a30d", "#111111"] } : { scale: 1, color: "#111111" }}
      transition={{ duration: 0.6, delay: delay / 1000, ease: "easeOut" }}
    >
      <motion.span>{rounded}</motion.span>
    </motion.span>
  );
}

export function AddGoalCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.92 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 8, scale: 0.96 }}
      transition={uiSpring}
      className="absolute right-6 top-8 z-30 w-[210px] rounded-2xl border border-black/10 bg-white p-3.5 shadow-node"
    >
      <div className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400">New goal</div>
      <div className="mt-1 text-sm font-bold">
        {NEW_GOAL.emoji} {NEW_GOAL.name}
      </div>
      <div className="tabular mt-2 text-xl font-bold">${NEW_GOAL.target}</div>
      <div className="mt-0.5 text-[11px] text-neutral-500">
        {NEW_GOAL.weeks} weeks · ${NEW_GOAL.flat}/wk
      </div>
      <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-neutral-100">
        <motion.div
          className="h-full rounded-full bg-lime"
          initial={{ width: "0%" }}
          animate={{ width: "6%" }}
          transition={{ duration: 0.6, ease: longEase }}
        />
      </div>
    </motion.div>
  );
}

export function WeekPlan({
  values,
  pulse,
}: {
  values: readonly number[];
  pulse?: boolean;
}) {
  const max = Math.max(...values, 1);
  const n = values.length;
  return (
    <motion.div
      id="week-plan"
      className="mt-1.5 flex items-end gap-1.5"
      initial="hidden"
      animate="show"
      exit="hidden"
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: 0.05, delayChildren: 0.08 } },
      }}
    >
      {values.map((v, i) => {
        const changed = pulse && (i < 3 || i >= n - 3);
        const delay = i * replanStaggerMs;
        return (
          <motion.div
            key={i}
            id={`week-${i + 1}`}
            variants={{
              hidden: { scale: 0.3, opacity: 0, x: -16 },
              show: { scale: 1, opacity: 1, x: 0, transition: uiSpring },
            }}
            className="flex flex-col items-center"
          >
            <motion.div
              className="mb-1 w-1.5 origin-bottom rounded-full"
              initial={false}
              animate={{
                height: 6 + (v / max) * 26,
                backgroundColor: changed ? "#93d637" : "#111111",
              }}
              transition={{ ...uiSpring, delay: delay / 1000 }}
            />
            <motion.div
              animate={changed ? { scale: [1, 1.08, 1] } : { scale: 1 }}
              transition={{ duration: 0.6, delay: delay / 1000, ease: "easeOut" }}
              className={`flex h-[44px] w-[36px] flex-col items-center justify-center rounded-xl border bg-white text-black shadow-soft ${
                changed ? "border-lime" : "border-neutral-200"
              }`}
            >
              <span className="text-[8px] font-bold text-neutral-400">W{i + 1}</span>
              <AnimatedDollar value={v} pulse={changed} delay={delay} />
            </motion.div>
          </motion.div>
        );
      })}
    </motion.div>
  );
}

export function CommandBar({
  active,
  thinking,
  fast,
}: {
  active: boolean;
  thinking: boolean;
  fast?: boolean;
}) {
  const reduce = useReducedMotion() === true;
  const [text, setText] = useState(reduce ? COMMAND_TEXT : "");
  const [typedOut, setTypedOut] = useState(reduce);
  const [caret, setCaret] = useState(true);
  const charMs = fast ? typeCharMsFast : typeCharMs;
  const pauseMs = fast ? typePauseMsFast : typePauseMs;

  useEffect(() => {
    if (!active || typedOut || thinking) return;
    const id = window.setInterval(() => setCaret((c) => !c), 530);
    return () => window.clearInterval(id);
  }, [active, thinking, typedOut]);

  useEffect(() => {
    if (!active) {
      setText("");
      setTypedOut(false);
      return;
    }
    if (reduce || thinking) {
      setText(COMMAND_TEXT);
      setTypedOut(true);
      return;
    }
    setText("");
    setTypedOut(false);
    let i = 0;
    let timer: number;
    const tick = () => {
      i += 1;
      setText(COMMAND_TEXT.slice(0, i));
      if (i >= COMMAND_TEXT.length) {
        window.setTimeout(() => setTypedOut(true), 180);
        return;
      }
      const ch = COMMAND_TEXT[i - 1];
      const pause = ch === " " || ch === "," || ch === "." ? pauseMs : 0;
      timer = window.setTimeout(tick, charMs + pause);
    };
    timer = window.setTimeout(tick, charMs);
    return () => window.clearTimeout(timer);
  }, [active, reduce, thinking, charMs, pauseMs]);

  const showThink = thinking;

  return (
    <div
      id="command-bar"
      className="absolute bottom-3 left-1/2 z-30 w-[min(540px,calc(100%-32px))] -translate-x-1/2"
    >
      <div className="flex items-center gap-2 rounded-2xl border border-black/10 bg-white/95 px-3.5 py-2.5 shadow-node backdrop-blur-md">
        <span className="text-[11px] font-bold text-neutral-400">⌘</span>
        <div className="relative min-h-[20px] min-w-0 flex-1 font-mono text-[12px] text-black">
          {showThink ? (
            <span className="relative inline-flex overflow-hidden rounded-md px-1 text-neutral-500">
              Re-planning around that…
              <motion.span
                className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-lime/50 to-transparent"
                animate={{ x: ["-100%", "120%"] }}
                transition={{ duration: 0.7, ease: "easeInOut", repeat: 2 }}
              />
            </span>
          ) : (
            <>
              {text || <span className="text-neutral-400">Tell Knodle what&apos;s going on…</span>}
              {active && !typedOut ? (
                <span
                  className="ml-0.5 inline-block h-3.5 w-[1.5px] align-middle"
                  style={{ background: caret ? "#111" : "transparent" }}
                />
              ) : null}
            </>
          )}
        </div>
        <span className="rounded-lg bg-black px-2 py-1 text-[10px] font-bold text-lime">enter</span>
      </div>
    </div>
  );
}
