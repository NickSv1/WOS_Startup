import type { Goal } from "./types";
import { isCompleted, projectGoal } from "./savings";

const MAX_BEADS = 8;

export function orderedGoals(goals: Goal[]): Goal[] {
  return [...goals].sort((a, b) => +new Date(a.deadline) - +new Date(b.deadline));
}

/** Weeks until finish: plan to the deadline, plus any overspend slip. */
export function weeksForGoal(goal: Goal, _weeklySavable = 0): number {
  if (isCompleted(goal)) return 0;
  const p = projectGoal(goal);
  return Math.max(1, p.weeksPlanned + p.extraWeeks);
}

export function suggestedDeadline(remaining: number, weeklySavable: number): string {
  const weeks = Math.max(1, Math.ceil(Math.max(0, remaining) / Math.max(1, weeklySavable)));
  const d = new Date();
  d.setDate(d.getDate() + weeks * 7);
  return d.toISOString().slice(0, 10);
}

export interface PathBead {
  id: string;
  kind: "you" | "week" | "milestone" | "goal";
  label: string;
  sub?: string;
  cumulative: number;
  weeksCovered: number;
  goal?: Goal;
  /** True when this bead is the extra week(s) the slip added. */
  slip?: boolean;
}

export function weekBeadsForGoal(
  goal: Goal,
  _weeklySavable: number,
  maxBeads = MAX_BEADS,
): PathBead[] {
  if (isCompleted(goal)) return [];
  const remaining = Math.max(0, goal.target - goal.saved);
  if (remaining <= 0) return [];
  const p = projectGoal(goal);
  const planned = Math.max(1, p.weeksPlanned);
  const extra = Math.max(0, p.extraWeeks);
  const weeks = planned + extra;
  const chunks = compressWeeks(weeks, goal.id, maxBeads);
  const perWeek = remaining / Math.max(1, weeks);
  let running = goal.saved;
  let weekNo = 0;
  const slipFrom = chunks.length - extra;
  return chunks.map((chunk, i) => {
    weekNo += chunk.weeksCovered;
    running = Math.min(goal.target, goal.saved + perWeek * weekNo);
    const slip = extra > 0 && i >= Math.max(0, slipFrom);
    return {
      id: chunk.id,
      kind: "week" as const,
      label: slip
        ? extra === 1
          ? "+1w"
          : `+${weekNo - planned}w`
        : chunk.weeksCovered === 1
          ? `W${weekNo}`
          : `W${weekNo - chunk.weeksCovered + 1}–${weekNo}`,
      sub: slip ? "late" : `week ${weekNo}`,
      cumulative: Math.round(running),
      weeksCovered: chunk.weeksCovered,
      slip,
    };
  });
}

function compressWeeks(
  weeks: number,
  goalId: string,
  maxBeads = MAX_BEADS,
): { id: string; weeksCovered: number; label: string }[] {
  const n = Math.max(1, weeks);
  if (n <= maxBeads) {
    return Array.from({ length: n }, (_, i) => ({
      id: `week-${goalId}-${i + 1}`,
      weeksCovered: 1,
      label: `W${i + 1}`,
    }));
  }
  const size = Math.ceil(n / maxBeads);
  const beads: { id: string; weeksCovered: number; label: string }[] = [];
  let covered = 0;
  let i = 0;
  while (covered < n) {
    const chunk = Math.min(size, n - covered);
    beads.push({
      id: `week-${goalId}-${i + 1}`,
      weeksCovered: chunk,
      label: chunk === 1 ? `W${covered + 1}` : `W${covered + 1}–${covered + chunk}`,
    });
    covered += chunk;
    i += 1;
  }
  return beads;
}

/**
 * A linear path to `selected`: any earlier-deadline goals first (you have to
 * fund those before this one), then the week-beads the engine needs, then the
 * selected goal. Length grows when overspend pushes the finish out.
 */
export function buildGoalPath(
  selected: Goal,
  allGoals: Goal[],
  weeklySavable: number,
): PathBead[] {
  const live = allGoals.filter((g) => !isCompleted(g) || g.id === selected.id);
  const ordered = orderedGoals(live);
  const idx = ordered.findIndex((g) => g.id === selected.id);
  const sequence = idx >= 0 ? ordered.slice(0, idx + 1) : [selected];

  const beads: PathBead[] = [
    { id: "you", kind: "you", label: "You", cumulative: 0, weeksCovered: 0 },
  ];

  let weekNo = 0;

  for (const g of sequence) {
    const remaining = Math.max(0, g.target - g.saved);

    if (isCompleted(g) || remaining <= 0) {
      beads.push({
        id: g.id,
        kind: g.id === selected.id ? "goal" : "milestone",
        label: g.name,
        sub: g.emoji,
        cumulative: g.target,
        weeksCovered: 0,
        goal: g,
      });
      continue;
    }

    const weeks = weeksForGoal(g, weeklySavable);
    const chunks = compressWeeks(weeks, g.id);
    const perWeek = remaining / Math.max(1, weeks);
    let running = g.saved;
    let localWeeks = 0;

    for (const chunk of chunks) {
      localWeeks += chunk.weeksCovered;
      weekNo += chunk.weeksCovered;
      running = Math.min(g.target, g.saved + perWeek * localWeeks);
      beads.push({
        id: chunk.id,
        kind: "week",
        label:
          chunk.weeksCovered === 1
            ? `W${weekNo}`
            : `W${weekNo - chunk.weeksCovered + 1}–${weekNo}`,
        sub: `week ${weekNo}`,
        cumulative: Math.round(running),
        weeksCovered: chunk.weeksCovered,
      });
    }

    beads.push({
      id: g.id,
      kind: g.id === selected.id ? "goal" : "milestone",
      label: g.name,
      sub: g.emoji,
      cumulative: g.target,
      weeksCovered: 0,
      goal: g,
    });
  }

  return beads;
}
