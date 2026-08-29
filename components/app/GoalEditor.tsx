"use client";

import { useState } from "react";
import { goalStatus } from "@/lib/savings";
import { suggestedDeadline } from "@/lib/path";
import { money } from "@/lib/format";
import type { Goal } from "@/lib/types";

const EMOJIS = ["🏄", "🚐", "🎿", "🤿", "🎟️", "🎯", "✈️", "🏠", "💻"];

export function GoalEditor({
  mode = "edit",
  goal,
  weeklySavable,
  onSave,
  onClose,
}: {
  mode?: "edit" | "create";
  goal?: Goal | null;
  weeklySavable: number;
  onSave: (g: Goal) => void;
  onClose: () => void;
}) {
  const creating = mode === "create" || !goal;
  const [name, setName] = useState(goal?.name ?? "");
  const [description, setDescription] = useState(goal?.description ?? "");
  const [target, setTarget] = useState(goal ? String(goal.target) : "1000");
  const [emoji, setEmoji] = useState(goal?.emoji ?? "🏄");
  const remaining = Math.max(0, (Number(target) || 0) - (goal?.saved ?? 0));
  const autoDate = suggestedDeadline(remaining || Number(target) || 0, weeklySavable);
  const [deadline, setDeadline] = useState(goal?.deadline ?? autoDate);
  const [dateTouched, setDateTouched] = useState(Boolean(goal?.deadline) && !creating);
  const effectiveDeadline = creating && !dateTouched ? autoDate : deadline;

  const draft: Goal = {
    id: goal?.id ?? `goal-${Date.now()}`,
    name: name.trim() || "New goal",
    description: description.trim(),
    target: Number(target) || 0,
    saved: goal?.saved ?? 0,
    deadline: effectiveDeadline,
    savedThisWeek: goal?.savedThisWeek ?? 0,
    emoji,
    discretionaryOverspend: goal?.discretionaryOverspend ?? 0,
    completedAt: goal?.completedAt,
    weeklyBoost: goal?.weeklyBoost,
    appliedSwitchIds: goal?.appliedSwitchIds,
    swapPledges: goal?.swapPledges,
    slip: goal?.slip,
  };
  const preview = goalStatus(draft);
  const engineWeeks = Math.max(
    1,
    Math.ceil(remaining / Math.max(1, weeklySavable)),
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md animate-fade-up rounded-2xl bg-white p-6 shadow-node"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold">{creating ? "Add a goal" : "Edit goal"}</h2>
        <p className="mt-1 text-sm text-neutral-500">
          What it is, what it costs — Knodle works out when you can actually pay for it.
        </p>

        <div className="mt-5 space-y-4">
          <div className="flex flex-wrap gap-1.5">
            {EMOJIS.map((e) => (
              <button
                key={e}
                type="button"
                onClick={() => setEmoji(e)}
                className={`h-9 w-9 rounded-xl text-lg transition ${
                  emoji === e ? "bg-black" : "bg-neutral-100 hover:bg-neutral-200"
                }`}
              >
                {e}
              </button>
            ))}
          </div>
          <Field label="What is it?">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Channel Islands surfboard"
              autoFocus
              className="w-full rounded-xl border border-neutral-200 px-3 py-2.5 text-sm outline-none focus:border-black"
            />
          </Field>
          <Field label="A bit more">
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="6'2 twin fin for the next swell season."
              rows={2}
              className="w-full resize-none rounded-xl border border-neutral-200 px-3 py-2.5 text-sm outline-none focus:border-black"
            />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="How much ($)">
              <input
                type="number"
                inputMode="numeric"
                value={target}
                onChange={(e) => setTarget(e.target.value)}
                className="tabular w-full rounded-xl border border-neutral-200 px-3 py-2.5 text-sm outline-none focus:border-black"
              />
            </Field>
            <Field label="By when?">
              <input
                type="date"
                value={effectiveDeadline.slice(0, 10)}
                onChange={(e) => {
                  setDateTouched(true);
                  setDeadline(e.target.value);
                }}
                className="w-full rounded-xl border border-neutral-200 px-3 py-2.5 text-sm outline-none focus:border-black"
              />
            </Field>
          </div>
        </div>

        <div className="mt-5 rounded-2xl bg-black p-4 text-white">
          <div className="text-[11px] uppercase tracking-widest text-neutral-400">
            From your pay, bills and usual spend
          </div>
          <div className="tabular mt-1 text-2xl font-bold text-lime">
            {money(preview.weeklyTarget)}
            <span className="text-sm font-normal text-neutral-400">/week</span>
          </div>
          <p className="mt-1 text-xs text-neutral-400">
            You can currently spare about {money(weeklySavable)}/week — that&apos;s roughly{" "}
            {engineWeeks} {engineWeeks === 1 ? "week" : "weeks"} to {draft.name || "this"}.
          </p>
        </div>

        <div className="mt-5 flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 rounded-xl border border-neutral-300 py-2.5 text-sm font-semibold transition hover:bg-neutral-50"
          >
            Cancel
          </button>
          <button
            onClick={() => onSave(draft)}
            disabled={!name.trim() || !(Number(target) > 0)}
            className="flex-1 rounded-xl bg-lime py-2.5 text-sm font-bold text-black transition hover:brightness-95 disabled:opacity-40"
          >
            {creating ? "Add to the map" : "Save goal"}
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-neutral-400">
        {label}
      </span>
      {children}
    </label>
  );
}
