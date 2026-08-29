import type { Account, DemoUser, Goal, SpendCategory, Txn } from "@/lib/types";

/**
 * One hardcoded demo person: Stephan. The map, the engine and the coach all
 * run off this seed when no live bank token is present.
 */

export const seedUser: DemoUser = {
  firstName: "Stephan",
  name: "Stephan",
};

// Super isn't in Australia's CDR yet, so it's a manual entry.
export const seedManualAccounts: Account[] = [
  { id: "super-1", name: "AustralianSuper", type: "SUPER", balance: 28400, live: false },
];

export const seedDemoBankAccounts: Account[] = [
  { id: "stephan-spend", name: "Everyday", type: "BANK", balance: 642.2, live: false },
  { id: "stephan-saver", name: "Board fund", type: "SAVINGS", balance: 180, live: false },
];

/** Weeks from today as an ISO date — keeps the demo's deadline in the near future. */
function weeksFromNow(weeks: number): string {
  const d = new Date();
  d.setDate(d.getDate() + weeks * 7);
  return d.toISOString().slice(0, 10);
}

export const seedSurfboard: Goal = {
  id: "goal-surfboard",
  name: "Channel Islands surfboard",
  description: "6'2 CI twin fin for the next swell season.",
  target: 1000,
  saved: 180,
  deadline: weeksFromNow(7),
  savedThisWeek: 40,
  emoji: "🏄",
  discretionaryOverspend: 0,
};

/** Back-compat for the Up webhook and anything still expecting a single goal. */
export const seedGoal: Goal = seedSurfboard;

export const seedGoals: Goal[] = [seedSurfboard];

/**
 * Discretionary buckets the coach can tell Stephan to trim after a blow-out.
 */
export const seedCategories: SpendCategory[] = [
  { id: "nightlife", label: "Drinks & nights out", emoji: "🍺", weekly: 78 },
  { id: "eatingOut", label: "Takeaway & eating out", emoji: "🥡", weekly: 84 },
  { id: "coffee", label: "Coffee", emoji: "☕", weekly: 28 },
  { id: "subscriptions", label: "Subscriptions", emoji: "📺", weekly: 32 },
];

/**
 * ~4 weeks of Stephan's banking: fortnightly pay, rent, bills, and the
 * discretionary spend the engine uses to work out when the board is realistic.
 */
export const seedTransactions: Record<string, Txn[]> = {
  "stephan-spend": [
    // fortnightly salary
    { id: "t1", description: "Payroll — Harbour Digital", amount: 1240, createdAt: day(2, 9) },
    { id: "t2", description: "Payroll — Harbour Digital", amount: 1240, createdAt: day(16, 9) },
    // rent
    { id: "t3", description: "Rent — Coogee", amount: -480, createdAt: day(3) },
    { id: "t4", description: "Rent — Coogee", amount: -480, createdAt: day(17) },
    // bills
    { id: "t5", description: "Origin Energy", amount: -86, createdAt: day(8) },
    { id: "t6", description: "Optus", amount: -62, createdAt: day(11) },
    // groceries
    { id: "t7", description: "Coles Bondi Junction", amount: -64.2, createdAt: day(1) },
    { id: "t8", description: "Woolworths Metro", amount: -41.5, createdAt: day(6) },
    { id: "t9", description: "ALDI", amount: -38.9, createdAt: day(12) },
    { id: "t10", description: "Coles Bondi Junction", amount: -72.1, createdAt: day(20) },
    { id: "t11", description: "Woolworths Metro", amount: -55.4, createdAt: day(26) },
    // eating out
    { id: "t12", description: "Uber Eats", amount: -32.4, createdAt: day(1, 20) },
    { id: "t13", description: "Guzman y Gomez", amount: -19.5, createdAt: day(5) },
    { id: "t14", description: "Boathouse Restaurant", amount: -48.0, createdAt: day(9) },
    { id: "t15", description: "Menulog", amount: -27.8, createdAt: day(14) },
    { id: "t16", description: "Sushi Hub", amount: -16.5, createdAt: day(22) },
    // coffee
    { id: "t17", description: "Single O Coffee", amount: -5.5, createdAt: day(1, 8) },
    { id: "t18", description: "Campos Coffee", amount: -5.2, createdAt: day(4, 8) },
    { id: "t19", description: "Toby's Estate Coffee", amount: -4.8, createdAt: day(8, 8) },
    { id: "t20", description: "Single O Coffee", amount: -5.5, createdAt: day(15, 8) },
    // transport
    { id: "t21", description: "Opal top-up", amount: -40, createdAt: day(3, 8) },
    { id: "t22", description: "Opal top-up", amount: -40, createdAt: day(18, 8) },
    // subscriptions
    { id: "t23", description: "Spotify", amount: -12.99, createdAt: day(5) },
    { id: "t24", description: "Netflix", amount: -18.99, createdAt: day(9, 2) },
    // nights out — the pattern the coach will call out
    { id: "t25", description: "The Winery Bar", amount: -54.0, createdAt: day(7, 21) },
    { id: "t26", description: "Dan Murphy's", amount: -38.0, createdAt: day(16, 19) },
    { id: "t27", description: "Coogee Bay Hotel pub", amount: -64.0, createdAt: day(4, 22) },
    { id: "t28", description: "Amazon AU", amount: -49.0, createdAt: day(13) },
    { id: "t29", description: "BWS", amount: -36.0, createdAt: day(21, 20) },
  ],
  "stephan-saver": [
    { id: "s1", description: "Auto-transfer → Board fund", amount: 40, createdAt: day(2) },
    { id: "s2", description: "Round-ups", amount: 6.2, createdAt: day(10) },
    { id: "s3", description: "Auto-transfer → Board fund", amount: 40, createdAt: day(16) },
  ],
};

/** ISO timestamp `days` (and optional `hour` of day) in the past. */
function day(days: number, hour = 12): string {
  const d = new Date(Date.now() - days * 86400_000);
  d.setHours(hour, 0, 0, 0);
  return d.toISOString();
}

/** Net worth = assets minus loans, across every node. */
export function netWorth(accounts: Account[]): number {
  return accounts.reduce(
    (sum, a) => sum + (a.type === "LOAN" ? -Math.abs(a.balance) : a.balance),
    0,
  );
}
