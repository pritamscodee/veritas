#![no_std]
use soroban_sdk::{contract, contractimpl, contracttype, symbol_short, Address, Env, Symbol};

const VERSION: Symbol = symbol_short!("VERSION");
const ADMIN: Symbol = symbol_short!("ADMIN");

#[derive(Clone)]
#[contracttype]
pub enum VotingMethod {
    OnePersonOneVote,
    Quadratic,
    TokenWeighted,
    Conviction,
}

#[derive(Clone)]
#[contracttype]
pub enum ElectionStatus {
    Draft,
    Registration,
    Voting,
    Tallying,
    Completed,
    Cancelled,
}

#[derive(Clone)]
#[contracttype]
pub struct Election {
    pub id: Symbol,
    pub title: Symbol,
    pub organizer: Address,
    pub voting_method: VotingMethod,
    pub status: ElectionStatus,
    pub required_kyc_level: u32,
    pub start_time: u64,
    pub end_time: u64,
    pub quorum_threshold: u32,
    pub total_votes: u32,
    pub options: soroban_sdk::Vec<Symbol>,
}

#[derive(Clone)]
#[contracttype]
pub struct EligibilityCriteria {
    pub required_anchors: soroban_sdk::Vec<Symbol>,
    pub required_kyc_level: u32,
}

#[contract]
pub struct VotingRegistry;

#[contractimpl]
impl VotingRegistry {
    pub fn initialize(env: Env, admin: Address) {
        env.storage().instance().set(&ADMIN, &admin);
        env.storage().instance().set(&VERSION, &1_u32);
    }

    pub fn create_election(
        env: Env,
        organizer: Address,
        title: Symbol,
        voting_method: VotingMethod,
        required_kyc_level: u32,
        start_time: u64,
        end_time: u64,
        quorum_threshold: u32,
        options: soroban_sdk::Vec<Symbol>,
    ) -> Symbol {
        organizer.require_auth();

        assert!(start_time < end_time, "start must be before end");
        assert!(options.len() >= 2, "need at least 2 options");
        assert!(quorum_threshold > 0, "quorum must be > 0");

        let election_id = symbol_short!("E");
        let election = Election {
            id: election_id.clone(),
            title,
            organizer,
            voting_method,
            status: ElectionStatus::Registration,
            required_kyc_level,
            start_time,
            end_time,
            quorum_threshold,
            total_votes: 0,
            options,
        };

        env.storage()
            .persistent()
            .set(&election_id, &election);

        env.events().publish(
            (symbol_short!("ELECTION"), symbol_short!("CREATED")),
            election_id.clone(),
        );

        election_id
    }

    pub fn update_status(env: Env, election_id: Symbol, new_status: ElectionStatus) {
        let admin: Address = env.storage().instance().get(&ADMIN).unwrap();
        admin.require_auth();

        let mut election: Election = env
            .storage()
            .persistent()
            .get(&election_id)
            .expect("election not found");

        election.status = new_status;
        env.storage()
            .persistent()
            .set(&election_id, &election);

        env.events().publish(
            (symbol_short!("ELECTION"), symbol_short!("STATUS")),
            election_id,
        );
    }

    pub fn record_vote(env: Env, election_id: Symbol) {
        let mut election: Election = env
            .storage()
            .persistent()
            .get(&election_id)
            .expect("election not found");

        assert!(
            matches!(election.status, ElectionStatus::Voting),
            "election not in voting phase"
        );

        let current_time = env.ledger().timestamp();
        assert!(
            current_time >= election.start_time && current_time <= election.end_time,
            "voting period not active"
        );

        election.total_votes += 1;
        env.storage()
            .persistent()
            .set(&election_id, &election);
    }

    pub fn get_election(env: Env, election_id: Symbol) -> Election {
        env.storage()
            .persistent()
            .get(&election_id)
            .expect("election not found")
    }

    pub fn get_election_count(env: Env) -> u32 {
        let admin: Address = env.storage().instance().get(&ADMIN).unwrap();
        let elections: soroban_sdk::Vec<Election> = env
            .storage()
            .persistent()
            .get(&symbol_short!("ELECTIONS"))
            .unwrap_or(soroban_sdk::Vec::new(&env));
        elections.len()
    }
}
