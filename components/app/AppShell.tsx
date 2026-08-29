"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { FinancialMap } from "./FinancialMap";
import { GoalEditor } from "./GoalEditor";
import { SimulateModal } from "./SimulateModal";
import { PhoneNudge, type NudgeState } from "./PhoneNudge";
import { CoachPrompt } from "./CoachPrompt";
import { Dashboard, type DashKey } from "./Dashboard";
import { SettingsPanel } from "./SettingsPanel";
import { LogoMark } from "@/components/Logo";
import { seedGoals, seedUser, netWorth as computeNetWorth, seedCategories } from "@/data/seed";
import { money } from "@/lib/format";
import { projectGoal, pushDeadline, recoveryOptions, type RecoveryOption } from "@/lib/savings";
import { discretionaryCategories, type SpendingProfile } from "@/lib/insights";
import { weeksForGoal } from "@/lib/path";
import type { Account, Goal } from "@/lib/types";

export function AppShell() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [source, setSource] = useState<"up" | "demo">("demo");
  const [loading, setLoading] = useState(true);
  const [goals, setGoals] = useState<Goal[]>(seedGoals);
  const [selectedId, setSelectedId] = useState<string | null>("you");
  const [dash, setDash] = useState<DashKey>("map");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [editor, setEditor] = useState<{ mode: "create" | "edit"; goal?: Goal } | null>(null);
  const [simulateOpen, setSimulateOpen] = useState(false);
  const [nudge, setNudge] = useState<NudgeState | null>(null);
  const [nudgeLoading, setNudgeLoading] = useState(false);
  const [profile, setProfile] = useState<SpendingProfile | null>(null);
  const [reorgSignal, setReorgSignal] = useState(0);
  const [spend, setSpend] = useState<{ amount: number; label: string } | null>(null);

  const loadAccounts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/accounts");
      const data = await res.json();
      setAccounts(data.accounts ?? []);
      setSource(data.source ?? "demo");
    } catch {
      setAccounts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadProfile = useCallback(async () => {
    try {
      const res = await fetch("/api/insights");
      const data = await res.json();
      setProfile(data.profile ?? null);
    } catch {
      setProfile(null);
    }
  }, []);

  useEffect(() => {
    loadAccounts();
    loadProfile();
  }, [loadAccounts, loadProfile]);

  const nw = computeNetWorth(accounts);
  const weeklySavable = Math.max(1, profile?.weeklySavable ?? 90);
  const selectedGoal = goals.find((g) => g.id === selectedId) ?? null;
  const cats = profile ? discretionaryCategories(profile) : seedCategories;
  const recover = selectedGoal
    ? recoveryOptions(selectedGoal, cats.length ? cats : seedCategories)
    : [];

  const activeGoal = useMemo(() => {
    if (selectedGoal) return selectedGoal;
    return goals[0] ?? null;
  }, [selectedGoal, goals]);

  function patchGoal(id: string, fn: (g: Goal) => Goal) {
    setGoals((prev) => prev.map((g) => (g.id === id ? fn(g) : g)));
  }

  async function fireNudge(amount: number, label: string) {
    const target = activeGoal;
    if (!target) return;
    setSimulateOpen(false);
    setNudgeLoading(true);
    setNudge(null);
    const spent: Goal = {
      ...target,
      discretionaryOverspend: (target.discretionaryOverspend ?? 0) + amount,
    };
    patchGoal(target.id, () => spent);
    setSelectedId(target.id);
    setSpend({ amount, label });

    try {
      const res = await fetch("/api/nudge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount, goal: spent }),
      });
      const data = await res.json();
      setNudge({ message: data.message, sms: data.sms, amount });
      setAccounts((prev) => {
        const idx = prev.findIndex((a) => a.type === "BANK");
        if (idx === -1) return prev;
        const next = [...prev];
        next[idx] = { ...next[idx], balance: next[idx].balance - amount };
        return next;
      });
      setReorgSignal((n) => n + 1);
    } catch {
      setNudge({
        message: "Couldn't reach the nudge service — check your connection and try again.",
        sms: { sent: false, reason: "network error" },
        amount,
      });
    } finally {
      setNudgeLoading(false);
    }
  }

  function applyCut(option: RecoveryOption) {
    if (!selectedGoal) return;
    patchGoal(selectedGoal.id, (g) => ({
      ...g,
      discretionaryOverspend: 0,
      savedThisWeek: g.savedThisWeek + option.freedPerWeek,
    }));
    setSpend(null);
    setReorgSignal((n) => n + 1);
  }

  function extendDeadline() {
    if (!selectedGoal) return;
    const p = projectGoal(selectedGoal);
    patchGoal(selectedGoal.id, (g) => ({
      ...g,
      deadline: pushDeadline(g.deadline, p.extraWeeks),
      discretionaryOverspend: 0,
    }));
    setSpend(null);
    setReorgSignal((n) => n + 1);
  }

  function saveGoal(g: Goal) {
    setGoals((prev) => {
      const exists = prev.some((x) => x.id === g.id);
      return exists ? prev.map((x) => (x.id === g.id ? g : x)) : [...prev, g];
    });
    setEditor(null);
    setSelectedId("you");
    setReorgSignal((n) => n + 1);
  }

  async function reset() {
    setGoals(seedGoals);
    setNudge(null);
    setNudgeLoading(false);
    setSpend(null);
    setSelectedId("you");
    setReorgSignal((n) => n + 1);
    await Promise.all([loadAccounts(), loadProfile()]);
  }

  const projection = selectedGoal ? projectGoal(selectedGoal) : null;
  const showCoach = Boolean(selectedGoal && spend && projection && projection.extraWeeks > 0);

  function navigate(key: DashKey) {
    setDash(key);
    setSidebarOpen(false);
    if (key === "map") setSelectedId("you");
    if (key === "goals") setSelectedId(goals[0]?.id ?? "you");
    if (key === "nudges") setSelectedId(activeGoal?.id ?? "you");
  }

  function selectFromDash(id: string) {
    setSelectedId(id);
    setDash(id === "you" ? "map" : goals.some((g) => g.id === id) ? "goals" : "map");
    setSidebarOpen(false);
  }

  return (
    <div className="relative flex h-screen w-full overflow-hidden bg-white text-black">
      <div className="hidden h-full lg:flex">
        <Dashboard
          userName={seedUser.firstName}
          accounts={accounts}
          goals={goals}
          netWorth={nw}
          selectedId={selectedId}
          source={source}
          active={dash}
          onNav={navigate}
          onSelect={selectFromDash}
          onAddGoal={() => setEditor({ mode: "create" })}
        />
      </div>

      {sidebarOpen && (
        <div className="fixed inset-0 z-40 flex lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setSidebarOpen(false)} />
          <div className="relative z-10 h-full">
            <Dashboard
              userName={seedUser.firstName}
              accounts={accounts}
              goals={goals}
              netWorth={nw}
              selectedId={selectedId}
              source={source}
              active={dash}
              onNav={navigate}
              onSelect={selectFromDash}
              onAddGoal={() => {
                setSidebarOpen(false);
                setEditor({ mode: "create" });
              }}
            />
          </div>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
      <header className="z-20 flex items-center justify-between border-b border-neutral-200 px-4 py-3 sm:px-5">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(true)}
            className="rounded-lg p-1.5 text-neutral-600 hover:bg-neutral-100 lg:hidden"
            aria-label="Open dashboard"
          >
            <LogoMark size={26} />
          </button>
          <span className="text-sm font-bold lg:hidden">{seedUser.firstName}&apos;s map</span>
          <span className="hidden text-sm text-neutral-400 lg:inline">Financial map</span>
          {source === "up" ? (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-lime/25 px-2.5 py-1 text-[11px] font-semibold text-neutral-700">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-lime-600" /> live
            </span>
          ) : (
            <span className="rounded-full bg-neutral-100 px-2.5 py-1 text-[11px] font-medium text-neutral-500">
              Demo
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setEditor({ mode: "create" })}
            className="rounded-xl border border-neutral-200 px-3 py-2 text-sm font-semibold transition hover:border-black"
          >
            Add Goal +
          </button>
          <button
            onClick={() => setSimulateOpen(true)}
            className="rounded-xl bg-lime px-3 py-2 text-sm font-bold text-black transition hover:brightness-95 sm:px-4"
          >
            Overspend
          </button>
        </div>
      </header>

      <div className="relative min-h-0 flex-1">
        {loading ? (
          <div className="flex h-full items-center justify-center text-sm text-neutral-400">
            Mapping {seedUser.firstName}&apos;s accounts…
          </div>
        ) : (
          <FinancialMap
            accounts={accounts}
            goals={goals}
            netWorth={nw}
            userName={seedUser.firstName}
            selectedId={selectedId}
            weeklySavable={weeklySavable}
            onSelect={setSelectedId}
            onAddGoal={() => setEditor({ mode: "create" })}
            reorgSignal={reorgSignal}
          />
        )}

        {selectedGoal && (
          <div className="pointer-events-none absolute left-1/2 top-4 z-20 w-[min(520px,calc(100%-24px))] -translate-x-1/2">
            <div className="pointer-events-auto flex items-center justify-between gap-3 rounded-2xl border border-neutral-200 bg-white/95 px-4 py-2.5 shadow-soft backdrop-blur">
              <div className="min-w-0">
                <div className="truncate text-sm font-bold">
                  {selectedGoal.emoji} {selectedGoal.name}
                </div>
                <div className="text-[11px] text-neutral-500">
                  {weeksForGoal(selectedGoal, weeklySavable)} weeks at {money(weeklySavable)}/wk
                  {selectedGoal.description ? ` · ${selectedGoal.description}` : ""}
                </div>
              </div>
              <div className="flex shrink-0 gap-1.5">
                <button
                  onClick={() => setEditor({ mode: "edit", goal: selectedGoal })}
                  className="rounded-lg px-2 py-1 text-[11px] font-semibold text-neutral-500 hover:bg-neutral-100"
                >
                  Edit
                </button>
                <button
                  onClick={() => setSelectedId("you")}
                  className="rounded-lg bg-black px-2.5 py-1 text-[11px] font-bold text-white"
                >
                  Map
                </button>
              </div>
            </div>
          </div>
        )}

        {showCoach && selectedGoal && projection && spend && (
          <CoachPrompt
            amount={spend.amount}
            label={spend.label}
            goalName={selectedGoal.name}
            extraWeeks={projection.extraWeeks}
            projectedWeeks={projection.projectedWeeks}
            plannedWeeks={projection.weeksPlanned}
            options={recover}
            onCut={applyCut}
            onExtend={extendDeadline}
            onDismiss={() => setSpend(null)}
          />
        )}
      </div>

      {editor && (
        <GoalEditor
          mode={editor.mode}
          goal={editor.goal ?? null}
          weeklySavable={weeklySavable}
          onSave={saveGoal}
          onClose={() => setEditor(null)}
        />
      )}
      {simulateOpen && (
        <SimulateModal onFire={fireNudge} onClose={() => setSimulateOpen(false)} />
      )}
      {dash === "settings" && (
        <SettingsPanel
          source={source}
          onReset={reset}
          onClose={() => setDash("map")}
        />
      )}
      <PhoneNudge nudge={nudge} loading={nudgeLoading} onClose={() => setNudge(null)} />
      </div>
    </div>
  );
}
