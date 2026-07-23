import { Router, Request, Response } from "express";
import * as StellarSdk from "stellar-sdk";
import { tokenizeAsset, mintToken, deployAssetContract } from "@veritas/stellar";
import { ASSETS } from "@veritas/constants";
import { store } from "../store";

const router = Router();

function keypairFromSecret(secret: string): StellarSdk.Keypair {
  if (!secret) throw new Error("secret is required");
  return StellarSdk.Keypair.fromSecret(secret);
}

// POST /assets/tokenize  { secret, code, limit? }
router.post("/tokenize", async (req: Request, res: Response) => {
  try {
    const { secret, code, limit } = req.body;
    const kp = keypairFromSecret(secret);
    const assetCode = code || ASSETS.GOVERNANCE_TOKEN_CODE;
    const result = await tokenizeAsset({ issuerKeypair: kp, code: assetCode, limit });
    const record = store.addAsset({
      code: result.code,
      issuer: result.issuer,
      asset: result.asset,
      contractAddress: result.contractAddress,
      totalSupply: "0",
      txHash: result.txHash,
    });
    res.json(record);
  } catch (e: any) {
    res.status(400).json({ code: "TOKENIZE_ERROR", message: e.message });
  }
});

// POST /assets/deploy-contract  { secret, code, issuer }
router.post("/deploy-contract", async (req: Request, res: Response) => {
  try {
    const { secret, code, issuer } = req.body;
    const kp = keypairFromSecret(secret);
    const asset = new StellarSdk.Asset(code, issuer);
    const address = await deployAssetContract(asset, kp);
    res.json({ contractAddress: address, asset: asset.toString() });
  } catch (e: any) {
    res.status(400).json({ code: "TOKENIZE_ERROR", message: e.message });
  }
});

// POST /assets/:contract/mint  { adminSecret, to, amount }
router.post("/:contract/mint", async (req: Request, res: Response) => {
  try {
    const { adminSecret, to, amount } = req.body;
    const kp = keypairFromSecret(adminSecret);
    const hash = await mintToken(req.params.contract, kp, to, amount);
    const existing = store.assets.find((a) => a.contractAddress === req.params.contract);
    if (existing) {
      existing.totalSupply = String(Number(existing.totalSupply) + Number(amount));
    }
    res.json({ contract: req.params.contract, to, amount, hash });
  } catch (e: any) {
    res.status(400).json({ code: "MINT_ERROR", message: e.message });
  }
});

// GET /assets  -> list tokenized assets recorded by this service
router.get("/", (_req: Request, res: Response) => {
  res.json({ assets: store.assets });
});

export default router;

