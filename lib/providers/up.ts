import type { Account, AccountType, Txn } from "../types";
import type { BankProvider } from "./types";

const BASE = "https://api.up.com.au/api/v1";

interface UpAccount {
  id: string;
  attributes: {
    displayName: string;
    accountType: "SAVER" | "TRANSACTIONAL" | string;
    balance: { valueInBaseUnits: number }; // cents
  };
}

interface UpTxn {
  id: string;
  attributes: {
    description: string;
    amount: { valueInBaseUnits: number }; // cents, negative = spend
    createdAt: string;
  };
}

function mapType(upType: string): AccountType {
  return upType === "SAVER" ? "SAVINGS" : "BANK";
}

/**
 * Live, read-only Up bank connection. Token stays server-side (this only ever
 * runs in route handlers). If no token is set, callers should skip it — the app
 * still boots from seed data.
 */
export class UpProvider implements BankProvider {
  readonly name = "Up";
  private token: string;

  constructor(token: string) {
    this.token = token;
  }

  static fromEnv(): UpProvider | null {
    const token = process.env.UP_TOKEN;
    if (!token || token.startsWith("up:yeah:xxxx")) return null;
    return new UpProvider(token);
  }

  private async get<T>(path: string): Promise<T> {
    const res = await fetch(`${BASE}${path}`, {
      headers: { Authorization: `Bearer ${this.token}` },
      cache: "no-store",
    });
    if (!res.ok) {
      throw new Error(`Up API ${res.status} on ${path}`);
    }
    return (await res.json()) as T;
  }

  async getAccounts(): Promise<Account[]> {
    const data = await this.get<{ data: UpAccount[] }>("/accounts");
    return data.data.map((a) => ({
      id: a.id,
      name: a.attributes.displayName,
      type: mapType(a.attributes.accountType),
      balance: a.attributes.balance.valueInBaseUnits / 100,
      live: true,
    }));
  }

  async getTransactions(accountId: string, limit = 20): Promise<Txn[]> {
    const data = await this.get<{ data: UpTxn[] }>(
      `/accounts/${accountId}/transactions?page[size]=${limit}`,
    );
    return data.data.map((t) => ({
      id: t.id,
      description: t.attributes.description,
      amount: t.attributes.amount.valueInBaseUnits / 100,
      createdAt: t.attributes.createdAt,
    }));
  }
}
