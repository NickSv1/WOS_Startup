"use client";

import { useState } from "react";
import { money } from "@/lib/format";

const PRESETS = [
  { emoji: "🍺", label: "Drinks last night", amount: 86 },
  { emoji: "🥡", label: "Uber Eats", amount: 42 },
  { emoji: "🎟️", label: "Gig tickets", amount: 120 },
  { emoji: "☕", label: "Coffee run", amount: 18 },
];

/** Pick a spend to simulate. Fires the nudge loop with the chosen amount. */
export function SimulateModal({
  onFire,
  onClose,
}: {
  onFire: (amount: number, label: string) => void;
  onClose: () => void;
}) {
  const [custom, setCustom] = useState("");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={onClose}>
      <div
        className="w-full max-w-sm animate-fade-up rounded-2xl bg-white p-6 shadow-node"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold">Stephan overspent</h2>
        <p className="mt-1 text-sm text-neutral-500">
          Log a blow-out. The path to the surfboard gets longer — then Knodle tells you what to cut.
        </p>

        <div className="mt-5 grid grid-cols-2 gap-2.5">
          {PRESETS.map((p) => (
            <button
              key={p.label}
              onClick={() => onFire(p.amount, p.label)}
              className="flex flex-col items-start rounded-2xl border border-neutral-200 p-3.5 text-left transition hover:border-black hover:bg-lime/10"
            >
              <span className="text-2xl">{p.emoji}</span>
              <span className="mt-1.5 text-sm font-semibold">{p.label}</span>
              <span className="tabular text-sm text-neutral-500">{money(p.amount)}</span>
            </button>
          ))}
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            const amt = Number(custom);
            if (amt > 0) onFire(amt, "Purchase");
          }}
          className="mt-4 flex gap-2"
        >
          <div className="relative flex-1">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-neutral-400">
              $
            </span>
            <input
              type="number"
              inputMode="numeric"
              value={custom}
              onChange={(e) => setCustom(e.target.value)}
              placeholder="Custom amount"
              className="tabular w-full rounded-xl border border-neutral-200 py-2.5 pl-7 pr-3 text-sm outline-none focus:border-black"
            />
          </div>
          <button
            type="submit"
            disabled={!(Number(custom) > 0)}
            className="rounded-xl bg-black px-4 py-2.5 text-sm font-bold text-white transition hover:bg-neutral-800 disabled:opacity-40"
          >
            Spend
          </button>
        </form>
      </div>
    </div>
  );
}
