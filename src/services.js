import { Connection, PublicKey, clusterApiUrl } from "@solana/web3.js";
import { Program, Provider, web3 } from "@project-serum/anchor";
import idl from "./idl.json";
import kp from "./keypair.json";

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

export const getProvider = () => {
  const connection = new Connection(network, opts.preflightCommitment);
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
