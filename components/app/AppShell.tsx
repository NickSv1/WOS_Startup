"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { FinancialMap } from "./FinancialMap";
import { GoalEditor } from "./GoalEditor";
import { SimulateModal } from "./SimulateModal";
import { PhoneNudge, type NudgeState } from "./PhoneNudge";
import { GoalFixPanel } from "./GoalFixPanel";
import { AccountTxnsPanel } from "./AccountTxnsPanel";
import { Dashboard, type DashKey } from "./Dashboard";
import { SettingsPanel } from "./SettingsPanel";
import { LogoMark } from "@/components/Logo";
import { seedGoals, seedUser, netWorth as computeNetWorth, seedCategories, seedSpendSwitches } from "@/data/seed";
import { money, shortDate } from "@/lib/format";
import {
  applySpendSwitch,
  isCompleted,
  markPledgeKept,
  projectGoal,
  pushDeadline,
  recoveryOptions,
  revertSpendSwitch,
  type RecoveryOption,
} from "@/lib/savings";
import { discretionaryCategories, type SpendingProfile } from "@/lib/insights";
import { weeksForGoal } from "@/lib/path";
import type { Account, Goal, SpendSwitch } from "@/lib/types";

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
  const [hideFix, setHideFix] = useState(false);
  const [alertDismissed, setAlertDismissed] = useState(false);
  const [previewSwitchId, setPreviewSwitchId] = useState<string | null>(null);
  const [couponRevealed, setCouponRevealed] = useState(false);
  const [fixReady, setFixReady] = useState(false);

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

  useEffect(() => {
    if (!selectedGoal || isCompleted(selectedGoal) || hideFix) {
      setFixReady(false);
      return;
    }
    setFixReady(false);
    const t = setTimeout(() => setFixReady(true), 1100);
    return () => clearTimeout(t);
  }, [selectedId, selectedGoal, hideFix]);
  const liveGoals = goals.filter((g) => !isCompleted(g));
  const cats = profile ? discretionaryCategories(profile) : seedCategories;
  const recover = selectedGoal
    ? recoveryOptions(selectedGoal, cats.length ? cats : seedCategories)
    : [];
  const atRisk = liveGoals.find((g) => !projectGoal(g).onTrack) ?? null;
  const atRiskWeeks = atRisk ? projectGoal(atRisk).extraWeeks : 0;
  const previewSwitch = seedSpendSwitches.find((s) => s.id === previewSwitchId) ?? null;
  const previewGoal =
    selectedGoal && previewSwitch && couponRevealed && !isCompleted(selectedGoal)
      ? applySpendSwitch(selectedGoal, previewSwitch)
      : null;
  const previewProjection = previewGoal ? projectGoal(previewGoal) : null;

  const activeGoal = useMemo(() => {
    if (selectedGoal && !isCompleted(selectedGoal)) return selectedGoal;
    return goals.find((g) => !isCompleted(g)) ?? null;
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
      slip: { date: new Date().toISOString(), label, amount },
    };
    patchGoal(target.id, () => spent);
    setSelectedId(target.id);
    setSpend({ amount, label });
    setHideFix(false);
    setPreviewSwitchId(null);
    setCouponRevealed(false);

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
      slip: undefined,
      savedThisWeek: g.savedThisWeek + option.freedPerWeek,
    }));
    setSpend(null);
    setHideFix(false);
    setPreviewSwitchId(null);
    setCouponRevealed(false);
    setReorgSignal((n) => n + 1);
  }

  function applySwitch(sw: SpendSwitch) {
    if (!selectedGoal) return;
    patchGoal(selectedGoal.id, (g) => ({
      ...applySpendSwitch(g, sw),
      discretionaryOverspend: 0,
      slip: undefined,
    }));
    setSpend(null);
    setPreviewSwitchId(null);
    setCouponRevealed(false);
    setHideFix(true);
    setReorgSignal((n) => n + 1);
  }

  function keepSwitch(sw: SpendSwitch) {
    if (!selectedGoal) return;
    patchGoal(selectedGoal.id, (g) => markPledgeKept(g, sw.id));
  }

  function breakSwitch(sw: SpendSwitch) {
    if (!selectedGoal) return;
    patchGoal(selectedGoal.id, (g) => revertSpendSwitch(g, sw));
    setPreviewSwitchId(null);
    setCouponRevealed(false);
    setReorgSignal((n) => n + 1);
  }

  function extendDeadline() {
    if (!selectedGoal) return;
    const p = projectGoal(selectedGoal);
    patchGoal(selectedGoal.id, (g) => ({
      ...g,
      deadline: pushDeadline(g.deadline, p.extraWeeks),
      discretionaryOverspend: 0,
      slip: undefined,
    }));
    setSpend(null);
    setReorgSignal((n) => n + 1);
  }

  function toggleGoalDone(id: string) {
    patchGoal(id, (g) => {
      if (isCompleted(g)) {
        return {
          ...g,
          completedAt: undefined,
          saved: Math.min(g.saved, Math.max(0, g.target - 1)),
        };
      }
      return {
        ...g,
        completedAt: new Date().toISOString().slice(0, 10),
        saved: g.target,
        discretionaryOverspend: 0,
        slip: undefined,
      };
    });
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
    setHideFix(false);
    setAlertDismissed(false);
    setPreviewSwitchId(null);
    setCouponRevealed(false);
    setSelectedId("you");
    setReorgSignal((n) => n + 1);
    await Promise.all([loadAccounts(), loadProfile()]);
  }

  const projection = selectedGoal ? projectGoal(selectedGoal) : null;
  const selectedAccount = accounts.find((a) => a.id === selectedId) ?? null;
  const showFix = Boolean(
    selectedGoal && !isCompleted(selectedGoal) && !hideFix && fixReady,
  );
  const showAlert = Boolean(!selectedGoal && !selectedAccount && atRisk && !alertDismissed);

  function selectNode(id: string) {
    setSelectedId(id);
    setHideFix(false);
    setPreviewSwitchId(null);
    setCouponRevealed(false);
  }

  function navigate(key: DashKey) {
    setDash(key);
    setSidebarOpen(false);
    if (key === "map") setSelectedId("you");
    if (key === "goals") {
      setSelectedId(goals.find((g) => !isCompleted(g))?.id ?? goals[0]?.id ?? "you");
      setHideFix(false);
    }
    if (key === "nudges") setSelectedId(activeGoal?.id ?? "you");
  }

  function selectFromDash(id: string) {
    selectNode(id);
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
          onToggleComplete={toggleGoalDone}
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
              onToggleComplete={toggleGoalDone}
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
            onSelect={selectNode}
            onAddGoal={() => setEditor({ mode: "create" })}
            reorgSignal={reorgSignal}
            previewGoal={previewGoal}
          />
        )}

        {selectedAccount ? (
          <AccountTxnsPanel account={selectedAccount} onClose={() => setSelectedId("you")} />
        ) : null}

        {selectedGoal && (
          <div className="pointer-events-none absolute left-1/2 top-4 z-20 w-[min(520px,calc(100%-24px))] -translate-x-1/2">
            <div
              className={`pointer-events-auto flex items-center justify-between gap-3 rounded-2xl border bg-white/95 px-4 py-2.5 shadow-soft backdrop-blur ${
                projection && !projection.onTrack ? "border-[#ff7a3d]" : "border-neutral-200"
              }`}
            >
              <div className="min-w-0">
                <div className="truncate text-sm font-bold">
                  {selectedGoal.emoji} {selectedGoal.name}
                </div>
                <div className="text-[11px] text-neutral-500">
                  {isCompleted(selectedGoal)
                    ? `Done · ${shortDate(selectedGoal.completedAt ?? selectedGoal.deadline)}`
                    : previewProjection && previewSwitch
                      ? `If ${previewSwitch.toMerchant}: ${previewProjection.projectedWeeks} weeks · ${previewProjection.onTrack ? `hits ${shortDate(selectedGoal.deadline)}` : "still late"}`
                      : `${weeksForGoal(selectedGoal, weeklySavable)} weeks at ${money(weeklySavable + (selectedGoal.weeklyBoost ?? 0))}/wk`}
                  {!previewGoal && selectedGoal.description ? ` · ${selectedGoal.description}` : ""}
                </div>
              </div>
              <div className="flex shrink-0 gap-1.5">
                {projection && !projection.onTrack && hideFix ? (
                  <button
                    onClick={() => setHideFix(false)}
                    className="rounded-lg bg-black px-2.5 py-1 text-[11px] font-bold text-white"
                  >
                    Fix
                  </button>
                ) : null}
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

        {showAlert && atRisk && (
          <button
            id="offtrack-alert"
            type="button"
            onClick={() => {
              selectNode(atRisk.id);
              setDash("goals");
            }}
            className="absolute left-1/2 top-4 z-20 w-[min(520px,calc(100%-24px))] -translate-x-1/2 animate-fade-up rounded-2xl border border-[#ff7a3d] bg-white px-4 py-3 text-left shadow-node"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-widest text-[#e85d1c]">
                  Off track
                </div>
                <p className="mt-0.5 text-sm font-semibold leading-snug">
                  {atRisk.emoji} {atRisk.name} has slipped
                  {atRiskWeeks > 0
                    ? ` ${atRiskWeeks} ${atRiskWeeks === 1 ? "week" : "weeks"}`
                    : ""}
                  .
                </p>
                <p className="mt-1 text-[11px] text-neutral-500">
                  Tap it — Knodle scans your spend and finds the fix.
                </p>
              </div>
              <span
                role="button"
                tabIndex={0}
                onClick={(e) => {
                  e.stopPropagation();
                  setAlertDismissed(true);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.stopPropagation();
                    setAlertDismissed(true);
                  }
                }}
                className="shrink-0 text-xs font-medium text-neutral-400 hover:text-black"
              >
                Dismiss
              </span>
            </div>
          </button>
        )}

        {showFix && selectedGoal && projection && (
          <GoalFixPanel
            key={selectedGoal.id}
            goal={selectedGoal}
            extraWeeks={projection.extraWeeks}
            projectedWeeks={projection.projectedWeeks}
            plannedWeeks={projection.weeksPlanned}
            spend={spend}
            switches={seedSpendSwitches}
            options={recover}
            previewId={previewSwitchId}
            couponRevealed={couponRevealed}
            onPreview={(sw) => {
              setPreviewSwitchId(sw?.id ?? null);
              setCouponRevealed(false);
            }}
            onRevealCoupon={() => setCouponRevealed(true)}
            onSwitch={applySwitch}
            onKeep={keepSwitch}
            onBreak={breakSwitch}
            onCut={applyCut}
            onExtend={extendDeadline}
            onDismiss={() => {
              setHideFix(true);
              setSpend(null);
              setPreviewSwitchId(null);
              setCouponRevealed(false);
            }}
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
