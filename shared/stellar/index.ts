import * as StellarSdk from "stellar-sdk";
import type { AnchorKYCAttestation } from "@veritas/types";

const HORIZON_URL = process.env.STELLAR_HORIZON_URL || "https://horizon-testnet.stellar.org";
const SOROBAN_RPC_URL = process.env.STELLAR_SOROBAN_RPC_URL || "https://soroban-testnet.stellar.org";
const NETWORK_PASSPHRASE =
  process.env.STELLAR_NETWORK_PASSPHRASE || "Test SDF Network ; September 2015";

export const server = new StellarSdk.Horizon.Server(HORIZON_URL);
export const sorobanRpc = new StellarSdk.SorobanRpc.Server(SOROBAN_RPC_URL);

export function getNetworkPassphrase(): string {
  return NETWORK_PASSPHRASE;
}

export async function verifyKYCAttestation(attestation: AnchorKYCAttestation): Promise<boolean> {
  try {
    const account = await server.loadAccount(attestation.accountId);
    const signers = account.signers;

    const trustedAnchors = getTrustedAnchors();
    const anchorKey = trustedAnchors[attestation.anchor];
    if (!anchorKey) return false;

    const isValid = signers.some((s) => s.key === anchorKey && s.weight >= 1);
    const isExpired = attestation.expiresAt < Date.now();

    return isValid && !isExpired;
  } catch {
    return false;
  }
}

export function getTrustedAnchors(): Record<string, string> {
  return {
    moneygram: process.env.MONEYGRAM_SIGNING_KEY || "",
    circle: process.env.CIRCLE_SIGNING_KEY || "",
    stellar_anchor: process.env.STELLAR_ANCHOR_SIGNING_KEY || "",
  };
}

export async function submitTransaction(
  contractAddress: string,
  method: string,
  args: StellarSdk.xdr.ScVal[],
  sourceKeypair: StellarSdk.Keypair
): Promise<StellarSdk.SorobanRpc.Api.SendTransactionResponse> {
  const sourceAccount = await server.loadAccount(sourceKeypair.publicKey());

  const contract = new StellarSdk.Contract(contractAddress);
  const transaction = new StellarSdk.TransactionBuilder(sourceAccount, {
    fee: "100000",
    networkPassphrase: getNetworkPassphrase(),
  })
    .addOperation(contract.call(method, ...args))
    .setTimeout(300)
    .build();

  transaction.sign(sourceKeypair);

  return sorobanRpc.sendTransaction(transaction);
}

export async function watchTransaction(
  txHash: string,
  maxAttempts = 30
): Promise<StellarSdk.SorobanRpc.Api.GetTransactionResponse> {
  for (let i = 0; i < maxAttempts; i++) {
    const response = await sorobanRpc.getTransaction(txHash);
    if (response.status !== "NOT_FOUND") return response;
    await new Promise((r) => setTimeout(r, 1000));
  }
  throw new Error("Transaction not confirmed within timeout");
}
