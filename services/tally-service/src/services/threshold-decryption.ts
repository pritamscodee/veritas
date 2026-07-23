import prisma from "../models/prisma";
import { THRESHOLD } from "@veritas/constants";

export class ThresholdDecryption {
  private thresholdM: number;
  private totalN: number;

  constructor() {
    this.thresholdM = THRESHOLD.M;
    this.totalN = THRESHOLD.N;
  }

  async submitShare(holderId: string, electionId: string, share: string): Promise<boolean> {
    const holder = await prisma.keyHolder.findUnique({ where: { holderId } });
    if (!holder || !holder.isActive) {
      throw new Error("Invalid or inactive key holder");
    }

    const existing = await prisma.decryptionShare.findUnique({
      where: { holderId_electionId: { holderId, electionId } },
    });
    if (existing) {
      throw new Error("Share already submitted for this election");
    }

    await prisma.decryptionShare.create({
      data: { holderId, electionId, share },
    });

    return true;
  }

  async getShareCount(electionId: string): Promise<number> {
    return prisma.decryptionShare.count({ where: { electionId } });
  }

  async canDecrypt(electionId: string): Promise<boolean> {
    const count = await this.getShareCount(electionId);
    return count >= this.thresholdM;
  }

  async combineSharesAndDecrypt(electionId: string): Promise<Record<string, number>> {
    const shares = await prisma.decryptionShare.findMany({
      where: { electionId },
    });

    if (shares.length < this.thresholdM) {
      throw new Error(
        `Need ${this.thresholdM} shares, only have ${shares.length}`
      );
    }

    // Lagrange interpolation for threshold decryption
    // In production, this combines the key shares to reconstruct
    // the decryption key, then decrypts the aggregated ciphertexts.
    const decrypted: Record<string, number> = {};

    // Placeholder: in production this performs actual cryptographic
    // threshold decryption using BLS12-381 pairing operations
    console.log(
      `[threshold-decryption] combining ${shares.length} shares for election ${electionId}`
    );

    return decrypted;
  }

  async registerKeyHolder(holderId: string, publicKey: string): Promise<void> {
    const existingCount = await prisma.keyHolder.count();
    if (existingCount >= this.totalN) {
      throw new Error(`Maximum ${this.totalN} key holders already registered`);
    }

    await prisma.keyHolder.create({
      data: {
        holderId,
        publicKey,
        shareIndex: existingCount,
      },
    });
  }

  async getKeyHolders() {
    return prisma.keyHolder.findMany({
      where: { isActive: true },
      select: { holderId: true, publicKey: true, shareIndex: true },
    });
  }
}

export const decryption = new ThresholdDecryption();
