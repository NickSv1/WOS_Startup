"use client";

import { useEffect, useState } from "react";
import { ACCOUNT_META } from "@/lib/constants";
import { money, signedMoney, relativeDate } from "@/lib/format";
import { goalStatus, projectGoal } from "@/lib/savings";
import type { Account, Goal, Txn } from "@/lib/types";
import type { SpendingProfile } from "@/lib/insights";
import { Roadmap } from "./Roadmap";

export function DetailPanel({
  selectedId,
  accounts,
  goal,
  netWorth,
  profile,
  onEditGoal,
  onSimulate,
}: {
  selectedId: string | null;
  accounts: Account[];
  goal: Goal;
  netWorth: number;
  profile: SpendingProfile | null;
  onEditGoal: () => void;
  onSimulate: () => void;
}) {
  if (selectedId === "goal") {
    return <GoalDetail goal={goal} profile={profile} onEditGoal={onEditGoal} onSimulate={onSimulate} />;
  }
  if (selectedId === "you" || selectedId === null) {
    return <NetWorthDetail accounts={accounts} netWorth={netWorth} goal={goal} profile={profile} />;
  }
  const account = accounts.find((a) => a.id === selectedId);
  if (!account) return <NetWorthDetail accounts={accounts} netWorth={netWorth} goal={goal} profile={profile} />;
  return <AccountDetail account={account} />;
}

/* ───────────────────────── goal detail ───────────────────────── */

function GoalDetail({
  goal,
  profile,
  onEditGoal,
  onSimulate,
}: {
  goal: Goal;
  profile: SpendingProfile | null;
  onEditGoal: () => void;
  onSimulate: () => void;
}) {
  const s = goalStatus(goal);
  const p = projectGoal(goal);
  const onTrack = p.onTrack;
  const deadline = new Date(goal.deadline).toLocaleDateString("en-AU", { day: "numeric", month: "short" });
  const projDate = new Date(p.projectedDate).toLocaleDateString("en-AU", { day: "numeric", month: "short" });

  return (
    <div className="animate-fade-up p-5">
      <SectionLabel>Goal</SectionLabel>
      <h2 className="mt-1 text-2xl font-bold">
        {goal.emoji ? `${goal.emoji} ` : ""}
        {goal.name}
      </h2>

      <div className="mt-4 rounded-2xl border border-neutral-200 p-4">
        <div className="flex items-baseline justify-between">
          <span className="tabular text-3xl font-bold">{money(goal.saved)}</span>
          <span className="text-sm text-neutral-500">of {money(goal.target)}</span>
        </div>
        <div className="mt-3 h-3 w-full overflow-hidden rounded-full bg-neutral-100">
          <div
            className="h-full rounded-full bg-lime transition-all"
            style={{ width: `${s.pctComplete}%` }}
          />
        </div>
        <div className="mt-1.5 text-xs text-neutral-500">{s.pctComplete}% of the way there</div>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-3">
        <Stat label="Weekly target" value={money(s.weeklyTarget)} accent />
        <Stat label="Saved this week" value={money(goal.savedThisWeek)} />
        <Stat label="Still to go" value={money(s.remaining)} />
        <Stat label="Overspent" value={money(p.overspend)} />
      </div>

      {/* planned vs projected — the deviation front and centre */}
      <div
        className={`mt-3 rounded-2xl border p-4 ${
          onTrack ? "border-lime-600 bg-lime/15" : "border-neutral-900 bg-black text-white"
        }`}
      >
        {onTrack ? (
          <p className="text-sm font-medium">
            ✅ On track — landing in {p.weeksPlanned} weeks, by ~{deadline}.
          </p>
        ) : (
          <>
            <p className="text-sm font-bold text-lime">
              ⚠️ Slipped {p.extraWeeks} {p.extraWeeks === 1 ? "week" : "weeks"}
            </p>
            <div className="mt-2 flex items-center gap-2 text-sm">
              <span className="rounded-lg bg-neutral-800 px-2 py-1">
                Planned <b>{p.weeksPlanned}w</b> · {deadline}
              </span>
              <span>→</span>
              <span className="rounded-lg bg-lime px-2 py-1 text-black">
                Now <b>{p.projectedWeeks}w</b> · {projDate}
              </span>
            </div>
          </>
        )}
      </div>

      {/* ── the weekly savings roadmap (built from real transactions) ── */}
      <div className="mt-6">
        <SectionLabel>Weekly roadmap</SectionLabel>
        <div className="mt-2">
          <Roadmap goal={goal} profile={profile} />
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-2">
        <button
          onClick={onSimulate}
          className="w-full rounded-xl bg-lime px-4 py-3 text-sm font-bold text-black transition hover:brightness-95"
        >
          Simulate a purchase →
        </button>
        <button
          onClick={onEditGoal}
          className="w-full rounded-xl border border-neutral-300 px-4 py-2.5 text-sm font-semibold transition hover:bg-neutral-50"
        >
          Edit goal
        </button>
      </div>
    </div>
  );
}

/* ───────────────────────── account detail ───────────────────────── */

function AccountDetail({ account }: { account: Account }) {
  const meta = ACCOUNT_META[account.type];
  const [txns, setTxns] = useState<Txn[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    fetch(`/api/accounts/${account.id}/transactions`)
      .then((r) => r.json())
      .then((d) => {
        if (alive) setTxns(d.transactions ?? []);
      })
      .catch(() => alive && setTxns([]))
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, [account.id]);

  return (
    <div className="animate-fade-up p-5">
      <SectionLabel>{meta.label}</SectionLabel>
      <div className="mt-1 flex items-center gap-2">
        <span className="text-2xl">{meta.emoji}</span>
        <h2 className="text-2xl font-bold">{account.name}</h2>
      </div>

      <div className="mt-4 rounded-2xl border border-neutral-200 p-4">
        <div className="text-[11px] uppercase tracking-widest text-neutral-400">Balance</div>
        <div className="tabular mt-1 text-3xl font-bold">{money(account.balance)}</div>
        <div className="mt-1 text-xs text-neutral-500">
          {account.live ? "Live · synced from Up just now" : "Manual entry · CDR coming"}
        </div>
      </div>

      <div className="mt-5">
        <SectionLabel>Recent transactions</SectionLabel>
        {loading ? (
          <div className="mt-3 space-y-2">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-10 animate-pulse rounded-xl bg-neutral-100" />
            ))}
          </div>
        ) : txns && txns.length > 0 ? (
          <div className="mt-2 divide-y divide-neutral-100">
            {txns.map((t) => (
              <div key={t.id} className="flex items-center justify-between py-2.5">
                <div className="min-w-0">
                  <div className="truncate text-sm font-medium">{t.description}</div>
                  <div className="text-[11px] text-neutral-400">{relativeDate(t.createdAt)}</div>
                </div>
                <div
                  className={`tabular text-sm font-semibold ${
                    t.amount < 0 ? "text-neutral-900" : "text-lime-600"
                  }`}
                >
                  {signedMoney(t.amount)}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-3 text-sm text-neutral-400">No recent transactions.</p>
        )}
      </div>
    </div>
  );
}

/* ───────────────────────── net worth detail ───────────────────────── */

function NetWorthDetail({
  accounts,
  netWorth,
  goal,
  profile,
}: {
  accounts: Account[];
  netWorth: number;
  goal: Goal;
  profile: SpendingProfile | null;
}) {
  const assets = accounts.filter((a) => a.type !== "LOAN");
  const total = assets.reduce((s, a) => s + a.balance, 0) || 1;
  const s = goalStatus(goal);
  const p = projectGoal(goal);

  return (
    <div className="animate-fade-up p-5">
      <SectionLabel>Overview</SectionLabel>
      <h2 className="mt-1 text-2xl font-bold">Your money at a glance</h2>

      <div className="mt-4 rounded-2xl border border-neutral-900 bg-black p-4 text-white">
        <div className="text-[11px] uppercase tracking-widest text-neutral-400">Net Worth</div>
        <div className="tabular mt-1 text-4xl font-bold text-lime">{money(netWorth)}</div>
        <div className="mt-1 text-[11px] text-neutral-400">
          across {accounts.length} accounts
        </div>
      </div>

      {/* this week — savings rate from transactions */}
      {profile && (
        <div className="mt-3 grid grid-cols-3 gap-2">
          <OverviewStat label="In / wk" value={money(profile.weeklyIncome)} />
          <OverviewStat label="Out / wk" value={money(profile.weeklySpend)} />
          <OverviewStat
            label="Saved / wk"
            value={money(Math.max(0, profile.weeklySavable))}
            accent
          />
        </div>
      )}

      {/* goal snapshot */}
      <div className="mt-3 rounded-2xl border border-neutral-200 p-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold">
            {goal.emoji ?? "🎯"} {goal.name}
          </span>
          <span
            className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
              p.onTrack ? "bg-lime text-black" : "bg-black text-white"
            }`}
          >
            {p.onTrack ? "ON TRACK" : `+${p.extraWeeks}W`}
          </span>
        </div>
        <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-neutral-100">
          <div className="h-full rounded-full bg-lime" style={{ width: `${s.pctComplete}%` }} />
        </div>
        <div className="tabular mt-1.5 flex justify-between text-[11px] text-neutral-500">
          <span>{money(goal.saved)} of {money(goal.target)}</span>
          <span>{money(s.weeklyTarget)}/wk · {p.projectedWeeks}w</span>
        </div>
      </div>

      {/* allocation */}
      <div className="mt-4">
        <SectionLabel>Allocation</SectionLabel>
        <div className="mt-2 space-y-2.5">
          {assets.map((a) => {
            const meta = ACCOUNT_META[a.type];
            const pct = Math.round((a.balance / total) * 100);
            return (
              <div key={a.id}>
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-1.5">
                    <span>{meta.emoji}</span>
                    {a.name}
                  </span>
                  <span className="tabular font-semibold">{pct}%</span>
                </div>
                <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-neutral-100">
                  <div className="h-full rounded-full bg-black" style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* top spending from transactions */}
      {profile && profile.categories.length > 0 && (
        <div className="mt-5">
          <SectionLabel>Top spending / week</SectionLabel>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {profile.categories.slice(0, 4).map((c) => (
              <span
                key={c.cat}
                className="inline-flex items-center gap-1 rounded-full border border-neutral-200 px-2.5 py-1 text-[12px]"
              >
                <span>{c.emoji}</span>
                {c.label}
                <span className="tabular font-semibold">{money(c.weekly)}</span>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function OverviewStat({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className={`rounded-xl border p-2.5 ${accent ? "border-lime-600 bg-lime/15" : "border-neutral-200"}`}>
      <div className="text-[9px] uppercase tracking-wide text-neutral-400">{label}</div>
      <div className="tabular mt-0.5 text-base font-bold">{value}</div>
    </div>
  );
}

/* ───────────────────────── shared bits ───────────────────────── */

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-[11px] font-semibold uppercase tracking-widest text-neutral-400">
      {children}
    </div>
  );
}

function Stat({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className={`rounded-xl border p-3 ${accent ? "border-lime-600 bg-lime/15" : "border-neutral-200"}`}>
      <div className="text-[10px] uppercase tracking-wide text-neutral-400">{label}</div>
      <div className="tabular mt-0.5 text-lg font-bold">{value}</div>
    </div>
  );
}
