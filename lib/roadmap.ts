import type { Goal } from "./types";
import { goalStatus, projectGoal } from "./savings";
import type { SpendingProfile } from "./insights";

/**
 * The weekly savings roadmap. Combines the deterministic goal math with the
 * user's real spending profile (from their transactions) to answer: how much do
 * I put away each week, can I actually afford it, and if not, what do I trim?
 */

const MS_PER_WEEK = 6.048e8;
const MAX_WEEKS_SHOWN = 16;

export interface RoadmapWeek {
  index: number;
  date: string; // ISO — end of that week
  target: number; // save this much this week
  cumulative: number; // projected total saved by end of week
  status: "current" | "upcoming";
}

export interface RoadmapTrim {
  label: string;
  emoji: string;
  from: number; // current weekly spend on this category
  to: number; // suggested weekly spend
  saves: number; // from - to
}

export interface Roadmap {
  weeklyTarget: number; // required weekly saving to hit the deadline
  weeksLeft: number;
  weeksShown: number; // capped for the UI
  savable: number; // sustainable weekly saving from transactions
  effectiveSavable: number; // savable minus the drag from recent overspend
  buffer: number; // effectiveSavable - weeklyTarget (negative = short)
  achievable: boolean;
  gap: number; // max(0, weeklyTarget - effectiveSavable)
  weeks: RoadmapWeek[];
  trim: RoadmapTrim | null;
  windowWeeks: number;
  txnCount: number;
}

export function buildRoadmap(goal: Goal, profile: SpendingProfile): Roadmap {
  const { weeklyTarget, weeksLeft } = goalStatus(goal);
  const { overspend } = projectGoal(goal);

  // Recent one-off overspend drags on your sustainable pace, spread over the
  // weeks you have left to absorb it.
  const drag = weeksLeft > 0 ? Math.round(overspend / weeksLeft) : overspend;
  const savable = profile.weeklySavable;
  const effectiveSavable = savable - drag;
  const buffer = effectiveSavable - weeklyTarget;
  const gap = Math.max(0, -buffer);

  const weeksShown = Math.min(weeksLeft, MAX_WEEKS_SHOWN);
  const weeks: RoadmapWeek[] = [];
  let cumulative = goal.saved;
  for (let i = 1; i <= weeksShown; i++) {
    cumulative = Math.min(goal.target, cumulative + weeklyTarget);
    weeks.push({
      index: i,
      date: new Date(Date.now() + i * MS_PER_WEEK).toISOString(),
      target: weeklyTarget,
      cumulative,
      status: i === 1 ? "current" : "upcoming",
    });
  }

  // If short, propose trimming the biggest discretionary bucket just enough.
  let trim: RoadmapTrim | null = null;
  if (gap > 0) {
    const top = profile.categories.find((c) => c.discretionary && c.weekly > 0);
    if (top) {
      const to = Math.max(0, top.weekly - gap);
      trim = { label: top.label, emoji: top.emoji, from: top.weekly, to, saves: top.weekly - to };
    }
  }

  return {
    weeklyTarget,
    weeksLeft,
    weeksShown,
    savable,
    effectiveSavable,
    buffer,
    achievable: gap === 0,
    gap,
    weeks,
    trim,
    windowWeeks: profile.windowWeeks,
    txnCount: profile.txnCount,
  };
}
