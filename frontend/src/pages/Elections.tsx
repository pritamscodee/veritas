import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Loader2 } from "lucide-react";
import ElectionCard from "@/components/ElectionCard";
import { electionsApi } from "@/lib/api";
import type { Election } from "@/types";

const TABS = ["all", "voting", "registration", "completed"];

export default function Elections() {
  const [elections, setElections] = useState<Election[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    setLoading(true);
    const filter = activeTab === "all" ? undefined : activeTab;
    electionsApi
      .list({ status: filter })
      .then((data) => setElections(data.elections))
      .finally(() => setLoading(false));
  }, [activeTab]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Elections</h1>
          <p className="mt-1 text-white/50">Browse and participate in governance votes</p>
        </div>
        <Link to="/create" className="btn-stellar">
          Create Election
        </Link>
      </div>

      {/* Tabs */}
      <div className="mb-6 flex gap-1 rounded-lg bg-white/5 p-1">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === tab
                ? "bg-white/10 text-white"
                : "text-white/50 hover:text-white"
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Results */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-stellar-blue" />
        </div>
      ) : elections.length === 0 ? (
        <div className="card py-20 text-center">
          <p className="text-white/50">No elections found</p>
          <Link to="/create" className="btn-stellar mt-4 inline-flex">
            Create the first one
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {elections.map((election) => (
            <ElectionCard key={election.id} election={election} />
          ))}
        </div>
      )}
    </div>
  );
}
