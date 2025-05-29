use anchor_lang::prelude::*;
use crate::state::*;

#[derive(Accounts)]
pub struct CreateElectionAccounts<'info> {
    // Making a global account for storing votes
    #[account(
        init, 
        payer = signer, 
        space = Election::DISCRIMINATOR.len() + Election::INIT_SPACE, 
        seeds = [b"election"],
        bump,
    )] 
    pub election: Account<'info, Election>,

    #[account(mut)]
    pub signer: Signer<'info>,
    
    pub system_program: Program<'info, System>,
}

pub fn create_election(context: Context<CreateElectionAccounts>) -> Result<()> {
    context.accounts.election.is_open = true;
    // We don't need to set values for 'gm' and 'gn' as we have the 'Default' macro enabled 
    // on the Election struct which will initialize these values to 0.
    Ok(())
} 