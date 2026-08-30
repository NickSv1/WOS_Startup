"use client";

import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { LogoMark } from "@/components/Logo";
import { MerchantLogo } from "@/components/app/MerchantLogo";
import { longEase, staggerChildren, uiSpring } from "@/lib/motionTokens";
import { FIX_SAVE, NEW_GOAL, type DemoPhase } from "@/lib/demoScript";
import { CommandBar, WeekPlan } from "./DemoPlan";

const SWAPS = [
  { id: "swap-fix", from: "Uber Eats", to: "Guzman y Gomez", fromD: "ubereats.com", toD: "guzmanygomez.com.au", save: FIX_SAVE, apply: true, note: "3× this fortnight · $32 avg" },
  { id: "swap-coffee", from: "Single O", to: "Starbucks", fromD: "singleo.com.au", toD: "starbucks.com", save: 8, apply: false, note: "5× last week · $8" },
  { id: "swap-woolies", from: "Woolworths", to: "ALDI", fromD: "woolworths.com.au", toD: "aldi.com.au", save: 14, apply: false, note: "2× this month" },
];

const TXNS = [
  { desc: "Payroll — Harbour Digital", domain: "", amount: 1240, ago: "2d" },
  { desc: "Uber Eats", domain: "ubereats.com", amount: -32.4, ago: "2d" },
  { desc: "Single O Coffee", domain: "singleo.com.au", amount: -8.0, ago: "2d" },
  { desc: "Coles Bondi Junction", domain: "coles.com.au", amount: -64.2, ago: "3d" },
  { desc: "Opal top-up", domain: "transportnsw.info", amount: -40.0, ago: "3d" },
];

const SCAN_LINES = [
  "$ knodle scan --account Everyday --weeks 4",
  "→ 34 transactions read",
  "→ Uber Eats ×3      ~$32 · takeaway",
  "→ Single O Coffee ×5  $8 · coffee",
  "→ Woolworths ×2       ~$70 · groceries",
  "✓ matching cheaper alternatives…",
];

const FLAT = Array.from({ length: NEW_GOAL.weeks }, () => NEW_GOAL.flat);

export function DemoProduct({
  phase,
  hoverId,
  weeklyBoost,
  stepId,
  showNewGoal,
  labelAccounts,
  compact,
}: {
  phase: DemoPhase;
  hoverId: string | null;
  weeklyBoost: number;
  stepId?: string;
  showNewGoal?: boolean;
  labelAccounts?: boolean;
  compact?: boolean;
}) {
  const onTrack = phase === "onTrack";
  const ringLime = phase === "applied" || phase === "onTrack";
  const focused = phase === "scanning" || phase === "recommend" || phase === "applied";
  const weeks = onTrack ? 14 : 16;
  const showSlipBead = phase === "scanning" || phase === "recommend";
  const showNew = Boolean(showNewGoal) || phase === "adding" || phase === "plan" || phase === "replan";
  const showWeeks = phase === "plan" || phase === "replan";
  const showCommand = phase === "plan" || phase === "replan";
  const commandTyping = stepId === "type";
  const commandThink = stepId === "think" || stepId === "replan" || phase === "replan";
  const weekValues = phase === "replan" ? NEW_GOAL.replanned : FLAT;
  const reduce = useReducedMotion() === true;
  const vanParked = showNew;

  return (
    <div className="flex h-[680px] w-[1120px] overflow-hidden rounded-[28px] border border-neutral-200 bg-white shadow-node">
      <aside className="flex w-[240px] shrink-0 flex-col border-r border-neutral-200 bg-white">
        <div className="flex items-center gap-2.5 border-b border-neutral-200 px-4 py-4">
          <LogoMark size={28} />
          <div>
            <div className="text-sm font-bold leading-tight">Knodle</div>
            <div className="text-[11px] text-neutral-400">Hayley&apos;s map</div>
          </div>
        </div>
        <div className="space-y-1.5 p-3">
          <AnimatePresence>
            {showNew ? (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={uiSpring}
              >
                <GoalRow emoji={NEW_GOAL.emoji} name={NEW_GOAL.name} badge="ON TRACK" onTrack active={showWeeks} />
              </motion.div>
            ) : null}
          </AnimatePresence>
          <GoalRow emoji="🏙️" name="Sydney Trip" badge={onTrack ? "ON TRACK" : "FIX"} onTrack={onTrack} active={focused || onTrack} />
          <GoalRow emoji="🎿" name="Japan powder trip" badge="ON TRACK" onTrack />
        </div>
        <div className="mt-auto border-t border-neutral-200 px-4 py-3">
          <div className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400">Net worth</div>
          <div className="tabular text-lg font-bold">$31,362</div>
        </div>
      </aside>

      <div id="map" className="relative min-w-0 flex-1 bg-[#fafafa]">
        <Dots />

        <div className="absolute inset-0 transition-opacity duration-500" style={{ opacity: focused ? 0.12 : 1 }}>
          <Spoke x1={50} y1={46} x2={50} y2={18} />
          <Spoke x1={50} y1={46} x2={84} y2={16} />
          <Spoke x1={50} y1={46} x2={22} y2={74} />
          <Spoke x1={50} y1={46} x2={80} y2={66} />
          <Spoke x1={50} y1={46} x2={16} y2={52} />
          <Spoke x1={50} y1={46} x2={54} y2={72} accent={ringLime} />
          <AnimatePresence>{showNew ? <VanSpoke key="van-spoke" /> : null}</AnimatePresence>
          <AccountNode
            id="node-everyday"
            left="50%"
            top="18%"
            emoji="💳"
            name="Everyday"
            kind="Transaction account"
            amount="$642"
            selected={phase === "txns"}
            showLabel={labelAccounts}
          />
          <AccountNode
            id="node-savings"
            left="84%"
            top="16%"
            emoji="🐷"
            name="Savings"
            amount="$180"
            showLabel={labelAccounts}
          />
          <AccountNode
            id="node-super"
            left="22%"
            top="74%"
            emoji="🏦"
            name="Super"
            amount="$28,400"
            showLabel={labelAccounts}
          />
          <AccountNode
            id="node-invest"
            left="80%"
            top="66%"
            emoji="📈"
            name="Investments"
            amount="$2,140"
            showLabel={labelAccounts}
          />
          <GoalCard
            id="node-japan"
            left="16%"
            top="52%"
            emoji="🎿"
            name="Japan trip"
            target="$2,800"
            weeks="22w"
            pct={23}
            onTrack
          />
          <YouNode />
        </div>

        <motion.div
          id="van-cluster"
          className={`absolute z-20 flex ${showWeeks ? "flex-col items-start" : "items-center"}`}
          initial={false}
          animate={{
            left: vanParked ? "2%" : "30%",
            top: vanParked ? "16%" : "30%",
            opacity: focused ? 0.12 : 1,
          }}
          transition={reduce ? { duration: 0 } : uiSpring}
          style={{ transform: "translate(0, -50%)" }}
        >
          <AnimatePresence mode="wait">
            {showNew ? (
              <motion.div
                key="new-goal"
                initial={{ scale: 0.3, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.3, opacity: 0 }}
                transition={uiSpring}
              >
                <GoalCard
                  id="node-new-goal"
                  emoji={NEW_GOAL.emoji}
                  name={NEW_GOAL.name}
                  target={`$${NEW_GOAL.target}`}
                  weeks={`${NEW_GOAL.weeks}w`}
                  pct={6}
                  onTrack
                />
              </motion.div>
            ) : (
              <motion.button
                key="add"
                id="goal-add"
                type="button"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: hoverId === "goal-add" ? 1.06 : 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={uiSpring}
                className={`flex h-[72px] w-[72px] shrink-0 flex-col items-center justify-center rounded-full border-2 border-dashed bg-white text-black shadow-soft ${
                  hoverId === "goal-add" ? "border-black bg-lime" : "border-neutral-300"
                }`}
              >
                <span className="text-2xl font-light leading-none">+</span>
                <span className="mt-0.5 text-[9px] font-bold uppercase tracking-wide">Goal</span>
              </motion.button>
            )}
          </AnimatePresence>
          <AnimatePresence>{showWeeks ? <WeekPlan key="weeks" values={weekValues} pulse={phase === "replan"} /> : null}</AnimatePresence>
        </motion.div>

        <AnimatePresence>
          {showCommand ? (
            <CommandBar
              key="cmd"
              active={commandTyping || commandThink}
              thinking={commandThink}
              fast={compact}
            />
          ) : null}
        </AnimatePresence>

        <motion.div
          id="sydney-cluster"
          className="absolute z-20"
          initial={false}
          animate={{ top: focused ? "44%" : "62%" }}
          transition={reduce ? { duration: 0 } : uiSpring}
          style={{ left: "52%", transform: "translateY(-50%)" }}
        >
          <div className="relative flex items-center">
            <AnimatePresence>
              {phase === "scanning" ? (
                <motion.div
                  key="scan"
                  id="scan-panel"
                  initial={reduce ? { opacity: 1, x: 0 } : { opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: reduce ? 0 : 0.5, ease: longEase }}
                  className="absolute right-full top-0 mr-3 w-[300px] overflow-hidden rounded-3xl border border-black/20 bg-[#0d0d0d] p-4 font-mono text-white shadow-node"
                >
                <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-widest text-lime">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-lime" /> Knodle · analysing spend
                </div>
                <motion.div
                  className="mt-2.5 space-y-1"
                  initial="hidden"
                  animate="show"
                  variants={{
                    hidden: {},
                    show: {
                      transition: {
                        staggerChildren: reduce ? 0 : compact ? 0.14 : 0.42,
                        delayChildren: reduce ? 0 : compact ? 0.18 : 0.7,
                      },
                    },
                  }}
                >
                  {SCAN_LINES.map((line, i) => (
                    <motion.div
                      key={line}
                      variants={{ hidden: { opacity: 0, x: -8 }, show: { opacity: 1, x: 0 } }}
                      className={`text-[11px] leading-relaxed ${i === 0 ? "text-neutral-400" : line.startsWith("✓") ? "text-lime" : "text-neutral-200"}`}
                    >
                      {line}
                      {i === SCAN_LINES.length - 1 ? <span className="ml-0.5 inline-block h-3 w-1.5 animate-pulse bg-lime align-middle" /> : null}
                    </motion.div>
                  ))}
                </motion.div>
                <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-white/10">
                  <motion.div
                    className="h-full rounded-full bg-lime"
                    initial={{ width: reduce ? "100%" : "0%" }}
                    animate={{ width: "100%" }}
                    transition={{
                      duration: reduce ? 0 : compact ? 1.15 : 2.9,
                      delay: reduce ? 0 : compact ? 0.18 : 0.7,
                      ease: "easeInOut",
                    }}
                  />
                </div>
              </motion.div>
            ) : phase === "recommend" || phase === "applied" ? (
              <motion.div
                key="swaps"
                id="swap-panel"
                initial={reduce ? { opacity: 1, x: 0 } : { opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: reduce ? 0 : 0.5, ease: longEase }}
                className="absolute right-full top-0 mr-3 w-[300px] overflow-hidden rounded-3xl border border-black/10 bg-white p-2.5 shadow-node"
              >
                <div className="text-[11px] font-semibold uppercase tracking-widest text-[#e85d1c]">
                  {onTrack ? "On track — keep it" : "3 swaps found on your spend"}
                </div>
                <p className="mt-0.5 text-sm font-semibold">
                  Same lifestyle. {weeks === 14 ? "Sydney Trip's back on the date." : "Keep the Sydney date."}
                </p>
                <motion.div
                  className="mt-1.5 space-y-1"
                  initial="hidden"
                  animate="show"
                  variants={{ hidden: {}, show: { transition: { staggerChildren: reduce ? 0 : staggerChildren } } }}
                >
                  {SWAPS.map((sw) => {
                    const hovered = hoverId === sw.id || hoverId === "swap-fix-apply";
                    const active = sw.apply && (hovered || phase === "applied");
                    return (
                      <motion.div
                        key={sw.id}
                        id={sw.id}
                        variants={{ hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0 } }}
                        className={`flex items-center gap-2 rounded-xl border px-2 py-1.5 transition-colors ${active ? "border-black bg-lime/30" : "border-neutral-200 bg-white"}`}
                      >
                        <span className="flex items-center gap-1">
                          <MerchantLogo name={sw.from} domain={sw.fromD} size={24} />
                          <span className="text-[10px] text-neutral-400">→</span>
                          <MerchantLogo name={sw.to} domain={sw.toD} size={24} />
                        </span>
                        <span className="min-w-0 flex-1 text-left">
                          <span className="block truncate text-[11px] font-semibold">{sw.from} → {sw.to}</span>
                          <span className="text-[9px] text-neutral-500">{sw.note}</span>
                        </span>
                        <span className="tabular shrink-0 text-[11px] font-bold">
                          {active ? `+$${sw.save}/wk` : `$${sw.save}/wk`}
                        </span>
                      </motion.div>
                    );
                  })}
                </motion.div>
                {phase === "applied" ? (
                    <div className="mt-1.5 rounded-2xl bg-black px-3 py-2.5 text-white">
                    <div className="text-[11px] font-semibold uppercase tracking-widest text-lime">Your code</div>
                    <div className="mt-1 font-mono text-xl font-bold tracking-[0.16em]">GYG15</div>
                    <button id="swap-fix-apply" type="button" className="mt-1.5 w-full rounded-xl bg-lime py-2 text-sm font-bold text-black">
                      Applied · +${weeklyBoost || FIX_SAVE}/wk
                    </button>
                  </div>
                ) : (
                    <button id="swap-fix-apply" type="button" className="mt-1.5 w-full rounded-xl bg-black py-2 text-[13px] font-bold text-lime">
                    Apply swap · +${FIX_SAVE}/wk
                  </button>
                )}
              </motion.div>
            ) : null}
          </AnimatePresence>

          <div id="sydney-timeline" className="flex items-center">
            <GoalCard
              id="node-sydney"
              emoji="🏙️"
              name="Sydney Trip"
              target="$650"
              weeks={`${weeks}w${weeklyBoost > 0 ? ` · +$${weeklyBoost}/wk` : ""}`}
              pct={17}
              onTrack={onTrack}
              hovered={hoverId === "node-sydney"}
              emphasis={focused}
            />

            <AnimatePresence>
              {focused ? (
                <motion.div
                  className="ml-3 flex items-center gap-3"
                  initial="hidden"
                  animate="show"
                  exit="hidden"
                  variants={{ hidden: {}, show: { transition: { staggerChildren, delayChildren: 0.1 } } }}
                >
                  {["W1", "W2", "W3"].map((w) => (
                    <motion.span
                      key={w}
                      variants={{ hidden: { scale: 0.3, opacity: 0, x: -20 }, show: { scale: 1, opacity: 1, x: 0 } }}
                      className="flex h-[44px] w-[44px] items-center justify-center rounded-full border-2 border-neutral-300 bg-white text-[10px] font-bold text-black shadow-node"
                    >
                      {w}
                    </motion.span>
                  ))}
                  <AnimatePresence>
                    {showSlipBead ? (
                      <motion.span
                        key="slip"
                        variants={{ hidden: { scale: 0.3, opacity: 0, x: -20 }, show: { scale: 1, opacity: 1, x: 0 } }}
                        exit={{ scale: 0.15, opacity: 0 }}
                        className="flex h-[44px] w-[44px] items-center justify-center rounded-full border-2 border-[#ff7a3d] bg-[#ff7a3d] text-[10px] font-bold text-black shadow-node"
                      >
                        +2w
                      </motion.span>
                    ) : null}
                  </AnimatePresence>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
          </div>
        </motion.div>

        <AnimatePresence>
          {phase === "txns" ? (
            <motion.div
              id="txns-panel"
              initial={{ opacity: 0, scale: 0.94, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 10 }}
              transition={{ duration: 0.48, ease: longEase }}
              className="absolute right-3 top-3 z-30 w-[300px] overflow-hidden rounded-3xl border border-black/10 bg-white/95 shadow-node backdrop-blur-md"
            >
              <div className="flex items-center justify-between border-b border-neutral-100 px-4 py-3">
                <div className="flex items-center gap-2">
                  <span className="text-base">💳</span>
                  <div>
                    <div className="text-[13px] font-bold leading-tight">Everyday</div>
                    <div className="text-[10px] text-neutral-400">Transaction account · live</div>
                  </div>
                </div>
                <div className="tabular text-sm font-bold">$642</div>
              </div>
              <div className="divide-y divide-neutral-100">
                {TXNS.map((t) => (
                  <TxnRow key={t.desc} {...t} />
                ))}
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </div>
  );
}

function VanSpoke() {
  return (
    <svg className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden>
      <motion.line
        x1="50%"
        y1="46%"
        x2="8%"
        y2="12%"
        stroke="#93d637"
        strokeWidth="2"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5, ease: longEase }}
      />
    </svg>
  );
}

function TxnRow({ desc, domain, amount, ago }: { desc: string; domain: string; amount: number; ago: string }) {
  const spend = amount < 0;
  return (
    <div className="flex items-center gap-2.5 px-4 py-2">
      {domain ? (
        <MerchantLogo name={desc} domain={domain} size={26} />
      ) : (
        <span className="flex h-[26px] w-[26px] items-center justify-center rounded-full bg-lime/30 text-[11px]">💰</span>
      )}
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[12px] font-medium">{desc}</span>
        <span className="text-[10px] text-neutral-400">{ago} ago</span>
      </span>
      <span className={`tabular text-[12px] font-bold ${spend ? "text-neutral-900" : "text-lime-600"}`}>
        {spend ? "-" : "+"}${Math.abs(amount).toFixed(2)}
      </span>
    </div>
  );
}

function YouNode() {
  return (
    <div
      style={{ left: "50%", top: "46%" }}
      className="absolute z-20 flex h-[120px] w-[120px] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full border-4 border-white bg-black text-white shadow-node"
    >
      <LogoMark size={28} />
      <span className="mt-1 text-[10px] font-semibold uppercase tracking-widest text-neutral-400">Hayley</span>
      <span className="tabular text-sm font-bold text-lime">$31,362</span>
    </div>
  );
}

function AccountNode({
  id,
  left,
  top,
  emoji,
  name,
  kind,
  amount,
  selected,
  showLabel,
}: {
  id?: string;
  left: string;
  top: string;
  emoji: string;
  name: string;
  kind?: string;
  amount: string;
  selected?: boolean;
  showLabel?: boolean;
}) {
  return (
    <div
      id={id}
      style={{ left, top }}
      className="absolute z-10 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center"
    >
      <div
        className={`flex h-[72px] w-[72px] flex-col items-center justify-center rounded-full border bg-white text-center ${
          selected ? "border-black ring-2 ring-lime/40" : "border-neutral-200"
        }`}
      >
        <span className="text-[16px] leading-none">{emoji}</span>
        <span className="tabular mt-0.5 text-[11px] font-bold">{amount}</span>
      </div>
      <AnimatePresence>
        {showLabel ? (
          <motion.span
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={uiSpring}
            className="mt-1.5 max-w-[92px] text-center text-[10px] font-bold leading-tight text-black"
          >
            {name}
            {kind ? <span className="mt-0.5 block text-[8px] font-medium leading-tight text-neutral-500">{kind}</span> : null}
          </motion.span>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

function GoalCard({
  id,
  left,
  top,
  emoji,
  name,
  target,
  weeks,
  pct,
  onTrack,
  hovered,
  emphasis,
}: {
  id: string;
  left?: string;
  top?: string;
  emoji: string;
  name: string;
  target: string;
  weeks: string;
  pct: number;
  onTrack: boolean;
  hovered?: boolean;
  emphasis?: boolean;
}) {
  const accent = onTrack ? "#93d637" : "#ff7a3d";
  const r = 13;
  const c = 2 * Math.PI * r;
  const positioned = Boolean(left && top);
  return (
    <button
      id={id}
      type="button"
      style={positioned ? { left, top } : undefined}
      className={`z-20 w-[156px] rounded-2xl border-2 bg-white p-2.5 text-left shadow-node will-change-transform ${
        positioned ? "absolute -translate-x-1/2 -translate-y-1/2" : "relative shrink-0"
      } ${onTrack ? "border-lime" : "border-[#ff7a3d]"} ${hovered || emphasis ? "scale-[1.03]" : ""}`}
    >
      <div className="flex items-start gap-2">
        <span className="relative flex h-9 w-9 shrink-0 items-center justify-center">
          <svg width="36" height="36" viewBox="0 0 36 36" className="-rotate-90" aria-hidden>
            <circle cx="18" cy="18" r={r} fill="none" stroke="#ececec" strokeWidth="3" />
            <circle
              cx="18"
              cy="18"
              r={r}
              fill="none"
              stroke={accent}
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray={c}
              strokeDashoffset={c * (1 - Math.min(1, pct / 100))}
            />
          </svg>
          <span className="absolute text-[13px] leading-none">{emoji}</span>
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-[12px] font-bold leading-tight">{name}</span>
          <span
            className={`mt-1 inline-block rounded-full px-1.5 py-0.5 text-[8px] font-bold ${
              onTrack ? "bg-lime text-black" : "bg-[#ff7a3d] text-black"
            }`}
          >
            {onTrack ? "ON TRACK" : "FIX"}
          </span>
        </span>
      </div>
      <div className="mt-2 flex items-baseline justify-between">
        <span className="tabular text-[13px] font-bold">{target}</span>
        <span className="tabular text-[10px] font-semibold text-neutral-500">{weeks}</span>
      </div>
      <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-neutral-100">
        <div className="h-full rounded-full" style={{ width: `${pct}%`, background: accent }} />
      </div>
    </button>
  );
}

function GoalRow({ emoji, name, badge, onTrack, active }: { emoji: string; name: string; badge: string; onTrack: boolean; active?: boolean }) {
  return (
    <div className={`rounded-xl border px-3 py-2 ${active ? (onTrack ? "border-lime bg-lime/15" : "border-[#ff7a3d] bg-[#ff7a3d]/10") : "border-transparent"}`}>
      <div className="flex items-center justify-between gap-2">
        <span className="truncate text-[12px] font-semibold">{emoji} {name}</span>
        <span className={`rounded-full px-1.5 py-0.5 text-[8px] font-bold ${onTrack ? "bg-lime text-black" : "bg-[#ff7a3d] text-black"}`}>{badge}</span>
      </div>
    </div>
  );
}

function Spoke({ x1, y1, x2, y2, accent }: { x1: number; y1: number; x2: number; y2: number; accent?: boolean }) {
  return (
    <svg className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden>
      <line x1={`${x1}%`} y1={`${y1}%`} x2={`${x2}%`} y2={`${y2}%`} stroke={accent ? "#93d637" : "#e5e5e5"} strokeWidth={accent ? 2 : 1.5} strokeDasharray={accent ? "5 5" : undefined} />
    </svg>
  );
}

function Dots() {
  return (
    <div
      className="pointer-events-none absolute inset-0 opacity-40"
      style={{ backgroundImage: "radial-gradient(#d4d4d4 1px, transparent 1px)", backgroundSize: "18px 18px" }}
    />
  );
}
