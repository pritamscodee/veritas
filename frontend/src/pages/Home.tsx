import { Shield, Vote, Lock, Eye, Zap, Globe } from "lucide-react";
import { Link } from "react-router-dom";

const features = [
  {
    icon: Vote,
    title: "One Person, One Vote",
    desc: "KYC-verified identity through Stellar anchors ensures every unique human gets exactly one vote. No tokens needed.",
  },
  {
    icon: Lock,
    title: "Zero-Knowledge Privacy",
    desc: "ZK-SNARKs prove your vote is valid without revealing your choice. Nobody can see how you voted — not even us.",
  },
  {
    icon: Eye,
    title: "Publicly Verifiable",
    desc: "Every vote and tally is recorded on-chain. Anyone can verify the result is correct without trusting any party.",
  },
  {
    icon: Zap,
    title: "Sub-Cent Fees",
    desc: "Stellar's near-zero transaction costs make per-vote on-chain recording economically viable at any scale.",
  },
  {
    icon: Globe,
    title: "No Wallet Required",
    desc: "Passkey-based authentication means voters use biometrics or a PIN. No crypto knowledge needed.",
  },
  {
    icon: Shield,
    title: "Threshold Decryption",
    desc: "M-of-N keyholders cooperate to decrypt the final tally. No single party can see individual votes.",
  },
];

export default function Home() {
  return (
    <div className="mx-auto max-w-7xl px-4">
      {/* Hero */}
      <section className="flex flex-col items-center py-20 text-center">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-stellar-blue/30 bg-stellar-blue/10 px-4 py-1.5 text-sm text-stellar-blue">
          <Shield className="h-4 w-4" />
          Built on Stellar
        </div>
        <h1 className="mb-4 max-w-3xl text-5xl font-bold leading-tight tracking-tight md:text-6xl">
          Governance that
          <span className="text-stellar-blue"> can't be bought</span>
        </h1>
        <p className="mb-8 max-w-2xl text-lg text-white/60">
          Veritas brings Sybil-resistant, privacy-preserving, publicly verifiable
          voting to the Stellar ecosystem. One unique human gets one vote — cryptographically guaranteed.
        </p>
        <div className="flex gap-3">
          <Link to="/create" className="btn-stellar px-6 py-3 text-base">
            Create Election
          </Link>
          <Link to="/" className="btn-secondary px-6 py-3 text-base">
            View Elections
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="pb-20">
        <h2 className="mb-12 text-center text-3xl font-bold">How It Works</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="card group hover:border-stellar-blue/30">
              <Icon className="mb-4 h-8 w-8 text-stellar-blue" />
              <h3 className="mb-2 text-lg font-semibold">{title}</h3>
              <p className="text-sm text-white/50">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Architecture */}
      <section className="card mb-20">
        <h2 className="mb-6 text-2xl font-bold">Architecture</h2>
        <div className="grid gap-4 md:grid-cols-5">
          {[
            "Voter authenticates with passkey",
            "Anchor KYC verified on-chain",
            "ZK proof generated off-chain",
            "Proof submitted to Soroban",
            "Tally decrypted with threshold",
          ].map((step, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-stellar-blue/20 text-sm font-bold text-stellar-blue">
                {i + 1}
              </div>
              <span className="text-sm text-white/70">{step}</span>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="pb-20 text-center">
        <h2 className="mb-4 text-3xl font-bold">Ready to build fair governance?</h2>
        <p className="mb-6 text-white/50">Deploy your first election on Stellar testnet in minutes.</p>
        <Link to="/create" className="btn-stellar px-8 py-3 text-base">
          Get Started
        </Link>
      </section>
    </div>
  );
}
