# Veritas

**Governance that can't be bought.**

<p align="center">
  <img src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1400&q=80" alt="Global decentralized governance network" width="100%" style="max-width:1100px;border-radius:12px" />
</p>

<p align="center">
  <img alt="Decentralized Governance" src="https://img.shields.io/badge/Decentralized-Governance-7b2cbf?style=for-the-badge" />
  <img alt="One Person One Vote" src="https://img.shields.io/badge/One_Person_One_Vote-2ecc71?style=for-the-badge" />
  <img alt="Zero Knowledge Privacy" src="https://img.shields.io/badge/Zero--Knowledge_Privacy-9b59b6?style=for-the-badge" />
  <img alt="Built on Stellar" src="https://img.shields.io/badge/Built_on-Stellar-000000?style=for-the-badge&logo=stellar" />
  <img alt="Status Live on Testnet" src="https://img.shields.io/badge/Status-Live_on_Testnet-2ecc71?style=for-the-badge" />
  <img alt="Raising Seed Round" src="https://img.shields.io/badge/Raising-Seed_Round-1f6feb?style=for-the-badge" />
</p>

<p align="center">
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white" />
  <img alt="React" src="https://img.shields.io/badge/React-20232A?style=flat-square&logo=react&logoColor=61DAFB" />
  <img alt="Node.js" src="https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=nodedotjs&logoColor=white" />
  <img alt="Soroban Contracts" src="https://img.shields.io/badge/Smart_Contracts-Soroban-14b8a6?style=flat-square" />
  <img alt="ZK SNARKs" src="https://img.shields.io/badge/ZK--SNARKs-8b5cf6?style=flat-square" />
  <img alt="PostgreSQL" src="https://img.shields.io/badge/PostgreSQL-316192?style=flat-square&logo=postgresql&logoColor=white" />
  <img alt="Docker" src="https://img.shields.io/badge/Docker-2496ED?style=flat-square&logo=docker&logoColor=white" />
  <img alt="Deploy Vercel" src="https://img.shields.io/badge/Deploy-Vercel-000000?style=flat-square&logo=vercel" />
  <img alt="Deploy Render" src="https://img.shields.io/badge/Deploy-Render-46E3B7?style=flat-square&logo=render" />
</p>

---

## What is Veritas?

**Veritas is a voting system where every real person gets exactly one vote — and no one can see how they voted, yet everyone can prove the result is correct.** Think of it like a transparent ballot box that only opens when a group of trusted custodians agree, while each ballot is sealed in a way that proves it's valid without revealing the choice inside. It runs on the Stellar blockchain, so it's global, cheap, and tamper-proof by default.

> **For who?** DAOs, unions, co-ops, associations, shareholder votes, and any group that needs a fair, auditable election without trusting a central authority.

---

## The Problem

| # | Problem | Why it matters |
|---|---|---|
| 1 | **Vote buying & bot farms** | Wealth or scripts, not people, decide outcomes in token- and account-based voting. |
| 2 | **Sybil attacks** | Faking thousands of identities to swing a result is cheap on most platforms. |
| 3 | **No verifiability** | Voters must blindly trust a central authority to count honestly. |
| 4 | **Privacy trade-offs** | Systems that verify identity usually also leak *how* you voted. |

---

## The Solution

Veritas solves all four at once:

- ✅ **Real-human verification** through regulated KYC anchors (MoneyGram, Circle) on Stellar.
- ✅ **Zero-knowledge privacy** — you prove your vote is valid without revealing the choice.
- ✅ **On-chain verifiability** — every vote and tally is public and auditable by anyone.
- ✅ **Sub-cent costs** — Stellar makes per-vote on-chain recording viable at any scale.

| Problem | How Veritas fixes it |
|---|---|
| Vote buying / bot farms | One verified human = one vote; no tokens, no scriptable accounts |
| Sybil attacks | KYC anchor attestation makes fake identities economically impossible |
| No verifiability | Soroban smart contracts publish every tally; anyone can audit |
| Privacy loss | ZK-SNARKs hide the choice; threshold M-of-N decryption hides the count until release |

---

## Architecture

```
Frontend (React + Vite)              Shared SDK
┌──────────────────────┐   ┌─────────────────────────────────┐
│ 12 pages             │   │ @veritas/stellar (payments,     │
│ 5 components         │   │   assets, ramp, defi, anchors)  │
│ 5 hooks              │──▶│ @veritas/types (15 interfaces)   │
│ 8 API namespaces     │   │ @veritas/constants (13 configs)  │
└──────────────────────┘   └─────────────────────────────────┘
           │                          │
           ▼                          ▼
   ┌──────────────────────────────────────────┐
   │        API Gateway (:3000)               │
   │  helmet · CORS · rate-limit · proxy      │
   └──────┬──────┬──────┬──────┬──────┬──────┘
          │      │      │      │      │
   ┌──────▼──┐ ┌─▼────┐ ▼      ▼      ▼
   │ Election│ │Ident │ │ZK    │Tally │Stellar
   │ (:3001) │ │(:3002)│(:3003)│(:3004)│(:3005)
   │ +Prisma │ │+Prism│snarkjs│+Prism│SDK
   └────┬────┘ └──┬───┘ └──┬──┘ └──┬──┘ └──┬──┘
        │         │        │       │        │
   ┌────▼─────────▼────────▼───────▼────────▼──┐
   │        Soroban Smart Contracts (7)         │
   │  voting_registry · identity_anchor         │
   │  vote_circuit   · tally_contract           │
   │  governance_token · treasury · staking     │
   └────────────────────────────────────────────┘
                    │
              Stellar Testnet
```

### Monorepo Structure

```
Quorix/
├── contracts/                     # Rust + Soroban smart contracts (7)
│   ├── voting_registry/           # Election lifecycle, methods, quorum, on-chain vote count
│   ├── identity_anchor/           # KYC anchor / attestation anchoring
│   ├── vote_circuit/              # ZK circuit (Circom-style → WASM prover + proving key)
│   ├── tally_contract/            # Threshold-decryptable tally (M-of-N)
│   ├── governance_token/          # Asset tokenization (Soroban token standard)
│   ├── treasury/                  # Stellar Payments: election fees + voter rewards
│   └── staking/                   # DeFi: stake tokens for conviction voting power
├── services/                      # Node.js microservices (Express + Prisma)
│   ├── api-gateway/               # Reverse proxy, helmet, CORS, rate limiting, /api/health
│   ├── election-service/          # Election CRUD (PostgreSQL via Prisma)
│   ├── identity-service/          # KYC anchor relay + attestation ingestion
│   ├── zk-proof-service/          # ZK proof generation/verification (snarkjs Groth16)
│   ├── tally-service/             # Threshold tallying & decryption
│   └── stellar-service/           # Payments, Tokenization, Ramp, DeFi, Anchors
├── shared/                        # @veritas/types, @veritas/constants, @veritas/stellar
├── frontend/                      # React + Vite + TypeScript (Tailwind, Recharts, Passkeys)
├── .github/workflows/             # CI/CD (ci.yml + deploy.yml)
├── docker-compose.yml             # Local 7-service stack (with Postgres)
├── render.yaml                    # Backend deploy (Render)
└── frontend/vercel.json           # Frontend deploy (Vercel)
```

---

## Smart Contracts (7 contracts, 41 functions)

### voting_registry — Election Lifecycle

| Function | Purpose | Auth |
|----------|---------|------|
| `initialize(admin)` | Set admin + version | — |
| `create_election(organizer, title, voting_method, kyc_level, start, end, quorum, options)` | Create election with ≥2 options, lifecycle transitions | `organizer` |
| `update_status(election_id, new_status)` | Draft → Registration → Voting → Tallying → Completed/Cancelled | `admin` |
| `record_vote(election_id)` | Increment on-chain vote count | — |
| `get_election(election_id)` | Full election state | — |
| `get_election_count()` | Total elections created | — |

**Voting methods:** One-Person-One-Vote · Quadratic · Token-Weighted · Conviction

### identity_anchor — KYC & Voting Credentials

| Function | Purpose | Auth |
|----------|---------|------|
| `initialize(admin)` | Set admin | — |
| `register_anchor(name, signing_key)` | Register trusted anchor (MoneyGram, Circle) | `admin` |
| `verify_kyc_attestation(account, anchor, kyc_level, credential_hash, signature)` | Verify anchor-signed KYC on-chain | — |
| `issue_credential(account, election_id, credential_hash)` | Issue per-election voting credential | `account` |
| `mark_credential_used(account, election_id)` | Prevent double-voting | — |
| `has_valid_credential(account, election_id)` | Check eligibility | — |
| `get_credential(account, election_id)` | Retrieve credential details | — |

### vote_circuit — Zero-Knowledge Proofs

| Function | Purpose |
|----------|---------|
| `submit_proof(election_id, proof_data, public_inputs, nullifier, encrypted_vote)` | Submit Groth16 ZK-SNARK proof |
| `is_nullifier_used(election_id, nullifier)` | Double-vote prevention via nullifier |
| `batch_verify(election_id, proofs)` | Batch verification for scalability |

**Public signals:** `[electionId, nullifier, optionIndex, "1"]` — proves valid ballot without revealing choice.

### tally_contract — Threshold Decryption

| Function | Purpose | Auth |
|----------|---------|------|
| `initialize(admin, threshold_m, total_n)` | Set M-of-N threshold | — |
| `register_key_holder(holder_id, public_key)` | Register decryption key holder | `admin` |
| `submit_decryption_share(holder_id, election_id, share)` | Submit partial decryption | — |
| `finalize_tally(election_id)` | Combine M shares → decrypt → produce result | `admin` |
| `get_result(election_id)` | Retrieve decrypted tally | — |
| `get_share_count(election_id)` | Check if threshold met | — |

**Default:** M=3, N=5 — any 3 of 5 key holders can decrypt the tally.

### governance_token — Tokenized Governance

| Function | Purpose | Auth |
|----------|---------|------|
| `initialize(admin, name, symbol, decimals)` | Create token with metadata | `admin` |
| `mint(to, amount)` | Issue tokens | `admin` |
| `burn(from, amount)` | Destroy tokens | `from` |
| `transfer(from, to, amount)` | Transfer tokens | `from` |
| `balance(account)` | Read balance | — |
| `total_supply()` | Total minted | — |
| `name()` / `symbol()` / `decimals()` | Token metadata | — |

### treasury — Payments & Rewards

| Function | Purpose | Auth |
|----------|---------|------|
| `initialize(admin)` | Set admin | — |
| `collect_fee(payer, election_id, amount)` | Collect election creation fee | `payer` |
| `reward_voter(voter, election_id, amount)` | Disburse voter micro-reward | `admin` |
| `balance()` | Treasury balance | — |

**Economics:** 1.0 XLM per election fee · 0.1 XLM per voter reward.

### staking — DeFi Conviction Voting

| Function | Purpose | Auth |
|----------|---------|------|
| `initialize(admin, token, max_lock_seconds)` | Set staking params | `admin` |
| `stake(staker, amount, lock_seconds)` | Lock tokens for voting power | `staker` |
| `unstake(staker)` | Release after lock expires | `staker` |
| `voting_power(staker)` | Read conviction-weighted power | — |
| `get_stake(staker)` | Full stake details | — |

**Power formula:** `staked × (1 + lock_seconds / max_lock)` — longer lock = more weight.

---

## Backend Services (6 services, 36 endpoints)

### api-gateway — Port 3000

| Layer | Detail |
|-------|--------|
| Middleware | helmet, CORS, morgan, express-rate-limit (100 req/15 min) |
| Proxy routes | `/api/elections` → election-service, `/api/identity` → identity-service, `/api/zk-proof` → zk-proof-service, `/api/tally` → tally-service, `/api/payments` → stellar-service, `/api/assets` → stellar-service, `/api/ramp` → stellar-service, `/api/defi` → stellar-service, `/api/anchors` → stellar-service |
| Health | `GET /health` (gateway), `GET /api/health` (aggregated all services) |

### election-service — Port 3001 (PostgreSQL)

| Method | Endpoint | Purpose |
|--------|----------|---------|
| `POST` | `/elections/` | Create election (≥2 options, time window, quorum, KYC level) |
| `GET` | `/elections/` | List elections (filterable by status, paginated) |
| `GET` | `/elections/:id` | Election detail with vote options |
| `PATCH` | `/elections/:id/status` | Lifecycle transition (draft → registration → voting → tallying → completed) |
| `POST` | `/elections/:id/options` | Add vote option (draft only) |
| `DELETE` | `/elections/:id` | Delete election (draft only) |

### identity-service — Port 3002 (PostgreSQL)

| Method | Endpoint | Purpose |
|--------|----------|---------|
| `POST` | `/identity/anchors` | Register trusted anchor |
| `GET` | `/identity/anchors` | List active anchors |
| `POST` | `/identity/attestations/verify` | Verify KYC attestation signature |
| `POST` | `/identity/eligibility` | Check voter eligibility (KYC level + credential) |
| `POST` | `/identity/credentials` | Issue voting credential |
| `GET` | `/identity/credentials/:accountId/:electionId` | Retrieve credential |

**Background:** `AttestationRelay` polls Stellar Horizon every 30s for new anchor attestations.

### zk-proof-service — Port 3003 (stateless)

| Method | Endpoint | Purpose |
|--------|----------|---------|
| `POST` | `/zk-proof/prove` | Generate Groth16 ZK-SNARK proof (snarkjs + circomlibjs) |
| `POST` | `/zk-proof/verify` | Verify proof against public inputs |
| `GET` | `/zk-proof/status` | Prover status (mock vs real circuit) |

**Inputs:** credentialHash, electionId, optionIndex, nullifier, salt (auto-generated 32 bytes).

### tally-service — Port 3004 (PostgreSQL)

| Method | Endpoint | Purpose |
|--------|----------|---------|
| `POST` | `/tally/key-holders` | Register decryption key holder |
| `GET` | `/tally/key-holders` | List active key holders |
| `POST` | `/tally/shares` | Submit decryption share |
| `GET` | `/tally/shares/:electionId` | Check share count & decrypt readiness |
| `POST` | `/tally/finalize/:electionId` | Combine shares → Lagrange interpolation → decrypt → tally |
| `GET` | `/tally/results/:electionId` | Retrieve finalized result |

### stellar-service — Port 3005 (in-memory)

| Module | Method | Endpoint | Purpose |
|--------|--------|----------|---------|
| **Payments** | `GET` | `/payments/balance?account=G...` | XLM balance |
| | `GET` | `/payments/history?account=G...` | Payment history |
| | `POST` | `/payments/send` | Send XLM (with memo) |
| | `POST` | `/payments/election-fee` | Pay election fee |
| | `POST` | `/payments/create-account` | Fund new Stellar account |
| **Assets** | `POST` | `/assets/tokenize` | Issue Stellar Asset Contract |
| | `POST` | `/assets/deploy-contract` | Deploy SAC to Soroban |
| | `POST` | `/assets/:contract/mint` | Mint governance tokens |
| | `GET` | `/assets/` | List tokenized assets |
| **DeFi** | `POST` | `/defi/stake` | Stake tokens (lock period) |
| | `POST` | `/defi/unstake` | Unstake after lock |
| | `GET` | `/defi/power` | Voting power calculator |
| **Ramp** | `GET` | `/ramp/anchors` | List MoneyGram/Circle/Stellar Anchor |
| | `POST` | `/ramp/quote` | SEP-24 deposit/withdraw quote |
| **Anchors** | `GET` | `/anchors/` | Trusted anchors list |
| | `GET` | `/anchors/toml` | SEP-1 stellar.toml |
| | `POST` | `/anchors/trust` | Add anchor as signer |
| | `POST` | `/anchors/verify` | Verify on-chain KYC |

---

## Stellar Use Cases (all 6 exercised)

| Use Case | Implementation | Business Value |
|---|---|---|
| **Anchors** | MoneyGram, Circle, Stellar Anchor for KYC attestation · SEP-1 stellar.toml · SEP-24 transfer server refs · on-chain signer verification | Turnkey real-human verification — the moat competitors can't replicate |
| **Payments** | Sub-cent XLM election fees (1 XLM) + voter rewards (0.1 XLM) · Soroban treasury contract · Horizon payment history | Sustainable protocol revenue at scale |
| **Asset Tokenization** | Governance token as Stellar Asset Contract (SAC) · mint/burn via Soroban · deterministic contract address derivation | Token-weighted + conviction voting without leaving Stellar |
| **On/Off Ramp** | SEP-24 interactive deposit/withdraw · MoneyGram (USD/EUR/GBP/MXN) · Circle (USDC) · fee quoting | Zero-friction fiat → crypto onboarding for non-crypto voters |
| **DeFi** | Time-locked staking (up to 30 days) · conviction power formula · composable with Soroban pools | Aligns voter commitment with governance outcomes |
| **Ecosystem** | MoneyGram · Circle · Franklin Templeton (FOBXX) · Bitbond · SDF · Ultra Stellar integrated | Full ecosystem participation, not a silo |

---

## Frontend (12 pages, 5 components, 5 hooks)

### Pages

| Page | Route | Feature |
|------|-------|---------|
| Elections | `/` | Filterable list (all/voting/registration/completed), ElectionCard with status badges |
| Election Detail | `/elections/:id` | Full lifecycle: registration → ZK proof generation → voting → results chart |
| Create Election | `/create` | Form: title, voting method, KYC level, quorum, time window, vote options |
| Health Dashboard | `/health` | Aggregated microservice health (all 6 services) |
| Payments | `/payments` | XLM send, balance check, election fee/reward info |
| Assets | `/assets` | Tokenize governance assets, view issued SACs, mint tokens |
| Ramp | `/ramp` | SEP-24 quote builder with MoneyGram/Circle/Stellar Anchor |
| DeFi | `/defi` | Stake tokens for conviction voting power, calculator |
| Anchors | `/anchors` | KYC attestation details, SEP-1 stellar.toml, trusted anchor list |
| Ecosystem | `/ecosystem` | 9 real Stellar ecosystem projects + use case cards |

### Components

| Component | Purpose |
|-----------|---------|
| `ElectionCard` | Card with status badge, vote count, time, KYC level, live indicator |
| `VoteForm` | Option selector → generates ZK-SNARK proof on submit |
| `ResultsChart` | Recharts bar chart + horizontal bar progress for tally |
| `Navbar` | Sticky nav with 8 links, wallet connect/disconnect |
| `Footer` | 3-column footer (brand, protocol, ecosystem) |

### Hooks

| Hook | Purpose |
|------|---------|
| `useElections(status?)` | Fetch/filter elections list |
| `useElection(id)` | Fetch single election detail |
| `useEligibility(accountId, electionId, kycLevel)` | Check voter KYC eligibility |
| `useTallyResult(electionId)` | Fetch decrypted tally |
| `useWallet()` | Freighter wallet connect/disconnect |

---

## Key Features

| Feature | What it means for the user | Badge |
|---|---|---|
| **Sybil resistance** | Cryptographic proof of unique-human status via regulated KYC anchors. | <img alt="Sybil Resistant" src="https://img.shields.io/badge/Sybil--Resistant-2ecc71?style=flat-square" /> |
| **Zero-knowledge voting** | Vote with a ZK proof; your choice stays secret even from us. | <img alt="Private" src="https://img.shields.io/badge/Private-9b59b6?style=flat-square" /> |
| **Publicly verifiable tallies** | Soroban contracts make every election auditable by anyone. | <img alt="Auditable" src="https://img.shields.io/badge/Auditable-1f6feb?style=flat-square" /> |
| **Flexible voting methods** | One-person-one-vote, quadratic, token-weighted, conviction. | <img alt="Multi Method" src="https://img.shields.io/badge/Multi--Method-14b8a6?style=flat-square" /> |
| **Quorum & lifecycle** | Draft → registration → voting → tallying → completed, with on-chain quorum. | <img alt="Lifecycle" src="https://img.shields.io/badge/Lifecycle-e67e22?style=flat-square" /> |
| **Threshold decryption** | M-of-N operators jointly reveal results; collusion-resistant. | <img alt="M of N" src="https://img.shields.io/badge/M--of--N-7b2cbf?style=flat-square" /> |

---

## How It Works

```
 1. Voter authenticates with a passkey (biometric / PIN — no crypto knowledge)
         │
 2. Stellar anchor verifies real-human KYC on-chain
         │
 3. Client generates a ZK-SNARK proof of eligibility + ballot (off-chain)
         │
 4. Proof is submitted to a Soroban smart contract (no choice revealed)
         │
 5. Threshold M-of-N keyholders cooperatively decrypt the final tally
```

### Why It's Different

| Property | How Veritas delivers it |
|---|---|
| **One person, one vote** | KYC-verified identity via Stellar anchors; no token holding required |
| **Privacy** | ZK-SNARKs prove ballot validity without revealing the choice |
| **Verifiability** | Every vote & tally recorded on-chain; anyone can audit the result |
| **Low cost** | Stellar's sub-cent fees make per-vote on-chain recording viable at scale |
| **No wallet friction** | Passkey auth — voters use biometrics or a PIN |
| **No single point of trust** | Threshold (M-of-N) decryption — no party sees individual votes alone |

---

## The Opportunity

- **~$25B** global elections & voting technology market, growing double digits as governance moves digital.
- **$20B+** in DAO treasuries today, almost all governed by insecure, plutocratic token voting.
- **Millions** of regulated elections annually (unions, co-ops, HOAs, associations, ESG/shareholder votes) mandated to be fair and auditable.
- Stellar's financial-inclusion mission and anchor network (MoneyGram, Circle) provide turnkey real-human identity.

---

## Business Model

| Revenue Stream | Description |
|---|---|
| **SaaS licensing** | Per-election / per-organization plans for associations, unions, co-ops, and DAOs. |
| **Enterprise & compliance** | Audit tooling, SSO, and SLAs for regulated bodies. |
| **Protocol micro-fees** | Optional per-vote fee on public-network elections (sub-cent). |
| **White-label SDK** | Verifiable governance primitives for platforms to embed. |

### Go-to-market

- **DAO tooling** — governance plugins for the $20B+ treasury market.
- **Regulated industries** — credit unions, HOAs, professional associations with mandated fair elections.
- **Stellar ecosystem** — financial-inclusion partnerships through the anchor network (MoneyGram, Circle).

---

## Roadmap

- [x] Core voting registry & Soroban contracts
- [x] ZK-proof service & vote circuit
- [x] Identity anchor relay & KYC attestation
- [x] Threshold tally & decryption
- [x] Passkey-based voter UX + dashboard
- [x] Stellar Payments (election fees + voter rewards)
- [x] Asset Tokenization (governance token SAC)
- [x] On/Off Ramp (SEP-24 anchor flows)
- [x] DeFi staking for conviction voting
- [x] Stellar ecosystem explorer
- [x] CI/CD pipeline (GitHub Actions)
- [x] Docker deployment (full stack)
- [ ] Mainnet hardening & audits (**target: Q2 2026**)
- [ ] DAO governance plugins & SDK
- [ ] Enterprise compliance & audit console

---

## Getting Started

**Prerequisites:** Node ≥ 20, Docker, a Stellar testnet account, Rust/Soroban CLI (for contracts).

```bash
npm install        # install workspace dependencies
npm run dev        # run full stack (gateway + 5 services + stellar-service + frontend)
npm run build      # build all packages & services
npm run lint       # lint & typecheck
npm run test       # test
```

| Service | Port |
|---|---|
| API Gateway | 3000 |
| Election Service | 3001 |
| Identity Service | 3002 |
| ZK Proof Service | 3003 |
| Tally Service | 3004 |
| Stellar Service | 3005 |

---

## Deployment

### Production CI/CD

GitHub Actions pipeline in `.github/workflows`:

- **`ci.yml`** — on every push/PR: lint, typecheck, build all Node workspaces, `cargo fmt` check, matrix Docker build of all 6 services with GHA layer caching.
- **`deploy.yml`** — on push to `main`:
  - **Frontend → Vercel** (`--prod`)
  - **Backend → GHCR** (Docker images) + **Render** deploy hook

### Required GitHub Secrets

| Secret | Purpose |
|---|---|
| `VERCEL_TOKEN` | Vercel deploy token |
| `VERCEL_ORG_ID` | Vercel team/org id |
| `VERCEL_PROJECT_ID` | Vercel project id |
| `GITHUB_TOKEN` | Built-in; pushes to GHCR |
| `RENDER_DEPLOY_HOOK` | Render deploy hook URL |

### Local Public Backend (Docker + ngrok)

```bash
docker compose up -d                                   # build & run full stack
ngrok config add-authtoken <YOUR_NGROK_AUTHTOKEN>      # one-time
./scripts/expose-backend.sh                            # or .ps1 on Windows
```

---

## Security & Trust

- Defense-in-depth: `helmet`, CORS, rate limiting at the gateway.
- Health-aggregation endpoint (`/api/health`) for observability across all services.
- On-chain immutability + public verifiability means results can be independently audited.
- ZK-SNARKs ensure vote privacy even from the protocol operators.
- Threshold M-of-N decryption prevents single-party key compromise.
- Third-party smart-contract & ZK-circuit audit planned before mainnet launch.

---

## Technology Stack

| Layer | Stack |
|---|---|
| Frontend | React 18, Vite, TypeScript, Tailwind CSS, Recharts, React Router, Passkeys (WebAuthn) |
| Backend | Node.js, Express, TypeScript, Prisma ORM, PostgreSQL |
| Blockchain | Stellar, Soroban smart contracts (Rust), Horizon & Soroban RPC |
| Privacy | ZK-SNARKs (Circom → WASM prover + proving key), threshold (M-of-N) decryption |
| Identity | Stellar anchors (MoneyGram, Circle) KYC attestations |
| Infra | Docker, docker-compose, GitHub Actions, Render (API/services), Vercel (web) |

---

## Team

<p align="center">
  <img src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1000&q=80" alt="The Veritas team" width="100%" style="max-width:800px;border-radius:12px" />
</p>

Built by a team combining **blockchain engineering, applied cryptography, and governance/product** expertise.

---

## Investment & Contact

Veritas is raising a **seed round** to ship mainnet, complete security audits, and launch DAO & enterprise integrations.

> **Contact:** [founder email] · [deck link] · [calendar link]

---

<p align="center">
  <sub>Veritas — governance that can't be bought.</sub>
</p>
