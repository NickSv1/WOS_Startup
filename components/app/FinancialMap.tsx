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
import { buildGraph, buildPathLayout, type LayoutOptions } from "@/lib/layout";
import { buildGoalPath, weeksForGoal } from "@/lib/path";
import { ACCOUNT_META } from "@/lib/constants";
import { money } from "@/lib/format";
import { goalStatus, projectGoal } from "@/lib/savings";
import type { Account, Goal } from "@/lib/types";
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
};
type MilestoneData = { goal: Goal; selected: boolean };

const hidden = { opacity: 0 } as const;

function Handles() {
  return (
    <>
      <Handle type="target" position={Position.Left} style={hidden} isConnectable={false} />
      <Handle type="source" position={Position.Right} style={hidden} isConnectable={false} />
      <Handle type="target" position={Position.Top} style={hidden} isConnectable={false} />
      <Handle type="source" position={Position.Bottom} style={hidden} isConnectable={false} />
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
      className={`w-[172px] cursor-grab rounded-2xl border bg-white p-3 shadow-node transition active:cursor-grabbing ${
        data.selected ? "border-black ring-4 ring-lime" : "border-neutral-200"
      }`}
    >
      <Handles />
      <div className="flex items-center gap-2">
        <span className="text-base leading-none">{meta.emoji}</span>
        <span className="truncate text-[13px] font-semibold">{data.account.name}</span>
      </div>
      <div className="tabular mt-1.5 text-lg font-bold">{money(data.account.balance)}</div>
      <div className="mt-0.5 text-[10px] uppercase tracking-wide text-neutral-400">{meta.label}</div>
    </div>
  );
}

function GoalCard({ data }: NodeProps<Node<GoalData>>) {
  const s = goalStatus(data.goal);
  const p = projectGoal(data.goal);
  return (
    <div
      role="button"
      aria-label={`${data.goal.name} goal`}
      className={`w-[196px] cursor-grab rounded-2xl border-2 bg-black p-3 text-white shadow-node transition active:cursor-grabbing ${
        data.entering ? "node-enter" : ""
      } ${data.selected ? "border-lime ring-4 ring-lime/50" : p.onTrack ? "border-black" : "border-white/40"}`}
    >
      <Handles />
      <div className="flex items-center justify-between gap-2">
        <span className="truncate text-[13px] font-semibold">
          {data.goal.emoji ?? "🎯"} {data.goal.name}
        </span>
        <span
          className={`shrink-0 rounded-full px-1.5 py-0.5 text-[9px] font-bold ${
            p.onTrack ? "bg-lime text-black" : "bg-white text-black"
          }`}
        >
          {p.onTrack ? "ON TRACK" : `+${p.extraWeeks}W`}
        </span>
      </div>
      <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-neutral-800">
        <div className="h-full rounded-full bg-lime" style={{ width: `${s.pctComplete}%` }} />
      </div>
      <div className="tabular mt-2 flex items-baseline justify-between">
        <span className="text-lg font-bold text-lime">{money(data.goal.target)}</span>
        <span className="text-[10px] text-neutral-400">
          {s.pctComplete}% · {p.onTrack ? `${p.weeksPlanned}w` : `${p.projectedWeeks}w`}
        </span>
      </div>
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
      className={`flex h-[52px] w-[52px] cursor-grab flex-col items-center justify-center rounded-full border-2 bg-white text-[10px] font-bold shadow-node ${
        data.entering ? "node-enter" : ""
      } ${data.slipped ? "border-black bg-black text-lime" : "border-neutral-300 text-neutral-700"}`}
      title={`${data.sub ?? data.label} · ${money(data.cumulative)} saved`}
    >
      <Handles />
      <span>{data.label}</span>
    </div>
  );
}

function MilestoneNode({ data }: NodeProps<Node<MilestoneData>>) {
  return (
    <div
      className={`w-[160px] cursor-grab rounded-2xl border bg-white px-3 py-2.5 shadow-node ${
        data.selected ? "border-black ring-4 ring-lime" : "border-neutral-200"
      }`}
    >
      <Handles />
      <div className="truncate text-[12px] font-semibold">
        {data.goal.emoji ?? "🎯"} {data.goal.name}
      </div>
      <div className="tabular text-[11px] text-neutral-500">{money(data.goal.target)}</div>
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

function buildRf(
  accounts: Account[],
  goals: Goal[],
  netWorth: number,
  userName: string,
  selectedId: string | null,
  weeklySavable: number,
  enteringIds: Set<string>,
  opts?: LayoutOptions,
): { nodes: Node[]; edges: Edge[] } {
  const pathGoal = goals.find((g) => g.id === selectedId);
  if (pathGoal) {
    const beads = buildGoalPath(pathGoal, goals, weeklySavable);
    const g = buildPathLayout(beads);
    const slipped = !projectGoal(pathGoal).onTrack;
    const nodes: Node[] = g.nodes.map((n) => {
      const selected = n.id === selectedId;
      const entering = enteringIds.has(n.id);
      const base = { id: n.id, position: { x: n.x, y: n.y }, draggable: true };
      if (n.kind === "you") {
        return { ...base, type: "you", data: { netWorth, name: userName, selected: selectedId === "you" } };
      }
      if (n.kind === "week") {
        return {
          ...base,
          type: "week",
          data: {
            label: n.bead?.label ?? "W",
            sub: n.bead?.sub,
            cumulative: n.bead?.cumulative ?? 0,
            slipped,
            entering,
          },
        };
      }
      if (n.kind === "milestone" && n.goal) {
        return { ...base, type: "milestone", data: { goal: n.goal, selected } };
      }
      return { ...base, type: "goal", data: { goal: n.goal ?? pathGoal, selected: true, entering } };
    });
    const edges: Edge[] = g.edges.map((e) => ({
      id: e.id,
      source: e.source,
      target: e.target,
      animated: true,
      style: { stroke: "#93d637", strokeWidth: 2.4 },
    }));
    return { nodes, edges };
  }

  const g = buildGraph(accounts, goals, opts);
  const nodes: Node[] = g.nodes.map((n) => {
    const selected = n.id === selectedId;
    const entering = enteringIds.has(n.id);
    const base = { id: n.id, position: { x: n.x, y: n.y }, draggable: true };
    if (n.kind === "you") return { ...base, type: "you", data: { netWorth, name: userName, selected } };
    if (n.kind === "add") return { ...base, type: "add", data: { selected } };
    if (n.kind === "goal" && n.goal) {
      return { ...base, type: "goal", data: { goal: n.goal, selected, entering } };
    }
    return { ...base, type: "account", data: { account: n.account as Account, selected } };
  });
  const edges: Edge[] = g.edges.map((e) => ({
    id: e.id,
    source: e.source,
    target: e.target,
    label: e.label,
    animated: e.target.startsWith("goal"),
    selected: e.source === selectedId || e.target === selectedId,
    style: e.target.startsWith("goal") ? { stroke: "#93d637", strokeWidth: 2 } : undefined,
  }));
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
}) {
  const { fitView } = useReactFlow();
  const enteringRef = useRef<Set<string>>(new Set());
  const prevGoalIds = useRef<Set<string>>(new Set(goals.map((g) => g.id)));
  const prevWeekKey = useRef("");
  const [enteringIds, setEnteringIds] = useState<Set<string>>(new Set());

  const weekKey = useMemo(() => {
    const g = goals.find((x) => x.id === selectedId);
    if (!g) return "";
    return `${g.id}:${weeksForGoal(g, weeklySavable)}:${g.discretionaryOverspend ?? 0}`;
  }, [goals, selectedId, weeklySavable]);

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
    if (!weekKey || !prevWeekKey.current) {
      prevWeekKey.current = weekKey;
      return;
    }
    if (weekKey !== prevWeekKey.current && selectedId) {
      prevWeekKey.current = weekKey;
      // New week beads get the pop animation via id change + entering set on last beads.
      const g = goals.find((x) => x.id === selectedId);
      if (g) {
        const beads = buildGoalPath(g, goals, weeklySavable).filter((b) => b.kind === "week");
        const last = beads[beads.length - 1];
        if (last) {
          setEnteringIds(new Set([last.id]));
          const t = setTimeout(() => setEnteringIds(new Set()), 700);
          return () => clearTimeout(t);
        }
      }
    }
    prevWeekKey.current = weekKey;
  }, [weekKey, selectedId, goals, weeklySavable]);

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
      ),
    [accounts, goals, netWorth, userName, selectedId, weeklySavable, enteringIds],
  );

  const [nodes, setNodes, onNodesChange] = useNodesState<Node>(graph.nodes);
  const [edges, setEdges] = useEdgesState<Edge>(graph.edges);
  const [reorganizing, setReorganizing] = useState(false);
  const reorgRef = useRef(reorgSignal);

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
      selectedId ? undefined : layout,
    );

    setNodes((prev) => {
      const byId = new Map(prev.map((n) => [n.id, n]));
      return next.nodes.map((t) => {
        if (isReorg || selectedId) return t;
        const existing = byId.get(t.id);
        return existing ? { ...t, position: existing.position } : t;
      });
    });
    setEdges(next.edges);

    const fit = setTimeout(() => fitView({ padding: 0.28, duration: 550 }), 40);
    if (isReorg) {
      setReorganizing(true);
      const timer = setTimeout(() => setReorganizing(false), 850);
      return () => {
        clearTimeout(timer);
        clearTimeout(fit);
      };
    }
    return () => clearTimeout(fit);
  }, [
    accounts,
    goals,
    netWorth,
    userName,
    selectedId,
    weeklySavable,
    enteringIds,
    reorgSignal,
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
        fitViewOptions={{ padding: 0.28 }}
        minZoom={0.35}
        maxZoom={1.6}
        nodesDraggable
        nodesConnectable={false}
        elementsSelectable
        proOptions={{ hideAttribution: true }}
        style={{ background: "transparent" }}
      >
        <Controls showInteractive={false} />
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
}) {
  return (
    <div className="relative h-full w-full">
      <InteractiveDots className="pointer-events-none absolute inset-0 z-0 h-full w-full" />
      <ReactFlowProvider>
        <MapCanvas {...props} reorgSignal={props.reorgSignal ?? 0} />
      </ReactFlowProvider>
    </div>
  );
}
