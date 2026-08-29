"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  ReactFlow,
  ReactFlowProvider,
  Controls,
  Handle,
  Position,
  useNodesState,
  useEdgesState,
  useReactFlow,
  type Node,
  type Edge,
  type NodeProps,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { buildGraph, timelineFromGoal, SIZE, type LayoutOptions } from "@/lib/layout";
import { weekBeadsForGoal, weeksForGoal } from "@/lib/path";
import { ACCOUNT_META } from "@/lib/constants";
import { money } from "@/lib/format";
import { goalBadge, goalStatus, isCompleted, projectGoal } from "@/lib/savings";
import type { Account, Goal } from "@/lib/types";
import { seedSpendSwitches } from "@/data/seed";
import { InteractiveDots } from "./InteractiveDots";
import { LogoMark } from "@/components/Logo";

type YouData = { netWorth: number; name: string; selected: boolean };
type AccountData = { account: Account; selected: boolean };
type GoalData = { goal: Goal; selected: boolean; entering?: boolean };
type AddData = { selected: boolean };
type WeekData = {
  label: string;
  sub?: string;
  cumulative: number;
  slipped?: boolean;
  entering?: boolean;
  leaving?: boolean;
  delay?: number;
};
type MilestoneData = { goal: Goal; selected: boolean };

const hiddenHandle = {
  opacity: 0,
  left: "50%",
  top: "50%",
  transform: "translate(-50%, -50%)",
  width: 1,
  height: 1,
  border: "none",
  pointerEvents: "none" as const,
};

function Handles() {
  return (
    <>
      <Handle type="target" position={Position.Top} style={hiddenHandle} isConnectable={false} />
      <Handle type="source" position={Position.Bottom} style={hiddenHandle} isConnectable={false} />
    </>
  );
}

function YouNode({ data }: NodeProps<Node<YouData>>) {
  return (
    <div
      className={`flex h-[136px] w-[136px] cursor-grab flex-col items-center justify-center rounded-full border bg-black text-white shadow-node transition active:cursor-grabbing ${
        data.selected ? "ring-4 ring-lime" : "border-black"
      }`}
    >
      <Handles />
      <LogoMark size={28} />
      <span className="mt-1 text-[11px] font-semibold uppercase tracking-widest text-neutral-400">
        {data.name}
      </span>
      <span className="tabular mt-0.5 text-lg font-bold text-lime">{money(data.netWorth)}</span>
    </div>
  );
}

function AccountNode({ data }: NodeProps<Node<AccountData>>) {
  const meta = ACCOUNT_META[data.account.type];
  return (
    <div
      className={`flex h-[132px] w-[132px] cursor-grab flex-col items-center justify-center rounded-full border bg-white px-3 text-center shadow-node transition active:cursor-grabbing ${
        data.selected ? "border-black ring-4 ring-lime" : "border-neutral-200"
      }`}
    >
      <Handles />
      <span className="text-lg leading-none">{meta.emoji}</span>
      <span className="mt-1 line-clamp-2 text-[12px] font-semibold leading-tight">{data.account.name}</span>
      <span className="tabular mt-1 text-base font-bold">{money(data.account.balance)}</span>
    </div>
  );
}

function GoalCard({ data }: NodeProps<Node<GoalData>>) {
  const s = goalStatus(data.goal);
  const p = projectGoal(data.goal);
  const badge = goalBadge(data.goal);
  const done = badge === "done";
  const slipped = badge === "off-track";

  return (
    <div
      role="button"
      aria-label={`${data.goal.name} goal`}
      id={data.goal.id === "goal-byron" ? "node-sydney" : undefined}
      className={`flex h-[148px] w-[148px] cursor-grab flex-col items-center justify-center rounded-full border-[3px] bg-black px-3 text-center text-white shadow-node transition active:cursor-grabbing ${
        data.entering ? "node-enter" : ""
      } ${slipped ? "node-slip" : ""} ${
        data.selected
          ? slipped
            ? "border-[#ff7a3d] ring-4 ring-[#ff7a3d]/45"
            : "border-lime ring-4 ring-lime/50"
          : done
            ? "border-lime"
            : slipped
              ? "border-[#ff7a3d]"
              : "border-lime/80"
      }`}
    >
      <Handles />
      <span className="text-lg leading-none">{data.goal.emoji ?? "🎯"}</span>
      <span className="mt-1 line-clamp-2 text-[11px] font-semibold leading-tight">
        {data.goal.name}
      </span>
      <span
        className={`mt-1.5 shrink-0 rounded-full px-1.5 py-0.5 text-[9px] font-bold ${
          done
            ? "bg-lime text-black"
            : p.onTrack
              ? "bg-lime text-black"
              : "bg-[#ff7a3d] text-black"
        }`}
      >
        {done ? "DONE" : p.onTrack ? "ON TRACK" : "FIX"}
      </span>
      <span className="tabular mt-1 text-sm font-bold text-lime">{money(data.goal.target)}</span>
      <span className="text-[9px] text-neutral-400">
        {done
          ? "Paid in full"
          : `${s.pctComplete}% · ${seedSpendSwitches.length} swaps`}
      </span>
    </div>
  );
}

function AddGoalNode({ data }: NodeProps<Node<AddData>>) {
  return (
    <div
      role="button"
      aria-label="Add a goal"
      className={`flex h-[72px] w-[72px] cursor-pointer flex-col items-center justify-center rounded-full border-2 border-dashed bg-white text-black shadow-node transition hover:border-black hover:bg-lime ${
        data.selected ? "border-black ring-4 ring-lime" : "border-neutral-300"
      }`}
    >
      <Handles />
      <span className="text-2xl font-light leading-none">+</span>
      <span className="mt-0.5 text-[9px] font-bold uppercase tracking-wide">Goal</span>
    </div>
  );
}

function WeekNode({ data }: NodeProps<Node<WeekData>>) {
  return (
    <div
      className={`flex h-[52px] w-[52px] cursor-grab flex-col items-center justify-center rounded-full border-2 text-[10px] font-bold shadow-node ${
        data.leaving ? "week-cut" : data.entering ? "node-enter" : ""
      } ${
        data.slipped
          ? `border-[#ff7a3d] bg-[#ff7a3d] text-black ${data.leaving ? "" : "node-slip"}`
          : "border-neutral-300 bg-white text-neutral-700"
      }`}
      style={data.delay && !data.leaving ? { animationDelay: `${data.delay}ms` } : undefined}
      title={`${data.sub ?? data.label} · ${money(data.cumulative)} saved`}
    >
      <Handles />
      <span>{data.label}</span>
    </div>
  );
}

function MilestoneNode({ data }: NodeProps<Node<MilestoneData>>) {
  const done = isCompleted(data.goal);
  return (
    <div
      className={`flex h-[120px] w-[120px] cursor-grab flex-col items-center justify-center rounded-full border px-2 text-center shadow-node ${
        done ? "border-lime bg-lime/20" : "border-neutral-200 bg-white"
      } ${data.selected ? "ring-4 ring-lime" : ""}`}
    >
      <Handles />
      <span className="text-base leading-none">{data.goal.emoji ?? "🎯"}</span>
      <span className="mt-1 line-clamp-2 text-[11px] font-semibold leading-tight">
        {data.goal.name}
      </span>
      {done ? (
        <span className="mt-1 rounded-full bg-black px-1.5 py-0.5 text-[8px] font-bold text-lime">
          DONE
        </span>
      ) : null}
      <span className="tabular mt-0.5 text-[11px] text-neutral-500">{money(data.goal.target)}</span>
    </div>
  );
}

const nodeTypes = {
  you: YouNode,
  account: AccountNode,
  goal: GoalCard,
  add: AddGoalNode,
  week: WeekNode,
  milestone: MilestoneNode,
};

function dim(kind: keyof typeof SIZE) {
  const s = SIZE[kind];
  return { width: s.w, height: s.h, style: { width: s.w, height: s.h } };
}

function straightEdge(
  e: { id: string; source: string; target: string },
  highlight: boolean,
  dimmed = false,
): Edge {
  return {
    id: e.id,
    source: e.source,
    target: e.target,
    type: "straight",
    animated: highlight && !dimmed,
    style: {
      stroke: dimmed ? "#e5e5e5" : highlight ? "#93d637" : "#d4d4d4",
      strokeWidth: highlight && !dimmed ? 2.4 : 1.5,
    },
  };
}

function buildRf(
  accounts: Account[],
  goals: Goal[],
  netWorth: number,
  userName: string,
  selectedId: string | null,
  weeklySavable: number,
  enteringIds: Set<string>,
  opts?: LayoutOptions,
  previewGoal?: Goal | null,
  pathReady = false,
  shoot = false,
): { nodes: Node[]; edges: Edge[] } {
  const g = buildGraph(accounts, goals, opts);
  const selectedGoal = goals.find((x) => x.id === selectedId) ?? null;
  const liveSelected =
    selectedGoal && !isCompleted(selectedGoal) ? (previewGoal ?? selectedGoal) : null;
  const weekBeads =
    liveSelected && pathReady ? weekBeadsForGoal(liveSelected, weeklySavable, 8) : [];
  const goalPos = liveSelected ? g.nodes.find((n) => n.id === liveSelected.id) : null;
  const spoke = goalPos
    ? timelineFromGoal(goalPos.x, goalPos.y, weekBeads.length, !shoot)
    : [];
  const plannedCount = weekBeads.filter((b) => !b.slip).length;

  const nodes: Node[] = g.nodes.map((n) => {
    const selected = n.id === selectedId;
    const entering = enteringIds.has(n.id);
    const base = { id: n.id, position: { x: n.x, y: n.y }, draggable: true };
    if (n.kind === "you") {
      return { ...base, ...dim("you"), type: "you", data: { netWorth, name: userName, selected: selectedId === "you" } };
    }
    if (n.kind === "add") {
      return { ...base, ...dim("add"), type: "add", data: { selected } };
    }
    if (n.kind === "goal" && n.goal) {
      const goal = n.id === liveSelected?.id ? liveSelected : n.goal;
      return { ...base, ...dim("goal"), type: "goal", data: { goal, selected, entering } };
    }
    return {
      ...base,
      ...dim("account"),
      type: "account",
      data: { account: n.account as Account, selected },
    };
  });

  weekBeads.forEach((bead, i) => {
    const pos = spoke[i];
    if (!pos) return;
    nodes.push({
      id: bead.id,
      ...dim("week"),
      type: "week",
      position: { x: pos.x, y: pos.y },
      draggable: true,
      zIndex: 4,
      data: {
        label: bead.label,
        sub: bead.sub,
        cumulative: bead.cumulative,
        slipped: Boolean(bead.slip),
        entering: enteringIds.has(bead.id),
        delay: bead.slip ? plannedCount * 70 + 160 : i * 70,
      },
    });
  });

  const weekIds = weekBeads.map((b) => b.id);
  const edges: Edge[] = g.edges.map((e) => {
    const isGoalSpoke = e.target.startsWith("goal") || e.target === "add-goal";
    const isSelectedGoal = Boolean(selectedGoal && e.target === selectedGoal.id);
    const dimmed = Boolean(selectedGoal && isGoalSpoke && !isSelectedGoal);
    return straightEdge(e, isGoalSpoke, dimmed);
  });

  if (liveSelected && weekIds.length && shoot) {
    weekBeads.forEach((bead, i) => {
      const source = i === 0 ? liveSelected.id : weekIds[i - 1];
      const edge = straightEdge(
        { id: `e-spoke-${source}-${bead.id}`, source, target: bead.id },
        true,
      );
      if (bead.slip) {
        edge.style = { ...edge.style, stroke: "#ff7a3d", strokeWidth: 2.4 };
        edge.animated = true;
      }
      edges.push(edge);
    });
  }

  return { nodes, edges };
}

function MapCanvas({
  accounts,
  goals,
  netWorth,
  userName,
  selectedId,
  weeklySavable,
  onSelect,
  onAddGoal,
  reorgSignal,
  previewGoal,
}: {
  accounts: Account[];
  goals: Goal[];
  netWorth: number;
  userName: string;
  selectedId: string | null;
  weeklySavable: number;
  onSelect: (id: string) => void;
  onAddGoal: () => void;
  reorgSignal: number;
  previewGoal?: Goal | null;
}) {
  const { fitView, setCenter, getNode } = useReactFlow();

  /** Park a goal in the middle of the map that’s actually visible — between the top chip and the swap sheet. */
  function panGoalIntoView(id: string, duration: number) {
    const node = getNode(id);
    const pane = document.querySelector(".react-flow") as HTMLElement | null;
    const h = pane?.clientHeight ?? 640;
    const zoom = 1.12;
    if (!node) {
      fitView({
        nodes: [{ id }],
        padding: { top: 0.14, bottom: 0.5, left: 0.22, right: 0.18 },
        duration,
        maxZoom: zoom,
      });
      return;
    }
    const dock = document.querySelector("[data-fix-dock]") as HTMLElement | null;
    const paneW = pane?.clientWidth ?? 960;
    const topChrome = 96;
    const dockH = dock ? Math.ceil(dock.getBoundingClientRect().height + 16) : 0;
    const dockW = dock ? Math.ceil(dock.getBoundingClientRect().width + 24) : 0;
    const visibleMidY = topChrome + (h - topChrome - Math.min(dockH, h * 0.2)) / 2;
    const visibleMidX = dockW + (paneW - dockW) / 2;
    const offsetY = (h / 2 - visibleMidY) / zoom;
    const offsetX = (paneW / 2 - visibleMidX) / zoom;
    setCenter(node.position.x + offsetX, node.position.y + offsetY, { zoom, duration });
  }

  function panTimeline(goalId: string, weekIds: string[], duration: number) {
    fitView({
      nodes: [{ id: goalId }, ...weekIds.map((id) => ({ id }))],
      padding: { top: 0.16, bottom: 0.22, left: 0.32, right: 0.1 },
      duration,
      maxZoom: 1.08,
    });
  }
  const enteringRef = useRef<Set<string>>(new Set());
  const prevGoalIds = useRef<Set<string>>(new Set(goals.map((g) => g.id)));
  const prevWeekKey = useRef("");
  const [enteringIds, setEnteringIds] = useState<Set<string>>(new Set());
  const [pathReady, setPathReady] = useState(false);
  const [shoot, setShoot] = useState(false);
  const accCountRef = useRef(0);
  const leavingRef = useRef<Node[]>([]);
  const leavingTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const weekKey = useMemo(() => {
    const g = previewGoal ?? goals.find((x) => x.id === selectedId);
    if (!g || isCompleted(g)) return "";
    return `${g.id}:${weeksForGoal(g, weeklySavable)}:${g.discretionaryOverspend ?? 0}:${g.weeklyBoost ?? 0}`;
  }, [goals, selectedId, weeklySavable, previewGoal]);

  useEffect(() => {
    const next = new Set(goals.map((g) => g.id));
    const fresh = [...next].filter((id) => !prevGoalIds.current.has(id));
    prevGoalIds.current = next;
    if (fresh.length) {
      enteringRef.current = new Set(fresh);
      setEnteringIds(new Set(fresh));
      const t = setTimeout(() => {
        enteringRef.current = new Set();
        setEnteringIds(new Set());
      }, 700);
      return () => clearTimeout(t);
    }
  }, [goals]);

  useEffect(() => {
    if (!weekKey || !pathReady) {
      if (!weekKey) prevWeekKey.current = weekKey;
      return;
    }
    const g = previewGoal ?? goals.find((x) => x.id === selectedId);
    if (!g || isCompleted(g)) return;
    const beads = weekBeadsForGoal(g, weeklySavable, 8);
    const ids = beads.map((b) => b.id);
    const isNewGoal = !prevWeekKey.current || prevWeekKey.current.split(":")[0] !== g.id;
    prevWeekKey.current = weekKey;
    const enter = isNewGoal ? ids : [];
    if (!enter.length) return;
    setEnteringIds(new Set(enter));
    const t = setTimeout(() => setEnteringIds(new Set()), 900);
    return () => clearTimeout(t);
  }, [weekKey, pathReady, selectedId, goals, weeklySavable, previewGoal]);

  const graph = useMemo(
    () =>
      buildRf(
        accounts,
        goals,
        netWorth,
        userName,
        selectedId,
        weeklySavable,
        enteringIds,
        undefined,
        previewGoal,
        pathReady,
        shoot,
      ),
    [accounts, goals, netWorth, userName, selectedId, weeklySavable, enteringIds, previewGoal, pathReady, shoot],
  );

  const [nodes, setNodes, onNodesChange] = useNodesState<Node>(graph.nodes);
  const [edges, setEdges] = useEdgesState<Edge>(graph.edges);
  const [reorganizing, setReorganizing] = useState(false);
  const reorgRef = useRef(reorgSignal);

  useEffect(() => {
    const isGoal = Boolean(selectedId?.startsWith("goal"));
    setPathReady(false);
    setShoot(false);
    if (!isGoal || !selectedId) {
      const fit = setTimeout(() => fitView({ padding: 0.22, maxZoom: 1, duration: 650 }), 40);
      return () => clearTimeout(fit);
    }
    const pan = setTimeout(() => panGoalIntoView(selectedId, 720), 40);
    const spawn = setTimeout(() => setPathReady(true), 720);
    return () => {
      clearTimeout(pan);
      clearTimeout(spawn);
    };
  }, [selectedId, fitView]);

  useEffect(() => {
    if (!pathReady || !selectedId) return;
    setShoot(false);
    setReorganizing(true);
    const kick = requestAnimationFrame(() => {
      requestAnimationFrame(() => setShoot(true));
    });
    return () => cancelAnimationFrame(kick);
  }, [pathReady, selectedId]);

  useEffect(() => {
    if (!shoot || !selectedId) return;
    const g = previewGoal ?? goals.find((x) => x.id === selectedId);
    const ids = g && !isCompleted(g) ? weekBeadsForGoal(g, weeklySavable, 8).map((b) => b.id) : [];
    const frame = setTimeout(() => panTimeline(selectedId, ids, 560), 90);
    const done = setTimeout(() => setReorganizing(false), 780);
    return () => {
      clearTimeout(frame);
      clearTimeout(done);
    };
  }, [shoot, selectedId, weekKey, previewGoal, goals, weeklySavable]);

  useEffect(() => {
    const isReorg = reorgSignal !== reorgRef.current;
    reorgRef.current = reorgSignal;
    const layout: LayoutOptions | undefined = isReorg
      ? { rotate: 0.35 * ((reorgSignal % 6) + 1), order: "balance" }
      : undefined;
    const next = buildRf(
      accounts,
      goals,
      netWorth,
      userName,
      selectedId,
      weeklySavable,
      enteringIds,
      selectedId && selectedId !== "you" ? undefined : layout,
      previewGoal,
      pathReady,
      shoot,
    );

    setNodes((prev) => {
      const byId = new Map(prev.map((n) => [n.id, n]));
      const nextIds = new Set(next.nodes.map((n) => n.id));
      const mapped = next.nodes.map((t) => {
        if (isReorg || t.type === "week") return t;
        const existing = byId.get(t.id);
        return existing ? { ...t, position: existing.position } : t;
      });
      const gone = prev.filter(
        (n) => n.type === "week" && !nextIds.has(n.id) && !(n.data as WeekData).leaving,
      );
      if (gone.length) {
        leavingRef.current = gone.map((n) => ({
          ...n,
          draggable: false,
          data: { ...(n.data as WeekData), leaving: true, entering: false },
        }));
        if (leavingTimer.current) clearTimeout(leavingTimer.current);
        leavingTimer.current = setTimeout(() => {
          leavingRef.current = [];
          setNodes((p) => p.filter((n) => !(n.data as WeekData | undefined)?.leaving));
        }, 720);
      }
      const stillLeaving = leavingRef.current.filter((n) => !nextIds.has(n.id));
      return [...mapped, ...stillLeaving];
    });
    setEdges(next.edges);

    if (isReorg) {
      setReorganizing(true);
      const fit = setTimeout(() => fitView({ padding: 0.22, maxZoom: 1, duration: 550 }), 40);
      const timer = setTimeout(() => setReorganizing(false), 850);
      return () => {
        clearTimeout(timer);
        clearTimeout(fit);
      };
    }
    if (accounts.length && accounts.length !== accCountRef.current) {
      accCountRef.current = accounts.length;
      if (!pathReady) {
        const fit = setTimeout(() => fitView({ padding: 0.22, maxZoom: 1, duration: 550 }), 40);
        return () => clearTimeout(fit);
      }
    }
  }, [
    accounts,
    goals,
    netWorth,
    userName,
    selectedId,
    weeklySavable,
    enteringIds,
    reorgSignal,
    previewGoal,
    pathReady,
    shoot,
    setNodes,
    setEdges,
    fitView,
  ]);

  return (
    <div className={`absolute inset-0 z-10 ${reorganizing ? "reorganizing" : ""}`}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        nodeTypes={nodeTypes}
        onNodeClick={(_, node) => {
          if (node.id === "add-goal") {
            onAddGoal();
            return;
          }
          if (node.type === "week") return;
          onSelect(node.id);
        }}
        onPaneClick={() => onSelect("you")}
        fitView
        fitViewOptions={{ padding: 0.22, maxZoom: 1 }}
        minZoom={0.35}
        maxZoom={1.8}
        nodeOrigin={[0.5, 0.5]}
        defaultEdgeOptions={{ type: "straight" }}
        nodesDraggable
        nodesConnectable={false}
        elementsSelectable
        proOptions={{ hideAttribution: true }}
        style={{ background: "transparent" }}
      >
        <Controls showInteractive={false} position="top-left" />
      </ReactFlow>
    </div>
  );
}

export function FinancialMap(props: {
  accounts: Account[];
  goals: Goal[];
  netWorth: number;
  userName: string;
  selectedId: string | null;
  weeklySavable: number;
  onSelect: (id: string) => void;
  onAddGoal: () => void;
  reorgSignal?: number;
  previewGoal?: Goal | null;
}) {
  return (
    <div className="relative h-full w-full" id="map">
      <InteractiveDots className="pointer-events-none absolute inset-0 z-0 h-full w-full" />
      <ReactFlowProvider>
        <MapCanvas {...props} reorgSignal={props.reorgSignal ?? 0} />
      </ReactFlowProvider>
    </div>
  );
}
