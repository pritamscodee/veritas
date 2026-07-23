import { Router, Request, Response } from "express";
import * as StellarSdk from "stellar-sdk";
import {
  sendPayment,
  createAccount,
  getPaymentHistory,
  getAccountBalance,
} from "@veritas/stellar";
import { PAYMENTS } from "@veritas/constants";
import { store } from "../store";

const router = Router();

function keypairFromSecret(secret: string): StellarSdk.Keypair {
  if (!secret) throw new Error("secret is required");
  return StellarSdk.Keypair.fromSecret(secret);
}

// GET /payments/balance?account=G...
router.get("/balance", async (req: Request, res: Response) => {
  try {
    const account = String(req.query.account || "");
    if (!account) return res.status(400).json({ code: "BAD_INPUT", message: "account required" });
    const balance = await getAccountBalance(account);
    res.json({ account, balance });
  } catch (e: any) {
    res.status(400).json({ code: "PAYMENT_ERROR", message: e.message });
  }
});

// GET /payments/history?account=G...&limit=20
router.get("/history", async (req: Request, res: Response) => {
  try {
    const account = String(req.query.account || "");
    const limit = Number(req.query.limit || 20);
    if (!account) return res.status(400).json({ code: "BAD_INPUT", message: "account required" });
    const history = await getPaymentHistory(account, limit);
    res.json({ account, payments: history });
  } catch (e: any) {
    res.status(400).json({ code: "PAYMENT_ERROR", message: e.message });
  }
});

// POST /payments/send  { secret, destination, amount, asset?, memo? }
router.post("/send", async (req: Request, res: Response) => {
  try {
    const { secret, destination, amount, asset, memo } = req.body;
    const kp = keypairFromSecret(secret);
    const stellarAsset = asset && asset !== "XLM" ? StellarSdk.Asset.native() : StellarSdk.Asset.native();
    const result = await sendPayment({ sourceKeypair: kp, destination, amount, asset: stellarAsset, memo });
    const record = store.addPayment({
      kind: "transfer",
      source: result.source,
      destination: result.destination,
      amount: result.amount,
      asset: result.asset,
      hash: result.hash,
    });
    res.json(record);
  } catch (e: any) {
    res.status(400).json({ code: "PAYMENT_ERROR", message: e.message });
  }
});

// POST /payments/election-fee  { secret, destination, electionId, amount? }
router.post("/election-fee", async (req: Request, res: Response) => {
  try {
    const { secret, destination, electionId, amount } = req.body;
    const kp = keypairFromSecret(secret);
    const fee = amount || PAYMENTS.ELECTION_FEE;
    const result = await sendPayment({
      sourceKeypair: kp,
      destination,
      amount: String(fee),
      memo: `election-fee:${electionId}`,
    });
    const record = store.addPayment({
      kind: "election_fee",
      source: result.source,
      destination: result.destination,
      amount: result.amount,
      asset: result.asset,
      electionId,
      hash: result.hash,
    });
    res.json(record);
  } catch (e: any) {
    res.status(400).json({ code: "PAYMENT_ERROR", message: e.message });
  }
});

// POST /payments/create-account  { funderSecret, newAccount }
router.post("/create-account", async (req: Request, res: Response) => {
  try {
    const { funderSecret, newAccount, startingBalance } = req.body;
    const kp = keypairFromSecret(funderSecret);
    const hash = await createAccount(kp, newAccount, startingBalance || "2");
    res.json({ hash, newAccount });
  } catch (e: any) {
    res.status(400).json({ code: "PAYMENT_ERROR", message: e.message });
  }
});

export default router;

