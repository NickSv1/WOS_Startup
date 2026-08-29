"use client";

import { money } from "@/lib/format";
import type { RecoveryOption } from "@/lib/savings";

export function CoachPrompt({
  amount,
  label,
  goalName,
  extraWeeks,
  projectedWeeks,
  plannedWeeks,
  options,
  onCut,
  onExtend,
  onDismiss,
}: {
  amount: number;
  label: string;
  goalName: string;
  extraWeeks: number;
  projectedWeeks: number;
  plannedWeeks: number;
  options: RecoveryOption[];
  onCut: (option: RecoveryOption) => void;
  onExtend: () => void;
  onDismiss: () => void;
}) {
  if (extraWeeks <= 0) return null;
  const top = options.slice(0, 3);

  return (
    <div className="pointer-events-auto absolute bottom-5 left-1/2 z-20 w-[min(560px,calc(100%-24px))] -translate-x-1/2 animate-fade-up rounded-2xl border border-black bg-white p-4 shadow-node">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-widest text-neutral-400">
            Off track
          </div>
          <p className="mt-1 text-sm font-semibold leading-snug">
            {label} ({money(amount)}) made {goalName} slip {extraWeeks}{" "}
            {extraWeeks === 1 ? "week" : "weeks"} — now {projectedWeeks}w, not {plannedWeeks}w.
          </p>
          <p className="mt-1 text-xs text-neutral-500">
            Cut something to still hit the original date, or push the goal out.
          </p>
        </div>
        <button
          onClick={onDismiss}
          className="shrink-0 text-xs font-medium text-neutral-400 hover:text-black"
        >
          Dismiss
        </button>
      </div>

      <div className="mt-3 grid gap-2">
        {top.map((o) => (
          <button
            key={`${o.categoryId}-${o.cut}`}
            onClick={() => onCut(o)}
            className="flex items-center justify-between rounded-xl border border-neutral-200 px-3 py-2.5 text-left text-sm transition hover:border-black hover:bg-lime/20"
          >
            <span>
              {o.emoji}{" "}
              {o.cut === "all" ? "Cut" : "Halve"} {o.label.toLowerCase()}
            </span>
            <span className="tabular text-xs font-semibold text-neutral-600">
              +{money(o.freedPerWeek)}/wk · {o.weeksToRecover}w to recover
            </span>
          </button>
        ))}
        <button
          onClick={onExtend}
          className="rounded-xl border border-neutral-200 px-3 py-2.5 text-left text-sm transition hover:border-black hover:bg-neutral-50"
        >
          Push the date instead — accept {projectedWeeks} weeks
        </button>
      </div>
    </div>
  );
}
