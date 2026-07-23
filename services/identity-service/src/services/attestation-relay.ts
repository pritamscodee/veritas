import prisma from "../models/prisma";
import { verifyKYCAttestation } from "@veritas/stellar";
import type { AnchorKYCAttestation } from "@veritas/types";

export class AttestationRelay {
  private pollingInterval: NodeJS.Timeout | null = null;
  private intervalMs = 30000;

  start() {
    console.log("[attestation-relay] starting relay indexer");
    this.poll();
    this.pollingInterval = setInterval(() => this.poll(), this.intervalMs);
  }

  stop() {
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
      this.pollingInterval = null;
    }
  }

  private async poll() {
    try {
      const anchors = await prisma.anchorRegistration.findMany({
        where: { isActive: true },
      });

      for (const anchor of anchors) {
        await this.indexAttestations(anchor.name);
      }
    } catch (error: any) {
      console.error("[attestation-relay] poll error:", error.message);
    }
  }

  private async indexAttestations(anchorName: string) {
    // In production, this monitors Stellar accounts for new KYC attestation
    // operations from the registered anchor. For each new attestation found,
    // it stores it in the database for the identity contract to verify.
    const lastChecked = await prisma.attestationIndex.findFirst({
      where: { anchorName },
      orderBy: { lastCheckedAt: "desc" },
    });

    // Horizon API call to fetch recent operations from the anchor's account
    // This is a placeholder for the actual relay logic
    console.log(
      `[attestation-relay] indexing ${anchorName} since ${lastChecked?.lastCheckedAt || "epoch"}`
    );
  }

  async verifyAndStoreAttestation(attestation: AnchorKYCAttestation): Promise<boolean> {
    const isValid = await verifyKYCAttestation(attestation);
    if (!isValid) return false;

    await prisma.kYCAttestation.upsert({
      where: {
        accountId_anchorName: {
          accountId: attestation.accountId,
          anchorName: attestation.anchor,
        },
      },
      update: {
        kycLevel: this.mapKycLevel(attestation.kycLevel),
        credentialHash: attestation.credentialHash,
        signature: attestation.signature,
        issuedAt: new Date(attestation.issuedAt),
        expiresAt: new Date(attestation.expiresAt),
        verifiedAt: new Date(),
      },
      create: {
        accountId: attestation.accountId,
        anchorName: attestation.anchor,
        kycLevel: this.mapKycLevel(attestation.kycLevel),
        credentialHash: attestation.credentialHash,
        signature: attestation.signature,
        issuedAt: new Date(attestation.issuedAt),
        expiresAt: new Date(attestation.expiresAt),
        verifiedAt: new Date(),
      },
    });

    return true;
  }

  async hasValidAttestation(accountId: string, requiredKycLevel: number): Promise<boolean> {
    const attestation = await prisma.kYCAttestation.findFirst({
      where: {
        accountId,
        isRevoked: false,
        kycLevel: { gte: requiredKycLevel },
        expiresAt: { gt: new Date() },
      },
    });

    return attestation !== null;
  }

  private mapKycLevel(level: string): number {
    const levels: Record<string, number> = { basic: 1, enhanced: 2, full: 3 };
    return levels[level] || 1;
  }
}

export const relay = new AttestationRelay();
