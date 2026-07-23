export type VotingMethod = "one_person_one_vote" | "quadratic" | "token_weighted" | "conviction";

export type ElectionStatus = "draft" | "registration" | "voting" | "tallying" | "completed" | "cancelled";

export type AnchorProvider = "moneygram" | "circle" | "stellar_anchor";

export interface AnchorKYCAttestation {
  accountId: string;
  anchor: AnchorProvider;
  kycLevel: "basic" | "enhanced" | "full";
  credentialHash: string;
  issuedAt: number;
  expiresAt: number;
  signature: string;
}

export interface Election {
  id: string;
  title: string;
  description: string;
  organizerId: string;
  contractAddress: string;
  votingMethod: VotingMethod;
  status: ElectionStatus;
  eligibility: EligibilityCriteria;
  options: VoteOption[];
  startTime: number;
  endTime: number;
  quorumThreshold: number;
  totalVotes: number;
  createdAt: number;
  updatedAt: number;
}

export interface EligibilityCriteria {
  requiredAnchor: AnchorProvider[];
  requiredKycLevel: "basic" | "enhanced" | "full";
  minimumStake?: string;
  allowedAccounts?: string[];
}

export interface VoteOption {
  id: string;
  electionId: string;
  label: string;
  description: string;
  metadata?: Record<string, unknown>;
}

export interface VoterCredential {
  id: string;
  accountId: string;
  electionId: string;
  credentialHash: string;
  isUsed: boolean;
  issuedAt: number;
  usedAt?: number;
}

export interface VoteRecord {
  id: string;
  electionId: string;
  optionId: string;
  proofHash: string;
  txHash: string;
  timestamp: number;
}

export interface ElectionResult {
  electionId: string;
  optionId: string;
  optionLabel: string;
  voteCount: number;
  percentage: number;
}

export interface TallyResult {
  electionId: string;
  results: ElectionResult[];
  totalVotes: number;
  quorumReached: boolean;
  decryptedAt: number;
}

export interface ZKProofRequest {
  electionId: string;
  accountId: string;
  optionId: string;
  credentialHash: string;
}

export interface ZKProofResponse {
  proof: string;
  publicInputs: string[];
  verified: boolean;
}

export interface ThresholdKeyShare {
  holderId: string;
  publicKey: string;
  shareIndex: number;
}

export interface ServiceHealth {
  service: string;
  status: "healthy" | "degraded" | "down";
  version: string;
  uptime: number;
  timestamp: number;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}
