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
  /** Set when the goal is already paid for — shown as DONE on the map. */
  completedAt?: string;
  /** Extra $/week unlocked by switching to cheaper habits. */
  weeklyBoost?: number;
  /** Spend-switch ids already turned on for this goal. */
  appliedSwitchIds?: string[];
  /** Pledges that keep a swap honest against the next bank tap. */
  swapPledges?: SwapPledge[];
  /** The specific blow-out that put this goal off track. */
  slip?: {
    date: string;
    label: string;
    amount: number;
  };
}

export type SwapPledgeStatus = "pledged" | "kept" | "broken";

export interface SwapPledge {
  switchId: string;
  status: SwapPledgeStatus;
  pledgedAt: string;
}

/** Swap a recurring spend for a cheaper option spotted on the bank feed. */
export interface SpendSwitch {
  id: string;
  emoji: string;
  habit: string;
  fromMerchant: string;
  fromPrice: number;
  fromDomain: string;
  toMerchant: string;
  toPrice: number;
  toDomain: string;
  timesPerWeek: number;
  partner?: string;
  categoryId: string;
  /** Short note tying the swap to a real-looking bank line. */
  sourceNote?: string;
  /** Partner code shown after the user reveals the coupon. */
  couponCode?: string;
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
