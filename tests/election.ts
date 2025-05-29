import { before, describe, test, it } from "node:test";
import assert from "node:assert";
import * as programClient from "../dist/js-client";
import { getElectionDecoder, ELECTION_DISCRIMINATOR } from "../dist/js-client";
import { connect, Connection, TOKEN_EXTENSIONS_PROGRAM, ErrorWithTransaction } from "solana-kite";
import { type KeyPairSigner, type Address, MaybeAccount, MaybeEncodedAccount, parseBase64RpcAccount, decodeAccount, type Base58EncodedBytes } from "@solana/kit";
import bs58 from "bs58";

export const log = console.log;
export const stringify = (object: any) => {
  const bigIntReplacer = (key: string, value: any) => (typeof value === "bigint" ? value.toString() : value);
  return JSON.stringify(object, bigIntReplacer, 2);
};


describe("election", () => {
  // Configure the client to use the local cluster.
  let connection: Connection;
  let user: KeyPairSigner;
  let election: Address;
  let getElections: () => Promise<Array<MaybeAccount<programClient.Election, string>>>

  before(async () => {
    connection = await connect();
    user = await connection.createWallet();

    // Create an address for "election"
    const electionPDAAndBump = await connection.getPDAAndBump(programClient.ELECTION_PROGRAM_ADDRESS, ["election"]);
    election = electionPDAAndBump.pda;

    // Create a function to get all elections.
    getElections = connection.getAccountsFactory(
      programClient.ELECTION_PROGRAM_ADDRESS,
      ELECTION_DISCRIMINATOR,
      getElectionDecoder(),
    );
  });

  it("Creates an election for the public to vote on", async () => {
    // Create an instruction that calls the create_election() instruction handler
    const createElectionInstruction = await programClient.getCreateElectionInstruction({
      election: election,
      signer: user,
    })

    const signature = await connection.sendTransactionFromInstructions({
      feePayer: user,
      instructions: [createElectionInstruction],
    });

    console.log("Transaction signature", signature);
  });


  it("Votes for GM", async () => {
    const voteInstruction = await programClient.getVoteInstruction({
      election: election,
      signer: user,
      choice: programClient.Choice.GM,
    })

    const signature = await connection.sendTransactionFromInstructions({
      feePayer: user,
      instructions: [voteInstruction],
    });

    console.log("Transaction signature", signature);

    const elections = await getElections();

    assert.ok(elections.length === 1, "Expected to get one election");
    // @ts-expect-error the 'data' property does actually exist.
    const firstElectionData = elections[0].data;

    assert(firstElectionData.isOpen, "Election should be open");
    assert.equal(firstElectionData.gm, 1, "GM should be 1");
    assert.equal(firstElectionData.gn, 0, "GN should be 0");

    const logs = await connection.getLogs(signature);
    assert(logs.includes("Program log: Voted for GM ☀️"), "Should include the log message");
  });

  it("Votes for GN", async () => {
    const voteInstruction = await programClient.getVoteInstruction({
      election: election,
      signer: user,
      choice: programClient.Choice.GN,
    })

    const signature = await connection.sendTransactionFromInstructions({
      feePayer: user,
      instructions: [voteInstruction],
    });

    console.log("Transaction signature", signature);

    const elections = await getElections();

    assert.ok(elections.length === 1, "Expected to get one election");

    // @ts-expect-error the 'data' property does actually exist.
    // TODO: resolve this error.
    const firstElectionData = elections[0].data;

    assert(firstElectionData.isOpen, "Election should be open");
    assert.equal(firstElectionData.gm, 1, "GM should be 1");
    assert.equal(firstElectionData.gn, 1, "GN should be 1");

    const logs = await connection.getLogs(signature);
    assert(logs.includes("Program log: Voted for GN 🌌"), "Should include the log message");


  });
});