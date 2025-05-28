use anchor_lang::prelude::*;

// Stores the count of votes for each choice
#[account]
#[derive(Default, InitSpace)]
pub struct Election {
    pub is_open: bool,
    pub gm: u64, 
    pub gn: u64,
}

// The two choices for the election
#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub enum Choice {
    GM,
    GN
} 