"use client";

import { useEffect, useState } from "react";
import { ACCOUNT_META } from "@/lib/constants";
import { money, signedMoney, relativeDate } from "@/lib/format";
import type { Account, Txn } from "@/lib/types";
import { MerchantLogo } from "./MerchantLogo";

const DOMAINS: Record<string, string> = {
  "Uber Eats": "ubereats.com",
  "Single O": "singleo.com.au",
  Coles: "coles.com.au",
  Woolworths: "woolworths.com.au",
  ALDI: "aldi.com.au",
  Opal: "transportnsw.info",
  Netflix: "netflix.com",
  Spotify: "spotify.com",
  "Guzman y Gomez": "guzmanygomez.com.au",
  Menulog: "menulog.com.au",
  "Sushi Hub": "sushihub.com.au",
  Campos: "camposcoffee.com",
  "Toby's Estate": "tobysestate.com.au",
  Amazon: "amazon.com.au",
  BWS: "bws.com.au",
  "Dan Murphy": "danmurphys.com.au",
  "Coogee Bay": "coogeebayhotel.com.au",
  "The Winery": "thewinery.com.au",
  Origin: "originenergy.com.au",
  Optus: "optus.com.au",
};

function domainFor(description: string): string {
  const hit = Object.keys(DOMAINS).find((k) => description.includes(k));
  return hit ? DOMAINS[hit] : "";
}

export function AccountTxnsPanel({
  account,
  onClose,
}: {
  account: Account;
  onClose: () => void;
}) {
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
    <div
      id="txns-panel"
      className="pointer-events-auto absolute left-1/2 top-1/2 z-30 w-[min(360px,calc(100%-24px))] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-3xl border border-black/10 bg-white/95 shadow-node backdrop-blur-md"
    >
      <div className="flex items-center justify-between border-b border-neutral-100 px-4 py-3">
        <div className="flex min-w-0 items-center gap-2">
          <span className="text-base">{meta.emoji}</span>
          <div className="min-w-0">
            <div className="truncate text-[13px] font-bold leading-tight">{account.name}</div>
            <div className="text-[10px] text-neutral-400">
              {account.live ? "Up · live" : "Demo · live feed"}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="tabular text-sm font-bold">{money(account.balance)}</div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-2 py-1 text-[11px] font-semibold text-neutral-400 hover:bg-neutral-100 hover:text-black"
          >
            Close
          </button>
        </div>
      </div>
      <div className="max-h-[min(52vh,420px)] overflow-y-auto divide-y divide-neutral-100">
        {loading ? (
          <div className="space-y-2 p-4">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="h-10 animate-pulse rounded-xl bg-neutral-100" />
            ))}
          </div>
        ) : txns && txns.length > 0 ? (
          txns.map((t) => {
            const domain = domainFor(t.description);
            const spend = t.amount < 0;
            return (
              <div key={t.id} className="flex items-center gap-2.5 px-4 py-2.5">
                {domain ? (
                  <MerchantLogo name={t.description} domain={domain} size={28} />
                ) : (
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-lime/30 text-[11px]">
                    {spend ? "↓" : "💰"}
                  </span>
                )}
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[12px] font-medium">{t.description}</span>
                  <span className="text-[10px] text-neutral-400">{relativeDate(t.createdAt)}</span>
                </span>
                <span className={`tabular text-[12px] font-bold ${spend ? "text-neutral-900" : "text-lime-600"}`}>
                  {signedMoney(t.amount)}
                </span>
              </div>
            );
          })
        ) : (
          <p className="px-4 py-6 text-center text-sm text-neutral-400">No recent transactions.</p>
        )}
      </div>
    </div>
  );
}
