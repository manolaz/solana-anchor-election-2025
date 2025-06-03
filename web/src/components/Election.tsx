import {
  address,
  lamports,
} from "@solana/kit";
import { useWalletAccountTransactionSendingSigner } from "@solana/react";
import { type UiWalletAccount } from "@wallet-standard/react";
import { useContext, useRef, useState } from "react";
import { useSWRConfig } from "swr";
// import * as programClient from "../../../dist/js-client";
import { getElectionDecoder, ELECTION_DISCRIMINATOR } from "../../../dist/js-client";
import { ChainContext } from "../context/ChainContext";
import { ConnectionContext } from "../context/ConnectionContext";

type Props = Readonly<{
  account: UiWalletAccount;
}>;

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

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <h3 style={{ margin: 0 }}>Elections</h3>
      <button onClick={async () => {
        try {
          const results = await getElections();
          console.log(`Address: ${ELECTION_PROGRAM_ADDRESS}`);
          setElections(results);
          console.log("Elections:", results);
        } catch (error) {
          console.error("Error fetching elections:", error);
          setError(error);
        }
      }}>Get Elections</button>

      {elections.length === 0 ? (
        <div>No elections yet, make one!</div>
      ) : (
        <div>
          <h4>Found {elections.length} elections:</h4>
          {elections.map((election, index) => (
            <div key={index} style={{ marginTop: '8px' }}>
              <pre>{JSON.stringify(election, null, 2)}</pre>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
