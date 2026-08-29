import type { Goal, SpendCategory, SpendSwitch, SwapPledge } from "./types";

/**
 * The savings engine is deterministic TypeScript. These numbers are the ONLY
 * source of truth for anything shown on screen or sent in a text — the LLM
 * never computes a dollar figure, it only phrases what this returns.
 */

const MS_PER_WEEK = 6.048e8; // 7 * 24 * 60 * 60 * 1000

export interface GoalStatus {
  weeksLeft: number;
  remaining: number;
  weeklyTarget: number;
  pctComplete: number;
}

export function isCompleted(g: Goal): boolean {
  return Boolean(g.completedAt) || g.saved >= g.target;
}

export function weeklySavingFromSwitch(sw: SpendSwitch): number {
  return Math.round(Math.max(0, sw.fromPrice - sw.toPrice) * sw.timesPerWeek);
}

export function percentOff(sw: SpendSwitch): number {
  if (sw.fromPrice <= 0) return 0;
  return Math.round((1 - sw.toPrice / sw.fromPrice) * 100);
}

export function applySpendSwitch(g: Goal, sw: SpendSwitch): Goal {
  if (g.appliedSwitchIds?.includes(sw.id)) return g;
  const now = new Date().toISOString();
  const pledges = (g.swapPledges ?? []).filter((p) => p.switchId !== sw.id);
  return {
    ...g,
    weeklyBoost: (g.weeklyBoost ?? 0) + weeklySavingFromSwitch(sw),
    appliedSwitchIds: [...(g.appliedSwitchIds ?? []), sw.id],
    swapPledges: [...pledges, { switchId: sw.id, status: "pledged", pledgedAt: now }],
  };
}

export function revertSpendSwitch(g: Goal, sw: SpendSwitch): Goal {
  if (!g.appliedSwitchIds?.includes(sw.id)) return g;
  return {
    ...g,
    weeklyBoost: Math.max(0, (g.weeklyBoost ?? 0) - weeklySavingFromSwitch(sw)),
    appliedSwitchIds: (g.appliedSwitchIds ?? []).filter((id) => id !== sw.id),
    swapPledges: (g.swapPledges ?? []).map((p) =>
      p.switchId === sw.id ? { ...p, status: "broken" as const } : p,
    ),
  };
}

export function markPledgeKept(g: Goal, switchId: string): Goal {
  return {
    ...g,
    swapPledges: (g.swapPledges ?? []).map((p) =>
      p.switchId === switchId ? { ...p, status: "kept" as const } : p,
    ),
  };
}

export function activePledge(g: Goal, switchId: string): SwapPledge | undefined {
  return g.swapPledges?.find((p) => p.switchId === switchId && p.status !== "broken");
}

export interface SwitchPreview {
  before: Projection;
  after: Projection;
  weeklySave: number;
  percentOff: number;
  restores: boolean;
  weeksSaved: number;
}

/** Before/after finish if this swap is locked in — used for proof, not the live goal. */
export function previewSpendSwitch(g: Goal, sw: SpendSwitch): SwitchPreview {
  const before = projectGoal(g);
  const after = projectGoal(applySpendSwitch(g, sw));
  return {
    before,
    after,
    weeklySave: weeklySavingFromSwitch(sw),
    percentOff: percentOff(sw),
    restores: after.onTrack && (!before.onTrack || after.projectedWeeks <= before.projectedWeeks),
    weeksSaved: Math.max(0, before.projectedWeeks - after.projectedWeeks),
  };
}

/** Whether this swap brings the finish back to (or before) the original deadline. */
export function switchRestoresDate(g: Goal, sw: SpendSwitch): boolean {
  return previewSpendSwitch(g, sw).after.onTrack;
}

export type GoalBadge = "done" | "on-track" | "off-track";

export function goalBadge(g: Goal): GoalBadge {
  if (isCompleted(g)) return "done";
  return projectGoal(g).onTrack ? "on-track" : "off-track";
}

export function goalStatus(g: Goal): GoalStatus {
  const weeksLeft = Math.max(
    1,
    Math.ceil((+new Date(g.deadline) - Date.now()) / MS_PER_WEEK),
  );
  const remaining = Math.max(0, g.target - g.saved);
  const weeklyTarget = remaining <= 0 ? 0 : Math.ceil(remaining / weeksLeft);
  const pctComplete = Math.min(100, Math.round((g.saved / g.target) * 100));
  return { weeksLeft, remaining, weeklyTarget, pctComplete };
}

/** How far short of this week's target the user currently is (0 = on track). */
export function behindBy(weeklyTarget: number, savedThisWeek: number): number {
  return Math.max(0, weeklyTarget - savedThisWeek);
}

/**
 * Weeks behind schedule: given a shortfall this week, roughly how many weeks of
 * the plan it eats. Deterministic and used for the "N weeks behind" line.
 */
export function weeksBehind(weeklyTarget: number, savedThisWeek: number): number {
  if (weeklyTarget <= 0) return 0;
  const shortfall = behindBy(weeklyTarget, savedThisWeek);
  return Math.round((shortfall / weeklyTarget) * 10) / 10;
}

export function isOnTrack(weeklyTarget: number, savedThisWeek: number): boolean {
  return behindBy(weeklyTarget, savedThisWeek) === 0;
}

/** Push a deadline out by N weeks (ISO date in, ISO date out). */
export function pushDeadline(iso: string, weeks: number): string {
  const d = new Date(iso);
  d.setDate(d.getDate() + Math.max(0, weeks) * 7);
  return d.toISOString().slice(0, 10);
}

/* ────────────────────────── deviation / projection ──────────────────────────
 * The heart of the product: when you overspend, the finish line moves. All of
 * this is deterministic — the numbers below are never touched by the LLM.
 */

export interface Projection {
  weeksPlanned: number; // weeks to the deadline
  requiredWeekly: number; // pace needed to hit the deadline
  overspend: number; // cumulative discretionary overspend
  extraWeeks: number; // weeks that overspend has cost you
  projectedWeeks: number; // when you'll actually finish, in weeks from now
  projectedDate: string; // ISO
  onTrack: boolean; // true when the finish still lands by the deadline
}

export function projectGoal(g: Goal): Projection {
  if (isCompleted(g)) {
    return {
      weeksPlanned: 0,
      requiredWeekly: 0,
      overspend: 0,
      extraWeeks: 0,
      projectedWeeks: 0,
      projectedDate: g.completedAt ?? g.deadline,
      onTrack: true,
    };
  }

  const { weeksLeft, weeklyTarget } = goalStatus(g);
  const overspend = Math.max(0, g.discretionaryOverspend ?? 0);
  const boost = Math.max(0, g.weeklyBoost ?? 0);
  // Boost is extra saved each remaining week — it eats the slip without moving the date.
  const netOverspend = Math.max(0, overspend - boost * weeksLeft);
  const extraWeeks =
    weeklyTarget <= 0 ? 0 : Math.round(netOverspend / weeklyTarget);
  const projectedWeeks = weeksLeft + extraWeeks;
  const projectedDate = new Date(Date.now() + projectedWeeks * MS_PER_WEEK).toISOString();
  return {
    weeksPlanned: weeksLeft,
    requiredWeekly: weeklyTarget,
    overspend,
    extraWeeks,
    projectedWeeks,
    projectedDate,
    onTrack: extraWeeks === 0,
  };
}

export interface RecoveryOption {
  categoryId: string;
  label: string;
  emoji: string;
  cut: "all" | "half";
  freedPerWeek: number; // extra dollars/week this cut frees up
  weeksToRecover: number; // weeks to claw back the whole slip at this rate
  clearsSlip: boolean; // does one week of this cut cover the current slip pace?
}

/**
 * The one-tap "get back on track" options that replace the chatbot. Each is a
 * concrete, pre-computed action: cut a category (fully or by half) and here's
 * exactly what it buys you.
 */
export function recoveryOptions(g: Goal, categories: SpendCategory[]): RecoveryOption[] {
  const { extraWeeks, requiredWeekly } = projectGoal(g);
  const overspend = Math.max(0, g.discretionaryOverspend ?? 0);
  const options: RecoveryOption[] = [];

  for (const c of categories) {
    for (const cut of ["all", "half"] as const) {
      const freedPerWeek = cut === "all" ? c.weekly : Math.round(c.weekly / 2);
      if (freedPerWeek <= 0) continue;
      const weeksToRecover = overspend > 0 ? Math.ceil(overspend / freedPerWeek) : 0;
      options.push({
        categoryId: c.id,
        label: c.label,
        emoji: c.emoji,
        cut,
        freedPerWeek,
        weeksToRecover,
        clearsSlip: freedPerWeek >= requiredWeekly && extraWeeks > 0,
      });
    }
  }

  // Most impactful first (biggest weekly saving), full cuts ahead of half cuts.
  return options.sort((a, b) => b.freedPerWeek - a.freedPerWeek);
}
