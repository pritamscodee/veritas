import { Router, Request, Response } from "express";
import * as StellarSdk from "stellar-sdk";
import { stake, unstake, computeVotingPower } from "@veritas/stellar";
import { DEFI } from "@veritas/constants";
import { store } from "../store";

const router = Router();

function keypairFromSecret(secret: string): StellarSdk.Keypair {
  if (!secret) throw new Error("secret is required");
  return StellarSdk.Keypair.fromSecret(secret);
}

// POST /defi/stake  { secret, stakingContract, tokenContract, amount, lockSeconds }
router.post("/stake", async (req: Request, res: Response) => {
  try {
    const { secret, stakingContract, tokenContract, amount, lockSeconds } = req.body;
    const kp = keypairFromSecret(secret);
    const hash = await stake({
      stakingContract,
      stakerKeypair: kp,
      tokenContract,
      amount: String(amount),
      lockSeconds: Number(lockSeconds),
    });
    const power = computeVotingPower(
      BigInt(amount),
      Number(lockSeconds),
      DEFI.MAX_LOCK_SECONDS
    );
    const record = store.setStake({
      account: kp.publicKey(),
      tokenContract,
      staked: String(amount),
      votingPower: power.toString(),
      lockSeconds: Number(lockSeconds),
      unlockAt: Math.floor(Date.now() / 1000) + Number(lockSeconds),
      updatedAt: Date.now(),
    });
    res.json({ hash, ...record });
  } catch (e: any) {
    res.status(400).json({ code: "STAKE_ERROR", message: e.message });
  }
});

// POST /defi/unstake  { secret, stakingContract }
router.post("/unstake", async (req: Request, res: Response) => {
  try {
    const { secret, stakingContract } = req.body;
    const kp = keypairFromSecret(secret);
    const hash = await unstake(stakingContract, kp);
    store.stakes.delete(kp.publicKey());
    res.json({ hash, account: kp.publicKey() });
  } catch (e: any) {
    res.status(400).json({ code: "UNSTAKE_ERROR", message: e.message });
  }
});

// GET /defi/power?account=G...  (uses stored position, else computes from query)
router.get("/power", (req: Request, res: Response) => {
  const account = String(req.query.account || "");
  const stored = account ? store.getStake(account) : undefined;
  if (stored) {
    return res.json(stored);
  }
  const staked = BigInt(req.query.staked ? String(req.query.staked) : "0");
  const lockSeconds = Number(req.query.lockSeconds || 0);
  const power = computeVotingPower(staked, lockSeconds, DEFI.MAX_LOCK_SECONDS);
  res.json({
    account,
    staked: staked.toString(),
    votingPower: power.toString(),
    lockSeconds,
  });
});

export default router;

