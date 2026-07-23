import { useEffect, useState } from "react";
import { ExternalLink, Coins, ArrowLeftRight, Layers, Landmark, Boxes } from "lucide-react";
import { Link } from "react-router-dom";
import type { EcosystemProject } from "@/types";

const ECOSYSTEM: EcosystemProject[] = [
  { name: "MoneyGram", category: "Anchor / On-off ramp", description: "Global cash-in/cash-out network bridging fiat and USDC on Stellar.", website: "https://www.moneygram.com", stellarOrg: true },
  { name: "Circle (USDC)", category: "Stablecoin", description: "Issuer of USDC, the dominant dollar token on Stellar.", website: "https://www.circle.com", stellarOrg: true },
  { name: "Stellar Development Foundation", category: "Protocol", description: "Maintains the Stellar network, standards (SEP-1/6/24) and grants.", website: "https://stellar.org", stellarOrg: true },
  { name: "Amberto", category: "Payments", description: "Merchant payment rails settled on Stellar.", website: "https://www.stellar.org/ecosystem", stellarOrg: false },
  { name: "Franklin Templeton", category: "Tokenization", description: "Tokenized money market fund (FOBXX) on Stellar.", website: "https://www.stellar.org/ecosystem", stellarOrg: false },
  { name: "Bitbond", category: "Tokenization", description: "Issuance of tokenized bonds and securities.", website: "https://www.bitbond.com", stellarOrg: false },
  { name: "Ultra Stellar", category: "Wallets / Tooling", description: "Lobstr wallet and Stellarport DEX tooling.", website: "https://ultrastellar.com", stellarOrg: false },
  { name: "SDF Meridian", category: "DeFi", description: "Reference AMM / DEX on the Stellar network.", website: "https://www.stellar.org/developers/meridian", stellarOrg: false },
  { name: "Veritas", category: "Governance (this project)", description: "Sybil-resistant, private, verifiable voting built on Stellar anchors + Soroban.", website: "https://stellar.org/ecosystem", stellarOrg: false },
];

const USE_CASE_ICONS: Record<string, any> = {
  anchors: Landmark,
  payments: Coins,
  tokenization: Layers,
  ramps: ArrowLeftRight,
  defi: Boxes,
  ecosystem: Boxes,
};

export default function Ecosystem() {
  const [projects] = useState<EcosystemProject[]>(ECOSYSTEM);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <div className="mb-8">
        <span className="badge badge-blue">Stellar Ecosystem</span>
        <h1 className="mt-3 text-3xl font-bold">Built on the Stellar network</h1>
        <p className="mt-2 max-w-2xl text-white/50">
          Veritas plugs into the wider Stellar ecosystem — anchors, stablecoins, tokenization,
          and DeFi primitives — to deliver fair governance. Explore the projects and use cases below.
        </p>
      </div>

      <div className="mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Link to="/payments" className="card hover:border-stellar-blue/30">
          <Coins className="mb-3 h-7 w-7 text-stellar-blue" />
          <h3 className="font-semibold">Payments</h3>
          <p className="text-sm text-white/50">Sub-cent election fees & voter rewards.</p>
        </Link>
        <Link to="/assets" className="card hover:border-stellar-blue/30">
          <Layers className="mb-3 h-7 w-7 text-stellar-blue" />
          <h3 className="font-semibold">Tokenization</h3>
          <p className="text-sm text-white/50">Issue governance tokens on Stellar.</p>
        </Link>
        <Link to="/ramp" className="card hover:border-stellar-blue/30">
          <ArrowLeftRight className="mb-3 h-7 w-7 text-stellar-blue" />
          <h3 className="font-semibold">On / Off Ramp</h3>
          <p className="text-sm text-white/50">Convert fiat to XLM via anchors.</p>
        </Link>
        <Link to="/defi" className="card hover:border-stellar-blue/30">
          <Boxes className="mb-3 h-7 w-7 text-stellar-blue" />
          <h3 className="font-semibold">DeFi</h3>
          <p className="text-sm text-white/50">Stake tokens for conviction voting.</p>
        </Link>
        <Link to="/ecosystem/anchors" className="card hover:border-stellar-blue/30">
          <Landmark className="mb-3 h-7 w-7 text-stellar-blue" />
          <h3 className="font-semibold">Anchors</h3>
          <p className="text-sm text-white/50">KYC real-human verification.</p>
        </Link>
      </div>

      <h2 className="mb-4 text-2xl font-bold">Ecosystem projects</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((p) => (
          <a
            key={p.name}
            href={p.website}
            target="_blank"
            rel="noreferrer"
            className="card group hover:border-stellar-blue/30"
          >
            <div className="flex items-start justify-between">
              <h3 className="font-semibold">{p.name}</h3>
              <ExternalLink className="h-4 w-4 text-white/30 group-hover:text-stellar-blue" />
            </div>
            <span className="mt-1 inline-block text-xs text-stellar-blue">{p.category}</span>
            <p className="mt-2 text-sm text-white/50">{p.description}</p>
          </a>
        ))}
      </div>
    </div>
  );
}
