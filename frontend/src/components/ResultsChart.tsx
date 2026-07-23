import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import type { ElectionResult } from "@/types";

interface ResultsChartProps {
  results: ElectionResult[];
  totalVotes: number;
}

const COLORS = ["#4c6ef5", "#14b6e7", "#51cf66", "#fcc419", "#ff6b6b", "#cc5de8", "#20c997", "#ff922b"];

export default function ResultsChart({ results, totalVotes }: ResultsChartProps) {
  const sorted = [...results].sort((a, b) => b.voteCount - a.voteCount);

  const data = sorted.map((r) => ({
    name: r.optionId.slice(0, 12),
    votes: r.voteCount,
    pct: totalVotes > 0 ? ((r.voteCount / totalVotes) * 100).toFixed(1) : "0",
  }));

  return (
    <div className="space-y-4">
      {sorted.map((r, i) => (
        <div key={r.optionId} className="space-y-1">
          <div className="flex items-center justify-between text-sm">
            <span className="text-white">{r.optionId}</span>
            <span className="text-white/50">
              {r.voteCount} votes ({totalVotes > 0 ? ((r.voteCount / totalVotes) * 100).toFixed(1) : 0}%)
            </span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${totalVotes > 0 ? (r.voteCount / totalVotes) * 100 : 0}%`,
                backgroundColor: COLORS[i % COLORS.length],
              }}
            />
          </div>
        </div>
      ))}

      {data.length > 0 && (
        <div className="mt-6 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <XAxis dataKey="name" tick={{ fill: "#ffffff80", fontSize: 12 }} />
              <YAxis tick={{ fill: "#ffffff80", fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1a1b2e",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "8px",
                  color: "#fff",
                }}
              />
              <Bar dataKey="votes" radius={[4, 4, 0, 0]}>
                {data.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      <div className="text-center text-sm text-white/40">Total votes: {totalVotes}</div>
    </div>
  );
}
