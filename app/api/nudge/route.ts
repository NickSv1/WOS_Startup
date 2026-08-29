import { NextResponse } from "next/server";
import { goalStatus, behindBy, projectGoal, recoveryOptions } from "@/lib/savings";
import { coachReply } from "@/lib/anthropic";
import { sendNudgeSms } from "@/lib/twilio";
import { money } from "@/lib/format";
import { seedCategories, seedTransactions } from "@/data/seed";
import { buildProfile, discretionaryCategories } from "@/lib/insights";
import type { Goal } from "@/lib/types";

export const dynamic = "force-dynamic";

/**
 * The demo loop. Client sends the current goal + the simulated spend. We compute
 * the shortfall deterministically, Claude phrases it (numbers passed in, never
 * recalculated), Twilio sends the text, and we return the message so the UI can
 * also show it on-screen as a fallback.
 */
export async function POST(req: Request) {
  const { amount, goal } = (await req.json()) as { amount: number; goal: Goal };

  if (typeof amount !== "number" || !goal) {
    return NextResponse.json({ error: "amount and goal required" }, { status: 400 });
  }

  // ── Deterministic math (the LLM never touches these numbers) ──
  const status = goalStatus(goal);
  const shortfall = behindBy(status.weeklyTarget, goal.savedThisWeek);
  const projection = projectGoal(goal); // goal already includes this spend's overspend

  // Derive the suggested trim from the user's real discretionary spending.
  const profile = buildProfile(Object.values(seedTransactions).flat());
  const cats = discretionaryCategories(profile);
  const topFix = recoveryOptions(goal, cats.length ? cats : seedCategories).find(
    (o) => o.cut === "half",
  );

  const numbers = {
    goalName: goal.name,
    spendAmount: amount,
    weeklyTarget: status.weeklyTarget,
    shortfallThisWeek: shortfall,
    weeksPlanned: projection.weeksPlanned,
    projectedWeeks: projection.projectedWeeks,
    weeksSlipped: projection.extraWeeks,
    suggestedCut: topFix
      ? { what: topFix.label, savePerWeek: topFix.freedPerWeek }
      : null,
  };

  // Deterministic fallback copy — used if Claude isn't configured. Leads with the
  // slipped finish line, then one concrete swap to claw it back.
  const cutLine = topFix
    ? ` Halve your ${topFix.label.toLowerCase()} (${money(topFix.freedPerWeek)}/week) and you pull it back.`
    : ` Trim one discretionary spend this week and you pull it back.`;

  const fallback =
    projection.extraWeeks > 0
      ? `That ${money(amount)} put your ${goal.name} back ${projection.extraWeeks} ${
          projection.extraWeeks === 1 ? "week" : "weeks"
        } — now landing in ~${projection.projectedWeeks} weeks, not ${projection.weeksPlanned}.${cutLine}`
      : `Logged that ${money(amount)} spend. Your ${goal.name} is still on for ${
          projection.weeksPlanned
        } weeks — nice discipline.`;

  let message = fallback;
  try {
    const phrased = await coachReply(
      [
        {
          role: "user",
          content:
            "Write the nudge SMS. Use ONLY these exact numbers, do not recalculate. " +
            "Lead with how the goal's finish line moved (weeksPlanned vs projectedWeeks), then ONE concrete swap from suggestedCut. " +
            "One or two sentences, warm and direct, mention the goal by name. " +
            JSON.stringify(numbers),
        },
      ],
      "You are writing a single SMS text message (no greeting, no signature).",
    );
    if (phrased) message = phrased;
  } catch (err) {
    console.error("Coach phrasing failed, using fallback:", err);
  }

  const sms = await sendNudgeSms(message);

  return NextResponse.json({ message, sms, numbers });
}
