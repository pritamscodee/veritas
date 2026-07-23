import { Request, Response } from "express";
import prisma from "../models/prisma";
import { decryption } from "../services/threshold-decryption";

export async function submitDecryptionShare(req: Request, res: Response) {
  try {
    const { holderId, electionId, share } = req.body;

    if (!holderId || !electionId || !share) {
      res.status(400).json({ code: "VALIDATION_ERROR", message: "Missing required fields" });
      return;
    }

    await decryption.submitShare(holderId, electionId, share);

    const shareCount = await decryption.getShareCount(electionId);
    const canDecrypt = await decryption.canDecrypt(electionId);

    res.json({
      submitted: true,
      shareCount,
      threshold: process.env.THRESHOLD_M || "3",
      canDecrypt,
    });
  } catch (error: any) {
    res.status(400).json({ code: "SHARE_ERROR", message: error.message });
  }
}

export async function finalizeTally(req: Request, res: Response) {
  try {
    const { electionId } = req.params;

    const canDecrypt = await decryption.canDecrypt(electionId);
    if (!canDecrypt) {
      const shareCount = await decryption.getShareCount(electionId);
      res.status(400).json({
        code: "INSUFFICIENT_SHARES",
        message: `Need more decryption shares. Current: ${shareCount}`,
      });
      return;
    }

    const decrypted = await decryption.combineSharesAndDecrypt(electionId);
    const totalVotes = Object.values(decrypted).reduce((sum, v) => sum + v, 0);
    const quorumReached = totalVotes > 0;

    const results = Object.entries(decrypted).map(([optionId, voteCount]) => ({
      optionId,
      voteCount,
      percentage: totalVotes > 0 ? (voteCount / totalVotes) * 100 : 0,
    }));

    const tally = await prisma.tallyResult.create({
      data: {
        electionId,
        results,
        totalVotes,
        quorumReached,
      },
    });

    res.json({
      electionId,
      results,
      totalVotes,
      quorumReached,
      decryptedAt: tally.decryptedAt,
    });
  } catch (error: any) {
    res.status(500).json({ code: "TALLY_FAILED", message: error.message });
  }
}

export async function getResult(req: Request, res: Response) {
  try {
    const { electionId } = req.params;

    const tally = await prisma.tallyResult.findUnique({
      where: { electionId },
    });

    if (!tally) {
      res.status(404).json({ code: "NOT_FOUND", message: "Tally result not found" });
      return;
    }

    res.json(tally);
  } catch (error: any) {
    res.status(500).json({ code: "INTERNAL_ERROR", message: error.message });
  }
}

export async function registerKeyHolder(req: Request, res: Response) {
  try {
    const { holderId, publicKey } = req.body;

    if (!holderId || !publicKey) {
      res.status(400).json({ code: "VALIDATION_ERROR", message: "Missing required fields" });
      return;
    }

    await decryption.registerKeyHolder(holderId, publicKey);

    res.status(201).json({ registered: true, holderId });
  } catch (error: any) {
    res.status(400).json({ code: "REGISTRATION_ERROR", message: error.message });
  }
}

export async function getKeyHolders(_req: Request, res: Response) {
  try {
    const holders = await decryption.getKeyHolders();
    res.json(holders);
  } catch (error: any) {
    res.status(500).json({ code: "INTERNAL_ERROR", message: error.message });
  }
}

export async function getShareStatus(req: Request, res: Response) {
  try {
    const { electionId } = req.params;
    const shareCount = await decryption.getShareCount(electionId);
    const canDecrypt = await decryption.canDecrypt(electionId);

    res.json({ electionId, shareCount, canDecrypt });
  } catch (error: any) {
    res.status(500).json({ code: "INTERNAL_ERROR", message: error.message });
  }
}
