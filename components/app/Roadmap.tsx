"use client";

import { buildRoadmap } from "@/lib/roadmap";
import type { SpendingProfile } from "@/lib/insights";
import { money } from "@/lib/format";
import type { Goal } from "@/lib/types";

/**
 * The weekly savings roadmap — how much to put away each week, whether the
 * user's real spending can sustain it, and the one trim that closes any gap.
 */
export function Roadmap({ goal, profile }: { goal: Goal; profile: SpendingProfile | null }) {
  if (!profile) {
    return (
      <div className="rounded-2xl border border-neutral-200 p-4 text-sm text-neutral-400">
        Reading your transactions…
      </div>
    );
  }

  const r = buildRoadmap(goal, profile);

  return (
    <div className="space-y-3">
      {/* capacity — derived from real transactions */}
      <div
        className={`rounded-2xl border p-4 ${
          r.achievable ? "border-lime-600 bg-lime/15" : "border-black bg-black text-white"
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold uppercase tracking-widest opacity-70">
            {r.achievable ? "You can afford this" : "You're short"}
          </span>
          <span className="text-[10px] opacity-60">
            from {r.txnCount} txns · {r.windowWeeks}w
          </span>
        </div>
        <div className="mt-2 grid grid-cols-3 gap-2 text-center">
          <Mini label="Save / wk" value={money(r.weeklyTarget)} strong />
          <Mini label="You can save" value={money(Math.max(0, r.effectiveSavable))} />
          <Mini
            label={r.achievable ? "Buffer" : "Gap"}
            value={`${r.achievable ? "+" : "−"}${money(Math.abs(r.buffer))}`}
          />
        </div>
        <p className="mt-3 text-xs opacity-80">
          {r.achievable ? (
            <>
              Your income minus your usual spending leaves about{" "}
              <b>{money(r.effectiveSavable)}/week</b> — enough for the {money(r.weeklyTarget)} you
              need, with {money(r.buffer)} to spare.
            </>
          ) : (
            <>
              At your current pace you can spare about <b>{money(Math.max(0, r.effectiveSavable))}/week</b>,
              {" "}
              {money(r.gap)} short of target.
            </>
          )}
        </p>
      </div>

      {/* the trim that closes the gap — straight from their spending */}
      {r.trim && (
        <div className="rounded-2xl border border-neutral-200 p-3">
          <div className="text-[11px] font-semibold uppercase tracking-widest text-neutral-400">
            Close the gap
          </div>
          <div className="mt-2 flex items-center gap-2.5">
            <span className="text-xl">{r.trim.emoji}</span>
            <div className="flex-1 text-sm">
              Trim <b>{r.trim.label.toLowerCase()}</b> from {money(r.trim.from)} to{" "}
              {money(r.trim.to)}/week
            </div>
            <span className="tabular rounded-full bg-lime/25 px-2 py-0.5 text-[11px] font-bold text-neutral-700">
              +{money(r.trim.saves)}/wk
            </span>
          </div>
        </div>
      )}

      {/* cumulative chart */}
      <RoadmapChart goal={goal} weeks={r.weeks} />

      {/* week-by-week */}
      <div className="rounded-2xl border border-neutral-200">
        {r.weeks.slice(0, 6).map((w) => (
          <div
            key={w.index}
            className={`flex items-center justify-between border-b border-neutral-100 px-3 py-2.5 last:border-b-0 ${
              w.status === "current" ? "bg-lime/10" : ""
            }`}
          >
            <div className="flex items-center gap-2.5">
              <span
                className={`flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-bold ${
                  w.status === "current" ? "bg-lime text-black" : "bg-neutral-100 text-neutral-500"
                }`}
              >
                {w.index}
              </span>
              <div>
                <div className="text-[13px] font-medium">
                  Week {w.index}
                  {w.status === "current" && (
                    <span className="ml-1.5 text-[10px] font-semibold text-lime-600">THIS WEEK</span>
                  )}
                </div>
                <div className="text-[10px] text-neutral-400">
                  by {new Date(w.date).toLocaleDateString("en-AU", { day: "numeric", month: "short" })}
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="tabular text-sm font-bold">+{money(w.target)}</div>
              <div className="tabular text-[10px] text-neutral-400">{money(w.cumulative)} saved</div>
            </div>
          </div>
        ))}
        {r.weeksLeft > r.weeksShown && (
          <div className="px-3 py-2 text-center text-[11px] text-neutral-400">
            + {r.weeksLeft - r.weeksShown} more weeks to {money(goal.target)}
          </div>
        )}
      </div>

      {/* where the money goes — the transaction context */}
      <div>
        <div className="mb-1.5 text-[11px] font-semibold uppercase tracking-widest text-neutral-400">
          Where your money goes / week
        </div>
        <div className="space-y-1.5">
          {profile.categories.slice(0, 5).map((c) => {
            const max = profile.categories[0]?.weekly || 1;
            return (
              <div key={c.cat} className="flex items-center gap-2">
                <span className="w-5 text-center">{c.emoji}</span>
                <span className="w-28 truncate text-[12px]">{c.label}</span>
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-neutral-100">
                  <div
                    className={`h-full rounded-full ${c.discretionary ? "bg-lime-600" : "bg-neutral-400"}`}
                    style={{ width: `${Math.round((c.weekly / max) * 100)}%` }}
                  />
                </div>
                <span className="tabular w-12 text-right text-[12px] font-semibold">
                  {money(c.weekly)}
                </span>
              </div>
            );
          })}
        </div>
        <p className="mt-2 text-[10px] text-neutral-400">
          Lime = discretionary (trimmable). Grey = essentials.
        </p>
      </div>
    </div>
  );
}

function Mini({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div>
      <div className="text-[9px] uppercase tracking-wide opacity-60">{label}</div>
      <div className={`tabular ${strong ? "text-base font-bold" : "text-base font-semibold"}`}>
        {value}
      </div>
    </div>
  );
}

/** Cumulative savings line from now to the goal, with the target as the ceiling. */
function RoadmapChart({
  goal,
  weeks,
}: {
  goal: Goal;
  weeks: { index: number; cumulative: number; status: string }[];
}) {
  const W = 300;
  const H = 96;
  const pad = 4;
  const start = goal.saved;
  const top = goal.target;
  const range = Math.max(1, top - start);
  const n = weeks.length;

  const pts = [{ x: pad, y: H - pad }, // now (saved) at bottom-left
    ...weeks.map((w, i) => ({
      x: pad + ((i + 1) / n) * (W - 2 * pad),
      y: H - pad - ((w.cumulative - start) / range) * (H - 2 * pad),
    })),
  ];

  const line = pts.map((p) => `${p.x},${p.y}`).join(" ");
  const area = `${pad},${H - pad} ${line} ${pts[pts.length - 1].x},${H - pad}`;
  const current = pts[1];

  return (
    <div className="rounded-2xl border border-neutral-200 p-3">
      <div className="mb-1 flex items-center justify-between">
        <span className="text-[11px] font-semibold uppercase tracking-widest text-neutral-400">
          Path to {money(goal.target)}
        </span>
        <span className="text-[10px] text-neutral-400">{n} weeks</span>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" preserveAspectRatio="none" style={{ height: 96 }}>
        <line x1={pad} y1={pad} x2={W - pad} y2={pad} stroke="#e5e5e5" strokeDasharray="3 3" />
        <polygon points={area} fill="#c1ff72" fillOpacity="0.25" />
        <polyline points={line} fill="none" stroke="#93d637" strokeWidth="2.5" strokeLinejoin="round" />
        {current && <circle cx={current.x} cy={current.y} r="4" fill="#000" />}
      </svg>
      <div className="mt-1 flex justify-between text-[10px] text-neutral-400">
        <span>Now · {money(start)}</span>
        <span>Goal · {money(top)}</span>
      </div>
    </div>
  );
}
