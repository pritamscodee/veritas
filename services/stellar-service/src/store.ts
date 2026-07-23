import StellarSdk from "stellar-sdk";

export interface PaymentRecord {
  id: string;
  kind: "election_fee" | "voter_reward" | "transfer";
  source: string;
  destination: string;
  amount: string;
  asset: string;
  electionId?: string;
  hash: string;
  createdAt: number;
}

export interface AssetRecord {
  id: string;
  code: string;
  issuer: string;
  asset: string;
  contractAddress: string;
  totalSupply: string;
  txHash: string;
  createdAt: number;
}

export interface StakeRecord {
  account: string;
  tokenContract: string;
  staked: string;
  votingPower: string;
  lockSeconds: number;
  unlockAt: number;
  updatedAt: number;
}

class Store {
  payments: PaymentRecord[] = [];
  assets: AssetRecord[] = [];
  stakes: Map<string, StakeRecord> = new Map();

  addPayment(p: Omit<PaymentRecord, "id" | "createdAt">): PaymentRecord {
    const record: PaymentRecord = { ...p, id: StellarSdk.Keypair.random().publicKey().slice(0, 16), createdAt: Date.now() };
    this.payments.unshift(record);
    return record;
  }

  addAsset(a: Omit<AssetRecord, "id" | "createdAt">): AssetRecord {
    const record: AssetRecord = { ...a, id: StellarSdk.Keypair.random().publicKey().slice(0, 16), createdAt: Date.now() };
    this.assets.unshift(record);
    return record;
  }

  setStake(r: StakeRecord): StakeRecord {
    this.stakes.set(r.account, r);
    return r;
  }

  getStake(account: string): StakeRecord | undefined {
    return this.stakes.get(account);
  }
}

export const store = new Store();
