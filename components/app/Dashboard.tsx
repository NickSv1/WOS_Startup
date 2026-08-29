"use client";

import { LogoMark } from "@/components/Logo";
import { ACCOUNT_META } from "@/lib/constants";
import { money } from "@/lib/format";
import { goalStatus, projectGoal } from "@/lib/savings";
import type { Account, Goal } from "@/lib/types";

export type DashKey = "map" | "goals" | "nudges" | "settings";

const NAV: { key: DashKey; label: string; icon: React.ReactNode }[] = [
  { key: "map", label: "Map", icon: <IconMap /> },
  { key: "goals", label: "Goals", icon: <IconTarget /> },
  { key: "nudges", label: "Nudges", icon: <IconBell /> },
  { key: "settings", label: "Settings", icon: <IconSettings /> },
];

export function Dashboard({
  userName,
  accounts,
  goals,
  netWorth,
  selectedId,
  source,
  active,
  onNav,
  onSelect,
  onAddGoal,
}: {
  userName: string;
  accounts: Account[];
  goals: Goal[];
  netWorth: number;
  selectedId: string | null;
  source: "up" | "demo";
  active: DashKey;
  onNav: (key: DashKey) => void;
  onSelect: (id: string) => void;
  onAddGoal: () => void;
}) {
  return (
    <aside className="flex h-full w-[272px] shrink-0 flex-col border-r border-neutral-200 bg-white">
      <div className="flex items-center gap-2.5 border-b border-neutral-200 px-4 py-4">
        <LogoMark size={32} />
        <div className="min-w-0">
          <div className="text-sm font-bold leading-tight">Knodle</div>
          <div className="truncate text-[11px] text-neutral-400">{userName}&apos;s map</div>
        </div>
      </div>

      <nav className="grid grid-cols-2 gap-1.5 p-3">
        {NAV.map((item) => {
          const on = active === item.key;
          return (
            <button
              key={item.key}
              onClick={() => onNav(item.key)}
              className={`flex items-center gap-2 rounded-xl px-3 py-2.5 text-left text-[13px] font-semibold transition ${
                on ? "bg-black text-white" : "text-neutral-600 hover:bg-neutral-100"
              }`}
            >
              <span className="h-4 w-4">{item.icon}</span>
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="no-scrollbar min-h-0 flex-1 overflow-y-auto px-3 pb-2">
        <SectionLabel
          action={
            <button onClick={onAddGoal} className="text-[11px] font-bold text-neutral-500 hover:text-black">
              + Add
            </button>
          }
        >
          Goals
        </SectionLabel>
        <div className="space-y-1">
          {goals.map((g) => {
            const on = selectedId === g.id;
            const s = goalStatus(g);
            const p = projectGoal(g);
            return (
              <button
                key={g.id}
                onClick={() => onSelect(g.id)}
                className={`w-full rounded-xl border px-3 py-2.5 text-left transition ${
                  on ? "border-black bg-lime/20" : "border-neutral-200 hover:border-neutral-300"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="truncate text-[13px] font-semibold">
                    {g.emoji} {g.name}
                  </span>
                  <span
                    className={`shrink-0 rounded-full px-1.5 py-0.5 text-[9px] font-bold ${
                      p.onTrack ? "bg-black text-lime" : "bg-black text-white"
                    }`}
                  >
                    {p.onTrack ? "ON TRACK" : `+${p.extraWeeks}W`}
                  </span>
                </div>
                <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-neutral-100">
                  <div className="h-full rounded-full bg-lime" style={{ width: `${s.pctComplete}%` }} />
                </div>
                <div className="tabular mt-1 text-[11px] text-neutral-500">
                  {money(g.saved)} / {money(g.target)}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="border-t border-neutral-200 p-3">
        <button
          onClick={() => onSelect("you")}
          className={`mb-2 w-full rounded-xl px-3 py-2.5 text-left ${
            selectedId === "you" ? "bg-black text-white" : "bg-neutral-50 hover:bg-neutral-100"
          }`}
        >
          <div className="text-[10px] font-semibold uppercase tracking-widest opacity-60">Net worth</div>
          <div className="tabular text-lg font-bold">{money(netWorth)}</div>
        </button>

        <SectionLabel>Accounts</SectionLabel>
        <div className="space-y-0.5">
          {accounts.map((a) => {
            const meta = ACCOUNT_META[a.type];
            const on = selectedId === a.id;
            return (
              <button
                key={a.id}
                onClick={() => onSelect(a.id)}
                className={`flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left transition ${
                  on ? "bg-lime/25" : "hover:bg-neutral-50"
                }`}
              >
                <span className="text-sm">{meta.emoji}</span>
                <span className="min-w-0 flex-1 truncate text-[12px] font-medium">{a.name}</span>
                <span className="tabular text-[12px] font-semibold">{money(a.balance)}</span>
              </button>
            );
          })}
        </div>
        <div className="mt-2 text-[10px] text-neutral-400">
          {source === "up" ? "Up connected · live" : "Demo accounts"}
        </div>
      </div>
    </aside>
  );
}

function SectionLabel({
  children,
  action,
}: {
  children: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-1.5 flex items-center justify-between px-1">
      <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">{children}</span>
      {action}
    </div>
  );
}

function IconMap() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <circle cx="12" cy="12" r="3" />
      <circle cx="6" cy="7" r="1.5" />
      <circle cx="18" cy="8" r="1.5" />
      <circle cx="17" cy="17" r="1.5" />
      <circle cx="7" cy="17" r="1.5" />
      <path d="M9.5 10.5 7.2 8.2M14.5 10.8l2.2-1.6M14.2 13.8l1.8 2.2M9.8 13.8 7.8 16" />
    </svg>
  );
}
function IconTarget() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="8" />
      <circle cx="12" cy="12" r="4" />
    </svg>
  );
}
function IconBell() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.7 21a2 2 0 0 1-3.4 0" />
    </svg>
  );
}
function IconSettings() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z" />
    </svg>
  );
}
