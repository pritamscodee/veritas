import * as StellarSdk from "stellar-sdk";
import { STELLAR } from "@veritas/constants";

const SOROBAN_RPC_URL = STELLAR.SOROBAN_RPC_URL;
const NETWORK_PASSPHRASE = STELLAR.NETWORK_PASSPHRASE;

function server(): StellarSdk.Horizon.Server {
  return new StellarSdk.Horizon.Server(STELLAR.HORIZON_URL);
}

function sorobanRpc(): StellarSdk.SorobanRpc.Server {
  return new StellarSdk.SorobanRpc.Server(SOROBAN_RPC_URL);
}

export interface StakeRequest {
  stakingContract: string;
  stakerKeypair: StellarSdk.Keypair;
  tokenContract: string;
  amount: string;
  lockSeconds: number;
}

export interface VotingPowerResult {
  account: string;
  staked: string;
  votingPower: string;
  unlockAt: number;
}

/**
 * Stellar DeFi use case — staking for conviction voting.
 * Voters stake the governance token to accrue voting power over time
 * (conviction voting). Locked stake also backstops Sybil resistance.
 */
export async function stake(req: StakeRequest): Promise<string> {
  const rpc = sorobanRpc();
  const sourceAccount = await server().loadAccount(req.stakerKeypair.publicKey());
  const contract = new StellarSdk.Contract(req.stakingContract);

  const tx = new StellarSdk.TransactionBuilder(sourceAccount, {
    fee: "100000",
    networkPassphrase: NETWORK_PASSPHRASE,
  })
    .addOperation(
      contract.call(
        "stake",
        StellarSdk.nativeToScVal(req.stakerKeypair.publicKey(), { type: "address" }),
        StellarSdk.nativeToScVal(req.tokenContract, { type: "address" }),
        StellarSdk.nativeToScVal(req.amount, { type: "i128" }),
        StellarSdk.nativeToScVal(req.lockSeconds, { type: "u64" })
      )
    )
    .setTimeout(30)
    .build();

  tx.sign(req.stakerKeypair);
  const res = await rpc.sendTransaction(tx);
  return (res as any).hash;
}

export async function unstake(
  stakingContract: string,
  stakerKeypair: StellarSdk.Keypair
): Promise<string> {
  const rpc = sorobanRpc();
  const sourceAccount = await server().loadAccount(stakerKeypair.publicKey());
  const contract = new StellarSdk.Contract(stakingContract);
  const tx = new StellarSdk.TransactionBuilder(sourceAccount, {
    fee: "100000",
    networkPassphrase: NETWORK_PASSPHRASE,
  })
    .addOperation(
      contract.call("unstake", StellarSdk.nativeToScVal(stakerKeypair.publicKey(), { type: "address" }))
    )
    .setTimeout(30)
    .build();
  tx.sign(stakerKeypair);
  const res = await rpc.sendTransaction(tx);
  return (res as any).hash;
}

/** Compute conviction-style voting power: staked * (1 + time-locked factor). */
export function computeVotingPower(
  stakedAmount: bigint,
  lockedForSeconds: number,
  maxLockSeconds: number
): bigint {
  const lockFactor =
    maxLockSeconds > 0
      ? (BigInt(lockedForSeconds) * 1_000_000n) / BigInt(maxLockSeconds)
      : 0n;
  return stakedAmount * (1n + lockFactor / 1_000_000n);
}
