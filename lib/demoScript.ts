export const demoScript = [
  {
    id: "establish",
    target: "map",
    zoom: 1.0,
    cursor: "idle",
    hold: 2400,
    caption: "Your accounts and goals — one map.",
  },
  {
    id: "toTxns",
    target: "node-everyday",
    zoom: 1.08,
    cursor: "node-everyday",
    hover: true,
    hold: 1600,
    caption: "Transaction, super, savings, investments.",
    frame: ["node-everyday", "node-super", "node-savings", "node-invest"],
  },
  {
    id: "clickTxns",
    target: "node-everyday",
    zoom: 1.08,
    cursor: "node-everyday",
    click: true,
    advance: "VIEW_TXNS",
    hold: 2600,
    caption: "Everyday — your transaction account.",
    frame: ["node-everyday", "txns-panel"],
  },
  {
    id: "closeTxns",
    target: "map",
    zoom: 1,
    cursor: "idle",
    advance: "TO_GOALS",
    hold: 800,
    caption: "Add a goal.",
  },
  {
    id: "toAdd",
    target: "goal-add",
    zoom: 1.12,
    cursor: "goal-add",
    hover: true,
    hold: 1400,
    caption: "Add a goal.",
    frame: ["goal-add"],
  },
  {
    id: "clickAdd",
    target: "goal-add",
    zoom: 1.12,
    cursor: "goal-add",
    click: true,
    advance: "ADD_GOAL",
    hold: 2000,
    caption: "Add a goal.",
    frame: ["goal-add", "node-new-goal", "van-cluster"],
  },
  {
    id: "showPlan",
    target: "van-cluster",
    zoom: 1.12,
    cursor: "week-4",
    hover: true,
    advance: "SHOW_PLAN",
    hold: 3200,
    caption: "Here's the week-by-week plan.",
    frame: ["node-new-goal", "week-plan", "van-cluster"],
  },
  {
    id: "toCommand",
    target: "command-bar",
    zoom: 1.08,
    cursor: "command-bar",
    hold: 800,
    caption: "Just tell it what's going on.",
    frame: ["command-bar", "van-cluster"],
  },
  {
    id: "type",
    target: "command-bar",
    zoom: 1.08,
    cursor: "command-bar",
    hold: 4300,
    caption: "Just tell it what's going on.",
    frame: ["command-bar", "van-cluster"],
  },
  {
    id: "think",
    target: "command-bar",
    zoom: 1.08,
    cursor: "command-bar",
    click: true,
    hold: 900,
    caption: "Just tell it what's going on.",
    frame: ["command-bar", "van-cluster"],
  },
  {
    id: "replan",
    target: "van-cluster",
    zoom: 1.12,
    cursor: "week-1",
    advance: "REPLAN",
    hold: 1800,
    caption: "It re-plans around your life.",
    frame: ["node-new-goal", "week-plan", "van-cluster"],
  },
  {
    id: "compress",
    target: "device-frame",
    zoom: 1,
    cursor: "idle",
    advance: "COMPRESS_TO_PHONE",
    hold: 1100,
    caption: "Knodle keeps you accountable.",
  },
  {
    id: "notif",
    target: "knodle-notif",
    zoom: 1,
    cursor: "knodle-notif",
    hover: true,
    advance: "PHONE_NOTIF",
    hold: 3000,
    caption: "Knodle keeps you accountable.",
  },
  {
    id: "tapNotif",
    target: "knodle-notif",
    zoom: 1,
    cursor: "knodle-notif",
    click: true,
    advance: "OPEN_APP",
    hold: 1800,
    caption: "Same map — every screen.",
  },
  {
    id: "stretch",
    target: "device-frame",
    zoom: 1,
    cursor: "idle",
    advance: "STRETCH_TO_DESKTOP",
    hold: 1100,
    caption: "Same map — every screen.",
  },
  {
    id: "toNode",
    target: "node-sydney",
    zoom: 1.12,
    cursor: "node-sydney",
    hover: true,
    hold: 1800,
    caption: "Sydney trip's slipped 2 weeks.",
    frame: ["sydney-cluster", "node-sydney", "sydney-timeline"],
  },
  {
    id: "openNode",
    target: "node-sydney",
    zoom: 1.12,
    cursor: "node-sydney",
    click: true,
    hold: 500,
    caption: "Tap the one that's off.",
    frame: ["sydney-cluster", "node-sydney", "sydney-timeline"],
  },
  {
    id: "scan",
    target: "scan-panel",
    zoom: 1.1,
    cursor: "scan-panel",
    mount: "SELECT_SYDNEY",
    hold: 3600,
    caption: "Reading your recent spend…",
    frame: ["sydney-cluster", "scan-panel", "node-sydney", "sydney-timeline"],
  },
  {
    id: "swaps",
    target: "swap-fix",
    zoom: 1.0,
    cursor: "swap-fix",
    hover: true,
    advance: "SCAN_DONE",
    hold: 2800,
    caption: "Cheaper swaps — same lifestyle.",
    frame: ["swap-panel", "node-sydney", "sydney-timeline"],
  },
  {
    id: "apply",
    target: "swap-fix-apply",
    zoom: 1.0,
    cursor: "swap-fix-apply",
    click: true,
    advance: "APPLY_SWAP",
    hold: 2800,
    caption: "One tap. The date's saved.",
    frame: ["swap-panel", "swap-fix-apply", "node-sydney"],
  },
  {
    id: "resolve",
    target: "map",
    zoom: 1.0,
    cursor: "idle",
    advance: "BACK_ON_TRACK",
    hold: 2800,
    caption: "Back on track.",
  },
  { id: "loop", target: "device-frame", zoom: 1, cursor: "idle", advance: "RESET", hold: 1400 },
] as const;

export type DemoStep = (typeof demoScript)[number];
export type DemoAdvance =
  | "ADD_GOAL"
  | "SHOW_PLAN"
  | "REPLAN"
  | "COMPRESS_TO_PHONE"
  | "PHONE_NOTIF"
  | "OPEN_APP"
  | "STRETCH_TO_DESKTOP"
  | "TO_DESKTOP"
  | "VIEW_TXNS"
  | "TO_GOALS"
  | "SELECT_SYDNEY"
  | "SCAN_DONE"
  | "APPLY_SWAP"
  | "BACK_ON_TRACK"
  | "RESET";
export type DemoPhase =
  | "idle"
  | "adding"
  | "plan"
  | "replan"
  | "txns"
  | "scanning"
  | "recommend"
  | "applied"
  | "onTrack";
export type DemoShell = "lock" | "app" | "desktop";

export function stepCaption(step: DemoStep): string | undefined {
  return "caption" in step ? step.caption : undefined;
}

export function stepFrame(step: DemoStep): readonly string[] {
  if ("frame" in step && step.frame) return step.frame;
  return [step.target];
}

export function stepMount(step: DemoStep): DemoAdvance | undefined {
  return "mount" in step ? step.mount : undefined;
}

export function phaseAfter(advances: readonly (DemoAdvance | undefined)[]): DemoPhase {
  let phase: DemoPhase = "idle";
  for (const a of advances) {
    if (a === "ADD_GOAL") phase = "adding";
    if (a === "SHOW_PLAN") phase = "plan";
    if (a === "REPLAN") phase = "replan";
    if (a === "STRETCH_TO_DESKTOP" || a === "TO_DESKTOP") {
      if (phase === "adding" || phase === "plan" || phase === "replan") phase = "idle";
    }
    if (a === "VIEW_TXNS") phase = "txns";
    if (a === "TO_GOALS") phase = "idle";
    if (a === "SELECT_SYDNEY") phase = "scanning";
    if (a === "SCAN_DONE") phase = "recommend";
    if (a === "APPLY_SWAP") phase = "applied";
    if (a === "BACK_ON_TRACK") phase = "onTrack";
    if (a === "RESET") phase = "idle";
  }
  return phase;
}

export function shellAfter(advances: readonly (DemoAdvance | undefined)[]): DemoShell {
  let shell: DemoShell = "desktop";
  for (const a of advances) {
    if (a === "COMPRESS_TO_PHONE") shell = "lock";
    if (a === "OPEN_APP") shell = "app";
    if (a === "STRETCH_TO_DESKTOP" || a === "TO_DESKTOP") shell = "desktop";
    if (a === "RESET") shell = "desktop";
  }
  return shell;
}

export const isMorphAdvance = (a?: DemoAdvance) =>
  a === "COMPRESS_TO_PHONE" || a === "STRETCH_TO_DESKTOP" || a === "TO_DESKTOP";

/** Weekly $ a fix adds back — used to animate the "+$/wk" and flip to on-track. */
export const FIX_SAVE = 25;

export const NEW_GOAL = {
  name: "Van trip",
  emoji: "🚐",
  target: 480,
  weeks: 8,
  flat: 60,
  /** First 3 down, last 3 up — still sums to $480. */
  replanned: [25, 25, 25, 55, 60, 90, 100, 100],
} as const;

export const COMMAND_TEXT = "I'm short on money for the first three weeks";

export function stepHold(step: DemoStep, compact = false): number {
  if (!compact) return step.hold;
  /** Record-mode dwells — short on setup/type/scan, long on GYG + promo. */
  const recordMs: Record<string, number> = {
    establish: 500,
    toTxns: 400,
    clickTxns: 450,
    closeTxns: 300,
    toAdd: 400,
    clickAdd: 550,
    showPlan: 900,
    toCommand: 300,
    type: 1450,
    think: 450,
    replan: 700,
    compress: 800,
    notif: 1100,
    tapNotif: 600,
    stretch: 800,
    toNode: 800,
    openNode: 350,
    scan: 1200,
    swaps: 2800,
    apply: 3200,
    resolve: 2200,
  };
  return recordMs[step.id] ?? Math.round(step.hold * 0.4);
}
