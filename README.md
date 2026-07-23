<h1 align="center">
  <br>
<img width="1911" height="870" alt="image" src="https://github.com/user-attachments/assets/330ac269-40b3-4da6-b584-33a5bd84abb3" />


  </br>
<div>   -----------------------------------------------------------------------------------          </div>




  
 <img width="1835" height="840" alt="image" src="https://github.com/user-attachments/assets/2a27a0e0-cff9-4e25-9c20-c92ddb08aeb5" />

  <br>
</h1>

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
  <img alt="Soroban" src="https://img.shields.io/badge/Soroban-14b8a6?style=flat-square" />
  <img alt="ZK-SNARKs" src="https://img.shields.io/badge/ZK--SNARKs-8b5cf6?style=flat-square" />
  <img alt="PostgreSQL" src="https://img.shields.io/badge/PostgreSQL-316192?style=flat-square&logo=postgresql&logoColor=white" />
  <img alt="Docker" src="https://img.shields.io/badge/Docker-2496ED?style=flat-square&logo=docker&logoColor=white" />
  <img alt="Vercel" src="https://img.shields.io/badge/Vercel-000000?style=flat-square&logo=vercel" />
  <img alt="Render" src="https://img.shields.io/badge/Render-46E3B7?style=flat-square&logo=render" />
  <img alt="GitHub Actions" src="https://img.shields.io/badge/GitHub_Actions-2088FF?style=flat-square&logo=githubactions&logoColor=white" />
</p>

<p align="center">
  <a href="https://veritas-drab.vercel.app">
    <img src="https://img.shields.io/badge/Live_Frontend-Veritas-2ecc71?style=for-the-badge&logo=vercel" alt="Live Frontend"/>
  </a>
  <a href="https://unhopeful-appeasable-grey.ngrok-free.dev">
    <img src="https://img.shields.io/badge/Live_Backend-ngrok-000000?style=for-the-badge" alt="Live Backend"/>
  </a>
  <a href="https://github.com/pritamscodee/veritas">
    <img src="https://img.shields.io/badge/View_on-GitHub-181717?style=for-the-badge&logo=github" alt="GitHub"/>
  </a>
</p>

---

<p align="center">
  <b>Veritas is a voting system where every real person gets exactly one vote</b><br>
  <i>— and no one can see how they voted, yet everyone can prove the result is correct.</i>
</p>

<p align="center">
  <img src="https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1100&q=80" alt="Cryptographic Infrastructure" width="100%" style="max-width:900px;border-radius:12px;margin:20px 0"/>
</p>

> **For who?** DAOs, unions, co-ops, associations, shareholder votes, and any group that needs a fair, auditable election without trusting a central authority.

---

## The Problem

<p align="center">
  <img src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1100&q=80" alt="Security Threats" width="100%" style="max-width:900px;border-radius:12px;margin:20px 0"/>
</p>

| # | Problem | Why it matters |
|---|---|---|
| 1 | **Vote buying & bot farms** | Wealth or scripts, not people, decide outcomes in token- and account-based voting. |
| 2 | **Sybil attacks** | Faking thousands of identities to swing a result is cheap on most platforms. |
| 3 | **No verifiability** | Voters must blindly trust a central authority to count honestly. |
| 4 | **Privacy trade-offs** | Systems that verify identity usually also leak *how* you voted. |

---

## The Solution

<p align="center">
  <img src="https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1100&q=80" alt="Blockchain Transparency" width="100%" style="max-width:900px;border-radius:12px;margin:20px 0"/>
</p>

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

<p align="center">
  <img src="https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1100&q=80" alt="Network Architecture" width="100%" style="max-width:900px;border-radius:12px;margin:20px 0"/>
</p>

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

---

## Smart Contracts

<p align="center">
  <img src="https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=1100&q=80" alt="Smart Contracts" width="100%" style="max-width:900px;border-radius:12px;margin:20px 0"/>
</p>

### voting_registry — Election Lifecycle

| Function | Purpose | Auth |
|----------|---------|------|
| `initialize(admin)` | Set admin + version | — |
| `create_election(organizer, title, voting_method, kyc_level, start, end, quorum, options)` | Create election with ≥2 options | `organizer` |
| `update_status(election_id, new_status)` | Draft → Registration → Voting → Tallying → Completed | `admin` |
| `record_vote(election_id)` | Increment on-chain vote count | — |
| `get_election(election_id)` | Full election state | — |
| `get_election_count()` | Total elections created | — |

### identity_anchor — KYC & Voting Credentials

| Function | Purpose | Auth |
|----------|---------|------|
| `initialize(admin)` | Set admin | — |
| `register_anchor(name, signing_key)` | Register trusted anchor | `admin` |
| `verify_kyc_attestation(account, anchor, kyc_level, credential_hash, signature)` | Verify on-chain KYC | — |
| `issue_credential(account, election_id, credential_hash)` | Issue voting credential | `account` |
| `mark_credential_used(account, election_id)` | Prevent double-voting | — |
| `has_valid_credential(account, election_id)` | Check eligibility | — |

### vote_circuit — Zero-Knowledge Proofs

| Function | Purpose |
|----------|---------|
| `submit_proof(election_id, proof_data, public_inputs, nullifier, encrypted_vote)` | Submit Groth16 ZK-SNARK |
| `is_nullifier_used(election_id, nullifier)` | Double-vote prevention |
| `batch_verify(election_id, proofs)` | Batch verification |

### tally_contract — Threshold Decryption (M=3, N=5)

| Function | Purpose | Auth |
|----------|---------|------|
| `initialize(admin, threshold_m, total_n)` | Set threshold | — |
| `register_key_holder(holder_id, public_key)` | Register holder | `admin` |
| `submit_decryption_share(holder_id, election_id, share)` | Submit partial | — |
| `finalize_tally(election_id)` | Combine → decrypt → tally | `admin` |
| `get_result(election_id)` | Retrieve result | — |

### governance_token — Tokenized Governance

| Function | Purpose | Auth |
|----------|---------|------|
| `initialize(admin, name, symbol, decimals)` | Create token | `admin` |
| `mint(to, amount)` | Issue tokens | `admin` |
| `burn(from, amount)` | Destroy tokens | `from` |
| `transfer(from, to, amount)` | Transfer | `from` |
| `balance(account)` | Read balance | — |

### treasury — Payments & Rewards

| Function | Purpose | Auth |
|----------|---------|------|
| `collect_fee(payer, election_id, amount)` | Election fee (1.0 XLM) | `payer` |
| `reward_voter(voter, election_id, amount)` | Voter reward (0.1 XLM) | `admin` |
| `balance()` | Treasury balance | — |

### staking — DeFi Conviction Voting

| Function | Purpose | Auth |
|----------|---------|------|
| `stake(staker, amount, lock_seconds)` | Lock tokens | `staker` |
| `unstake(staker)` | Release after lock | `staker` |
| `voting_power(staker)` | Conviction power | — |

---

## Stellar Use Cases

<p align="center">
  <img src="https://images.unsplash.com/photo-1621761191319-c6fb62004040?auto=format&fit=crop&w=1100&q=80" alt="Stellar Blockchain" width="100%" style="max-width:900px;border-radius:12px;margin:20px 0"/>
</p>

| Use Case | Implementation | Business Value |
|---|---|---|
| **Anchors** | MoneyGram, Circle, Stellar Anchor · SEP-1 stellar.toml · SEP-24 transfer server | Turnkey real-human verification |
| **Payments** | XLM election fees (1 XLM) + voter rewards (0.1 XLM) · Soroban treasury | Sustainable protocol revenue |
| **Tokenization** | Governance token as SAC · mint/burn via Soroban | Token-weighted voting |
| **On/Off Ramp** | SEP-24 deposit/withdraw · MoneyGram (USD/EUR/GBP/MXN) · Circle (USDC) | Zero-friction fiat onboarding |
| **DeFi** | Time-locked staking (up to 30 days) · conviction power formula | Aligns voter commitment |
| **Ecosystem** | MoneyGram · Circle · Franklin Templeton · Bitbond · SDF | Full ecosystem integration |

---

## Frontend

<p align="center">
  <img src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1100&q=80" alt="Dashboard Interface" width="100%" style="max-width:900px;border-radius:12px;margin:20px 0"/>
</p>

| Page | Route | Feature |
|------|-------|---------|
| Elections | `/` | Filterable list, ElectionCard with status badges |
| Election Detail | `/elections/:id` | ZK proof generation → voting → results chart |
| Create Election | `/create` | Form: voting method, KYC level, quorum, options |
| Health | `/health` | Aggregated microservice dashboard |
| Payments | `/payments` | XLM send, balance, election fees |
| Assets | `/assets` | Tokenize governance assets, mint tokens |
| Ramp | `/ramp` | SEP-24 quote builder |
| DeFi | `/defi` | Stake tokens for conviction voting |
| Anchors | `/anchors` | KYC attestation, SEP-1 stellar.toml |
| Ecosystem | `/ecosystem` | 9 real Stellar projects |

---

## Key Features

<p align="center">
  <img src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=520&q=80" alt="Verifiable" width="31%" style="border-radius:10px;margin:4px" />
  <img src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=520&q=80" alt="Private" width="31%" style="border-radius:10px;margin:4px" />
  <img src="https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=520&q=80" alt="Transparent" width="31%" style="border-radius:10px;margin:4px" />
</p>

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

<p align="center">
  <img src="https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1100&q=80" alt="On-chain Transparency" width="100%" style="max-width:900px;border-radius:12px;margin:20px 0"/>
</p>

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

<p align="center">
  <img src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1100&q=80" alt="Market Opportunity" width="100%" style="max-width:900px;border-radius:12px;margin:20px 0"/>
</p>

- **~$25B** global elections & voting technology market, growing double digits as governance moves digital.
- **$20B+** in DAO treasuries today, almost all governed by insecure, plutocratic token voting.
- **Millions** of regulated elections annually (unions, co-ops, HOAs, associations, ESG/shareholder votes) mandated to be fair and auditable.
- Stellar's financial-inclusion mission and anchor network (MoneyGram, Circle) provide turnkey real-human identity.

---

## Business Model

<p align="center">
  <img src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1100&q=80" alt="Revenue Streams" width="100%" style="max-width:900px;border-radius:12px;margin:20px 0"/>
</p>

| Revenue Stream | Description |
|---|---|
| **SaaS licensing** | Per-election / per-organization plans for associations, unions, co-ops, and DAOs. |
| **Enterprise & compliance** | Audit tooling, SSO, and SLAs for regulated bodies. |
| **Protocol micro-fees** | Optional per-vote fee on public-network elections (sub-cent). |
| **White-label SDK** | Verifiable governance primitives for platforms to embed. |

---

## Roadmap

<p align="center">
  <img src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1100&q=80" alt="Roadmap" width="100%" style="max-width:900px;border-radius:12px;margin:20px 0"/>
</p>

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

- **`ci.yml`** — lint, typecheck, build, cargo fmt, matrix Docker build
- **`deploy.yml`** — Vercel frontend + GHCR images + Render hook

### Required GitHub Secrets

| Secret | Purpose |
|---|---|
| `VERCEL_TOKEN` | Vercel deploy token |
| `VERCEL_ORG_ID` | Vercel team/org id |
| `VERCEL_PROJECT_ID` | Vercel project id |
| `GITHUB_TOKEN` | Built-in; pushes to GHCR |
| `RENDER_DEPLOY_HOOK` | Render deploy hook URL |

### Local Public Backend

```bash
docker compose up -d                                   # build & run full stack
ngrok config add-authtoken <YOUR_NGROK_AUTHTOKEN>      # one-time
./scripts/expose-backend.sh                            # or .ps1 on Windows
```

---

## Security & Trust

<p align="center">
  <img src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1100&q=80" alt="Security" width="100%" style="max-width:900px;border-radius:12px;margin:20px 0"/>
</p>

- Defense-in-depth: `helmet`, CORS, rate limiting at the gateway.
- Health-aggregation endpoint (`/api/health`) for observability.
- On-chain immutability + public verifiability.
- ZK-SNARKs ensure vote privacy even from operators.
- Threshold M-of-N decryption prevents single-party compromise.
- Third-party audit planned before mainnet launch.

---

## Technology Stack

| Layer | Stack |
|---|---|
| Frontend | React 18, Vite, TypeScript, Tailwind CSS, Recharts, Passkeys (WebAuthn) |
| Backend | Node.js, Express, TypeScript, Prisma ORM, PostgreSQL |
| Blockchain | Stellar, Soroban (Rust), Horizon & Soroban RPC |
| Privacy | ZK-SNARKs (Circom → WASM), threshold (M-of-N) decryption |
| Identity | Stellar anchors (MoneyGram, Circle) KYC |
| Infra | Docker, GitHub Actions, Render, Vercel |

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
  <img src="https://img.shields.io/badge/Veritas-Governance_That_Can't_Be_Bought-7b2cbf?style=for-the-badge&labelColor=0D1117" alt="Veritas Badge"/>
  <br>
  <sub>Veritas — governance that can't be bought.</sub>
</p>
