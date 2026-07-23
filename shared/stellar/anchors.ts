import * as StellarSdk from "stellar-sdk";
import { STELLAR, ANCHOR_SIGNING_KEYS } from "@veritas/constants";

const HORIZON_URL = STELLAR.HORIZON_URL;
const NETWORK_PASSPHRASE = STELLAR.NETWORK_PASSPHRASE;

function server(): StellarSdk.Horizon.Server {
  return new StellarSdk.Horizon.Server(HORIZON_URL);
}

export { ANCHOR_SIGNING_KEYS };

/**
 * Stellar Anchor basics (SEP-1 / SEP-24).
 * Anchors are entities that connect the Stellar network to the real world:
 * they issue KYC attestations, hold fiat rails, and act as on/off ramps.
 * Veritas relies on regulated anchors (MoneyGram, Circle) for real-human
 * verification, and also exposes a reference anchor endpoint of its own.
 */

export interface StellarToml {
  NETWORK_PASSPHRASE: string;
  TRANSFER_SERVER_SEP0024: string;
  WEB_AUTH_ENDPOINT: string;
  KYC_SERVER: string;
  SIGNING_KEY: string;
  VERSION: string;
}

/** Render a SEP-1 `stellar.toml` for the Veritas reference anchor. */
export function buildStellarToml(signingKey: string, homeDomain: string): StellarToml {
  return {
    NETWORK_PASSPHRASE,
    TRANSFER_SERVER_SEP0024: `https://${homeDomain}/sep24`,
    WEB_AUTH_ENDPOINT: `https://${homeDomain}/auth`,
    KYC_SERVER: `https://${homeDomain}/kyc`,
    SIGNING_KEY: signingKey,
    VERSION: "0.1.0",
  };
}

/** Resolve an anchor's SEP-1 metadata from its home domain. */
export async function resolveAnchorToml(homeDomain: string): Promise<StellarToml> {
  const res = await fetch(`https://${homeDomain}/.well-known/stellar.toml`);
  if (!res.ok) throw new Error(`Failed to resolve stellar.toml for ${homeDomain}`);
  const toml = await res.text();
  const parsed: Record<string, string> = {};
  for (const line of toml.split("\n")) {
    const m = line.match(/^([A-Z_]+)\s*=\s*"?([^"\n]*)"?\s*$/);
    if (m) parsed[m[1]] = m[2];
  }
  return {
    NETWORK_PASSPHRASE: parsed.NETWORK_PASSPHRASE ?? NETWORK_PASSPHRASE,
    TRANSFER_SERVER_SEP0024: parsed.TRANSFER_SERVER_SEP0024 ?? "",
    WEB_AUTH_ENDPOINT: parsed.WEB_AUTH_ENDPOINT ?? "",
    KYC_SERVER: parsed.KYC_SERVER ?? "",
    SIGNING_KEY: parsed.SIGNING_KEY ?? "",
    VERSION: parsed.VERSION ?? "0.1.0",
  };
}

export interface TrustAnchorRequest {
  accountKeypair: StellarSdk.Keypair;
  anchorSigningKey: string;
  weight?: number;
}

/** Establish a trustline / add an anchor as a signer on a voter account. */
export async function trustAnchor(req: TrustAnchorRequest): Promise<string> {
  const horizon = server();
  const account = await horizon.loadAccount(req.accountKeypair.publicKey());
  const tx = new StellarSdk.TransactionBuilder(account, {
    fee: StellarSdk.BASE_FEE,
    networkPassphrase: NETWORK_PASSPHRASE,
  })
    .addOperation(
      StellarSdk.Operation.setOptions({
        signer: {
          ed25519PublicKey: req.anchorSigningKey,
          weight: req.weight ?? 1,
        },
      })
    )
    .setTimeout(30)
    .build();
  tx.sign(req.accountKeypair);
  const res = await horizon.submitTransaction(tx);
  return res.hash;
}

export function getTrustedAnchors(): Record<string, string> {
  return { ...ANCHOR_SIGNING_KEYS };
}
