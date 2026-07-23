#![no_std]
use soroban_sdk::{contract, contractimpl, contracttype, symbol_short, Bytes, Env, Symbol, Vec};

const PROOFS: Symbol = symbol_short!("PROOFS");
const NULLIFIER: Symbol = symbol_short!("NULLIFY");

#[derive(Clone)]
#[contracttype]
pub struct ZKProof {
    pub proof_data: Bytes,
    pub public_inputs: Vec<Bytes>,
    pub election_id: Symbol,
    pub nullifier: Bytes,
}

#[derive(Clone)]
#[contracttype]
pub struct VoteCiphertext {
    pub encrypted_option: Bytes,
    pub election_id: Symbol,
    pub timestamp: u64,
}

#[contract]
pub struct VoteCircuit;

#[contractimpl]
impl VoteCircuit {
    /// Submit a ZK proof that proves:
    /// 1. The voter holds a valid voting credential
    /// 2. The credential hasn't been used in this election
    /// 3. The vote is for a valid option
    /// Without revealing the voter's identity or choice.
    pub fn submit_proof(
        env: Env,
        election_id: Symbol,
        proof_data: Bytes,
        public_inputs: Vec<Bytes>,
        nullifier: Bytes,
        encrypted_vote: Bytes,
    ) -> bool {
        // Check nullifier hasn't been used (prevents double voting)
        let nullifier_key = (NULLIFIER, election_id.clone(), nullifier.clone());
        let used: Option<bool> = env.storage().persistent().get(&nullifier_key);
        assert!(!used.unwrap_or(false), "nullifier already used - double vote detected");

        // Verify the ZK proof against public inputs
        let proof_valid = Self::verify_proof(&env, &proof_data, &public_inputs);
        assert!(proof_valid, "invalid zero-knowledge proof");

        // Mark nullifier as used
        env.storage().persistent().set(&nullifier_key, &true);

        // Store the encrypted vote
        let ciphertext = VoteCiphertext {
            encrypted_option: encrypted_vote,
            election_id: election_id.clone(),
            timestamp: env.ledger().timestamp(),
        };

        let proof_record = ZKProof {
            proof_data,
            public_inputs,
            election_id: election_id.clone(),
            nullifier,
        };

        env.storage()
            .persistent()
            .set(&(PROOFS, env.ledger().sequence() as u64), &proof_record);

        env.events().publish(
            (symbol_short!("VOTE"), symbol_short!("SUBMITTED")),
            (election_id, ciphertext),
        );

        true
    }

    /// Check if a nullifier has been used for an election
    pub fn is_nullifier_used(env: Env, election_id: Symbol, nullifier: Bytes) -> bool {
        let key = (NULLIFIER, election_id, nullifier);
        env.storage().persistent().get(&key).unwrap_or(false)
    }

    /// Verify a ZK proof on-chain using BLS12-381 precompile
    /// In production, this calls the BLS12-381 pairing verification
    /// via Soroban's cryptographic precompiles.
    fn verify_proof(_env: &Env, _proof_data: &Bytes, _public_inputs: &Vec<Bytes>) -> bool {
        // ZK-SNARK verification using BLS12-381 pairing:
        // 1. Parse the proof into (A, B, C) group elements
        // 2. Compute the verification key check using pairing operations
        // 3. Verify that the public inputs match the circuit constraints
        //
        // This will use Soroban's native BLS12-381 precompiles once
        // they are stabilized. For now, this is a placeholder that
        // will be replaced with the actual pairing check.
        true
    }

    /// Batch verify multiple proofs in a single transaction
    pub fn batch_verify(
        env: Env,
        election_id: Symbol,
        proofs: Vec<(Bytes, Vec<Bytes>, Bytes, Bytes)>,
    ) -> Vec<bool> {
        let mut results = Vec::new(&env);

        for proof_tuple in proofs.iter() {
            let (proof_data, public_inputs, nullifier, encrypted_vote) = proof_tuple;

            let valid = Self::submit_proof(
                env.clone(),
                election_id.clone(),
                proof_data,
                public_inputs,
                nullifier,
                encrypted_vote,
            );

            results.push_back(valid);
        }

        results
    }
}
