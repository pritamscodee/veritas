#![no_std]
use soroban_sdk::{contract, contractimpl, contracttype, symbol_short, Address, Env, Symbol};

const ADMIN: Symbol = symbol_short!("ADMIN");
const BALANCE: Symbol = symbol_short!("BAL");

#[derive(Clone)]
#[contracttype]
pub struct TreasuryEvent {
    pub kind: Symbol,
    pub from: Address,
    pub amount: i128,
    pub election_id: Symbol,
}

#[contract]
pub struct Treasury;

#[contractimpl]
impl Treasury {
    pub fn initialize(env: Env, admin: Address) {
        admin.require_auth();
        env.storage().instance().set(&ADMIN, &admin);
    }

    /// Collect an election fee (Stellar Payments use case).
    pub fn collect_fee(env: Env, payer: Address, election_id: Symbol, amount: i128) {
        payer.require_auth();
        let current: i128 = env.storage().instance().get(&BALANCE).unwrap_or(0);
        env.storage().instance().set(&BALANCE, &(current + amount));
        env.events().publish(
            (symbol_short!("FEE"), symbol_short!("PAID")),
            TreasuryEvent {
                kind: symbol_short!("FEE"),
                from: payer,
                amount,
                election_id,
            },
        );
    }

    /// Disburse a voter reward (Stellar Payments use case).
    pub fn reward_voter(env: Env, voter: Address, election_id: Symbol, amount: i128) {
        let admin: Address = env.storage().instance().get(&ADMIN).unwrap();
        admin.require_auth();
        let current: i128 = env.storage().instance().get(&BALANCE).unwrap_or(0);
        assert!(current >= amount, "insufficient treasury");
        env.storage().instance().set(&BALANCE, &(current - amount));
        env.events().publish(
            (symbol_short!("REWARD"), symbol_short!("SENT")),
            TreasuryEvent {
                kind: symbol_short!("REWARD"),
                from: voter,
                amount,
                election_id,
            },
        );
    }

    pub fn balance(env: Env) -> i128 {
        env.storage().instance().get(&BALANCE).unwrap_or(0)
    }
}
