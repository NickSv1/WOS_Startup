export type AccountType =
  | "BANK"
  | "SAVINGS"
  | "SUPER"
  | "INVESTMENT"
  | "PROPERTY"
  | "LOAN";

export interface Account {
  id: string;
  name: string;
  type: AccountType;
  balance: number;
  live: boolean;
}

export interface Txn {
  id: string;
  description: string;
  amount: number; // negative = spend
  createdAt: string;
}

export interface Goal {
  id: string;
  name: string;
  target: number;
  saved: number;
  deadline: string; // ISO date
  savedThisWeek: number;
  /** Big emoji / vision for the thing you're saving for — the motivational hook. */
  emoji?: string;
  /** What it is, in the user's words. */
  description?: string;
  /** Cumulative discretionary overspend since the plan started. Pushes the finish out. */
  discretionaryOverspend?: number;
}

export interface DemoUser {
  firstName: string;
  name: string;
}

/** A discretionary spending bucket the user can trim to claw back weeks. */
export interface SpendCategory {
  id: string;
  label: string;
  emoji: string;
  weekly: number; // typical spend per week
}

/** The relationship an account has to the "You" node. */
export type EdgeKind = "owns" | "owes" | "contributes to";
