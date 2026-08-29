import type { AccountType } from "./types";

/** Current Claude Sonnet model — the coach's phrasing engine (never the math). */
export const MODEL = "claude-sonnet-5";

export const COACH_SYSTEM_PROMPT =
  "You are a savings coach for young Australians. You are given exact numbers — " +
  "never invent or recalculate them. Warm, direct, 1–2 sentences. Never recommend " +
  "financial products or tell the user what to invest in — you give information, not advice.";

/** How each account type presents in the UI. */
export const ACCOUNT_META: Record<
  AccountType,
  { label: string; emoji: string; group: string }
> = {
  BANK: { label: "Everyday", emoji: "💳", group: "Spending" },
  SAVINGS: { label: "Savings", emoji: "🐷", group: "Savings" },
  SUPER: { label: "Super", emoji: "🏦", group: "Super" },
  INVESTMENT: { label: "Investments", emoji: "📈", group: "Investments" },
  PROPERTY: { label: "Property", emoji: "🏠", group: "Property" },
  LOAN: { label: "Loan", emoji: "📉", group: "Loans" },
};

/** Order account groups appear in the directory. */
export const GROUP_ORDER = [
  "Spending",
  "Savings",
  "Super",
  "Investments",
  "Property",
  "Loans",
] as const;
