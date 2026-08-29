import type { Goal } from "./types";
import { projectGoal } from "./savings";

const MAX_BEADS = 8;

export function orderedGoals(goals: Goal[]): Goal[] {
  return [...goals].sort((a, b) => +new Date(a.deadline) - +new Date(b.deadline));
}

/** Weeks of saving still required at this weekly pace, plus any overspend slip. */
export function weeksForGoal(goal: Goal, weeklySavable: number): number {
  const remaining = Math.max(0, goal.target - goal.saved);
  const pace = Math.max(1, Math.round(weeklySavable));
  const base = Math.max(1, Math.ceil(remaining / pace));
  return base + Math.max(0, projectGoal(goal).extraWeeks);
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
}

function compressWeeks(weeks: number, goalId: string): { id: string; weeksCovered: number; label: string }[] {
  const n = Math.max(1, weeks);
  if (n <= MAX_BEADS) {
    return Array.from({ length: n }, (_, i) => ({
      id: `week-${goalId}-${i + 1}`,
      weeksCovered: 1,
      label: `W${i + 1}`,
    }));
  }
  const size = Math.ceil(n / MAX_BEADS);
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
  const ordered = orderedGoals(allGoals);
  const idx = ordered.findIndex((g) => g.id === selected.id);
  const sequence = idx >= 0 ? ordered.slice(0, idx + 1) : [selected];

  const beads: PathBead[] = [
    { id: "you", kind: "you", label: "You", cumulative: 0, weeksCovered: 0 },
  ];

  let weekNo = 0;

  for (const g of sequence) {
    const weeks = weeksForGoal(g, weeklySavable);
    const remaining = Math.max(0, g.target - g.saved);
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
