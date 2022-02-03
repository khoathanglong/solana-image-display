import React, { useEffect, useState, createContext } from "react";
import "./App.css";
import ConnecToWallet from "./components/ConnecToWallet";
import ConnectedContainer from "./components/ConnectedContainer";
import { Container } from "@mui/material";
import { Global } from "./context";
import {
  getGifListService,
  createGifAccountService,
  sendGifService,
  startVoteService,
  checkIfWalletIsConnected,
  connectWalletService,
} from "./services";

const App = () => {
  const [walletAddress, setWalletAddress] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [gifList, setGifList] = useState([]);

  useEffect(() => {
    const onLoad = async () => {
      await checkIfWalletIsConnected().then((pubKey) =>
        setWalletAddress(pubKey)
      );
    };
    window.addEventListener("load", onLoad);
    return () => window.removeEventListener("load", onLoad);
  }, []);

  useEffect(() => {
    if (walletAddress) {
      console.log("Fetching GIF list...");
      getGifList();
    }
  }, [walletAddress]);
  // Actions
  const createGifAccount = () =>
    createGifAccountService().then(() => getGifList());

  const getGifList = async () => {
    const gifList = await getGifListService();
    setGifList(gifList);
  };

  const connectWallet = () => {
    return connectWalletService().then((pubKey) => setWalletAddress(pubKey));
  };

  const onInputChange = (event) => {
    const { value } = event.target;
    setInputValue(value);
  };

  const sendGif = () => {
    if (inputValue.length === 0) {
      return;
    }
    return sendGifService(inputValue).then(() => {
      getGifList();
      setInputValue("");
    });
  };

  const startVote = (item) => {
    return startVoteService(item).then(() => getGifList());
  };

  return (
    <Global.Provider
      value={{
        gifList,
        inputValue,
        createGifAccount,
        sendGif,
        onInputChange,
        startVote,
      }}
    >
      <Container>
        {!walletAddress && <ConnecToWallet connectWallet={connectWallet} />}
        {/* We just need to add the inverse here! */}
        {walletAddress && <ConnectedContainer />}
      </Container>
    </Global.Provider>
  );
};

export default App;
