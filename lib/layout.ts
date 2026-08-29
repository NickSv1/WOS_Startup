import type { Account, EdgeKind, Goal } from "./types";
import type { PathBead } from "./path";

/**
 * Deterministic layouts. Fixed positions, no physics — nodes must not jiggle
 * on stage. Same input always yields the same coordinates.
 *
 * Overview map is two rings around You:
 *   inner  — accounts (what makes up Hayley: spend, save, super, invest)
 *   outer  — goals (the things she's actually aiming at)
 */

export const CENTER = { x: 520, y: 360 };
const INNER_RADIUS = 205;
const OUTER_RADIUS = 470;

export const SIZE = {
  you: { w: 136, h: 136 },
  goal: { w: 148, h: 148 },
  account: { w: 132, h: 132 },
  add: { w: 72, h: 72 },
  week: { w: 52, h: 52 },
  milestone: { w: 120, h: 120 },
};

export type NodeKind = "you" | "goal" | "account" | "add" | "week" | "milestone";

export interface PositionedNode {
  id: string;
  kind: NodeKind;
  x: number;
  y: number;
  account?: Account;
  goal?: Goal;
  bead?: PathBead;
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  label?: EdgeKind | string;
}

function edgeKind(type: Account["type"]): EdgeKind {
  return type === "LOAN" ? "owes" : "owns";
}

const ACCOUNT_RING: Account["type"][] = [
  "BANK",
  "SAVINGS",
  "SUPER",
  "INVESTMENT",
  "PROPERTY",
  "LOAN",
];

function accountRank(type: Account["type"]): number {
  const i = ACCOUNT_RING.indexOf(type);
  return i === -1 ? 99 : i;
}

function around(
  count: number,
  radius: number,
  start: number,
  i: number,
): { x: number; y: number } {
  const step = (2 * Math.PI) / Math.max(1, count);
  const angle = start + step * i;
  return polar(radius, angle);
}

function polar(radius: number, angle: number): { x: number; y: number } {
  return {
    x: CENTER.x + radius * Math.cos(angle),
    y: CENTER.y + radius * Math.sin(angle),
  };
}

/** Sit outer nodes in the gaps between inner-ring accounts so spokes don't clip them. */
function inGap(
  innerCount: number,
  outerCount: number,
  radius: number,
  rotate: number,
  i: number,
): { x: number; y: number } {
  if (innerCount <= 0) {
    return around(outerCount, radius, -Math.PI / 2 + rotate, i);
  }
  const innerStep = (2 * Math.PI) / innerCount;
  const gap = i % innerCount;
  const rank = Math.floor(i / innerCount);
  const totalInGap = Math.ceil((outerCount - gap) / innerCount);
  const fan = totalInGap > 1 ? (rank - (totalInGap - 1) / 2) * 0.42 : 0;
  return polar(radius, -Math.PI / 2 + rotate + gap * innerStep + fan);
}

/**
 * Week beads shoot straight out of the goal, through its middle, to the right:
 *
 *   O----o--o--o--o
 */
export function timelineFromGoal(
  goalX: number,
  goalY: number,
  count: number,
  collapsed = false,
): { x: number; y: number }[] {
  if (count <= 0) return [];
  if (collapsed) {
    return Array.from({ length: count }, () => ({ x: goalX, y: goalY }));
  }
  const startX = goalX + SIZE.goal.w / 2 + SIZE.week.w / 2 + 18;
  const gap = 84;
  return Array.from({ length: count }, (_, i) => ({
    x: startX + gap * i,
    y: goalY,
  }));
}

export interface LayoutOptions {
  rotate?: number;
  order?: "seed" | "balance";
}

/** You in the middle, accounts close in, goals further out, plus an Add Goal node. */
export function buildGraph(
  accounts: Account[],
  goals: Goal[],
  opts: LayoutOptions = {},
) {
  const rotate = opts.rotate ?? 0;
  const inner = [...accounts].sort(
    (a, b) => accountRank(a.type) - accountRank(b.type) || a.name.localeCompare(b.name),
  );

  const nodes: PositionedNode[] = [];
  const edges: GraphEdge[] = [];

  nodes.push({
    id: "you",
    kind: "you",
    x: CENTER.x,
    y: CENTER.y,
  });

  const innerCount = inner.length;
  const innerStart = -Math.PI / 2 + (innerCount ? Math.PI / innerCount : 0) + rotate;

  inner.forEach((acc, i) => {
    const { x, y } = around(Math.max(1, innerCount), INNER_RADIUS, innerStart, i);
    nodes.push({
      id: acc.id,
      kind: "account",
      x,
      y,
      account: acc,
    });
    edges.push({
      id: `e-you-${acc.id}`,
      source: "you",
      target: acc.id,
      label: edgeKind(acc.type),
    });
  });

  const outerCount = Math.max(1, goals.length + 1);
  const outerRadius = OUTER_RADIUS + Math.max(0, goals.length - 5) * 24;

  goals.forEach((goal, i) => {
    const { x, y } = inGap(innerCount, outerCount, outerRadius, rotate, i);
    nodes.push({
      id: goal.id,
      kind: "goal",
      x,
      y,
      goal,
    });
    edges.push({
      id: `e-you-${goal.id}`,
      source: "you",
      target: goal.id,
      label: "contributes to",
    });
  });

  {
    const { x, y } = inGap(innerCount, outerCount, outerRadius, rotate, goals.length);
    nodes.push({
      id: "add-goal",
      kind: "add",
      x,
      y,
    });
    edges.push({
      id: "e-you-add-goal",
      source: "you",
      target: "add-goal",
      label: "contributes to",
    });
  }

  return { nodes, edges };
}

/** Horizontal stepping-stone path: You → o → o → o → goal. */
export function buildPathLayout(beads: PathBead[]) {
  const nodes: PositionedNode[] = [];
  const edges: GraphEdge[] = [];
  const gap = beads.length > 10 ? 92 : beads.length > 7 ? 112 : 128;
  const startX = CENTER.x - ((beads.length - 1) * gap) / 2;
  const y = CENTER.y;

  beads.forEach((bead, i) => {
    const cx = startX + i * gap;
    nodes.push({
      id: bead.id,
      kind: bead.kind,
      x: cx,
      y,
      goal: bead.goal,
      bead,
    });
    if (i > 0) {
      edges.push({
        id: `e-path-${beads[i - 1].id}-${bead.id}`,
        source: beads[i - 1].id,
        target: bead.id,
        label: bead.kind === "week" ? "" : undefined,
      });
    }
  });

  return { nodes, edges };
}
