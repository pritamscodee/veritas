import { ANCHOR_PROVIDERS } from "@veritas/constants";
import type { AnchorProvider } from "@veritas/types";

export type RampDirection = "deposit" | "withdraw";

export interface RampAnchor {
  provider: AnchorProvider;
  name: string;
  /** SEP-24 transfer server URL. */
  transferServer: string;
  /** SEP-1 stellar.toml host for discovery. */
  homeDomain: string;
  currencies: string[];
  countries: string[];
  isActive: boolean;
}

export interface RampRequest {
  provider: AnchorProvider;
  direction: RampDirection;
  accountId: string;
  assetCode: string;
  amount: string;
  language?: string;
  memo?: string;
}

export interface RampUrl {
  provider: AnchorProvider;
  direction: RampDirection;
  /** Interactive SEP-24 URL the user opens to complete KYC + transfer. */
  url: string;
  transactionId?: string;
}

/**
 * Stellar On/Off Ramp use case (SEP-24 interactive flows).
 * Veritas voters use regulated anchors to convert fiat <-> XLM so they can
 * pay election fees or receive rewards without leaving the Stellar network.
 */
export const RAMP_ANCHORS: RampAnchor[] = [
  {
    provider: ANCHOR_PROVIDERS.MONEYGRAM,
    name: "MoneyGram",
    transferServer: "https://api.moneygram.com/sep24",
    homeDomain: "moneygram.com",
    currencies: ["USD", "EUR", "GBP", "MXN"],
    countries: ["US", "MX", "PH", "KE"],
    isActive: true,
  },
  {
    provider: ANCHOR_PROVIDERS.CIRCLE,
    name: "Circle (USDC)",
    transferServer: "https://api.circle.com/sep24",
    homeDomain: "circle.com",
    currencies: ["USD", "EUR"],
    countries: ["US", "EU"],
    isActive: true,
  },
  {
    provider: ANCHOR_PROVIDERS.STELLAR_ANCHOR,
    name: "Stellar Anchor (reference)",
    transferServer: "https://testanchor.stellar.org/sep24",
    homeDomain: "testanchor.stellar.org",
    currencies: ["USD", "XLM"],
    countries: ["*"],
    isActive: true,
  },
];

export function listRampAnchors(): RampAnchor[] {
  return RAMP_ANCHORS.filter((a) => a.isActive);
}

/** Build a SEP-24 interactive deposit/withdraw URL for the chosen anchor. */
export function buildRampUrl(req: RampRequest): RampUrl {
  const anchor = RAMP_ANCHORS.find((a) => a.provider === req.provider);
  if (!anchor) throw new Error(`Unknown ramp provider: ${req.provider}`);

  const params = new URLSearchParams({
    asset_code: req.assetCode,
    account: req.accountId,
    amount: req.amount,
    ...(req.language ? { lang: req.language } : {}),
    ...(req.memo ? { memo: req.memo } : {}),
  });

  const base =
    req.direction === "deposit"
      ? `${anchor.transferServer}/transactions/deposit/interactive`
      : `${anchor.transferServer}/transactions/withdraw/interactive`;

  return {
    provider: req.provider,
    direction: req.direction,
    url: `${base}?${params.toString()}`,
  };
}
