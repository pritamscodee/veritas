import { useEffect, useState } from "react";
import { ArrowLeftRight, ArrowDownToLine, ArrowUpFromLine } from "lucide-react";
import { rampApi } from "@/lib/api";
import { useWallet } from "@/hooks/useVeritas";
import type { RampDirection } from "@/types";

export default function Ramp() {
  const { accountId } = useWallet();
  const [anchors, setAnchors] = useState<any[]>([]);
  const [provider, setProvider] = useState("moneygram");
  const [direction, setDirection] = useState<RampDirection>("deposit");
  const [assetCode, setAssetCode] = useState("USDC");
  const [amount, setAmount] = useState("100");
  const [quote, setQuote] = useState<any>(null);

  useEffect(() => {
    rampApi
      .anchors()
      .then((d) => setAnchors(d.anchors || []))
      .catch(() => setAnchors([]));
  }, []);

  async function getQuote() {
    if (!accountId) return;
    try {
      const q = await rampApi.quote({ provider, direction, assetCode, amount, accountId });
      setQuote(q);
    } catch (e: any) {
      setQuote({ error: e.message });
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <span className="badge badge-blue">On / Off Ramp</span>
      <h1 className="mt-3 text-3xl font-bold">Fiat ↔ XLM via anchors</h1>
      <p className="mt-2 text-white/50">
        Convert fiat to crypto (deposit) or crypto to fiat (withdraw) through regulated Stellar
        anchors using the SEP-24 interactive flow.
      </p>

      <div className="card mt-6 space-y-4">
        <div className="flex items-center gap-2 text-stellar-blue">
          <ArrowLeftRight className="h-5 w-5" />
          <h3 className="font-semibold">Get a ramp quote</h3>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setDirection("deposit")}
            className={`btn ${direction === "deposit" ? "btn-stellar" : "btn-secondary"}`}
          >
            <ArrowDownToLine className="mr-1 inline h-4 w-4" /> Deposit (fiat→XLM)
          </button>
          <button
            onClick={() => setDirection("withdraw")}
            className={`btn ${direction === "withdraw" ? "btn-stellar" : "btn-secondary"}`}
          >
            <ArrowUpFromLine className="mr-1 inline h-4 w-4" /> Withdraw (XLM→fiat)
          </button>
        </div>

        <select className="input" value={provider} onChange={(e) => setProvider(e.target.value)}>
          {anchors.map((a) => (
            <option key={a.provider} value={a.provider}>{a.name}</option>
          ))}
        </select>
        <input className="input" placeholder="Asset code (e.g. USDC)" value={assetCode} onChange={(e) => setAssetCode(e.target.value)} />
        <input className="input" placeholder="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} />
        <button onClick={getQuote} disabled={!accountId} className="btn-stellar">
          {accountId ? "Get quote" : "Connect wallet first"}
        </button>
      </div>

      {quote && (
        <div className="card mt-6">
          {quote.error ? (
            <p className="text-sm text-red-400">{quote.error}</p>
          ) : (
            <>
              <p className="text-sm text-white/70">Fee: {quote.fee} {quote.assetCode}</p>
              <p className="text-sm text-white/70">Rate: {quote.rate}</p>
              <a href={quote.url} target="_blank" rel="noreferrer" className="btn-stellar mt-3 inline-block text-xs">
                Open anchor (SEP-24)
              </a>
            </>
          )}
        </div>
      )}
    </div>
  );
}
