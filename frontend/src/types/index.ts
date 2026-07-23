export type VotingMethod = "one_person_one_vote" | "quadratic" | "token_weighted" | "conviction";

export type ElectionStatus = "draft" | "registration" | "voting" | "tallying" | "completed" | "cancelled";

export interface Election {
  id: string;
  title: string;
  description: string;
  organizerId: string;
  contractAddress?: string;
  votingMethod: VotingMethod;
  status: ElectionStatus;
  requiredKycLevel: number;
  options: VoteOption[];
  startTime: string;
  endTime: string;
  quorumThreshold: number;
  totalVotes: number;
  createdAt: string;
  updatedAt: string;
}

export interface VoteOption {
  id: string;
  electionId: string;
  label: string;
  description: string;
  position: number;
  metadata?: Record<string, unknown>;
}

export interface ElectionResult {
  optionId: string;
  voteCount: number;
  percentage: number;
}

export interface TallyResult {
  electionId: string;
  results: ElectionResult[];
  totalVotes: number;
  quorumReached: boolean;
  decryptedAt: string;
}

export interface EligibilityCheck {
  eligible: boolean;
  hasCredential: boolean;
  credentialUsed: boolean;
}

export interface ZKProofResponse {
  proof: any;
  publicInputs: string[];
  electionId: string;
  nullifier: string;
  verified: boolean;
}

export interface ServiceHealth {
  gateway: string;
  services: Array<{ service: string; status: string; version?: string }>;
  timestamp: number;
}

// --- Stellar use-case types ---

export type AnchorProvider = "moneygram" | "circle" | "stellar_anchor" | "veritas";

export interface StellarAnchor {
  provider: AnchorProvider;
  name: string;
  signingKey: string;
  transferServer: string;
  homeDomain: string;
  currencies: string[];
  isActive: boolean;
}

export interface Payment {
  hash: string;
  source: string;
  destination: string;
  amount: string;
  asset: string;
  memo?: string;
  createdAt: string;
}

export interface TokenizedAsset {
  asset: string;
  code: string;
  issuer: string;
  contractAddress: string;
  totalSupply: string;
  txHash: string;
}

export type RampDirection = "deposit" | "withdraw";

export interface RampQuote {
  provider: AnchorProvider;
  direction: RampDirection;
  assetCode: string;
  amount: string;
  fee: string;
  rate: string;
  url: string;
}

export interface StakePosition {
  account: string;
  tokenContract: string;
  staked: string;
  votingPower: string;
  unlockAt: number;
}

export interface EcosystemProject {
  name: string;
  category: string;
  description: string;
  website: string;
  stellarOrg: boolean;
}

