import { clickDelayMs, cursorLeadMs } from "./motionTokens";

export const demoScript = [
  { id: "lock", target: "device-frame", zoom: 1, cursor: "idle", hold: 1600, caption: "It starts on your phone." },
  { id: "notif", target: "knodle-notif", zoom: 1, cursor: "knodle-notif", hover: true, hold: 2600, caption: "Knodle pings you when a goal slips." },
  { id: "openNotif", target: "knodle-notif", zoom: 1, cursor: "knodle-notif", click: true, advance: "OPEN_APP", hold: 2200, caption: "Tap through — into the map." },
  { id: "morph", target: "device-frame", zoom: 1, cursor: "idle", advance: "TO_DESKTOP", hold: 2400, caption: "Same map. Every screen." },
  { id: "establish", target: "map", zoom: 1.0, cursor: "idle", hold: 2000, caption: "Your whole money map, live." },
  { id: "account", target: "node-everyday", zoom: 1.32, cursor: "node-everyday", hover: true, hold: 1800, caption: "Connected straight to your bank." },
  { id: "openTxns", target: "node-everyday", zoom: 1.2, cursor: "node-everyday", click: true, advance: "VIEW_TXNS", hold: 700 },
  { id: "readTxns", target: "txns-panel", zoom: 1.12, cursor: "txns-panel", hold: 3000, caption: "Every transaction, categorised." },
  { id: "goals", target: "offtrack-alert", zoom: 1.16, cursor: "offtrack-alert", hover: true, advance: "TO_GOALS", hold: 2200, caption: "It keeps every goal on track." },
  { id: "toNode", target: "node-sydney", zoom: 1.22, cursor: "node-sydney", hover: true, hold: 2000, caption: "Sydney trip's slipped 2 weeks." },
  { id: "openNode", target: "sydney-timeline", zoom: 1.14, cursor: "node-sydney", click: true, advance: "SELECT_SYDNEY", hold: 1800, caption: "Tap the one that's off." },
  { id: "scan", target: "sydney-timeline", zoom: 1.08, cursor: "scan-panel", hold: 3400, caption: "Reading your recent spend…" },
  { id: "swaps", target: "sydney-timeline", zoom: 1.08, cursor: "swap-fix", hover: true, advance: "SCAN_DONE", hold: 2800, caption: "Cheaper swaps — same lifestyle." },
  { id: "apply", target: "swap-fix", zoom: 1.16, cursor: "swap-fix-apply", click: true, advance: "APPLY_SWAP", hold: 2800, caption: "One tap. The date's saved." },
  { id: "resolve", target: "map", zoom: 1.0, cursor: "idle", advance: "BACK_ON_TRACK", hold: 3200, caption: "Back on track — automatically." },
  { id: "loop", target: "device-frame", zoom: 1, cursor: "idle", advance: "RESET", hold: 1600 },
] as const;

export type DemoStep = (typeof demoScript)[number];
export type DemoAdvance =
  | "OPEN_APP"
  | "TO_DESKTOP"
  | "VIEW_TXNS"
  | "TO_GOALS"
  | "SELECT_SYDNEY"
  | "SCAN_DONE"
  | "APPLY_SWAP"
  | "BACK_ON_TRACK"
  | "RESET";
export type DemoPhase = "idle" | "txns" | "scanning" | "recommend" | "applied" | "onTrack";
export type DemoShell = "lock" | "app" | "desktop";

export function stepCaption(step: DemoStep): string | undefined {
  return "caption" in step ? step.caption : undefined;
}

export function phaseAfter(advances: readonly (DemoAdvance | undefined)[]): DemoPhase {
  let phase: DemoPhase = "idle";
  for (const a of advances) {
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
  let shell: DemoShell = "lock";
  for (const a of advances) {
    if (a === "OPEN_APP") shell = "app";
    if (a === "TO_DESKTOP") shell = "desktop";
    if (a === "RESET") shell = "lock";
  }
  return shell;
}

/** Weekly $ a fix adds back — used to animate the "+$/wk" and flip to on-track. */
export const FIX_SAVE = 25;

const CAMERA_MS = 420;
const MORPH_CAMERA_MS = 400;
const START_MS = 80;

export function stepRuntimeMs(step: DemoStep): number {
  const lead = cursorLeadMs;
  const cam = step.id === "morph" ? MORPH_CAMERA_MS : CAMERA_MS;
  const click = "click" in step && step.click ? clickDelayMs : 0;
  return lead + cam + click + step.hold;
}

/** One full play-through, excluding the silent loop reset. */
export function tourDurationMs(): number {
  return (
    START_MS +
    demoScript.filter((s) => s.id !== "loop").reduce((sum, s) => sum + stepRuntimeMs(s), 0)
  );
}
