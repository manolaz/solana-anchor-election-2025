import {
  address,
  type KeyPairSigner,
} from "@solana/kit";
import { useWalletAccountTransactionSendingSigner } from "@solana/react";
import { type UiWalletAccount } from "@wallet-standard/react";
import { useContext, useRef, useState, useEffect } from "react";
import * as programClient from "../../../dist/js-client";
import { getElectionDecoder, ELECTION_DISCRIMINATOR } from "../../../dist/js-client";
import { ChainContext } from "../context/ChainContext";
import { ConnectionContext } from "../context/ConnectionContext";
import { DayNightChart } from "./DayNightChart";

type Props = Readonly<{
  account: UiWalletAccount;
}>;

const log = console.log;
const bigIntReplacer = (key: string, value: any) => {
  if (typeof value === 'bigint') {
    return value.toString();
  }
  return value;
};
const stringify = (value: any) => JSON.stringify(value, bigIntReplacer, 2);

// Where we deployed our election program, on Solana Devnet.
const ELECTION_PROGRAM_ADDRESS = address("9rHqnJtY6QGbyAdMjtzVaHKix5tAgbQTRpasW6iz2FZd");

export function Election({ account }: Props) {
  const { current: NO_ERROR } = useRef(Symbol());
  const [error, setError] = useState<Error | undefined>(undefined);
  const { chain: currentChain } = useContext(ChainContext);
  const { connection } = useContext(ConnectionContext);
  const transactionSendingSigner = useWalletAccountTransactionSendingSigner(account, currentChain);
  const [elections, setElections] = useState<Array<any>>([]);

  // Create a function to get all elections.
  const getElections = connection.getAccountsFactory(
    ELECTION_PROGRAM_ADDRESS,
    ELECTION_DISCRIMINATOR,
    getElectionDecoder(),
  );

  const fetchElections = async () => {
    try {
      const results = await getElections();
      console.log(`Address: ${ELECTION_PROGRAM_ADDRESS}`);
      setElections(results);
      console.log("Elections:", results);
    } catch (thrownObject) {
      const error = thrownObject as Error;
      console.error("Error fetching elections:", error);
      setError(error);
    }
  };

  // Fetch elections when the component mounts
  useEffect(() => {
    void fetchElections();
  }, []);

  const createElection = async () => {
    try {
      // Get the PDA for the election account
      const electionPDAAndBump = await connection.getPDAAndBump(ELECTION_PROGRAM_ADDRESS, ["election"]);
      const election = electionPDAAndBump.pda;

      // Create the instruction
      const createElectionInstruction = await programClient.getCreateElectionInstruction({
        election,
        signer: transactionSendingSigner as unknown as KeyPairSigner,
      });

      // Send the transaction
      const signature = await connection.sendTransactionFromInstructionsWithWalletApp({
        feePayer: transactionSendingSigner,
        instructions: [createElectionInstruction],
      });

      console.log("Created election with signature:", signature);

      // Refresh the elections list
      const results = await getElections();
      setElections(results);
    } catch (thrownObject) {
      const error = thrownObject as Error;
      console.error("Error creating election:", error);
      setError(error);
    }
  };

  const vote = async (choice: programClient.Choice) => {
    try {
      // Get the PDA for the election account
      const electionPDAAndBump = await connection.getPDAAndBump(ELECTION_PROGRAM_ADDRESS, ["election"]);
      const election = electionPDAAndBump.pda;

      // Create a PDA for the vote account
      const votePDAAndBump = await connection.getPDAAndBump(ELECTION_PROGRAM_ADDRESS, ["vote", account.address]);
      const vote = votePDAAndBump.pda;

      // Create the vote instruction
      const voteInstruction = await programClient.getVoteInstruction({
        election,
        vote,
        signer: transactionSendingSigner as unknown as KeyPairSigner,
        choice,
      });

      // Send the transaction
      const signature = await connection.sendTransactionFromInstructionsWithWalletApp({
        feePayer: transactionSendingSigner,
        instructions: [voteInstruction],
      });

      console.log("Voted with signature:", signature);

      // Refresh the elections list
      const results = await getElections();
      setElections(results);
    } catch (thrownObject) {
      const error = thrownObject as Error;
      console.error("Error voting:", error);
      setError(error);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <h3 style={{ margin: 0 }}>Elections</h3>
      {error && (
        <div style={{ 
          padding: '12px', 
          backgroundColor: '#fee2e2', 
          border: '1px solid #ef4444',
          borderRadius: '4px',
          color: '#991b1b'
        }}>
          Error: {error.message}
        </div>
      )}
      <div style={{ display: 'flex', gap: '8px' }}>
        <button onClick={fetchElections}>{elections.length > 0 ? 'Update Election' : 'Get Election'}</button>
        {elections.length === 0 && <button onClick={createElection}>Create Election</button>}
      </div>

      {elections.length === 0 ? (
        <div>No elections yet, make one!</div>
      ) : (
        <div>
          {elections.map((election, index) => {
            const electionData = election.data;

            return (
              <div key={index} style={{ marginTop: '8px' }}>
                <div style={{ marginBottom: '8px' }}>
                  <DayNightChart gmVotes={electionData.gm} gnVotes={electionData.gn} />
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={() => vote(programClient.Choice.GM)}>Vote GM ☀️</button>
                    <button onClick={() => vote(programClient.Choice.GN)}>Vote GN 🌌</button>
                  </div>
                </div>
                <h4 style={{ marginTop: '24px' }}>Raw election account:</h4>
                <pre>{stringify(election)}</pre>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
