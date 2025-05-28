use anchor_lang::prelude::*;

declare_id!("9rHqnJtY6QGbyAdMjtzVaHKix5tAgbQTRpasW6iz2FZd");

#[program]
pub mod election {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Greetings from: {:?}", ctx.program_id);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}


