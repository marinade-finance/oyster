import { PublicKey, TransactionInstruction } from '@solana/web3.js';
import { getGovernanceInstructionSchema } from './serialisation';
import { serialize } from 'borsh';
import { InsertProposalOptionsArgs } from './instructions';
import { SYSTEM_PROGRAM_ID } from '../tools';

export const withInsertProposalOptions = async (
  instructions: TransactionInstruction[],
  programId: PublicKey,
  programVersion: number,
  proposal: PublicKey,
  proposalOwnerTokenOwnerRecord: PublicKey,
  governanceAuthority: PublicKey,
  payer: PublicKey,
  options: string[],
) => {
  if (!options || options.length == 0) {
    throw Error(`No options provided to be inserted to proposal ${proposal}`);
  }
  const args = new InsertProposalOptionsArgs({
    options: options,
  });
  const data = Buffer.from(
    serialize(getGovernanceInstructionSchema(programVersion), args),
  );

  const keys = [
    {
      pubkey: proposal,
      isWritable: true,
      isSigner: false,
    },
    {
      pubkey: proposalOwnerTokenOwnerRecord,
      isWritable: false,
      isSigner: false,
    },
    {
      pubkey: governanceAuthority,
      isWritable: false,
      isSigner: true,
    },
    {
      pubkey: payer,
      isWritable: true,
      isSigner: true,
    },
    {
      pubkey: SYSTEM_PROGRAM_ID,
      isWritable: false,
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
