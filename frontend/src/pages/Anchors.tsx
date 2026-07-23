import { useEffect, useState } from "react";
import { Landmark, ShieldCheck, FileText, Link2 } from "lucide-react";
import { anchorsApi } from "@/lib/api";
import { useWallet } from "@/hooks/useVeritas";

export default function Anchors() {
  const { accountId } = useWallet();
  const [anchors, setAnchors] = useState<any[]>([]);
  const [toml, setToml] = useState<string>("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    anchorsApi
      .list()
      .then((d) => setAnchors(d.anchors || []))
      .catch(() => setAnchors([]));
  }, []);

  async function loadToml() {
    setLoading(true);
    try {
      const data = await anchorsApi.toml("veritas.vote", "");
      setToml(JSON.stringify(data, null, 2));
    } catch (e: any) {
      setToml(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <span className="badge badge-blue">Stellar Anchors</span>
      <h1 className="mt-3 text-3xl font-bold">Real-human verification via anchors</h1>
      <p className="mt-2 max-w-2xl text-white/50">
        Anchors are trusted entities (MoneyGram, Circle) that connect Stellar to the real world.
        Veritas uses anchor KYC attestations to guarantee one verified human = one vote.
      </p>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <div className="card">
          <ShieldCheck className="mb-3 h-7 w-7 text-stellar-blue" />
          <h3 className="font-semibold">KYC Attestation</h3>
          <p className="text-sm text-white/50">Anchors sign a credential proving real-human status.</p>
        </div>
        <div className="card">
          <FileText className="mb-3 h-7 w-7 text-stellar-blue" />
          <h3 className="font-semibold">SEP-1 stellar.toml</h3>
          <p className="text-sm text-white/50">Standard discovery metadata for our reference anchor.</p>
        </div>
        <div className="card">
          <Link2 className="mb-3 h-7 w-7 text-stellar-blue" />
          <h3 className="font-semibold">SEP-24 Transfers</h3>
          <p className="text-sm text-white/50">Anchors also act as fiat on/off ramps.</p>
        </div>
      </div>

      <h2 className="mb-4 mt-10 text-2xl font-bold">Trusted anchors</h2>
      <div className="grid gap-3 md:grid-cols-2">
        {anchors.map((a) => (
          <div key={a.provider} className="card">
            <div className="flex items-center justify-between">
              <span className="font-semibold capitalize">{a.name}</span>
              <span className={`badge ${a.isActive ? "badge-green" : "badge-yellow"}`}>
                {a.isActive ? "Active" : "Pending"}
              </span>
            </div>
            <p className="mt-1 break-all text-xs text-white/40">{a.signingKey || "signing key not configured"}</p>
          </div>
        ))}
      </div>

      <div className="card mt-8">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="font-semibold">Reference stellar.toml</h3>
          <button onClick={loadToml} disabled={loading} className="btn-secondary text-xs">
            {loading ? "Loading..." : "Fetch SEP-1"}
          </button>
        </div>
        <pre className="overflow-x-auto rounded-lg bg-black/40 p-4 text-xs text-white/70">
          {toml || "Click to load the SEP-1 metadata for the Veritas reference anchor."}
        </pre>
        {accountId && (
          <p className="mt-3 text-xs text-white/40">Connected: {accountId}</p>
        )}
      </div>
    </div>
  );
}
