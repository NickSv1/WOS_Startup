import type { SpendCategory, Txn } from "./types";

/**
 * Turns raw transactions into a spending profile — weekly income, spend, savable,
 * and per-category breakdown. This is the user's real context (their accounts +
 * history) that makes the roadmap something a generic chatbot can't produce.
 * All deterministic; the LLM never touches these numbers.
 */

const MS_PER_WEEK = 6.048e8;

export type SpendCat =
  | "income"
  | "rent"
  | "groceries"
  | "eatingOut"
  | "coffee"
  | "transport"
  | "subscriptions"
  | "shopping"
  | "nightlife"
  | "other";

interface CatMeta {
  label: string;
  emoji: string;
  discretionary: boolean;
}

export const CAT_META: Record<SpendCat, CatMeta> = {
  income: { label: "Income", emoji: "💰", discretionary: false },
  rent: { label: "Rent & bills", emoji: "🏠", discretionary: false },
  groceries: { label: "Groceries", emoji: "🛒", discretionary: false },
  eatingOut: { label: "Eating out & takeaway", emoji: "🥡", discretionary: true },
  coffee: { label: "Coffee", emoji: "☕", discretionary: true },
  transport: { label: "Transport", emoji: "🚌", discretionary: false },
  subscriptions: { label: "Subscriptions", emoji: "📺", discretionary: true },
  shopping: { label: "Shopping", emoji: "🛍️", discretionary: true },
  nightlife: { label: "Nights out", emoji: "🍺", discretionary: true },
  other: { label: "Other", emoji: "🔖", discretionary: false },
};

const RULES: [SpendCat, RegExp][] = [
  ["income", /salary|payroll|acme|wage|pay run|dividend|refund/i],
  ["rent", /rent|landlord|real estate|water|electric|energy|agl|origin|insurance|internet|telstra|optus/i],
  ["groceries", /coles|woolworths|woolies|aldi|iga|grocer|foodland/i],
  ["eatingOut", /uber ?eats|deliveroo|menulog|doordash|restaurant|dinner|mcdonald|kfc|guzman|sushi|thai|pizza|burger|nando|noodle|ramen|kebab|takeaway/i],
  ["coffee", /coffee|espresso|starbucks|barista|roasters|toby|campos|single o/i],
  ["transport", /opal|myki|uber(?! ?eats)|didi|ola|fuel|\bbp\b|shell|ampol|caltex|petrol|linkt|transport/i],
  ["subscriptions", /spotify|netflix|disney|youtube|audible|apple\.com|prime video|binge|kayo|patreon|icloud|adobe/i],
  ["shopping", /amazon|mecca|myer|asos|cotton on|uniqlo|kmart|sephora|the iconic|jb ?hi-?fi|zara|h&m/i],
  ["nightlife", /\bbar\b|pub|bottle|liquor|dan murphy|\bbws\b|nightclub|brewery|tavern|winery/i],
];

export function categorize(description: string): SpendCat {
  for (const [cat, re] of RULES) if (re.test(description)) return cat;
  return "other";
}

export interface CategoryLine {
  cat: SpendCat;
  label: string;
  emoji: string;
  discretionary: boolean;
  weekly: number;
  total: number;
  count: number;
}

export interface SpendingProfile {
  windowWeeks: number;
  txnCount: number;
  weeklyIncome: number;
  weeklySpend: number;
  weeklySavable: number;
  discretionaryWeekly: number;
  categories: CategoryLine[]; // spend only, sorted by weekly desc
}

export function buildProfile(txns: Txn[]): SpendingProfile {
  const empty: SpendingProfile = {
    windowWeeks: 1,
    txnCount: 0,
    weeklyIncome: 0,
    weeklySpend: 0,
    weeklySavable: 0,
    discretionaryWeekly: 0,
    categories: [],
  };
  if (txns.length === 0) return empty;

  const times = txns.map((t) => +new Date(t.createdAt));
  const span = Math.max(...times) - Math.min(...times);
  const windowWeeks = Math.max(1, Math.round(span / MS_PER_WEEK) || 1);

  const agg = new Map<SpendCat, { total: number; count: number }>();
  let income = 0;
  let spend = 0;

  for (const t of txns) {
    if (t.amount > 0) {
      // Positive money in — treat as income (skip internal saver transfers).
      if (!/transfer|round-?up/i.test(t.description)) income += t.amount;
      continue;
    }
    const cat = categorize(t.description);
    const abs = Math.abs(t.amount);
    spend += abs;
    const cur = agg.get(cat) ?? { total: 0, count: 0 };
    cur.total += abs;
    cur.count += 1;
    agg.set(cat, cur);
  }

  const categories: CategoryLine[] = [...agg.entries()]
    .map(([cat, v]) => ({
      cat,
      label: CAT_META[cat].label,
      emoji: CAT_META[cat].emoji,
      discretionary: CAT_META[cat].discretionary,
      weekly: Math.round(v.total / windowWeeks),
      total: Math.round(v.total),
      count: v.count,
    }))
    .sort((a, b) => b.weekly - a.weekly);

  const weeklyIncome = Math.round(income / windowWeeks);
  const weeklySpend = Math.round(spend / windowWeeks);
  const discretionaryWeekly = categories
    .filter((c) => c.discretionary)
    .reduce((s, c) => s + c.weekly, 0);

  return {
    windowWeeks,
    txnCount: txns.length,
    weeklyIncome,
    weeklySpend,
    weeklySavable: weeklyIncome - weeklySpend,
    discretionaryWeekly,
    categories,
  };
}

/** Discretionary categories mapped to the shape the recovery engine expects. */
export function discretionaryCategories(profile: SpendingProfile): SpendCategory[] {
  return profile.categories
    .filter((c) => c.discretionary && c.weekly > 0)
    .map((c) => ({ id: c.cat, label: c.label, emoji: c.emoji, weekly: c.weekly }));
}
