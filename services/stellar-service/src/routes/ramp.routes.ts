import { Router, Request, Response } from "express";
import * as StellarSdk from "stellar-sdk";
import { listRampAnchors, buildRampUrl } from "@veritas/stellar";
import { RAMP } from "@veritas/constants";

const router = Router();

// GET /ramp/anchors  -> available on/off-ramp anchors
router.get("/anchors", (_req: Request, res: Response) => {
  res.json({ anchors: listRampAnchors() });
});

// POST /ramp/quote  { provider, direction, assetCode, amount, accountId, language? }
router.post("/quote", (req: Request, res: Response) => {
  try {
    const { provider, direction, assetCode, amount, accountId, language } = req.body;
    if (!provider || !direction || !assetCode || !amount || !accountId) {
      return res.status(400).json({ code: "BAD_INPUT", message: "missing fields" });
    }
    const fee = (Number(amount) * Number(RAMP.FEE_RATE)).toFixed(2);
    const url = buildRampUrl({
      provider,
      direction,
      accountId,
      assetCode,
      amount: String(amount),
      language,
    });
    res.json({
      provider,
      direction,
      assetCode,
      amount,
      fee,
      rate: "1.00",
      url: url.url,
    });
  } catch (e: any) {
    res.status(400).json({ code: "RAMP_ERROR", message: e.message });
  }
});

export default router;

