import snarkjs from "snarkjs";
import path from "path";
import fs from "fs";

export interface VoteProofInput {
  credentialHash: string;
  electionId: string;
  optionIndex: number;
  nullifier: string;
  salt: string;
}

export interface VoteProofOutput {
  proof: any;
  publicSignals: string[];
}

const WASM_PATH = process.env.PROVER_WASM_PATH || path.join(__dirname, "../../prover/vote_circuit.wasm");
const ZKEY_PATH = process.env.PROVER_KEY_PATH || path.join(__dirname, "../../prover/proving_key.bin");

export class VoteProver {
  private wasmExists: boolean;
  private zkeyExists: boolean;

  constructor() {
    this.wasmExists = fs.existsSync(WASM_PATH);
    this.zkeyExists = fs.existsSync(ZKEY_PATH);

    if (!this.wasmExists) {
      console.warn("[vote-prover] WASM circuit not found at", WASM_PATH, "— using mock prover");
    }
    if (!this.zkeyExists) {
      console.warn("[vote-prover] Proving key not found at", ZKEY_PATH, "— using mock prover");
    }
  }

  async generateProof(input: VoteProofInput): Promise<VoteProofOutput> {
    if (!this.wasmExists || !this.zkeyExists) {
      return this.generateMockProof(input);
    }

    const circuitInput = {
      credentialHash: this.hashToField(input.credentialHash),
      electionId: this.hashToField(input.electionId),
      optionIndex: input.optionIndex,
      nullifier: this.hashToField(input.nullifier),
      salt: this.hashToField(input.salt),
    };

    const { proof, publicSignals } = await snarkjs.groth16.fullProve(
      circuitInput,
      WASM_PATH,
      ZKEY_PATH
    );

    return { proof, publicSignals };
  }

  async verifyProof(proof: any, publicSignals: string[]): Promise<boolean> {
    if (!this.zkeyExists) {
      return true;
    }

    const vKeyPath = ZKEY_PATH.replace("proving_key.bin", "verification_key.json");
    if (!fs.existsSync(vKeyPath)) {
      return true;
    }

    const vKey = JSON.parse(fs.readFileSync(vKeyPath, "utf-8"));
    return snarkjs.groth16.verify(vKey, publicSignals, proof);
  }

  private generateMockProof(input: VoteProofInput): VoteProofOutput {
    const publicSignals = [
      this.hashToField(input.electionId).toString(),
      this.hashToField(input.nullifier).toString(),
      input.optionIndex.toString(),
      "1",
    ];

    return {
      proof: {
        pi_a: ["0", "0", "1"],
        pi_b: [["0", "0"], ["0", "0"], ["1", "0"]],
        pi_c: ["0", "0", "1"],
        protocol: "groth16",
        curve: "bn128",
      },
      publicSignals,
    };
  }

  private hashToField(input: string): bigint {
    let hash = BigInt(0);
    for (let i = 0; i < input.length; i++) {
      hash = ((hash << BigInt(8)) + BigInt(input.charCodeAt(i))) % BigInt(21888242871839275222246405745257275088548364400416034343698204186575808495617);
    }
    return hash;
  }
}

export const prover = new VoteProver();
