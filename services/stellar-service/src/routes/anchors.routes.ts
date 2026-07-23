import { Router, Request, Response } from "express";
import * as StellarSdk from "stellar-sdk";
import {
  getTrustedAnchors,
  buildStellarToml,
  trustAnchor,
  verifyKYCAttestation,
} from "@veritas/stellar";
import { ANCHOR_PROVIDERS } from "@veritas/constants";

const router = Router();

function keypairFromSecret(secret: string): StellarSdk.Keypair {
  if (!secret) throw new Error("secret is required");
  return StellarSdk.Keypair.fromSecret(secret);
}

// GET /anchors  -> trusted anchors used for real-human verification
router.get("/", (_req: Request, res: Response) => {
  const anchors = getTrustedAnchors();
  res.json({
    anchors: Object.entries(anchors).map(([provider, signingKey]) => ({
      provider,
      signingKey,
      name: provider,
      isActive: Boolean(signingKey),
    })),
    providers: ANCHOR_PROVIDERS,
  });
});

// GET /anchors/toml?homeDomain=...&signingKey=...  -> SEP-1 stellar.toml
router.get("/toml", (req: Request, res: Response) => {
  const homeDomain = String(req.query.homeDomain || "veritas.vote");
  const signingKey = String(req.query.signingKey || "");
  res.type("toml").send(buildStellarToml(signingKey, homeDomain));
});

// POST /anchors/trust  { secret, anchorSigningKey, weight? }
router.post("/trust", async (req: Request, res: Response) => {
  try {
    const { secret, anchorSigningKey, weight } = req.body;
    const kp = keypairFromSecret(secret);
    const hash = await trustAnchor({ accountKeypair: kp, anchorSigningKey, weight });
    res.json({ hash, account: kp.publicKey(), anchorSigningKey });
  } catch (e: any) {
    res.status(400).json({ code: "ANCHOR_ERROR", message: e.message });
  }
});

// POST /anchors/verify  { accountId, anchor, expiresAt }
router.post("/verify", async (req: Request, res: Response) => {
  try {
    const { accountId, anchor, expiresAt } = req.body;
    const verified = await verifyKYCAttestation({ accountId, anchor, expiresAt });
    res.json({ verified, accountId, anchor });
  } catch (e: any) {
    res.status(400).json({ code: "ANCHOR_ERROR", message: e.message });
  }
});

export default router;

