use anchor_lang::prelude::*;
use crate::state::*;

#[derive(Accounts)]
pub struct VoteAccounts<'info> {
    #[account(mut)] 
    pub election: Account<'info, Election>,

    pub signer: Signer<'info>,
}

pub fn vote(context: Context<VoteAccounts>, choice: Choice) -> Result<()> {
    // If choice is GM increment GM by 1 else increment GN by 1
    match choice {
        Choice::GM => {
            msg!("Voted for GM ☀️");
            context.accounts.election.gm += 1; 
        },
        Choice::GN => {
            msg!("Voted for GN 🌌");
            context.accounts.election.gn += 1; 
        },
    };
    Ok(())
} 