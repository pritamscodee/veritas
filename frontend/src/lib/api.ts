import type { Election, EligibilityCheck, ZKProofResponse, TallyResult, ServiceHealth } from "@/types";

const BASE_URL = "/api";

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(error.message || `HTTP ${res.status}`);
  }

  if (res.status === 204) return undefined as T;
  return res.json();
}

// --- Elections ---
export const electionsApi = {
  list: (params?: { status?: string; page?: number }) => {
    const query = new URLSearchParams();
    if (params?.status) query.set("status", params.status);
    if (params?.page) query.set("page", String(params.page));
    return request<{ elections: Election[]; pagination: any }>(`/elections?${query}`);
  },

  get: (id: string) => request<Election>(`/elections/${id}`),

  create: (data: {
    title: string;
    description: string;
    organizerId: string;
    votingMethod: string;
    requiredKycLevel: number;
    startTime: string;
    endTime: string;
    quorumThreshold: number;
    options: { label: string; description: string }[];
  }) => request<Election>("/elections", { method: "POST", body: JSON.stringify(data) }),

  updateStatus: (id: string, status: string) =>
    request<Election>(`/elections/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    }),

  delete: (id: string) =>
    request<void>(`/elections/${id}`, { method: "DELETE" }),
};

// --- Identity ---
export const identityApi = {
  checkEligibility: (accountId: string, electionId: string, requiredKycLevel: number) =>
    request<EligibilityCheck>("/identity/eligibility", {
      method: "POST",
      body: JSON.stringify({ accountId, electionId, requiredKycLevel }),
    }),

  verifyAttestation: (data: {
    accountId: string;
    anchorName: string;
    kycLevel: number;
    credentialHash: string;
    signature: string;
  }) => request<{ verified: boolean }>("/identity/attestations/verify", {
    method: "POST",
    body: JSON.stringify(data),
  }),

  issueCredential: (accountId: string, electionId: string, credentialHash: string) =>
    request<any>("/identity/credentials", {
      method: "POST",
      body: JSON.stringify({ accountId, electionId, credentialHash }),
    }),

  listAnchors: () => request<any[]>("/identity/anchors"),
};

// --- ZK Proof ---
export const zkProofApi = {
  generateProof: (data: {
    electionId: string;
    accountId: string;
    optionId: string;
    optionIndex: number;
    credentialHash: string;
    nullifier: string;
  }) => request<ZKProofResponse>("/zk-proof/prove", {
    method: "POST",
    body: JSON.stringify(data),
  }),

  verifyProof: (proof: any, publicInputs: string[]) =>
    request<{ verified: boolean }>("/zk-proof/verify", {
      method: "POST",
      body: JSON.stringify({ proof, publicInputs }),
    }),

  getStatus: () => request<{ proverType: string; status: string }>("/zk-proof/status"),
};

// --- Tally ---
export const tallyApi = {
  getResult: (electionId: string) => request<TallyResult>(`/tally/results/${electionId}`),

  getShareStatus: (electionId: string) =>
    request<{ shareCount: number; canDecrypt: boolean }>(`/tally/shares/${electionId}`),

  submitShare: (holderId: string, electionId: string, share: string) =>
    request<{ shareCount: number; canDecrypt: boolean }>("/tally/shares", {
      method: "POST",
      body: JSON.stringify({ holderId, electionId, share }),
    }),

  finalize: (electionId: string) =>
    request<TallyResult>(`/tally/finalize/${electionId}`, { method: "POST" }),
};

// --- Health ---
export const healthApi = {
  gateway: () => request<ServiceHealth>("/health"),
  aggregated: () => request<ServiceHealth>("/health"),
};
