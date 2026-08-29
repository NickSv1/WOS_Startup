"use client";

import { ACCOUNT_META, GROUP_ORDER } from "@/lib/constants";
import { money } from "@/lib/format";
import type { Account } from "@/lib/types";

/** Accounts grouped by type, with Net Worth pinned at the top. */
export function Directory({
  accounts,
  netWorth,
  selectedId,
  onSelect,
  source,
}: {
  accounts: Account[];
  netWorth: number;
  selectedId: string | null;
  onSelect: (id: string) => void;
  source: "up" | "demo";
}) {
  const groups = GROUP_ORDER.map((group) => ({
    group,
    items: accounts.filter((a) => ACCOUNT_META[a.type].group === group),
  })).filter((g) => g.items.length > 0);

  return (
    <div className="flex h-full flex-col">
      {/* Net Worth — pinned */}
      <button
        onClick={() => onSelect("you")}
        className={`m-3 rounded-2xl border p-4 text-left transition ${
          selectedId === "you" ? "border-black ring-2 ring-lime" : "border-neutral-200 hover:border-neutral-300"
        } bg-black text-white`}
      >
        <div className="text-[11px] uppercase tracking-widest text-neutral-400">Net Worth</div>
        <div className="tabular mt-1 text-3xl font-bold text-lime">{money(netWorth)}</div>
        <div className="mt-1 text-[11px] text-neutral-400">
          {accounts.length} accounts · {source === "up" ? "Up connected" : "demo data"}
        </div>
      </button>

      <div className="no-scrollbar flex-1 overflow-y-auto px-3 pb-4">
        {groups.map(({ group, items }) => (
          <div key={group} className="mb-4">
            <div className="mb-1.5 px-1 text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
              {group}
            </div>
            <div className="space-y-1">
              {items.map((a) => {
                const meta = ACCOUNT_META[a.type];
                const active = a.id === selectedId;
                return (
                  <button
                    key={a.id}
                    onClick={() => onSelect(a.id)}
                    className={`flex w-full items-center gap-2.5 rounded-xl border px-2.5 py-2 text-left transition ${
                      active
                        ? "border-black bg-lime/15"
                        : "border-transparent hover:border-neutral-200 hover:bg-neutral-50"
                    }`}
                  >
                    <span className="text-lg leading-none">{meta.emoji}</span>
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-[13px] font-medium">{a.name}</div>
                      <div className="flex items-center gap-1 text-[10px] text-neutral-400">
                        {a.live ? "live" : "manual"}
                      </div>
                    </div>
                    <span className="tabular text-[13px] font-semibold">{money(a.balance)}</span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
