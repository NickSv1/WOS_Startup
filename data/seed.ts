import type { Account, DemoUser, Goal, SpendCategory, SpendSwitch, Txn } from "@/lib/types";

/**
 * One hardcoded demo person: Hayley. The map, the engine and the coach all
 * run off this seed when no live bank token is present.
 */

export const seedUser: DemoUser = {
  firstName: "Hayley",
  name: "Hayley",
};

// Super isn't in Australia's CDR yet, so it's a manual entry.
export const seedManualAccounts: Account[] = [
  { id: "super-1", name: "AustralianSuper", type: "SUPER", balance: 28400, live: false },
  { id: "invest-1", name: "Investments", type: "INVESTMENT", balance: 2140, live: false },
];

export const seedDemoBankAccounts: Account[] = [
  { id: "hayley-spend", name: "Everyday", type: "BANK", balance: 642.2, live: false },
  { id: "hayley-saver", name: "Board fund", type: "SAVINGS", balance: 180, live: false },
];

/** Weeks from today as an ISO date — keeps the demo's deadline in the near future. */
function weeksFromNow(weeks: number): string {
  const d = new Date();
  d.setDate(d.getDate() + weeks * 7);
  return d.toISOString().slice(0, 10);
}

function weeksAgo(weeks: number): string {
  const d = new Date();
  d.setDate(d.getDate() - weeks * 7);
  return d.toISOString().slice(0, 10);
}

export const seedWetsuit: Goal = {
  id: "goal-wetsuit",
  name: "3/2 steamer wetsuit",
  description: "Rip Curl E-Bomb for winter dawnies — already on the rack.",
  target: 320,
  saved: 320,
  deadline: weeksAgo(2),
  savedThisWeek: 0,
  emoji: "🤿",
  completedAt: weeksAgo(2),
};

export const seedLaneway: Goal = {
  id: "goal-laneway",
  name: "BTV Festival",
  description: "Ticket + trains. Done and dusted.",
  target: 180,
  saved: 180,
  deadline: weeksAgo(5),
  savedThisWeek: 0,
  emoji: "🎟️",
  completedAt: weeksAgo(5),
};

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

/** Off-track from weekday $8 coffees — the goal you tap to fix. */
export const seedByron: Goal = {
  id: "goal-byron",
  name: "Sydney Trip",
  description: "Weekend in the city — Bondi, the Opera House, and a night out.",
  target: 650,
  saved: 110,
  deadline: weeksFromNow(3),
  savedThisWeek: 18,
  emoji: "🏙️",
  discretionaryOverspend: 100,
  slip: {
    date: day(1, 8),
    label: "Single O large flat white",
    amount: 8,
  },
};

export const seedJapan: Goal = {
  id: "goal-japan",
  name: "Japan powder trip",
  description: "Niseko week with the Harbour crew next winter.",
  target: 2800,
  saved: 640,
  deadline: weeksFromNow(22),
  savedThisWeek: 40,
  emoji: "🎿",
};

/** Back-compat for the Up webhook and anything still expecting a single goal. */
export const seedGoal: Goal = seedSurfboard;

export const seedGoals: Goal[] = [
  seedWetsuit,
  seedLaneway,
  seedByron,
  seedSurfboard,
  seedJapan,
];

/**
 * Cheaper swaps spotted on Hayley's bank feed. Turning one on adds $/week
 * and can restore a slipped deadline instead of pushing the date.
 */
export const seedSpendSwitches: SpendSwitch[] = [
  {
    id: "switch-woolies",
    emoji: "🛒",
    habit: "Weekly grocery shop",
    fromMerchant: "Woolworths",
    fromPrice: 70,
    fromDomain: "woolworths.com.au",
    toMerchant: "ALDI",
    toPrice: 56,
    toDomain: "aldi.com.au",
    timesPerWeek: 1,
    partner: "ALDI",
    categoryId: "groceries",
    sourceNote: "Woolworths Metro · 2× this month on Everyday",
    couponCode: "ALDI20",
  },
  {
    id: "switch-coffee",
    emoji: "☕",
    habit: "Weekday flat whites",
    fromMerchant: "Single O",
    fromPrice: 8,
    fromDomain: "singleo.com.au",
    toMerchant: "Starbucks",
    toPrice: 6.4,
    toDomain: "starbucks.com",
    timesPerWeek: 5,
    partner: "Starbucks",
    categoryId: "coffee",
    sourceNote: "Single O Coffee · $8 large · 5× last week",
    couponCode: "STARFLAT",
  },
  {
    id: "switch-eats",
    emoji: "🥡",
    habit: "Weeknight takeaway",
    fromMerchant: "Uber Eats",
    fromPrice: 32,
    fromDomain: "ubereats.com",
    toMerchant: "Guzman y Gomez",
    toPrice: 19.5,
    toDomain: "guzmanygomez.com.au",
    timesPerWeek: 2,
    partner: "Guzman y Gomez",
    categoryId: "eatingOut",
    sourceNote: "Uber Eats · $32.40 Tuesday night",
    couponCode: "GYG15",
  },
  {
    id: "switch-drinks",
    emoji: "🍺",
    habit: "Thursday schooners",
    fromMerchant: "Coogee Bay Hotel",
    fromPrice: 14,
    fromDomain: "coogeebayhotel.com.au",
    toMerchant: "Dan Murphy's",
    toPrice: 6,
    toDomain: "danmurphys.com.au",
    timesPerWeek: 4,
    partner: "Dan Murphy's",
    categoryId: "nightlife",
    sourceNote: "Coogee Bay Hotel pub · $64 Thursday",
    couponCode: "DAN10",
  },
  {
    id: "switch-netflix",
    emoji: "📺",
    habit: "Streaming",
    fromMerchant: "Netflix",
    fromPrice: 18.99,
    fromDomain: "netflix.com",
    toMerchant: "Binge",
    toPrice: 10,
    toDomain: "binge.com.au",
    timesPerWeek: 1,
    partner: "Binge",
    categoryId: "subscriptions",
    sourceNote: "Netflix · $18.99 monthly on Everyday",
    couponCode: "BINGE1",
  },
];

/**
 * Discretionary buckets the coach can tell Hayley to trim after a blow-out.
 */
export const seedCategories: SpendCategory[] = [
  { id: "nightlife", label: "Drinks & nights out", emoji: "🍺", weekly: 78 },
  { id: "eatingOut", label: "Takeaway & eating out", emoji: "🥡", weekly: 84 },
  { id: "coffee", label: "Coffee", emoji: "☕", weekly: 40 },
  { id: "subscriptions", label: "Subscriptions", emoji: "📺", weekly: 32 },
];

/**
 * ~4 weeks of Hayley's banking: fortnightly pay, rent, bills, and the
 * discretionary spend the engine uses to work out when a goal is realistic.
 */
export const seedTransactions: Record<string, Txn[]> = {
  "hayley-spend": [
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
    { id: "t17", description: "Single O Coffee", amount: -8.0, createdAt: day(1, 8) },
    { id: "t18", description: "Single O Coffee", amount: -8.0, createdAt: day(2, 8) },
    { id: "t19", description: "Single O Coffee", amount: -8.0, createdAt: day(3, 8) },
    { id: "t20", description: "Campos Coffee", amount: -5.0, createdAt: day(4, 8) },
    { id: "t20b", description: "Toby's Estate Coffee", amount: -4.8, createdAt: day(8, 8) },
    { id: "t20c", description: "Single O Coffee", amount: -8.0, createdAt: day(9, 8) },
    { id: "t20d", description: "Single O Coffee", amount: -8.0, createdAt: day(10, 8) },
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
  "hayley-saver": [
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
