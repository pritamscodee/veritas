import { randomBytes } from "crypto";
import { Request, Response } from "express";
import { prover } from "../provers/vote-prover";

function generateSalt(): string {
  return randomBytes(32).toString("hex");
}

export async function generateVoteProof(req: Request, res: Response) {
  try {
    const { electionId, accountId, optionId, optionIndex, credentialHash, nullifier, salt } =
      req.body;

    if (!electionId || !accountId || !optionId || !credentialHash || !nullifier) {
      res.status(400).json({ code: "VALIDATION_ERROR", message: "Missing required fields" });
      return;
    }

    const proof = await prover.generateProof({
      credentialHash,
      electionId,
      optionIndex: optionIndex || 0,
      nullifier,
      salt: salt || generateSalt(),
    });

    res.json({
      proof: proof.proof,
      publicInputs: proof.publicSignals,
      electionId,
      nullifier,
      verified: true,
    });
  } catch (error: any) {
    console.error("generateVoteProof error:", error);
    res.status(500).json({ code: "PROOF_GENERATION_FAILED", message: error.message });
  }
}

export async function verifyVoteProof(req: Request, res: Response) {
  try {
    const { proof, publicInputs } = req.body;

    if (!proof || !publicInputs) {
      res.status(400).json({ code: "VALIDATION_ERROR", message: "Missing proof or publicInputs" });
      return;
    }

    const isValid = await prover.verifyProof(proof, publicInputs);

    res.json({ verified: isValid });
  } catch (error: any) {
    res.status(500).json({ code: "VERIFICATION_FAILED", message: error.message });
  }
}

export async function getProverStatus(_req: Request, res: Response) {
  res.json({
    service: "zk-proof-service",
    status: "healthy",
    proverType: process.env.PROVER_WASM_PATH ? "circuit" : "mock",
    version: "0.1.0",
    timestamp: Date.now(),
  });
}
