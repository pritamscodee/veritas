import { useEffect, useState } from "react";
import { Activity, CheckCircle2, XCircle, Loader2, RefreshCw } from "lucide-react";
import { healthApi } from "@/lib/api";
import type { ServiceHealth } from "@/types";

export default function Health() {
  const [health, setHealth] = useState<ServiceHealth | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchHealth = () => {
    setLoading(true);
    healthApi.aggregated()
      .then(setHealth)
      .catch(() => setHealth(null))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchHealth();
  }, []);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">System Status</h1>
          <p className="mt-1 text-white/50">Health status of all Veritas microservices</p>
        </div>
        <button onClick={fetchHealth} className="btn-secondary">
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {loading && !health ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-stellar-blue" />
        </div>
      ) : !health ? (
        <div className="card py-12 text-center">
          <XCircle className="mx-auto mb-4 h-12 w-12 text-red-400" />
          <p className="text-lg text-white/70">Gateway unreachable</p>
          <p className="text-sm text-white/40">Make sure the API gateway is running on port 3000</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className={`card flex items-center gap-4 ${health.gateway === "healthy" ? "border-emerald-500/30" : "border-red-500/30"}`}>
            {health.gateway === "healthy" ? (
              <CheckCircle2 className="h-6 w-6 text-emerald-400" />
            ) : (
              <XCircle className="h-6 w-6 text-red-400" />
            )}
            <div>
              <p className="font-semibold">API Gateway</p>
              <p className="text-sm text-white/50">Status: {health.gateway}</p>
            </div>
          </div>

          {health.services.map((s) => (
            <div
              key={s.service}
              className={`card flex items-center gap-4 ${s.status === "healthy" ? "border-emerald-500/30" : "border-red-500/30"}`}
            >
              {s.status === "healthy" ? (
                <CheckCircle2 className="h-6 w-6 text-emerald-400" />
              ) : (
                <XCircle className="h-6 w-6 text-red-400" />
              )}
              <div className="flex-1">
                <p className="font-semibold capitalize">{s.service.replace(/-/g, " ")}</p>
                <p className="text-sm text-white/50">
                  Status: {s.status}
                  {s.version && ` • v${s.version}`}
                </p>
              </div>
              <Activity className="h-4 w-4 text-white/20" />
            </div>
          ))}

          <p className="text-center text-xs text-white/30">
            Last checked: {new Date(health.timestamp).toLocaleTimeString()}
          </p>
        </div>
      )}
    </div>
  );
}
