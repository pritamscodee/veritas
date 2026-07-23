import { useState } from "react";
import { Coins, Send, ArrowDownToLine } from "lucide-react";
import { paymentsApi } from "@/lib/api";
import { useWallet } from "@/hooks/useVeritas";

export default function Payments() {
  const { accountId } = useWallet();
  const [secret, setSecret] = useState("");
  const [destination, setDestination] = useState("");
  const [amount, setAmount] = useState("1");
  const [balance, setBalance] = useState<string | null>(null);
  const [result, setResult] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [busy, setBusy] = useState(false);

  async function fetchBalance() {
    if (!accountId) return;
    try {
      const d = await paymentsApi.balance(accountId);
      setBalance(d.balance);
    } catch (e: any) {
      setError(e.message);
    }
  }

  async function send() {
    setBusy(true);
    setError("");
    setResult("");
    try {
      const d = await paymentsApi.send({ secret, destination, amount, asset: "XLM", memo: "Veritas payment" });
      setResult(`Sent ${amount} XLM — tx ${d.hash}`);
      fetchBalance();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <span className="badge badge-blue">Payments</span>
      <h1 className="mt-3 text-3xl font-bold">Stellar Payments</h1>
      <p className="mt-2 text-white/50">
        Send XLM for election fees and voter rewards. Stellar settles in ~5s for fractions of a cent.
      </p>

      {accountId && (
        <button onClick={fetchBalance} className="btn-secondary mt-4 text-xs">
          Check my balance
        </button>
      )}
      {balance !== null && (
        <p className="mt-2 text-sm text-white/70">Balance: <span className="font-mono">{balance} XLM</span></p>
      )}

      <div className="card mt-6 space-y-4">
        <div className="flex items-center gap-2 text-stellar-blue">
          <Send className="h-5 w-5" />
          <h3 className="font-semibold">Send payment</h3>
        </div>
        <input className="input" placeholder="Sender secret key (demo)" value={secret} onChange={(e) => setSecret(e.target.value)} />
        <input className="input" placeholder="Destination account (G...)" value={destination} onChange={(e) => setDestination(e.target.value)} />
        <input className="input" placeholder="Amount (XLM)" value={amount} onChange={(e) => setAmount(e.target.value)} />
        <button onClick={send} disabled={busy} className="btn-stellar">
          {busy ? "Sending..." : "Send XLM"}
        </button>
      </div>

      <div className="card mt-6">
        <div className="flex items-center gap-2 text-stellar-blue">
          <ArrowDownToLine className="h-5 w-5" />
          <h3 className="font-semibold">Election fees & rewards</h3>
        </div>
        <p className="mt-2 text-sm text-white/50">
          Organizers pay a small per-election fee into the on-chain treasury; verified voters can
          receive micro-rewards. Both use the same sub-cent payment rail.
        </p>
        <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-white/60">
          <li>Per-election fee: 1.0 XLM</li>
          <li>Per-voter reward: 0.1 XLM</li>
        </ul>
      </div>

      {result && <p className="mt-4 text-sm text-emerald-400">{result}</p>}
      {error && <p className="mt-4 text-sm text-red-400">{error}</p>}
    </div>
  );
}
