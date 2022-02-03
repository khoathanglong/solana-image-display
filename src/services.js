import {
  Connection,
  PublicKey,
  clusterApiUrl,
  Transaction,
} from "@solana/web3.js";
import { Program, Provider, web3 } from "@project-serum/anchor";

import idl from "./idl.json";
import kp from "./keypair.json";
import { DONATE_AMOUNT } from "./constant";

const network = clusterApiUrl("devnet");
// Controls how we want to acknowledge when a transaction is "done".
const opts = {
  preflightCommitment: "processed",
};
// Get our program's id from the IDL file.
export const programID = new PublicKey(idl.metadata.address);

// Create a keypair for the account that will hold the GIF data.
const arr = Object.values(kp._keypair.secretKey);
const secret = new Uint8Array(arr);
const baseAccount = web3.Keypair.fromSecretKey(secret);
const { SystemProgram } = web3;
const connection = new Connection(network, opts.preflightCommitment);

export const getProvider = () => {
  const provider = new Provider(
    connection,
    window.solana,
    opts.preflightCommitment
  );
  return provider;
};

export const getProgram = () => {
  const provider = getProvider();
  const program = new Program(idl, programID, provider);
  return program;
};

export const provider = getProvider();
export const program = getProgram();

export const createGifAccountService = async () => {
  try {
    console.log("ping");
    await program.rpc.startStuffOff({
      accounts: {
        baseAccount: baseAccount.publicKey,
        user: provider.wallet.publicKey,
        systemProgram: SystemProgram.programId,
      },
      signers: [baseAccount],
    });
    console.log(
      "Created a new BaseAccount w/ address:",
      baseAccount.publicKey.toString()
    );
  } catch (error) {
    console.log("Error creating BaseAccount account:", error);
  }
};
export const getGifListService = async () => {
  try {
    const account = await program.account.baseAccount.fetch(
      baseAccount.publicKey
    );
    console.log("Got the account", account);
    return account.gifList;
  } catch (error) {
    console.log("Error in getGifList: ", error);
    return null;
  }
};

export const sendGifService = async (imageUrl) => {
  if (imageUrl.length === 0) {
    console.log("No gif link given!");
    return;
  }
  console.log("Gif link:", imageUrl);
  try {
    await program.rpc.addGif(imageUrl, {
      accounts: {
        baseAccount: baseAccount.publicKey,
        user: provider.wallet.publicKey,
      },
    });
    console.log("GIF successfully sent to program", imageUrl);
  } catch (error) {
    console.log("Error sending GIF:", error);
  }
};
export const startVoteService = async (item) => {
  try {
    await program.rpc.startVote(item.gifLink, {
      accounts: {
        baseAccount: baseAccount.publicKey,
        user: provider.wallet.publicKey,
      },
    });
  } catch (error) {
    console.log("Error sending GIF:", error);
  }
};

export const checkIfWalletIsConnected = async () => {
  try {
    const { solana } = window;
    if (solana?.isPhantom) {
      console.log("Phantom wallet found!");
      const response = await solana.connect({ onlyIfTrusted: true });
      console.log("Connected with Public Key:", response.publicKey.toString());
      return response.publicKey.toString(); // return wallet pubKey
    } else {
      alert("Solana object not found! Get a Phantom Wallet 👻");
    }
  } catch (error) {
    console.error(error);
  }
};
export const connectWalletService = async () => {
  const { solana } = window;

  if (solana) {
    const response = await solana.connect();
    console.log("Connected with Public Key:", response.publicKey.toString());
    return response.publicKey.toString();
  }
};

export const donateService = async ({ userAddress, ...item }) => {
  console.log("start donating...");
  const fromPubkey = new PublicKey(provider.wallet.publicKey);
  const toPubkey = new PublicKey(userAddress);

  console.log(provider.wallet);

  const instructions = SystemProgram.transfer({
    fromPubkey,
    toPubkey,
    lamports: DONATE_AMOUNT * 1000000000, // 1 SOL = 1000000000 lamport
  });
  const recentBlockhash = (await connection.getRecentBlockhash()).blockhash;

  const transferTransaction = new Transaction().add(instructions);
  transferTransaction.feePayer = fromPubkey;
  transferTransaction.recentBlockhash = recentBlockhash;

  const signed = await provider.wallet.signTransaction(transferTransaction);
  const signature = await connection.sendRawTransaction(signed.serialize());
  const hash = await connection.confirmTransaction(signature);

  // const hash = await sendAndConfirmTransaction(
  //   connection,
  //   transferTransaction,
  //   [signature]
  // );
  console.log("hash", hash);
};
