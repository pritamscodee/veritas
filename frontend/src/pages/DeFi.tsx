import { useState } from "react";
import { Boxes, Lock, Zap } from "lucide-react";
import { defiApi } from "@/lib/api";

export default function DeFi() {
  const [secret, setSecret] = useState("");
  const [stakingContract, setStakingContract] = useState("");
  const [tokenContract, setTokenContract] = useState("");
  const [amount, setAmount] = useState("10");
  const [lockSeconds, setLockSeconds] = useState(30 * 24 * 3600);
  const [power, setPower] = useState<any>(null);
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function computePower() {
    try {
      const p = await defiApi.power(undefined, amount, lockSeconds);
      setPower(p);
    } catch (e: any) {
      setError(e.message);
    }
  }

  async function stake() {
    setBusy(true);
    setError("");
    setResult("");
    try {
      const d = await defiApi.stake({ secret, stakingContract, tokenContract, amount, lockSeconds });
      setResult(`Staked ${amount} — voting power ${d.votingPower}`);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <span className="badge badge-blue">DeFi</span>
      <h1 className="mt-3 text-3xl font-bold">Stake for conviction voting</h1>
      <p className="mt-2 text-white/50">
        Lock governance tokens to accrue conviction voting power over time. Longer locks =
        more weight, aligning voter commitment with election outcomes.
      </p>

      <div className="card mt-6 space-y-4">
        <div className="flex items-center gap-2 text-stellar-blue">
          <Lock className="h-5 w-5" />
          <h3 className="font-semibold">Stake tokens</h3>
        </div>
        <input className="input" placeholder="Staker secret key (demo)" value={secret} onChange={(e) => setSecret(e.target.value)} />
        <input className="input" placeholder="Staking contract address" value={stakingContract} onChange={(e) => setStakingContract(e.target.value)} />
        <input className="input" placeholder="Governance token contract" value={tokenContract} onChange={(e) => setTokenContract(e.target.value)} />
        <input className="input" placeholder="Amount to stake" value={amount} onChange={(e) => setAmount(e.target.value)} />
        <input className="input" placeholder="Lock period (seconds)" value={lockSeconds} onChange={(e) => setLockSeconds(Number(e.target.value))} />
        <button onClick={stake} disabled={busy} className="btn-stellar">
          {busy ? "Staking..." : "Stake"}
        </button>
      </div>

      <div className="card mt-6">
        <div className="flex items-center gap-2 text-stellar-blue">
          <Zap className="h-5 w-5" />
          <h3 className="font-semibold">Voting power calculator</h3>
        </div>
        <button onClick={computePower} className="btn-secondary mt-3 text-xs">Compute power</button>
        {power && (
          <pre className="mt-3 overflow-x-auto rounded-lg bg-black/40 p-3 text-xs text-white/70">
            {JSON.stringify(power, null, 2)}
          </pre>
        )}
      </div>

      <div className="card mt-6">
        <div className="flex items-center gap-2 text-stellar-blue">
          <Boxes className="h-5 w-5" />
          <h3 className="font-semibold">DeFi building blocks</h3>
        </div>
        <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-white/60">
          <li>Staking contract enforces time-locks</li>
          <li>Voting power = staked × (1 + lock factor)</li>
          <li>Composable with any Soroban DeFi pool</li>
        </ul>
      </div>

      {result && <p className="mt-4 text-sm text-emerald-400">{result}</p>}
      {error && <p className="mt-4 text-sm text-red-400">{error}</p>}
    </div>
  );
}
