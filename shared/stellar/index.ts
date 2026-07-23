import * as StellarSdk from "stellar-sdk";
import type { AnchorKYCAttestation } from "@veritas/types";

function getHorizonUrl(): string {
  return process.env.STELLAR_HORIZON_URL || "https://horizon-testnet.stellar.org";
}

function getRpcUrl(): string {
  return process.env.STELLAR_SOROBAN_RPC_URL || "https://soroban-testnet.stellar.org";
}

function getNetworkPassphrase(): string {
  return process.env.STELLAR_NETWORK_PASSPHRASE || "Test SDF Network ; September 2015";
}

let _server: StellarSdk.Horizon.Server | null = null;
let _sorobanRpc: StellarSdk.SorobanRpc.Server | null = null;

export function getServer(): StellarSdk.Horizon.Server {
  if (!_server) _server = new StellarSdk.Horizon.Server(getHorizonUrl());
  return _server;
}

export function getSorobanRpc(): StellarSdk.SorobanRpc.Server {
  if (!_sorobanRpc) _sorobanRpc = new StellarSdk.SorobanRpc.Server(getRpcUrl());
  return _sorobanRpc;
}

export async function verifyKYCAttestation(attestation: AnchorKYCAttestation): Promise<boolean> {
  try {
    const server = getServer();
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
  const server = getServer();
  const sorobanRpc = getSorobanRpc();
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
  const sorobanRpc = getSorobanRpc();
  for (let i = 0; i < maxAttempts; i++) {
    const response = await sorobanRpc.getTransaction(txHash);
    if (response.status !== "NOT_FOUND") return response;
    await new Promise((r) => setTimeout(r, 1000));
  }
  throw new Error("Transaction not confirmed within timeout");
}
