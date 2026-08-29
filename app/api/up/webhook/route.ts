import { NextResponse } from "next/server";
import { goalStatus, behindBy } from "@/lib/savings";
import { coachReply } from "@/lib/anthropic";
import { sendNudgeSms } from "@/lib/twilio";
import { money } from "@/lib/format";
import { seedGoal } from "@/data/seed";

export const dynamic = "force-dynamic";

/**
 * OPTIONAL: real Up `TRANSACTION_CREATED` webhooks. There's no DB, so this reads
 * the single demo user's goal straight from the seed constant. The in-app
 * "Simulate a purchase" button is the reliable demo path — this is a nice-to-have
 * that proves the loop works on genuine bank events too.
 */
export async function POST(req: Request) {
  let payload: unknown;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid JSON" }, { status: 400 });
  }

  const eventType = extractEventType(payload);
  if (eventType !== "TRANSACTION_CREATED") {
    // Acknowledge pings/other events without acting.
    return NextResponse.json({ ok: true, ignored: eventType ?? "unknown" });
  }

  const goal = seedGoal;
  const status = goalStatus(goal);
  const shortfall = behindBy(status.weeklyTarget, goal.savedThisWeek);

  const numbers = {
    goalName: goal.name,
    weeklyTarget: status.weeklyTarget,
    savedThisWeek: goal.savedThisWeek,
    shortfall,
    weeksLeft: status.weeksLeft,
  };

  const fallback = `A new transaction just landed. You're ${money(
    shortfall,
  )} short of this week's ${money(status.weeklyTarget)} target for ${goal.name} — trim one treat to stay on track.`;

  let message = fallback;
  try {
    const phrased = await coachReply(
      [
        {
          role: "user",
          content:
            "Write the nudge SMS from a real bank transaction. Use ONLY these numbers, never recalculate. " +
            JSON.stringify(numbers),
        },
      ],
      "You are writing a single SMS text message (no greeting, no signature).",
    );
    if (phrased) message = phrased;
  } catch (err) {
    console.error("Webhook coach phrasing failed:", err);
  }

  const sms = await sendNudgeSms(message);
  return NextResponse.json({ ok: true, message, sms });
}

function extractEventType(payload: unknown): string | null {
  if (
    payload &&
    typeof payload === "object" &&
    "data" in payload &&
    payload.data &&
    typeof payload.data === "object" &&
    "attributes" in payload.data &&
    payload.data.attributes &&
    typeof payload.data.attributes === "object" &&
    "eventType" in payload.data.attributes
  ) {
    return String((payload.data.attributes as { eventType: unknown }).eventType);
  }
  return null;
}
