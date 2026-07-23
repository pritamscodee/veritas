export const SERVICE_PORTS = {
  API_GATEWAY: 3000,
  ELECTION: 3001,
  IDENTITY: 3002,
  ZK_PROOF: 3003,
  TALLY: 3004,
} as const;

export const SERVICE_URLS = {
  ELECTION: "http://localhost:3001",
  IDENTITY: "http://localhost:3002",
  ZK_PROOF: "http://localhost:3003",
  TALLY: "http://localhost:3004",
  STELLAR: "http://localhost:3005",
} as const;

export const STELLAR = {
  HORIZON_URL: "https://horizon-testnet.stellar.org",
  SOROBAN_RPC_URL: "https://soroban-testnet.stellar.org",
  NETWORK_PASSPHRASE: "Test SDF Network ; September 2015",
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
  SECRET: "veritas-dev-secret-change-in-production",
  EXPIRES_IN: "24h",
} as const;

export const THRESHOLD = {
  M: 3,
  N: 5,
} as const;

export const ANCHOR_SIGNING_KEYS = {
  MONEYGRAM: "",
  CIRCLE: "",
  STELLAR_ANCHOR: "",
  VERITAS: "",
} as const;

// --- Stellar use-case configuration ---

export const PAYMENTS = {
  FEE_ASSET: "XLM",
  ELECTION_FEE: "1.0",
  VOTER_REWARD: "0.1",
} as const;

export const ASSETS = {
  GOVERNANCE_TOKEN_CODE: "VOTE",
  DEFAULT_STARTING_BALANCE: "2",
} as const;

export const RAMP = {
  DEFAULT_ASSET: "USDC",
  FEE_RATE: "0.01",
} as const;

export const DEFI = {
  STAKING_TOKEN: "VOTE",
  MAX_LOCK_SECONDS: 30 * 24 * 60 * 60,
  MIN_STAKE: "1",
} as const;

export const STELLAR_USE_CASES = [
  { key: "anchors", label: "Anchors", href: "/ecosystem/anchors" },
  { key: "payments", label: "Payments", href: "/payments" },
  { key: "tokenization", label: "Tokenization", href: "/assets" },
  { key: "ramps", label: "On/Off Ramp", href: "/ramp" },
  { key: "defi", label: "DeFi", href: "/defi" },
  { key: "ecosystem", label: "Ecosystem", href: "/ecosystem" },
] as const;
