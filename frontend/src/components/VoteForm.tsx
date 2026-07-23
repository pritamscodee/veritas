import { useState } from "react";
import { cn } from "@/lib/utils";
import type { VoteOption } from "@/types";

interface VoteFormProps {
  options: VoteOption[];
  onVote: (optionId: string, optionIndex: number) => void;
  loading: boolean;
  disabled?: boolean;
}

export default function VoteForm({ options, onVote, loading, disabled }: VoteFormProps) {
  const [selected, setSelected] = useState<string | null>(null);

  const handleSubmit = () => {
    if (!selected) return;
    const index = options.findIndex((o) => o.id === selected);
    onVote(selected, index);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        {options.map((option, i) => {
          const checked = selected === option.id;
          return (
            <button
              key={option.id}
              type="button"
              disabled={disabled}
              onClick={() => setSelected(option.id)}
              className={cn(
                "w-full cursor-pointer rounded-lg border p-4 text-left transition-all",
                checked
                  ? "border-primary-500 bg-primary-500/10"
                  : "border-white/10 bg-white/5 hover:border-white/20",
                disabled && "cursor-not-allowed opacity-50"
              )}
            >
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border-2 text-sm font-bold",
                    checked
                      ? "border-primary-500 bg-primary-500 text-white"
                      : "border-white/30 text-white/50"
                  )}
                >
                  {String.fromCharCode(65 + i)}
                </div>
                <div>
                  <div className="font-medium text-white">{option.label}</div>
                  {option.description && (
                    <div className="mt-0.5 text-sm text-white/50">{option.description}</div>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <button
        onClick={handleSubmit}
        disabled={!selected || loading || disabled}
        className="btn-primary w-full"
      >
        {loading ? (
          <>
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            Generating ZK Proof...
          </>
        ) : (
          "Cast Vote"
        )}
      </button>
    </div>
  );
}
