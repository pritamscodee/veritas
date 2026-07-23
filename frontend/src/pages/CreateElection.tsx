import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Trash2, Loader2 } from "lucide-react";
import { electionsApi } from "@/lib/api";

export default function CreateElection() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
    votingMethod: "one_person_one_vote",
    requiredKycLevel: 1,
    quorumThreshold: 1,
    startTime: "",
    endTime: "",
  });

  const [options, setOptions] = useState([
    { label: "", description: "" },
    { label: "", description: "" },
  ]);

  const updateField = (field: string, value: any) => setForm((f) => ({ ...f, [field]: value }));

  const addOption = () => setOptions((o) => [...o, { label: "", description: "" }]);
  const removeOption = (i: number) => setOptions((o) => o.filter((_, idx) => idx !== i));
  const updateOption = (i: number, field: string, value: string) => {
    setOptions((o) => o.map((opt, idx) => (idx === i ? { ...opt, [field]: value } : opt)));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!form.title || !form.startTime || !form.endTime) {
      setError("Please fill in all required fields");
      return;
    }

    const validOptions = options.filter((o) => o.label.trim());
    if (validOptions.length < 2) {
      setError("At least 2 options with labels are required");
      return;
    }

    setLoading(true);
    try {
      const election = await electionsApi.create({
        ...form,
        organizerId: "stellar-org-001",
        options: validOptions,
      });
      navigate(`/elections/${election.id}`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="mb-2 text-3xl font-bold">Create Election</h1>
      <p className="mb-8 text-white/50">Set up a new governance vote on Stellar</p>

      {error && (
        <div className="mb-6 rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="card space-y-4">
          <h3 className="font-semibold">Basic Info</h3>
          <div>
            <label className="mb-1 block text-sm text-white/70">Title *</label>
            <input
              type="text"
              className="input"
              placeholder="Board Election 2025"
              value={form.title}
              onChange={(e) => updateField("title", e.target.value)}
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-sm text-white/70">Description</label>
            <textarea
              className="input min-h-[80px] resize-y"
              placeholder="Describe the election..."
              value={form.description}
              onChange={(e) => updateField("description", e.target.value)}
            />
          </div>
        </div>

        <div className="card space-y-4">
          <h3 className="font-semibold">Settings</h3>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm text-white/70">Voting Method</label>
              <select
                className="input"
                value={form.votingMethod}
                onChange={(e) => updateField("votingMethod", e.target.value)}
              >
                <option value="one_person_one_vote">One Person One Vote</option>
                <option value="quadratic">Quadratic Voting</option>
                <option value="token_weighted">Token Weighted</option>
                <option value="conviction">Conviction Voting</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm text-white/70">KYC Level Required</label>
              <select
                className="input"
                value={form.requiredKycLevel}
                onChange={(e) => updateField("requiredKycLevel", Number(e.target.value))}
              >
                <option value={1}>Basic</option>
                <option value={2}>Enhanced</option>
                <option value={3}>Full</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm text-white/70">Start Time *</label>
              <input
                type="datetime-local"
                className="input"
                value={form.startTime}
                onChange={(e) => updateField("startTime", e.target.value)}
                required
              />
            </div>
            <div>
              <label className="mb-1 block text-sm text-white/70">End Time *</label>
              <input
                type="datetime-local"
                className="input"
                value={form.endTime}
                onChange={(e) => updateField("endTime", e.target.value)}
                required
              />
            </div>
            <div>
              <label className="mb-1 block text-sm text-white/70">Quorum Threshold</label>
              <input
                type="number"
                className="input"
                min={1}
                value={form.quorumThreshold}
                onChange={(e) => updateField("quorumThreshold", Number(e.target.value))}
              />
            </div>
          </div>
        </div>

        <div className="card space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Options ({options.length})</h3>
            <button type="button" onClick={addOption} className="btn-secondary text-xs">
              <Plus className="h-3.5 w-3.5" /> Add Option
            </button>
          </div>
          {options.map((opt, i) => (
            <div key={i} className="flex gap-2">
              <input
                type="text"
                className="input flex-1"
                placeholder={`Option ${String.fromCharCode(65 + i)}`}
                value={opt.label}
                onChange={(e) => updateOption(i, "label", e.target.value)}
              />
              <input
                type="text"
                className="input flex-1"
                placeholder="Description (optional)"
                value={opt.description}
                onChange={(e) => updateOption(i, "description", e.target.value)}
              />
              {options.length > 2 && (
                <button
                  type="button"
                  onClick={() => removeOption(i)}
                  className="rounded-lg p-2 text-white/40 hover:bg-red-500/10 hover:text-red-400"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>
          ))}
        </div>

        <button type="submit" disabled={loading} className="btn-stellar w-full py-3 text-base">
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Creating Election...
            </>
          ) : (
            "Create Election"
          )}
        </button>
      </form>
    </div>
  );
}
