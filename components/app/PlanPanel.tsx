"use client";

import { useState } from "react";
import { projectGoal, recoveryOptions, goalStatus } from "@/lib/savings";
import { money } from "@/lib/format";
import { seedCategories } from "@/data/seed";
import { discretionaryCategories, type SpendingProfile } from "@/lib/insights";
import type { Goal } from "@/lib/types";
import { LogoMark } from "@/components/Logo";

export interface NudgeMessage {
  id: string;
  text: string;
  amount: number;
  sent: boolean;
  at: number;
}

/**
 * Replaces the chatbot. No open chat — the value is Knodle reaching out, plus a
 * few pre-computed, one-tap "get back on track" actions. Everything here is
 * deterministic; the LLM only ever phrased the message that already landed.
 */
export function PlanPanel({
  goal,
  profile,
  messages,
  onSimulate,
}: {
  goal: Goal;
  profile: SpendingProfile | null;
  messages: NudgeMessage[];
  onSimulate: () => void;
}) {
  const p = projectGoal(goal);
  const status = goalStatus(goal);
  const [openId, setOpenId] = useState<string | null>(null);

  // One-tap fixes drawn from the user's ACTUAL discretionary spending (their
  // transactions), falling back to demo buckets if the profile isn't loaded yet.
  const cats = profile ? discretionaryCategories(profile) : seedCategories;
  const options = recoveryOptions(goal, cats.length ? cats : seedCategories).slice(0, 4);

  const deadline = new Date(goal.deadline).toLocaleDateString("en-AU", {
    day: "numeric",
    month: "short",
  });
  const projDate = new Date(p.projectedDate).toLocaleDateString("en-AU", {
    day: "numeric",
    month: "short",
  });

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2 border-b border-neutral-200 px-5 py-3.5">
        <LogoMark size={26} />
        <div>
          <div className="text-sm font-bold leading-tight">Your plan</div>
          <div className="text-[11px] text-neutral-400">Knodle keeps you to your word</div>
        </div>
      </div>

      <div className="no-scrollbar flex-1 space-y-4 overflow-y-auto p-4">
        {/* ── vision banner: the thing you're saving for ── */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-lime via-lime-500 to-lime-600 p-4">
          <div className="absolute -right-3 -top-4 select-none text-8xl opacity-30">
            {goal.emoji ?? "🎯"}
          </div>
          <div className="relative">
            <div className="text-[11px] font-semibold uppercase tracking-widest text-black/60">
              Eyes on the prize
            </div>
            <div className="mt-1 flex items-center gap-2 text-2xl font-bold text-black">
              <span>{goal.emoji ?? "🎯"}</span> {goal.name}
            </div>
            <div className="tabular mt-1 text-sm font-medium text-black/70">
              {money(goal.saved)} of {money(goal.target)} · {status.pctComplete}%
            </div>
          </div>
        </div>

        {/* ── deviation status ── */}
        {p.onTrack ? (
          <div className="rounded-2xl border border-lime-600 bg-lime/15 p-4">
            <div className="text-sm font-bold">✅ On track</div>
            <p className="mt-1 text-sm text-neutral-700">
              Landing in <b>{p.weeksPlanned} weeks</b>, by ~{deadline}. Keep saving{" "}
              {money(p.requiredWeekly)}/week.
            </p>
          </div>
        ) : (
          <div className="rounded-2xl border-2 border-black bg-black p-4 text-white">
            <div className="flex items-center gap-2 text-sm font-bold text-lime">
              ⚠️ You've slipped {p.extraWeeks} {p.extraWeeks === 1 ? "week" : "weeks"}
            </div>
            <div className="mt-3 flex items-center gap-3">
              <TimeChip label="Planned" value={`${p.weeksPlanned} wks`} sub={deadline} muted />
              <span className="text-neutral-500">→</span>
              <TimeChip label="Now tracking" value={`${p.projectedWeeks} wks`} sub={projDate} />
            </div>
            <p className="mt-3 text-xs text-neutral-400">
              {money(p.overspend)} of extra spending pushed {goal.name} past your deadline.
            </p>
          </div>
        )}

        {/* ── one-tap get-back-on-track actions ── */}
        <div>
          <div className="mb-2 text-[11px] font-semibold uppercase tracking-widest text-neutral-400">
            Get back on track
          </div>
          <div className="space-y-2">
            {options.map((o) => {
              const id = `${o.categoryId}-${o.cut}`;
              const open = openId === id;
              return (
                <div key={id} className="overflow-hidden rounded-xl border border-neutral-200">
                  <button
                    onClick={() => setOpenId(open ? null : id)}
                    className="flex w-full items-center gap-2.5 px-3 py-2.5 text-left transition hover:bg-neutral-50"
                  >
                    <span className="text-lg">{o.emoji}</span>
                    <span className="flex-1 text-sm font-semibold">
                      {o.cut === "all" ? "Cut" : "Halve"} {o.label.toLowerCase()}
                    </span>
                    <span className="tabular rounded-full bg-lime/25 px-2 py-0.5 text-[11px] font-bold text-neutral-700">
                      +{money(o.freedPerWeek)}/wk
                    </span>
                  </button>
                  {open && (
                    <div className="animate-fade-up border-t border-neutral-100 bg-neutral-50 px-3 py-3 text-sm">
                      {p.extraWeeks > 0 ? (
                        <p>
                          {o.cut === "all" ? "Cutting" : "Halving"} <b>{o.label.toLowerCase()}</b> frees{" "}
                          <b>{money(o.freedPerWeek)}/week</b>. Put that straight on {goal.name} and you
                          claw back your {p.extraWeeks}-week slip in{" "}
                          <b>
                            ~{o.weeksToRecover} {o.weeksToRecover === 1 ? "week" : "weeks"}
                          </b>
                          {o.clearsSlip ? " — you're back on pace immediately." : "."}
                        </p>
                      ) : (
                        <p>
                          {o.cut === "all" ? "Cutting" : "Halving"} <b>{o.label.toLowerCase()}</b> banks an
                          extra <b>{money(o.freedPerWeek)}/week</b> toward {goal.name} — you'd finish
                          ahead of {deadline}.
                        </p>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* ── messages Knodle has sent ── */}
        <div>
          <div className="mb-2 text-[11px] font-semibold uppercase tracking-widest text-neutral-400">
            Messages from Knodle
          </div>
          {messages.length === 0 ? (
            <div className="rounded-xl border border-dashed border-neutral-200 p-4 text-center text-sm text-neutral-400">
              No nudges yet. Simulate a purchase and Knodle will text you.
            </div>
          ) : (
            <div className="space-y-2">
              {messages.map((m) => (
                <div key={m.id} className="flex gap-2">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-lime text-base">
                    {goal.emoji ?? "🎯"}
                  </div>
                  <div className="flex-1 rounded-2xl rounded-tl-sm border border-neutral-200 bg-white p-3">
                    <p className="text-[13px] leading-snug">{m.text}</p>
                    <div className="mt-1.5 text-[10px] text-neutral-400">
                      {m.sent ? "Sent via SMS" : "On-screen preview"} · triggered by {money(m.amount)} spend
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="border-t border-neutral-200 p-3">
        <button
          onClick={onSimulate}
          className="w-full rounded-xl bg-lime px-4 py-3 text-sm font-bold text-black transition hover:brightness-95"
        >
          Simulate a purchase →
        </button>
      </div>
    </div>
  );
}

function TimeChip({
  label,
  value,
  sub,
  muted,
}: {
  label: string;
  value: string;
  sub: string;
  muted?: boolean;
}) {
  return (
    <div className={`flex-1 rounded-xl px-3 py-2 ${muted ? "bg-neutral-800" : "bg-lime text-black"}`}>
      <div className={`text-[9px] uppercase tracking-wide ${muted ? "text-neutral-400" : "text-black/60"}`}>
        {label}
      </div>
      <div className="tabular text-base font-bold leading-tight">{value}</div>
      <div className={`text-[10px] ${muted ? "text-neutral-500" : "text-black/60"}`}>{sub}</div>
    </div>
  );
}
