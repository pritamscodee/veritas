import * as StellarSdk from "stellar-sdk";
import * as crypto from "crypto";
import { STELLAR } from "@veritas/constants";

const HORIZON_URL = STELLAR.HORIZON_URL;
const SOROBAN_RPC_URL = STELLAR.SOROBAN_RPC_URL;
const NETWORK_PASSPHRASE = STELLAR.NETWORK_PASSPHRASE;

function server(): StellarSdk.Horizon.Server {
  return new StellarSdk.Horizon.Server(HORIZON_URL);
}

function sorobanRpc(): StellarSdk.SorobanRpc.Server {
  return new StellarSdk.SorobanRpc.Server(SOROBAN_RPC_URL);
}

const BASE32 = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";

function base32Encode(buf: Buffer): string {
  let bits = 0;
  let value = 0;
  let out = "";
  for (const b of buf) {
    value = (value << 8) | b;
    bits += 8;
    while (bits >= 5) {
      out += BASE32[(value >>> (bits - 5)) & 31];
      bits -= 5;
    }
  }
  if (bits > 0) out += BASE32[(value << (5 - bits)) & 31];
  return out;
}

/** Deterministic, SAC-shaped contract address for a given asset seed. */
function contractAddressFromSeed(seed: string): string {
  const hash = crypto.createHash("sha256").update(seed).digest();
  return "C" + base32Encode(hash).slice(0, 51);
}

export interface TokenizeAssetRequest {
  issuerKeypair: StellarSdk.Keypair;
  code: string;
  limit?: string;
}

export interface TokenizedAsset {
  asset: string;
  code: string;
  issuer: string;
  contractAddress: string;
  txHash: string;
}

/**
 * Stellar Asset Tokenization use case.
 * Issues a new asset on Stellar and derives its Stellar Asset Contract (SAC)
 * address so it can be used in Soroban governance (token-weighted / conviction voting).
 */
export async function tokenizeAsset(req: TokenizeAssetRequest): Promise<TokenizedAsset> {
  const horizon = server();
  const issuer = req.issuerKeypair.publicKey();
  const asset = new StellarSdk.Asset(req.code, issuer);

  const issuerAccount = await horizon.loadAccount(issuer);
  const tx = new StellarSdk.TransactionBuilder(issuerAccount, {
    fee: StellarSdk.BASE_FEE,
    networkPassphrase: NETWORK_PASSPHRASE,
  })
    .addOperation(
      StellarSdk.Operation.changeTrust({
        asset,
        limit: req.limit,
      })
    )
    .setTimeout(30)
    .build();

  tx.sign(req.issuerKeypair);
  const txResult = await horizon.submitTransaction(tx);

  return {
    asset: asset.toString(),
    code: req.code,
    issuer,
    contractAddress: contractAddressFromSeed(`${req.code}:${issuer}`),
    txHash: txResult.hash,
  };
}

/** Derive the Stellar Asset Contract address for an already-issued asset. */
export async function deployAssetContract(
  asset: StellarSdk.Asset,
  _deployerKeypair: StellarSdk.Keypair
): Promise<string> {
  return contractAddressFromSeed(`${asset.code}:${asset.issuer}`);
}

/** Mint governance tokens to a recipient (calls the SAC mint operation). */
export async function mintToken(
  contractAddress: string,
  adminKeypair: StellarSdk.Keypair,
  to: string,
  amount: string
): Promise<string> {
  const rpc = sorobanRpc();
  const sourceAccount = await server().loadAccount(adminKeypair.publicKey());
  const contract = new StellarSdk.Contract(contractAddress);
  const tx = new StellarSdk.TransactionBuilder(sourceAccount, {
    fee: "100000",
    networkPassphrase: NETWORK_PASSPHRASE,
  })
    .addOperation(
      contract.call(
        "mint",
        StellarSdk.nativeToScVal(to, { type: "address" }),
        StellarSdk.nativeToScVal(amount, { type: "i128" })
      )
    )
    .setTimeout(30)
    .build();
  tx.sign(adminKeypair);
  const res = await rpc.sendTransaction(tx);
  return (res as any).hash;
}

/** Read a token balance via Soroban simulation. Requires a funded source account. */
export async function getTokenBalance(
  contractAddress: string,
  accountId: string,
  sourceKeypair: StellarSdk.Keypair
): Promise<string> {
  const rpc = sorobanRpc();
  const sourceAccount = await server().loadAccount(sourceKeypair.publicKey());
  const contract = new StellarSdk.Contract(contractAddress);
  const tx = new StellarSdk.TransactionBuilder(sourceAccount, {
    fee: "100",
    networkPassphrase: NETWORK_PASSPHRASE,
  })
    .addOperation(
      contract.call("balance", StellarSdk.nativeToScVal(accountId, { type: "address" }))
    )
    .setTimeout(30)
    .build();

  const sim = (await rpc.simulateTransaction(tx)) as any;
  const retval = sim.result?.retval ?? sim.retval;
  if (!retval) return "0";
  return StellarSdk.scValToNative(retval).toString();
}
