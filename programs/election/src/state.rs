use anchor_lang::prelude::*;
use anchor_lang::prelude::Space;

// Stores the count of votes for each choice
#[account]
#[derive(Default, InitSpace)]
pub struct Election {
    pub is_open: bool,
    pub gm: u64, 
    pub gn: u64,
}

// The two choices for the election
#[derive(AnchorSerialize, AnchorDeserialize, Clone, Default)]
pub enum Choice {
    #[default]
    GM,
    GN
}

impl Space for Choice {
    const INIT_SPACE: usize = 1; // Enum with two variants fits in 1 byte
}

// Stores an individual vote
#[account]
#[derive(Default, InitSpace)]
pub struct Vote {
    pub bump: u8,
    pub choice: Choice,
} 