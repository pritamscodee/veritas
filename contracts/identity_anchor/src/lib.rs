#![no_std]
use soroban_sdk::{
    contract, contractimpl, contracttype, symbol_short, Address, Bytes, Env, Symbol, Vec,
};

const ADMIN: Symbol = symbol_short!("ADMIN");
const CREDENTIALS: Symbol = symbol_short!("CRED");

#[derive(Clone)]
#[contracttype]
pub struct VotingCredential {
    pub account_id: Address,
    pub election_id: Symbol,
    pub credential_hash: Bytes,
    pub is_used: bool,
    pub issued_at: u64,
}

#[derive(Clone)]
#[contracttype]
pub struct TrustedAnchor {
    pub name: Symbol,
    pub signing_key: Bytes,
    pub is_active: bool,
}

#[contract]
pub struct IdentityAnchor;

#[contractimpl]
impl IdentityAnchor {
    pub fn initialize(env: Env, admin: Address) {
        env.storage().instance().set(&ADMIN, &admin);
    }

    pub fn register_anchor(env: Env, name: Symbol, signing_key: Bytes) {
        let admin: Address = env.storage().instance().get(&ADMIN).unwrap();
        admin.require_auth();

        let anchor = TrustedAnchor {
            name: name.clone(),
            signing_key,
            is_active: true,
        };

        env.storage()
            .persistent()
            .set(&(ADMIN, name), &anchor);

        env.events().publish(
            (symbol_short!("ANCHOR"), symbol_short!("REGISTERED")),
            name,
        );
    }

    pub fn verify_kyc_attestation(
        env: Env,
        account_id: Address,
        anchor_name: Symbol,
        kyc_level: u32,
        credential_hash: Bytes,
        signature: Bytes,
    ) -> bool {
        let anchor: TrustedAnchor = env
            .storage()
            .persistent()
            .get(&(ADMIN, anchor_name.clone()))
            .expect("anchor not registered");

        assert!(anchor.is_active, "anchor is deactivated");

        // Verify signature against the anchor's signing key
        let valid_signature = Self::verify_signature(
            &env,
            &anchor.signing_key,
            &credential_hash,
            &signature,
        );
        assert!(valid_signature, "invalid attestation signature");

        // Check minimum KYC level
        assert!(kyc_level >= 1, "insufficient KYC level");

        true
    }

    pub fn issue_credential(
        env: Env,
        account_id: Address,
        election_id: Symbol,
        credential_hash: Bytes,
    ) -> VotingCredential {
        account_id.require_auth();

        // Check credential hasn't already been issued for this election
        let key = (CREDENTIALS, account_id.clone(), election_id.clone());
        let existing: Option<VotingCredential> = env.storage().persistent().get(&key);
        assert!(existing.is_none(), "credential already issued for this election");

        let credential = VotingCredential {
            account_id: account_id.clone(),
            election_id: election_id.clone(),
            credential_hash: credential_hash.clone(),
            is_used: false,
            issued_at: env.ledger().timestamp(),
        };

        env.storage().persistent().set(&key, &credential);

        env.events().publish(
            (symbol_short!("CRED"), symbol_short!("ISSUED")),
            (account_id, election_id),
        );

        credential
    }

    pub fn mark_credential_used(
        env: Env,
        account_id: Address,
        election_id: Symbol,
    ) {
        let key = (CREDENTIALS, account_id.clone(), election_id.clone());
        let mut credential: VotingCredential = env
            .storage()
            .persistent()
            .get(&key)
            .expect("credential not found");

        assert!(!credential.is_used, "credential already used");
        credential.is_used = true;

        env.storage().persistent().set(&key, &credential);
    }

    pub fn has_valid_credential(
        env: Env,
        account_id: Address,
        election_id: Symbol,
    ) -> bool {
        let key = (CREDENTIALS, account_id, election_id);
        let credential: Option<VotingCredential> = env.storage().persistent().get(&key);
        match credential {
            Some(c) => !c.is_used,
            None => false,
        }
    }

    pub fn get_credential(
        env: Env,
        account_id: Address,
        election_id: Symbol,
    ) -> Option<VotingCredential> {
        let key = (CREDENTIALS, account_id, election_id);
        env.storage().persistent().get(&key)
    }

    fn verify_signature(
        _env: &Env,
        _signing_key: &Bytes,
        _message: &Bytes,
        _signature: &Bytes,
    ) -> bool {
        // In production, this would use ed25519 signature verification
        // against the anchor's registered signing key.
        // BLS12-381 pairing verification will be added in the privacy layer.
        true
    }
}
