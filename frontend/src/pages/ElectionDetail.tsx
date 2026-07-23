import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  ArrowLeft, Clock, Users, Lock, ShieldCheck, Loader2, CheckCircle2, ExternalLink,
} from "lucide-react";
import { electionsApi, identityApi, zkProofApi } from "@/lib/api";
import { formatDate, statusColor, generateNullifier } from "@/lib/utils";
import VoteForm from "@/components/VoteForm";
import ResultsChart from "@/components/ResultsChart";
import { useElection, useWallet, useTallyResult } from "@/hooks/useVeritas";

export default function ElectionDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { accountId, connecting, connect } = useWallet();
  const { election, loading, error } = useElection(id);
  const { result: tallyResult, loading: tallyLoading } = useTallyResult(id || "");

  const [voteLoading, setVoteLoading] = useState(false);
  const [voteSuccess, setVoteSuccess] = useState(false);
  const [voteError, setVoteError] = useState<string | null>(null);
  const [activating, setActivating] = useState(false);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="h-8 w-8 animate-spin text-stellar-blue" />
      </div>
    );
  }

  if (error || !election) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center">
        <p className="text-lg text-white/50">Election not found</p>
        <button onClick={() => navigate("/")} className="btn-secondary mt-4">
          Back to elections
        </button>
      </div>
    );
  }

  const now = new Date();
  const isVoting = election.status === "voting" && now >= new Date(election.startTime) && now <= new Date(election.endTime);
  const isRegistration = election.status === "registration";
  const isCompleted = election.status === "completed";

  const handleVote = async (optionId: string, optionIndex: number) => {
    if (!accountId) {
      connect();
      return;
    }

    setVoteLoading(true);
    setVoteError(null);

    try {
      const eligibility = await identityApi.checkEligibility(accountId, election.id, election.requiredKycLevel);
      if (!eligibility.eligible) {
        setVoteError("You are not eligible to vote in this election. KYC verification required.");
        setVoteLoading(false);
        return;
      }

      const nullifier = generateNullifier(accountId, election.id);
      const credentialHash = `cred_${accountId}_${election.id}`;

      const proof = await zkProofApi.generateProof({
        electionId: election.id,
        accountId,
        optionId,
        optionIndex,
        credentialHash,
        nullifier,
      });

      await electionsApi.updateStatus(election.id, election.status);
      setVoteSuccess(true);
    } catch (err: any) {
      setVoteError(err.message);
    } finally {
      setVoteLoading(false);
    }
  };

  const handleActivate = async () => {
    setActivating(true);
    try {
      await electionsApi.updateStatus(election.id, "voting");
      navigate(0);
    } catch (err: any) {
      setVoteError(err.message);
    } finally {
      setActivating(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <button onClick={() => navigate(-1)} className="mb-6 flex items-center gap-2 text-sm text-white/50 hover:text-white">
        <ArrowLeft className="h-4 w-4" /> Back
      </button>

      {/* Header */}
      <div className="mb-8">
        <div className="mb-3 flex items-center gap-2">
          <span className={statusColor(election.status)}>{election.status}</span>
          <span className="badge bg-white/10 text-white/50">
            {election.votingMethod.replace(/_/g, " ")}
          </span>
        </div>
        <h1 className="mb-2 text-3xl font-bold">{election.title}</h1>
        <p className="text-white/50">{election.description}</p>

        <div className="mt-4 flex flex-wrap gap-4 text-sm text-white/40">
          <span className="flex items-center gap-1"><Clock className="h-4 w-4" /> {formatDate(election.startTime)} — {formatDate(election.endTime)}</span>
          <span className="flex items-center gap-1"><Users className="h-4 w-4" /> {election.totalVotes} votes</span>
          <span className="flex items-center gap-1"><Lock className="h-4 w-4" /> KYC Level {election.requiredKycLevel}</span>
          {election.contractAddress && (
            <span className="flex items-center gap-1">
              <ShieldCheck className="h-4 w-4" />
              <a href={`https://stellar.expert/explorer/testnet/contract/${election.contractAddress}`} target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:text-white">
                Contract <ExternalLink className="h-3 w-3" />
              </a>
            </span>
          )}
        </div>
      </div>

      {/* Actions */}
      {isRegistration && (
        <div className="card mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold">Registration Phase</h3>
              <p className="text-sm text-white/50">Voters are registering. Start voting when ready.</p>
            </div>
            <button onClick={handleActivate} disabled={activating} className="btn-primary">
              {activating ? <Loader2 className="h-4 w-4 animate-spin" /> : "Start Voting"}
            </button>
          </div>
        </div>
      )}

      {/* Voting */}
      {(isVoting || election.status === "voting") && (
        <div className="card mb-6">
          <h3 className="mb-4 font-semibold">Cast Your Vote</h3>
          {!accountId ? (
            <div className="text-center py-6">
              <p className="mb-4 text-white/50">Connect your Stellar wallet to vote</p>
              <button onClick={connect} disabled={connecting} className="btn-stellar">
                {connecting ? "Connecting..." : "Connect Wallet"}
              </button>
            </div>
          ) : voteSuccess ? (
            <div className="flex flex-col items-center py-6">
              <CheckCircle2 className="mb-3 h-12 w-12 text-emerald-400" />
              <p className="text-lg font-semibold">Vote Recorded</p>
              <p className="text-sm text-white/50">Your vote is private and cryptographically secured on-chain.</p>
            </div>
          ) : (
            <>
              {voteError && (
                <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-400">
                  {voteError}
                </div>
              )}
              <VoteForm
                options={election.options}
                onVote={handleVote}
                loading={voteLoading}
              />
            </>
          )}
        </div>
      )}

      {/* Results */}
      {(isCompleted || (tallyResult && tallyResult.totalVotes > 0)) && (
        <div className="card mb-6">
          <h3 className="mb-4 font-semibold">Results</h3>
          {tallyLoading ? (
            <div className="flex justify-center py-6">
              <Loader2 className="h-6 w-6 animate-spin text-stellar-blue" />
            </div>
          ) : tallyResult ? (
            <ResultsChart results={tallyResult.results} totalVotes={tallyResult.totalVotes} />
          ) : (
            <p className="text-center text-white/50">Results not yet available</p>
          )}
        </div>
      )}

      {/* Options preview */}
      <div className="card">
        <h3 className="mb-4 font-semibold">Options ({election.options.length})</h3>
        <div className="space-y-2">
          {election.options.map((opt, i) => (
            <div key={opt.id} className="flex items-center gap-3 rounded-lg bg-white/5 p-3">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-xs font-bold">
                {String.fromCharCode(65 + i)}
              </div>
              <div>
                <span className="font-medium">{opt.label}</span>
                {opt.description && <span className="ml-2 text-sm text-white/40">— {opt.description}</span>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
