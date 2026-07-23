import { Request, Response } from "express";
import prisma from "../models/prisma";
import { relay } from "../services/attestation-relay";

export async function verifyAttestation(req: Request, res: Response) {
  try {
    const { accountId, anchorName, kycLevel, credentialHash, signature, issuedAt, expiresAt } =
      req.body;

    if (!accountId || !anchorName || !credentialHash || !signature) {
      res.status(400).json({ code: "VALIDATION_ERROR", message: "Missing required fields" });
      return;
    }

    const isValid = await relay.verifyAndStoreAttestation({
      accountId,
      anchor: anchorName,
      kycLevel: kycLevel || "basic",
      credentialHash,
      signature,
      issuedAt: issuedAt || Date.now(),
      expiresAt: expiresAt || Date.now() + 365 * 24 * 60 * 60 * 1000,
    });

    if (!isValid) {
      res.status(400).json({ code: "INVALID_ATTESTATION", message: "KYC attestation verification failed" });
      return;
    }

    res.json({ verified: true, accountId, anchorName });
  } catch (error: any) {
    res.status(500).json({ code: "INTERNAL_ERROR", message: error.message });
  }
}

export async function checkEligibility(req: Request, res: Response) {
  try {
    const { accountId, requiredKycLevel, electionId } = req.body;

    if (!accountId || !electionId) {
      res.status(400).json({ code: "VALIDATION_ERROR", message: "Missing required fields" });
      return;
    }

    const hasAttestation = await relay.hasValidAttestation(accountId, requiredKycLevel || 1);

    const existingCredential = await prisma.votingCredential.findUnique({
      where: { accountId_electionId: { accountId, electionId } },
    });

    res.json({
      eligible: hasAttestation,
      hasCredential: !!existingCredential,
      credentialUsed: existingCredential?.isUsed || false,
    });
  } catch (error: any) {
    res.status(500).json({ code: "INTERNAL_ERROR", message: error.message });
  }
}

export async function issueCredential(req: Request, res: Response) {
  try {
    const { accountId, electionId, credentialHash } = req.body;

    if (!accountId || !electionId || !credentialHash) {
      res.status(400).json({ code: "VALIDATION_ERROR", message: "Missing required fields" });
      return;
    }

    const existing = await prisma.votingCredential.findUnique({
      where: { accountId_electionId: { accountId, electionId } },
    });

    if (existing) {
      res.status(409).json({ code: "CREDENTIAL_EXISTS", message: "Credential already issued" });
      return;
    }

    const credential = await prisma.votingCredential.create({
      data: { accountId, electionId, credentialHash },
    });

    res.status(201).json(credential);
  } catch (error: any) {
    res.status(500).json({ code: "INTERNAL_ERROR", message: error.message });
  }
}

export async function getCredential(req: Request, res: Response) {
  try {
    const { accountId, electionId } = req.params;

    const credential = await prisma.votingCredential.findUnique({
      where: { accountId_electionId: { accountId, electionId } },
    });

    if (!credential) {
      res.status(404).json({ code: "NOT_FOUND", message: "Credential not found" });
      return;
    }

    res.json(credential);
  } catch (error: any) {
    res.status(500).json({ code: "INTERNAL_ERROR", message: error.message });
  }
}

export async function registerAnchor(req: Request, res: Response) {
  try {
    const { name, signingKey } = req.body;

    if (!name || !signingKey) {
      res.status(400).json({ code: "VALIDATION_ERROR", message: "Missing required fields" });
      return;
    }

    const anchor = await prisma.anchorRegistration.upsert({
      where: { name },
      update: { signingKey, isActive: true },
      create: { name, signingKey },
    });

    res.status(201).json(anchor);
  } catch (error: any) {
    res.status(500).json({ code: "INTERNAL_ERROR", message: error.message });
  }
}

export async function listAnchors(_req: Request, res: Response) {
  try {
    const anchors = await prisma.anchorRegistration.findMany({
      where: { isActive: true },
      select: { id: true, name: true, createdAt: true },
    });
    res.json(anchors);
  } catch (error: any) {
    res.status(500).json({ code: "INTERNAL_ERROR", message: error.message });
  }
}
