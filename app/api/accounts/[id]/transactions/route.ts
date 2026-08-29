import { NextResponse } from "next/server";
import { UpProvider } from "@/lib/providers/up";
import { seedTransactions } from "@/data/seed";

export const dynamic = "force-dynamic";

/** Recent transactions for one account — live from Up, or seed for demo ids. */
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const up = UpProvider.fromEnv();

  // Demo/seed ids never hit the live API.
  if (seedTransactions[id]) {
    return NextResponse.json({ transactions: seedTransactions[id] });
  }

  if (up) {
    try {
      const transactions = await up.getTransactions(id, 20);
      return NextResponse.json({ transactions });
    } catch (err) {
      console.error("Up getTransactions failed:", err);
    }
  }

  return NextResponse.json({ transactions: [] });
}
