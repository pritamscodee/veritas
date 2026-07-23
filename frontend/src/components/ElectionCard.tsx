import { Link } from "react-router-dom";
import { Clock, Users, Lock } from "lucide-react";
import { formatDate, statusColor } from "@/lib/utils";
import type { Election } from "@/types";

interface ElectionCardProps {
  election: Election;
}

export default function ElectionCard({ election }: ElectionCardProps) {
  const now = new Date();
  const start = new Date(election.startTime);
  const end = new Date(election.endTime);
  const isActive = now >= start && now <= end && election.status === "voting";
  const isUpcoming = now < start;

  return (
    <Link to={`/elections/${election.id}`} className="card group block transition-all hover:border-primary-500/50 hover:bg-white/8">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="mb-2 flex items-center gap-2">
            <span className={statusColor(election.status)}>{election.status}</span>
            <span className="badge bg-white/10 text-white/50">
              {election.votingMethod.replace(/_/g, " ")}
            </span>
          </div>
          <h3 className="mb-1 text-lg font-semibold text-white group-hover:text-stellar-blue">
            {election.title}
          </h3>
          <p className="mb-3 line-clamp-2 text-sm text-white/50">
            {election.description || "No description"}
          </p>
          <div className="flex flex-wrap items-center gap-4 text-xs text-white/40">
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {formatDate(election.startTime)}
            </span>
            <span className="flex items-center gap-1">
              <Users className="h-3.5 w-3.5" />
              {election.totalVotes} votes
            </span>
            <span className="flex items-center gap-1">
              <Lock className="h-3.5 w-3.5" />
              KYC Level {election.requiredKycLevel}
            </span>
          </div>
        </div>

        <div className="flex flex-col items-end gap-2">
          <div className="text-right">
            <div className="text-2xl font-bold text-white">{election.options.length}</div>
            <div className="text-xs text-white/40">options</div>
          </div>
          {isActive && (
            <span className="animate-pulse rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-medium text-emerald-400">
              Live
            </span>
          )}
          {isUpcoming && (
            <span className="rounded-full bg-sky-500/20 px-3 py-1 text-xs font-medium text-sky-400">
              Upcoming
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
