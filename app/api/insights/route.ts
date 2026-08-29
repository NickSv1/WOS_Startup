import { NextResponse } from "next/server";
import { UpProvider } from "@/lib/providers/up";
import { seedTransactions } from "@/data/seed";
import { buildProfile } from "@/lib/insights";
import type { Txn } from "@/lib/types";

export const dynamic = "force-dynamic";

/**
 * Aggregates transactions across every account into one spending profile — the
 * context the roadmap runs on. Live from Up when a token is set, else the seed.
 * Token stays server-side.
 */
export async function GET() {
  const up = UpProvider.fromEnv();
  let txns: Txn[] = [];

  if (up) {
    try {
      const accounts = await up.getAccounts();
      const lists = await Promise.all(
        accounts.map((a) => up.getTransactions(a.id, 60).catch(() => [] as Txn[])),
      );
      txns = lists.flat();
    } catch (err) {
      console.error("Up insights fetch failed, using seed:", err);
    }
  }

  if (txns.length === 0) {
    txns = Object.values(seedTransactions).flat();
  }

  return NextResponse.json({ profile: buildProfile(txns) });
}
