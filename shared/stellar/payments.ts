import * as StellarSdk from "stellar-sdk";
import { STELLAR } from "@veritas/constants";

const HORIZON_URL = STELLAR.HORIZON_URL;
const NETWORK_PASSPHRASE = STELLAR.NETWORK_PASSPHRASE;

function server(): StellarSdk.Horizon.Server {
  return new StellarSdk.Horizon.Server(HORIZON_URL);
}

export interface PaymentRequest {
  sourceKeypair: StellarSdk.Keypair;
  destination: string;
  amount: string;
  asset?: StellarSdk.Asset;
  memo?: string;
}

export interface PaymentResult {
  hash: string;
  source: string;
  destination: string;
  amount: string;
  asset: string;
  createdAt: string;
}

/**
 * Stellar Payments use case.
 * Send XLM (or any issued asset) from one account to another. This powers
 * election fees, voter rewards, and treasury disbursements in Veritas.
 */
export async function sendPayment(req: PaymentRequest): Promise<PaymentResult> {
  const horizon = server();
  const asset = req.asset ?? StellarSdk.Asset.native();
  const sourceAccount = await horizon.loadAccount(req.sourceKeypair.publicKey());

  const txBuilder = new StellarSdk.TransactionBuilder(sourceAccount, {
    fee: StellarSdk.BASE_FEE,
    networkPassphrase: NETWORK_PASSPHRASE,
  }).addOperation(
    StellarSdk.Operation.payment({
      destination: req.destination,
      asset,
      amount: req.amount,
    })
  );

  if (req.memo) {
    txBuilder.addMemo(StellarSdk.Memo.text(req.memo));
  }

  const tx = txBuilder.setTimeout(30).build();
  tx.sign(req.sourceKeypair);

  const result = await horizon.submitTransaction(tx);
  return {
    hash: result.hash,
    source: req.sourceKeypair.publicKey(),
    destination: req.destination,
    amount: req.amount,
    asset: asset.code,
    createdAt: new Date().toISOString(),
  };
}

/** Create and fund a new Stellar account (used when onboarding voters). */
export async function createAccount(
  funderKeypair: StellarSdk.Keypair,
  newAccountPublicKey: string,
  startingBalance: string
): Promise<string> {
  const horizon = server();
  const sourceAccount = await horizon.loadAccount(funderKeypair.publicKey());
  const tx = new StellarSdk.TransactionBuilder(sourceAccount, {
    fee: StellarSdk.BASE_FEE,
    networkPassphrase: NETWORK_PASSPHRASE,
  })
    .addOperation(
      StellarSdk.Operation.createAccount({
        destination: newAccountPublicKey,
        startingBalance,
      })
    )
    .setTimeout(30)
    .build();

  tx.sign(funderKeypair);
  const result = await horizon.submitTransaction(tx);
  return result.hash;
}

/** Fetch recent payments for an account (paginated via Horizon). */
export async function getPaymentHistory(
  accountId: string,
  limit = 20
): Promise<PaymentResult[]> {
  const horizon = server();
  const transactions = await horizon
    .payments()
    .forAccount(accountId)
    .order("desc")
    .limit(limit)
    .call();

  return transactions.records
    .filter((r: any) => r.type === "payment" || r.type === "create_account")
    .map((r: any) => ({
      hash: r.transaction_hash,
      source: r.from ?? r.funder ?? accountId,
      destination: r.to ?? r.account ?? accountId,
      amount: r.amount ?? (r as any).starting_balance ?? "0",
      asset: (r.asset_type === "native" ? "XLM" : r.asset_code) ?? "XLM",
      createdAt: r.created_at,
    }));
}

export async function getAccountBalance(accountId: string): Promise<string> {
  const horizon = server();
  const account = await horizon.loadAccount(accountId);
  const native = account.balances.find(
    (b: any) => b.asset_type === "native"
  ) as any;
  return native ? native.balance : "0";
}
