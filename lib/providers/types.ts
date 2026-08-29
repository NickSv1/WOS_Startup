import type { Account, Txn } from "../types";

/**
 * One interface, many banks. Today only UpProvider is wired to a live account;
 * BasiqProvider is a stub so "scale to every Australian bank" is a one-file
 * story for the judges, not a rebuild.
 */
export interface BankProvider {
  readonly name: string;
  /** Read-only: the user's accounts with current balances. */
  getAccounts(): Promise<Account[]>;
  /** Read-only: recent transactions for one account. */
  getTransactions(accountId: string, limit?: number): Promise<Txn[]>;
}
