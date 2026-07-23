# Veritas

**Governance that can't be bought.**

<p align="center">
  <img src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1400&q=80" alt="Global decentralized governance network" width="100%" style="max-width:1100px;border-radius:12px" />
</p>

<p align="center">
  <!-- Product -->
  <img alt="Decentralized Governance" src="https://img.shields.io/badge/Decentralized-Governance-7b2cbf?style=for-the-badge" />
  <img alt="One Person One Vote" src="https://img.shields.io/badge/One_Person_One_Vote-2ecc71?style=for-the-badge" />
  <img alt="Zero Knowledge Privacy" src="https://img.shields.io/badge/Zero--Knowledge_Privacy-9b59b6?style=for-the-badge" />
  <img alt="Built on Stellar" src="https://img.shields.io/badge/Built_on-Stellar-000000?style=for-the-badge&logo=stellar" />
  <!-- Status -->
  <img alt="Status Live on Testnet" src="https://img.shields.io/badge/Status-Live_on_Testnet-2ecc71?style=for-the-badge" />
  <img alt="Raising Seed Round" src="https://img.shields.io/badge/Raising-Seed_Round-1f6feb?style=for-the-badge" />
</p>

<p align="center">
  <!-- Tech -->
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

## What is Veritas? (in one paragraph)

**Veritas is a voting system where every real person gets exactly one vote — and no one can see how they voted, yet everyone can prove the result is correct.** Think of it like a transparent ballot box that only opens when a group of trusted custodians agree, while each ballot is sealed in a way that proves it's valid without revealing the choice inside. It runs on the Stellar blockchain, so it's global, cheap, and tamper-proof by default.

> **For who?** DAOs, unions, co-ops, associations, shareholder votes, and any group that needs a fair, auditable election without trusting a central authority.

---

## The problem

| # | Problem | Why it matters |
|---|---|---|
| 1 | **Vote buying & bot farms** | Wealth or scripts, not people, decide outcomes in token- and account-based voting. |
| 2 | **Sybil attacks** | Faking thousands of identities to swing a result is cheap on most platforms. |
| 3 | **No verifiability** | Voters must blindly trust a central authority to count honestly. |
| 4 | **Privacy trade-offs** | Systems that verify identity usually also leak *how* you voted. |

---

## The solution

Veritas solves all four at once:

<p align="center">
  <img src="https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1100&q=80" alt="Cryptographic infrastructure behind Veritas" width="100%" style="max-width:900px;border-radius:12px" />
</p>

- ✅ **Real-human verification** through regulated KYC anchors (MoneyGram, Circle) on Stellar.
- ✅ **Zero-knowledge privacy** — you prove your vote is valid without revealing the choice.
- ✅ **On-chain verifiability** — every vote and tally is public and auditable by anyone.
- ✅ **Sub-cent costs** — Stellar makes per-vote on-chain recording viable at any scale.

### Problem → Solution, at a glance

| Problem | How Veritas fixes it |
|---|---|
| Vote buying / bot farms | One verified human = one vote; no tokens, no scriptable accounts |
| Sybil attacks | KYC anchor attestation makes fake identities economically impossible |
| No verifiability | Soroban smart contracts publish every tally; anyone can audit |
| Privacy loss | ZK-SNARKs hide the choice; threshold M-of-N decryption hides the count until release |

---

## Key features

<p align="center">
  <img src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1100&q=80" alt="Veritas voting product interface" width="100%" style="max-width:900px;border-radius:12px" />
</p>

| Feature | What it means for the user | Badge |
|---|---|---|
| **Sybil resistance** | Cryptographic proof of unique-human status via regulated KYC anchors. | <img alt="Sybil Resistant" src="https://img.shields.io/badge/Sybil--Resistant-2ecc71?style=flat-square" /> |
| **Zero-knowledge voting** | Vote with a ZK proof; your choice stays secret even from us. | <img alt="Private" src="https://img.shields.io/badge/Private-9b59b6?style=flat-square" /> |
| **Publicly verifiable tallies** | Soroban contracts make every election auditable by anyone. | <img alt="Auditable" src="https://img.shields.io/badge/Auditable-1f6feb?style=flat-square" /> |
| **Flexible voting methods** | One-person-one-vote, quadratic, token-weighted, conviction. | <img alt="Multi Method" src="https://img.shields.io/badge/Multi--Method-14b8a6?style=flat-square" /> |
| **Quorum & lifecycle** | Draft → registration → voting → tallying → completed, with on-chain quorum. | <img alt="Lifecycle" src="https://img.shields.io/badge/Lifecycle-e67e22?style=flat-square" /> |
| **Threshold decryption** | M-of-N operators jointly reveal results; collusion-resistant. | <img alt="M of N" src="https://img.shields.io/badge/M--of--N-7b2cbf?style=flat-square" /> |

<p align="center">
  <img src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=520&q=80" alt="Privacy and security" width="31%" style="border-radius:10px;margin:4px" />
  <img src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=520&q=80" alt="Verifiable results" width="31%" style="border-radius:10px;margin:4px" />
  <img src="https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=520&q=80" alt="On-chain transparency" width="31%" style="border-radius:10px;margin:4px" />
</p>

---

## How it works

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

### Why it's different

| Property | How Veritas delivers it |
|---|---|
| **One person, one vote** | KYC-verified identity via Stellar anchors; no token holding required |
| **Privacy** | ZK-SNARKs prove ballot validity without revealing the choice |
| **Verifiability** | Every vote & tally recorded on-chain; anyone can audit the result |
| **Low cost** | Stellar's sub-cent fees make per-vote on-chain recording viable at scale |
| **No wallet friction** | Passkey auth — voters use biometrics or a PIN |
| **No single point of trust** | Threshold (M-of-N) decryption — no party sees individual votes alone |

---

## The opportunity

- **~$25B** global elections & voting technology market, growing double digits as governance moves digital.
- **$20B+** in DAO treasuries today, almost all governed by insecure, plutocratic token voting.
- **Millions** of regulated elections annually (unions, co-ops, HOAs, associations, ESG/shareholder votes) mandated to be fair and auditable.
- Stellar's financial-inclusion mission and anchor network (MoneyGram, Circle) provide turnkey real-human identity.

> *Figures are illustrative market estimates — replace with your sourced TAM/SAM/SOM before wide distribution.*

---

## Architecture

Veritas is a **TypeScript monorepo** with independently deployable microservices and on-chain smart contracts.

> **Data flow:** `Frontend → API Gateway → {election | identity | zk-proof | tally} services → Stellar/Soroban + PostgreSQL`

```
Quorix/
├── contracts/                 # Rust + Soroban smart contracts
│   ├── voting_registry/       # Election lifecycle, methods, quorum, on-chain vote count
│   ├── identity_anchor/       # KYC anchor / attestation anchoring
│   ├── tally_contract/        # Threshold-decryptable tally
│   └── vote_circuit/          # ZK circuit (Circom-style -> WASM prover + proving key)
├── services/                  # Node.js microservices (Express + Prisma)
│   ├── api-gateway/           # Reverse proxy, helmet, CORS, rate limiting, /api/health
│   ├── election-service/      # Election CRUD (PostgreSQL via Prisma)
│   ├── identity-service/      # KYC anchor relay + attestation ingestion
│   ├── zk-proof-service/       # ZK proof generation/verification
│   └── tally-service/         # Threshold tallying & decryption
├── shared/                    # @veritas/types, @veritas/constants, @veritas/stellar
├── frontend/                  # React + Vite + TypeScript (Tailwind, Recharts, Passkeys)
├── docker-compose.yml         # Local 5-service stack
├── render.yaml                # Backend deploy (Render)
└── vercel.json                # Frontend deploy (Vercel)
```

## Technology stack

| Layer | Stack |
|---|---|
| Frontend | React 18, Vite, TypeScript, Tailwind CSS, Recharts, React Router, Passkeys (WebAuthn) |
| Backend | Node.js, Express, TypeScript, Prisma ORM, PostgreSQL |
| Blockchain | Stellar, Soroban smart contracts (Rust), Horizon & Soroban RPC |
| Privacy | ZK-SNARKs (Circom → WASM prover + proving key), threshold (M-of-N) decryption |
| Identity | Stellar anchors (MoneyGram, Circle) KYC attestations |
| Infra | Docker, docker-compose, Render (API/services), Vercel (web), npm workspaces |

---

## Business model

- **SaaS licensing** — per-election / per-organization plans for associations, unions, co-ops, and DAOs.
- **Enterprise & compliance tier** — audit tooling, SSO, and SLAs for regulated bodies.
- **Protocol micro-fees** — optional per-vote fee on public-network elections (sub-cent).
- **White-label SDK** — verifiable governance primitives for platforms to embed.

## Go-to-market

- **DAO tooling** — governance plugins for the $20B+ treasury market.
- **Regulated industries** — credit unions, HOAs, professional associations with mandated fair elections.
- **Stellar ecosystem** — financial-inclusion partnerships through the anchor network (MoneyGram, Circle).

---

## Traction

*Live on Stellar testnet with full protocol implemented; pre-launch / raising seed.*

| Milestone | Status |
|---|---|
| Core protocol (registry, ZK, identity, tally) | ✅ Built & testnet-live |
| Elections run on testnet | **[insert count]** |
| Verified unique voters | **[insert count]** |
| Pilot partners / LOIs | **[insert count]** |
| Grants / awards | **[insert here]** |

## Roadmap

- [x] Core voting registry & Soroban contracts
- [x] ZK-proof service & vote circuit
- [x] Identity anchor relay & KYC attestation
- [x] Threshold tally & decryption
- [x] Passkey-based voter UX + dashboard
- [ ] Mainnet hardening & audits (**target: [insert quarter]**)
- [ ] DAO governance plugins & SDK
- [ ] Enterprise compliance & audit console

---

## Getting started (developers)

**Prerequisites:** Node ≥ 20, Docker, a Stellar testnet account, Rust/Soroban CLI (for contracts).

```bash
npm install        # install workspace dependencies
npm run dev        # run full stack (gateway + 4 services + frontend)
npm run build      # build all packages & services
npm run lint       # lint
npm run test       # test
```

| Service | Port |
|---|---|
| API Gateway | 3000 |
| Election Service | 3001 |
| Identity Service | 3002 |
| ZK Proof Service | 3003 |
| Tally Service | 3004 |

Deploy: backend on **Render** (`render.yaml`), frontend on **Vercel** (`vercel.json`, rewrites `/api/*` to the gateway).

---

## Security & trust

- Defense-in-depth: `helmet`, CORS, rate limiting at the gateway.
- Health-aggregation endpoint (`/api/health`) for observability across services.
- On-chain immutability + public verifiability means results can be independently audited.
- Third-party smart-contract & ZK-circuit audit planned before mainnet launch.

---

## Team

<p align="center">
  <img src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1000&q=80" alt="The Veritas team" width="100%" style="max-width:800px;border-radius:12px" />
</p>

Built by a team combining **blockchain engineering, applied cryptography, and governance/product** expertise. *[Add founder names, roles, and notable credentials here.]*

---

## Investment & contact

Veritas is raising a **seed round** to ship mainnet, complete security audits, and launch DAO & enterprise integrations.

> **Contact:** [founder email] · [deck link] · [calendar link]

---

<p align="center">
  <sub>Veritas — governance that can't be bought.</sub>
</p>
