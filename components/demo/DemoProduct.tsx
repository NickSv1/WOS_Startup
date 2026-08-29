"use client";

import { motion, AnimatePresence } from "framer-motion";
import { LogoMark } from "@/components/Logo";
import { MerchantLogo } from "@/components/app/MerchantLogo";
import { staggerChildren } from "@/lib/motionTokens";
import { FIX_SAVE, type DemoPhase } from "@/lib/demoScript";

/** Cheaper alternatives the scan "finds" on Hayley's real spend. */
const SWAPS = [
  { id: "swap-fix", from: "Uber Eats", to: "Guzman y Gomez", fromD: "ubereats.com", toD: "guzmanygomez.com.au", save: FIX_SAVE, off: 39, apply: true, coupon: "GYG15", note: "3× this fortnight · $32 avg" },
  { id: "swap-coffee", from: "Single O", to: "Starbucks", fromD: "singleo.com.au", toD: "starbucks.com", save: 8, off: 20, apply: false, note: "5× last week · $8" },
  { id: "swap-woolies", from: "Woolworths", to: "ALDI", fromD: "woolworths.com.au", toD: "aldi.com.au", save: 14, off: 20, apply: false, note: "2× this month" },
];

/** The recent transactions the "bank connection" + scan reads. */
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

export function DemoProduct({
  phase,
  hoverId,
  weeklyBoost,
}: {
  phase: DemoPhase;
  hoverId: string | null;
  weeklyBoost: number;
}) {
  const onTrack = phase === "onTrack";
  const ringLime = phase === "applied" || phase === "onTrack";
  const focused = phase === "scanning" || phase === "recommend" || phase === "applied";
  const weeks = onTrack ? 14 : 16;
  const showSlipBead = phase === "scanning" || phase === "recommend";

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
          <GoalRow emoji="🏙️" name="Sydney Trip" badge={onTrack ? "ON TRACK" : "FIX"} onTrack={onTrack} active />
          <GoalRow emoji="🎿" name="Japan powder trip" badge="ON TRACK" onTrack />
          <GoalRow emoji="🤿" name="3/2 steamer wetsuit" badge="DONE" onTrack />
        </div>
        <div className="mt-auto border-t border-neutral-200 px-4 py-3">
          <div className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400">Net worth</div>
          <div className="tabular text-lg font-bold">$31,362</div>
        </div>
      </aside>

      <div id="map" className="relative min-w-0 flex-1 bg-[#fafafa]">
        <Dots />

        {/* dimmable constellation */}
        <div
          className="absolute inset-0 transition-opacity duration-500"
          style={{ opacity: focused ? 0.12 : 1 }}
        >
          <Spoke x1={50} y1={46} x2={32} y2={30} />
          <Spoke x1={50} y1={46} x2={70} y2={28} />
          <Spoke x1={50} y1={46} x2={26} y2={64} />
          <Spoke x1={50} y1={46} x2={74} y2={58} />
          <Spoke x1={50} y1={46} x2={62} y2={74} accent={ringLime} />
          <AccountNode id="node-everyday" left="32%" top="30%" emoji="💳" name="Everyday" amount="$642" selected={phase === "txns"} />
          <AccountNode left="70%" top="28%" emoji="🐷" name="Board fund" amount="$180" />
          <AccountNode left="26%" top="64%" emoji="🏦" name="AustralianSuper" amount="$28,400" />
          <AccountNode left="74%" top="58%" emoji="📈" name="Investments" amount="$2,140" />
          <YouNode />
        </div>

        {/* off-track alert — no specific cause, the scan finds it */}
        <AnimatePresence>
          {phase === "idle" ? (
            <motion.div
              id="offtrack-alert"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className={`absolute left-1/2 top-4 z-20 w-[min(440px,calc(100%-32px))] -translate-x-1/2 rounded-2xl border border-[#ff7a3d] bg-white px-4 py-3 text-left shadow-node ${
                hoverId === "offtrack-alert" ? "shadow-[0_0_0_6px_rgba(255,122,61,0.18)]" : ""
              }`}
            >
              <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-widest text-[#e85d1c]">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#ff7a3d]" /> Off track
              </div>
              <p className="mt-0.5 text-sm font-semibold">🏙️ Sydney Trip has slipped 2 weeks.</p>
              <p className="mt-1 text-[11px] text-neutral-500">Tap it — Knodle scans your spend and finds the fix.</p>
            </motion.div>
          ) : null}
        </AnimatePresence>

        {/* the goal node + week beads to the RIGHT — camera target so swaps never cover them */}
        <div
          id="sydney-timeline"
          className="absolute z-20 flex items-center"
          style={{ left: "62%", top: "74%", transform: "translate(-66px, -50%)" }}
        >
          <button
            id="node-sydney"
            type="button"
            className={`relative z-20 flex h-[132px] w-[132px] shrink-0 flex-col items-center justify-center rounded-full border-[3px] bg-black px-3 text-center text-white shadow-node transition-all duration-500 ${
              ringLime ? "border-lime ring-4 ring-lime/40" : "border-[#ff7a3d]"
            } ${focused && !ringLime ? "ring-4 ring-[#ff7a3d]/40" : ""} ${
              hoverId === "node-sydney" ? "-translate-y-1.5 scale-[1.04]" : ""
            }`}
          >
            <span className="text-lg leading-none">🏙️</span>
            <span className="mt-1 text-[11px] font-semibold leading-tight">Sydney Trip</span>
            <span className={`mt-1.5 rounded-full px-1.5 py-0.5 text-[9px] font-bold ${onTrack ? "bg-lime text-black" : "bg-[#ff7a3d] text-black"}`}>
              {onTrack ? "ON TRACK" : "FIX"}
            </span>
            <span className="tabular mt-1 text-sm font-bold text-lime">$650</span>
            <span className="tabular text-[9px] text-neutral-400">
              {weeks}w{weeklyBoost > 0 ? ` · +$${weeklyBoost}/wk` : ""}
            </span>
          </button>

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

        {/* transactions — the bank connection */}
        <AnimatePresence>
          {phase === "txns" ? (
            <motion.div
              id="txns-panel"
              initial={{ opacity: 0, scale: 0.94, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 10 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="absolute left-1/2 top-1/2 z-30 w-[320px] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-3xl border border-black/10 bg-white/95 shadow-node backdrop-blur-md"
            >
              <div className="flex items-center justify-between border-b border-neutral-100 px-4 py-3">
                <div className="flex items-center gap-2">
                  <span className="text-base">💳</span>
                  <div>
                    <div className="text-[13px] font-bold leading-tight">Everyday</div>
                    <div className="text-[10px] text-neutral-400">Up · live</div>
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

        {/* bottom-left dock — scan then recommendations (never over the beads) */}
        <div className="absolute bottom-3 left-3 z-30 w-[min(360px,calc(50%-8px))]">
          <AnimatePresence mode="wait">
            {phase === "scanning" ? (
              <motion.div
                key="scan"
                id="scan-panel"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="overflow-hidden rounded-3xl border border-black/20 bg-[#0d0d0d] p-4 font-mono text-white shadow-node"
              >
                <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-widest text-lime">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-lime" /> Knodle · analysing spend
                </div>
                <motion.div
                  className="mt-2.5 space-y-1"
                  initial="hidden"
                  animate="show"
                  variants={{ hidden: {}, show: { transition: { staggerChildren: 0.42, delayChildren: 0.2 } } }}
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
                  <motion.div className="h-full rounded-full bg-lime" initial={{ width: "0%" }} animate={{ width: "100%" }} transition={{ duration: 2.9, ease: "easeInOut" }} />
                </div>
              </motion.div>
            ) : phase === "recommend" || phase === "applied" ? (
              <motion.div
                key="swaps"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="overflow-hidden rounded-3xl border border-black/10 bg-white/95 p-3 shadow-node backdrop-blur-md"
              >
                <div className="text-[11px] font-semibold uppercase tracking-widest text-[#e85d1c]">
                  {onTrack ? "On track — keep it" : "3 swaps found on your spend"}
                </div>
                <p className="mt-0.5 text-sm font-semibold">
                  Same lifestyle. {weeks === 14 ? "Sydney Trip's back on the date." : "Keep the Sydney date."}
                </p>
                <motion.div
                  className="mt-2 space-y-1.5"
                  initial="hidden"
                  animate="show"
                  variants={{ hidden: {}, show: { transition: { staggerChildren } } }}
                >
                  {SWAPS.map((sw) => {
                    const hovered = hoverId === sw.id || hoverId === "swap-fix-apply";
                    const active = sw.apply && (hovered || phase === "applied");
                    return (
                      <motion.div
                        key={sw.id}
                        id={sw.id}
                        variants={{ hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0 } }}
                        className={`flex items-center gap-3 rounded-2xl border px-3 py-2.5 transition-colors ${active ? "border-black bg-lime/30" : "border-neutral-200 bg-white"}`}
                      >
                        <span className="flex items-center gap-1.5">
                          <MerchantLogo name={sw.from} domain={sw.fromD} size={28} />
                          <span className="text-[11px] text-neutral-400">→</span>
                          <MerchantLogo name={sw.to} domain={sw.toD} size={28} />
                        </span>
                        <span className="min-w-0 flex-1 text-left">
                          <span className="block truncate text-[12px] font-semibold">{sw.from} → {sw.to}</span>
                          <span className="text-[10px] text-neutral-500">{sw.note}</span>
                        </span>
                        <span className="tabular shrink-0 text-[12px] font-bold">
                          {active ? `+$${sw.save}/wk` : `$${sw.save}/wk`}
                        </span>
                      </motion.div>
                    );
                  })}
                </motion.div>

                {phase === "applied" ? (
                  <div className="mt-2 rounded-2xl bg-black px-3.5 py-3 text-white">
                    <div className="text-[11px] font-semibold uppercase tracking-widest text-lime">Your code</div>
                    <div className="mt-1 font-mono text-xl font-bold tracking-[0.16em]">GYG15</div>
                    <button id="swap-fix-apply" type="button" className="mt-2 w-full rounded-xl bg-lime py-2 text-sm font-bold text-black">
                      Applied · +${weeklyBoost || FIX_SAVE}/wk
                    </button>
                  </div>
                ) : (
                  <button id="swap-fix-apply" type="button" className="mt-2 w-full rounded-xl bg-black py-2.5 text-sm font-bold text-lime">
                    Apply swap · +${FIX_SAVE}/wk
                  </button>
                )}
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </div>
    </div>
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
  amount,
  selected,
}: {
  id?: string;
  left: string;
  top: string;
  emoji: string;
  name: string;
  amount: string;
  selected?: boolean;
}) {
  return (
    <div
      id={id}
      style={{ left, top }}
      className={`absolute z-10 flex h-[108px] w-[108px] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full border bg-white px-2 text-center shadow-node transition ${
        selected ? "border-black ring-4 ring-lime/50" : "border-neutral-200"
      }`}
    >
      <span className="text-base">{emoji}</span>
      <span className="mt-0.5 text-[11px] font-semibold leading-tight">{name}</span>
      <span className="tabular text-[12px] font-bold">{amount}</span>
    </div>
  );
}

function GoalRow({ emoji, name, badge, onTrack, active }: { emoji: string; name: string; badge: string; onTrack: boolean; active?: boolean }) {
  return (
    <div
      className={`rounded-xl border px-3 py-2 ${
        active ? (onTrack ? "border-lime bg-lime/15" : "border-[#ff7a3d] bg-[#ff7a3d]/10") : "border-transparent"
      }`}
    >
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
