export const SERVICE_PORTS = {
  API_GATEWAY: 3000,
  ELECTION: 3001,
  IDENTITY: 3002,
  ZK_PROOF: 3003,
  TALLY: 3004,
} as const;

export const SERVICE_URLS = {
  ELECTION: process.env.ELECTION_SERVICE_URL || "http://localhost:3001",
  IDENTITY: process.env.IDENTITY_SERVICE_URL || "http://localhost:3002",
  ZK_PROOF: process.env.ZK_PROOF_SERVICE_URL || "http://localhost:3003",
  TALLY: process.env.TALLY_SERVICE_URL || "http://localhost:3004",
} as const;

export const STELLAR = {
  HORIZON_URL: process.env.STELLAR_HORIZON_URL || "https://horizon-testnet.stellar.org",
  SOROBAN_RPC_URL: process.env.STELLAR_SOROBAN_RPC_URL || "https://soroban-testnet.stellar.org",
  NETWORK_PASSPHRASE: process.env.STELLAR_NETWORK_PASSPHRASE || "Test SDF Network ; September 2015",
} as const;

export const KYC_LEVELS = {
  BASIC: 1,
  ENHANCED: 2,
  FULL: 3,
} as const;

export const ELECTION_STATUS = {
  DRAFT: "draft",
  REGISTRATION: "registration",
  VOTING: "voting",
  TALLYING: "tallying",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
} as const;

export const VOTING_METHODS = {
  ONE_PERSON_ONE_VOTE: "one_person_one_vote",
  QUADRATIC: "quadratic",
  TOKEN_WEIGHTED: "token_weighted",
  CONVICTION: "conviction",
} as const;

export const ANCHOR_PROVIDERS = {
  MONEYGRAM: "moneygram",
  CIRCLE: "circle",
  STELLAR_ANCHOR: "stellar_anchor",
} as const;

export const RATE_LIMIT = {
  WINDOW_MS: 15 * 60 * 1000,
  MAX_REQUESTS: 100,
} as const;

export const JWT = {
  SECRET: process.env.JWT_SECRET || "veritas-dev-secret-change-in-production",
  EXPIRES_IN: "24h",
} as const;

export const THRESHOLD = {
  M: parseInt(process.env.THRESHOLD_M || "3"),
  N: parseInt(process.env.THRESHOLD_N || "5"),
} as const;
