#![no_std]
use soroban_sdk::{
    contract, contractimpl, contracttype, symbol_short, Address, Env, Symbol, Vec,
};

const ADMIN: Symbol = symbol_short!("ADMIN");
const NAME: Symbol = symbol_short!("NAME");
const SYMBOL: Symbol = symbol_short!("SYMB");
const DECIMALS: Symbol = symbol_short!("DEC");

#[derive(Clone)]
#[contracttype]
pub struct TokenMetadata {
    pub name: Symbol,
    pub symbol: Symbol,
    pub decimals: u32,
}

#[contract]
pub struct GovernanceToken;

#[contractimpl]
impl GovernanceToken {
    pub fn initialize(
        env: Env,
        admin: Address,
        name: Symbol,
        symbol: Symbol,
        decimals: u32,
    ) {
        admin.require_auth();
        env.storage().instance().set(&ADMIN, &admin);
        env.storage().instance().set(&NAME, &name);
        env.storage().instance().set(&SYMBOL, &symbol);
        env.storage().instance().set(&DECIMALS, &decimals);
    }

    /// Mint governance tokens (used for token-weighted & conviction voting).
    pub fn mint(env: Env, to: Address, amount: i128) {
        let admin: Address = env.storage().instance().get(&ADMIN).unwrap();
        admin.require_auth();
        let balance = Self::balance(env.clone(), to.clone());
        env.storage()
            .persistent()
            .set(&(symbol_short!("BAL"), to.clone()), &(balance + amount));
        Self::incr_supply(&env, amount);
    }

    pub fn burn(env: Env, from: Address, amount: i128) {
        from.require_auth();
        let balance = Self::balance(env.clone(), from.clone());
        assert!(balance >= amount, "insufficient balance");
        env.storage()
            .persistent()
            .set(&(symbol_short!("BAL"), from.clone()), &(balance - amount));
        Self::incr_supply(&env, -amount);
    }

    pub fn transfer(env: Env, from: Address, to: Address, amount: i128) {
        from.require_auth();
        let from_bal = Self::balance(env.clone(), from.clone());
        let to_bal = Self::balance(env.clone(), to.clone());
        assert!(from_bal >= amount, "insufficient balance");
        env.storage()
            .persistent()
            .set(&(symbol_short!("BAL"), from.clone()), &(from_bal - amount));
        env.storage()
            .persistent()
            .set(&(symbol_short!("BAL"), to.clone()), &(to_bal + amount));
    }

    pub fn balance(env: Env, account: Address) -> i128 {
        env.storage()
            .persistent()
            .get(&(symbol_short!("BAL"), account))
            .unwrap_or(0)
    }

    pub fn total_supply(env: Env) -> i128 {
        env.storage().instance().get(&symbol_short!("SUPPLY")).unwrap_or(0)
    }

    pub fn name(env: Env) -> Symbol {
        env.storage().instance().get(&NAME).unwrap()
    }

    pub fn symbol(env: Env) -> Symbol {
        env.storage().instance().get(&SYMBOL).unwrap()
    }

    pub fn decimals(env: Env) -> u32 {
        env.storage().instance().get(&DECIMALS).unwrap_or(7)
    }

    fn incr_supply(env: &Env, delta: i128) {
        let supply = Self::total_supply(env.clone());
        env.storage()
            .instance()
            .set(&symbol_short!("SUPPLY"), &(supply + delta));
    }
}
