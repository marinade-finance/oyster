import { PublicKey, TransactionInstruction } from '@solana/web3.js';
import { getGovernanceInstructionSchema } from './serialisation';
import { serialize } from 'borsh';
import { CompleteProposalArgs } from './instructions';

export const withCompleteProposal = async (
  instructions: TransactionInstruction[],
  programId: PublicKey,
  programVersion: number,
  proposal: PublicKey,
) => {
  const args = new CompleteProposalArgs();
  const data = Buffer.from(
    serialize(getGovernanceInstructionSchema(programVersion), args),
  );

  const keys = [
    {
      pubkey: proposal,
      isWritable: true,
      isSigner: false,
    },
  ];

  instructions.push(
    new TransactionInstruction({
      keys,
      programId,
      data,
    }),
  );
};
