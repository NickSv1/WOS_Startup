import type { Account, EdgeKind, Goal } from "./types";
import type { PathBead } from "./path";

/**
 * Deterministic layouts. Fixed positions, no physics — nodes must not jiggle
 * on stage. Same input always yields the same coordinates.
 */

export const CENTER = { x: 520, y: 360 };
const RADIUS = 280;

const SIZE = {
  you: { w: 136, h: 136 },
  goal: { w: 196, h: 112 },
  account: { w: 172, h: 88 },
  add: { w: 72, h: 72 },
  week: { w: 52, h: 52 },
  milestone: { w: 160, h: 72 },
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

export interface LayoutOptions {
  rotate?: number;
  order?: "seed" | "balance";
}

/** You in the middle, assets + goals around you, plus an Add Goal node. */
export function buildGraph(
  accounts: Account[],
  goals: Goal[],
  opts: LayoutOptions = {},
) {
  const rotate = opts.rotate ?? 0;
  const ordered =
    opts.order === "balance"
      ? [...accounts].sort((a, b) => b.balance - a.balance)
      : accounts;

  const slots = ordered.length + goals.length + 1; // + add-goal
  const nodes: PositionedNode[] = [];
  const edges: GraphEdge[] = [];

  nodes.push({
    id: "you",
    kind: "you",
    x: CENTER.x - SIZE.you.w / 2,
    y: CENTER.y - SIZE.you.h / 2,
  });

  const step = (2 * Math.PI) / Math.max(1, slots);
  const start = -Math.PI / 2 + rotate;

  goals.forEach((goal, i) => {
    const angle = start + step * i;
    const cx = CENTER.x + RADIUS * Math.cos(angle);
    const cy = CENTER.y + RADIUS * Math.sin(angle);
    nodes.push({
      id: goal.id,
      kind: "goal",
      x: cx - SIZE.goal.w / 2,
      y: cy - SIZE.goal.h / 2,
      goal,
    });
    edges.push({
      id: `e-you-${goal.id}`,
      source: "you",
      target: goal.id,
      label: "contributes to",
    });
  });

  ordered.forEach((acc, i) => {
    const angle = start + step * (goals.length + i);
    const cx = CENTER.x + RADIUS * Math.cos(angle);
    const cy = CENTER.y + RADIUS * Math.sin(angle);
    nodes.push({
      id: acc.id,
      kind: "account",
      x: cx - SIZE.account.w / 2,
      y: cy - SIZE.account.h / 2,
      account: acc,
    });
    edges.push({
      id: `e-you-${acc.id}`,
      source: "you",
      target: acc.id,
      label: edgeKind(acc.type),
    });
  });

  {
    const angle = start + step * (goals.length + ordered.length);
    const cx = CENTER.x + RADIUS * Math.cos(angle);
    const cy = CENTER.y + RADIUS * Math.sin(angle);
    nodes.push({
      id: "add-goal",
      kind: "add",
      x: cx - SIZE.add.w / 2,
      y: cy - SIZE.add.h / 2,
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
  const gap = beads.length > 10 ? 78 : beads.length > 7 ? 96 : 118;
  const startX = 80;
  const y = CENTER.y;

  beads.forEach((bead, i) => {
    const wave = Math.sin(i * 0.7) * 28;
    const size =
      bead.kind === "you"
        ? SIZE.you
        : bead.kind === "week"
        ? SIZE.week
        : bead.kind === "milestone"
        ? SIZE.milestone
        : SIZE.goal;
    const cx = startX + i * gap + size.w / 2;
    const cy = y + wave;
    nodes.push({
      id: bead.id,
      kind: bead.kind,
      x: cx - size.w / 2,
      y: cy - size.h / 2,
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
