import type { Account, Txn } from "../types";
import type { BankProvider } from "./types";

/**
 * Stub only. Basiq is the CDR aggregator that would let Knodle connect to every
 * Australian bank, not just Up. It's the pitch ("one integration, every bank"),
 * not the weekend build — hence the empty implementation behind the same
 * interface. Swapping providers is a one-line change at the call site.
 */
export class BasiqProvider implements BankProvider {
  readonly name = "Basiq";

  async getAccounts(): Promise<Account[]> {
    return [];
  }

  async getTransactions(): Promise<Txn[]> {
    return [];
  }
}
