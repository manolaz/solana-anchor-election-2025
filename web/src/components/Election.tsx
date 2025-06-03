import {
  address,
  lamports,
  type KeyPairSigner,
} from "@solana/kit";
import { useWalletAccountTransactionSendingSigner } from "@solana/react";
import { type UiWalletAccount } from "@wallet-standard/react";
import { useContext, useRef, useState } from "react";
import { useSWRConfig } from "swr";
import * as programClient from "../../../dist/js-client";
import { getElectionDecoder, ELECTION_DISCRIMINATOR } from "../../../dist/js-client";
import { ChainContext } from "../context/ChainContext";
import { ConnectionContext } from "../context/ConnectionContext";

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

const ELECTION_PROGRAM_ADDRESS = address("9rHqnJtY6QGbyAdMjtzVaHKix5tAgbQTRpasW6iz2FZd");

export function Election({ account }: Props) {
  const { mutate } = useSWRConfig();
  const { current: NO_ERROR } = useRef(Symbol());
  const [error, setError] = useState<unknown>(NO_ERROR);
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
    } catch (error) {
      console.error("Error fetching elections:", error);
      setError(error);
    }
  };

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
    } catch (error) {
      console.error("Error creating election:", error);
      setError(error);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <h3 style={{ margin: 0 }}>Elections</h3>
      <div style={{ display: 'flex', gap: '8px' }}>
        <button onClick={fetchElections}>Get Elections</button>
        <button onClick={createElection}>Create Election</button>
      </div>

      {elections.length === 0 ? (
        <div>No elections yet, make one!</div>
      ) : (
        <div>
          <h4>Found {elections.length} elections:</h4>
          {elections.map((election, index) => (
            <div key={index} style={{ marginTop: '8px' }}>
              <pre>{stringify(election)}</pre>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
