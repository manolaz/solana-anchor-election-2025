use anchor_lang::prelude::*;
use handlers::*;

pub mod constants;
pub mod error;
pub mod handlers;
pub mod state;

declare_id!("9rHqnJtY6QGbyAdMjtzVaHKix5tAgbQTRpasW6iz2FZd");

#[program]
pub mod election {
    use super::*;

    pub fn create_election(
        context: Context<CreateElectionAccounts>
    ) -> Result<()> {
        handlers::create_election::create_election(context)
    }

    pub fn vote(
        context: Context<VoteAccounts>, 
        choice: state::Choice
    ) -> Result<()> {
        handlers::vote::vote(context, choice)
    }
}