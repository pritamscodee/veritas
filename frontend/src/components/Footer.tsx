import { Shield, Github, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-stellar-dark/50">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <div className="mb-3 flex items-center gap-2">
              <Shield className="h-5 w-5 text-stellar-blue" />
              <span className="font-bold">Veritas</span>
            </div>
            <p className="text-sm text-white/50">
              Decentralized, privacy-preserving governance on Stellar.
              One person, one vote. Cryptographically guaranteed.
            </p>
          </div>
          <div>
            <h4 className="mb-3 text-sm font-semibold text-white/70">Protocol</h4>
            <ul className="space-y-2 text-sm text-white/50">
              <li><Link to="/" className="hover:text-white">Elections</Link></li>
              <li><Link to="/create" className="hover:text-white">Create Election</Link></li>
              <li><Link to="/health" className="hover:text-white">System Status</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-3 text-sm font-semibold text-white/70">Stellar</h4>
            <ul className="space-y-2 text-sm text-white/50">
              <li>
                <a href="https://stellar.org" target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:text-white">
                  Stellar <ExternalLink className="h-3 w-3" />
                </a>
              </li>
              <li>
                <a href="https://soroban.stellar.org" target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:text-white">
                  Soroban Docs <ExternalLink className="h-3 w-3" />
                </a>
              </li>
              <li>
                <a href="https://github.com/stellar" target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:text-white">
                  <Github className="h-3 w-3" /> GitHub
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-white/10 pt-6 text-center text-xs text-white/30">
          Built for the Stellar Startup Track. All votes are cryptographically private and publicly verifiable.
        </div>
      </div>
    </footer>
  );
}
