import { NextResponse } from "next/server";
import { UpProvider } from "@/lib/providers/up";
import {
  seedDemoBankAccounts,
  seedManualAccounts,
} from "@/data/seed";
import type { Account } from "@/lib/types";

export const dynamic = "force-dynamic";

/**
 * Returns the full account list for the one demo user. Live Up accounts are
 * merged over the top of the seed; if there's no token (or Up errors), we fall
 * back to demo bank accounts so the map is never empty on stage.
 */
export async function GET() {
  const up = UpProvider.fromEnv();
  let bankAccounts: Account[] = seedDemoBankAccounts;
  let source: "up" | "demo" = "demo";

  if (up) {
    try {
      const live = await up.getAccounts();
      if (live.length > 0) {
        bankAccounts = live;
        source = "up";
      }
    } catch (err) {
      console.error("Up getAccounts failed, using demo accounts:", err);
    }
  }

  // Manual super/investments (not in CDR yet) always sit alongside the bank data.
  const accounts = [...bankAccounts, ...seedManualAccounts];
  return NextResponse.json({ accounts, source });
}
