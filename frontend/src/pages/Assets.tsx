import { useState } from "react";
import { Layers, Plus, Droplet } from "lucide-react";
import { assetsApi } from "@/lib/api";

export default function Assets() {
  const [secret, setSecret] = useState("");
  const [code, setCode] = useState("VOTE");
  const [assets, setAssets] = useState<any[]>([]);
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function refresh() {
    try {
      const d = await assetsApi.list();
      setAssets(d.assets || []);
    } catch {
      setAssets([]);
    }
  }

  async function tokenize() {
    setBusy(true);
    setError("");
    setResult("");
    try {
      const d = await assetsApi.tokenize({ secret, code });
      setResult(`Token ${code} issued — contract ${d.contractAddress}`);
      refresh();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <span className="badge badge-blue">Asset Tokenization</span>
      <h1 className="mt-3 text-3xl font-bold">Tokenize governance assets</h1>
      <p className="mt-2 text-white/50">
        Issue a Stellar asset and wrap it as a Stellar Asset Contract (SAC) for use in Soroban —
        powering token-weighted and conviction voting.
      </p>

      <div className="card mt-6 space-y-4">
        <div className="flex items-center gap-2 text-stellar-blue">
          <Plus className="h-5 w-5" />
          <h3 className="font-semibold">Issue a new asset</h3>
        </div>
        <input className="input" placeholder="Issuer secret key (demo)" value={secret} onChange={(e) => setSecret(e.target.value)} />
        <input className="input" placeholder="Asset code (e.g. VOTE)" value={code} onChange={(e) => setCode(e.target.value)} />
        <button onClick={tokenize} disabled={busy} className="btn-stellar">
          {busy ? "Issuing..." : "Tokenize asset"}
        </button>
      </div>

      <div className="card mt-6">
        <div className="flex items-center gap-2 text-stellar-blue">
          <Layers className="h-5 w-5" />
          <h3 className="font-semibold">Tokenized assets</h3>
        </div>
        <button onClick={refresh} className="btn-secondary mt-3 text-xs">Refresh</button>
        {assets.length === 0 ? (
          <p className="mt-3 text-sm text-white/40">No assets tokenized yet.</p>
        ) : (
          <ul className="mt-3 space-y-2">
            {assets.map((a, i) => (
              <li key={i} className="rounded-lg bg-black/30 p-3 text-sm">
                <div className="flex items-center gap-2">
                  <Droplet className="h-4 w-4 text-stellar-blue" />
                  <span className="font-mono">{a.asset}</span>
                </div>
                <p className="mt-1 text-xs text-white/40 break-all">SAC: {a.contractAddress}</p>
                <p className="text-xs text-white/40">Supply: {a.totalSupply}</p>
              </li>
            ))}
          </ul>
        )}
      </div>

      {result && <p className="mt-4 text-sm text-emerald-400">{result}</p>}
      {error && <p className="mt-4 text-sm text-red-400">{error}</p>}
    </div>
  );
}
