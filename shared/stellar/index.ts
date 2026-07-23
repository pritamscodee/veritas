import * as StellarSdk from "stellar-sdk";
import { ANCHOR_SIGNING_KEYS } from "@veritas/constants";

export * from "./anchors";
export * from "./payments";
export * from "./assets";
export * from "./ramp";
export * from "./defi";

// --- Connection helpers (legacy) ---
const HORIZON_URL = process.env.STELLAR_HORIZON_URL || "https://horizon-testnet.stellar.org";
const SOROBAN_RPC_URL =
  process.env.STELLAR_SOROBAN_RPC_URL || "https://soroban-testnet.stellar.org";
const NETWORK_PASSPHRASE =
  process.env.STELLAR_NETWORK_PASSPHRASE || "Test SDF Network ; September 2015";

let _server: StellarSdk.Horizon.Server | null = null;
let _sorobanRpc: StellarSdk.SorobanRpc.Server | null = null;

export function getServer(): StellarSdk.Horizon.Server {
  if (!_server) _server = new StellarSdk.Horizon.Server(HORIZON_URL);
  return _server;
}

export function getSorobanRpc(): StellarSdk.SorobanRpc.Server {
  if (!_sorobanRpc) _sorobanRpc = new StellarSdk.SorobanRpc.Server(SOROBAN_RPC_URL);
  return _sorobanRpc;
}

export function getNetworkPassphrase(): string {
  return NETWORK_PASSPHRASE;
}

export async function verifyKYCAttestation(attestation: {
  accountId: string;
  anchor: string;
  expiresAt: number;
}): Promise<boolean> {
  try {
    const server = getServer();
    const account = await server.loadAccount(attestation.accountId);
    const anchorKey = ANCHOR_SIGNING_KEYS[attestation.anchor as keyof typeof ANCHOR_SIGNING_KEYS];
    if (!anchorKey) return false;
    const hasAnchorSigner = account.signers.some(
      (s) => s.key === anchorKey && s.weight >= 1
    );
    const isExpired = attestation.expiresAt < Date.now();
    return hasAnchorSigner && !isExpired;
  } catch {
    return false;
  }
}

export async function submitTransaction(
  contractAddress: string,
  method: string,
  args: StellarSdk.xdr.ScVal[],
  sourceKeypair: StellarSdk.Keypair
): Promise<StellarSdk.SorobanRpc.Api.SendTransactionResponse> {
  const server = getServer();
  const sorobanRpc = getSorobanRpc();
  const sourceAccount = await server.loadAccount(sourceKeypair.publicKey());

  const contract = new StellarSdk.Contract(contractAddress);
  const transaction = new StellarSdk.TransactionBuilder(sourceAccount, {
    fee: "100000",
    networkPassphrase: NETWORK_PASSPHRASE,
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
  const sorobanRpc = getSorobanRpc();
  for (let i = 0; i < maxAttempts; i++) {
    const response = await sorobanRpc.getTransaction(txHash);
    if (response.status !== "NOT_FOUND") return response;
    await new Promise((r) => setTimeout(r, 1000));
  }
  throw new Error("Transaction not confirmed within timeout");
}
