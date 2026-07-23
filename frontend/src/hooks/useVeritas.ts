import { useState, useEffect, useCallback } from "react";
import { electionsApi, identityApi, zkProofApi, tallyApi } from "@/lib/api";
import type { Election, EligibilityCheck, ZKProofResponse, TallyResult } from "@/types";

export function useElections(status?: string) {
  const [elections, setElections] = useState<Election[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchElections = useCallback(async () => {
    try {
      setLoading(true);
      const data = await electionsApi.list({ status });
      setElections(data.elections);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [status]);

  useEffect(() => {
    fetchElections();
  }, [fetchElections]);

  return { elections, loading, error, refetch: fetchElections };
}

export function useElection(id: string | undefined) {
  const [election, setElection] = useState<Election | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    electionsApi
      .get(id)
      .then(setElection)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  return { election, loading, error };
}

export function useEligibility(accountId: string | null, electionId: string, kycLevel: number) {
  const [check, setCheck] = useState<EligibilityCheck | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!accountId) return;
    setLoading(true);
    identityApi
      .checkEligibility(accountId, electionId, kycLevel)
      .then(setCheck)
      .finally(() => setLoading(false));
  }, [accountId, electionId, kycLevel]);

  return { check, loading };
}

export function useTallyResult(electionId: string) {
  const [result, setResult] = useState<TallyResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    tallyApi
      .getResult(electionId)
      .then(setResult)
      .catch(() => setResult(null))
      .finally(() => setLoading(false));
  }, [electionId]);

  return { result, loading };
}

export function useWallet() {
  const [accountId, setAccountId] = useState<string | null>(null);
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isFreighterAvailable = typeof window !== "undefined" && !!(window as any).freighter;

  const connect = useCallback(async () => {
    setConnecting(true);
    setError(null);

    try {
      if (isFreighterAvailable) {
        const freighter = (window as any).freighter;
        const addr = await freighter.getAddress();
        setAccountId(addr);
      } else {
        // Demo mode: use testnet account
        const demoAccount = "GDNQWCLQTYJQ2XM2Q2IF6IHWPNNOGNC6YMJOMRAFDGMFQ4PLPX3VTNNL";
        setAccountId(demoAccount);
        setError("Demo mode — install Freighter for real wallet connection");
      }
    } catch (err: any) {
      console.error("Wallet connection failed:", err);
      setError(err?.message || "Connection failed");
    } finally {
      setConnecting(false);
    }
  }, [isFreighterAvailable]);

  const disconnect = useCallback(() => {
    setAccountId(null);
    setError(null);
  }, []);

  return { accountId, connecting, connect, disconnect, error, isFreighterAvailable };
}
