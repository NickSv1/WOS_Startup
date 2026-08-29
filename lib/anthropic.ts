import Anthropic from "@anthropic-ai/sdk";
import { COACH_SYSTEM_PROMPT, MODEL } from "./constants";

/**
 * The coach's wording ONLY. Every dollar figure is computed deterministically
 * and passed in; Claude phrases, it never calculates. Returns null when no key
 * is configured so callers can fall back to a deterministic template.
 */

let client: Anthropic | null = null;
function getClient(): Anthropic | null {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key || key.startsWith("sk-ant-xxxx")) return null;
  if (!client) client = new Anthropic({ apiKey: key });
  return client;
}

export interface CoachTurn {
  role: "user" | "assistant";
  content: string;
}

export async function coachReply(
  turns: CoachTurn[],
  extraSystem?: string,
): Promise<string | null> {
  const anthropic = getClient();
  if (!anthropic) return null;

  const system = extraSystem
    ? `${COACH_SYSTEM_PROMPT}\n\n${extraSystem}`
    : COACH_SYSTEM_PROMPT;

  const res = await anthropic.messages.create({
    model: MODEL,
    max_tokens: 200,
    system,
    messages: turns.map((t) => ({ role: t.role, content: t.content })),
  });

  const text = res.content
    .filter((b): b is Anthropic.TextBlock => b.type === "text")
    .map((b) => b.text)
    .join("")
    .trim();

  return text || null;
}
