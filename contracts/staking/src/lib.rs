#![no_std]
use soroban_sdk::{contract, contractimpl, contracttype, symbol_short, Address, Env, Symbol};

const ADMIN: Symbol = symbol_short!("ADMIN");
const MAX_LOCK: Symbol = symbol_short!("MAXLOCK");
const TOKEN: Symbol = symbol_short!("TOKEN");

#[derive(Clone)]
#[contracttype]
pub struct Stake {
    pub amount: i128,
    pub locked_at: u64,
    pub lock_seconds: u64,
}

#[contract]
pub struct Staking;

#[contractimpl]
impl Staking {
    pub fn initialize(env: Env, admin: Address, token: Address, max_lock_seconds: u64) {
        admin.require_auth();
        env.storage().instance().set(&ADMIN, &admin);
        env.storage().instance().set(&TOKEN, &token);
        env.storage().instance().set(&MAX_LOCK, &max_lock_seconds);
    }

    /// Stake governance tokens to accrue conviction voting power (Stellar DeFi).
    pub fn stake(env: Env, staker: Address, amount: i128, lock_seconds: u64) {
        staker.require_auth();
        let max_lock: u64 = env.storage().instance().get(&MAX_LOCK).unwrap_or(0);
        assert!(lock_seconds > 0 && lock_seconds <= max_lock, "invalid lock");
        let current: Stake = env
            .storage()
            .persistent()
            .get(&(symbol_short!("STK"), staker.clone()))
            .unwrap_or(Stake {
                amount: 0,
                locked_at: env.ledger().timestamp(),
                lock_seconds: 0,
            });
        let updated = Stake {
            amount: current.amount + amount,
            locked_at: env.ledger().timestamp(),
            lock_seconds,
        };
        env.storage()
            .persistent()
            .set(&(symbol_short!("STK"), staker.clone()), &updated);
    }

    pub fn unstake(env: Env, staker: Address) {
        staker.require_auth();
        let stake: Stake = env
            .storage()
            .persistent()
            .get(&(symbol_short!("STK"), staker.clone()))
            .expect("no stake");
        let unlock_at = stake.locked_at + stake.lock_seconds;
        assert!(env.ledger().timestamp() >= unlock_at, "still locked");
        env.storage()
            .persistent()
            .remove(&(symbol_short!("STK"), staker));
    }

    /// Conviction voting power: staked * (1 + time-locked factor).
    pub fn voting_power(env: Env, staker: Address) -> i128 {
        let stake: Stake = match env
            .storage()
            .persistent()
            .get(&(symbol_short!("STK"), staker.clone()))
        {
            Some(s) => s,
            None => return 0,
        };
        let max_lock: u64 = env.storage().instance().get(&MAX_LOCK).unwrap_or(1);
        let locked = stake.lock_seconds.min(max_lock);
        let factor = 1_000_000i128 + (locked as i128 * 1_000_000i128) / (max_lock as i128);
        stake.amount * factor / 1_000_000i128
    }

    pub fn get_stake(env: Env, staker: Address) -> Stake {
        env.storage()
            .persistent()
            .get(&(symbol_short!("STK"), staker))
            .unwrap_or(Stake {
                amount: 0,
                locked_at: 0,
                lock_seconds: 0,
            })
    }
}
