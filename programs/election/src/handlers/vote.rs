use anchor_lang::prelude::*;
use crate::state::*;

#[derive(Accounts)]
pub struct VoteAccounts<'info> {
    #[account(
        mut, 
        seeds = [b"election"], 
        bump,
    )] 
    pub election: Account<'info, Election>,

    #[account(
        init,
        payer = signer,
        space = Vote::DISCRIMINATOR.len() + Vote::INIT_SPACE,
        seeds = [b"vote", signer.key().as_ref()],
        bump,
    )]
    pub vote: Account<'info, Vote>,

    #[account(mut)]
    pub signer: Signer<'info>,
    pub system_program: Program<'info, System>,
}

pub fn vote(context: Context<VoteAccounts>, choice: Choice) -> Result<()> {
    // Store the vote
    context.accounts.vote.choice = choice.clone();
    context.accounts.vote.bump = context.bumps.vote;

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