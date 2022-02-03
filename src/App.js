import React, { useEffect, useState } from "react";
import "./App.css";
import ConnecToWallet from "./components/ConnecToWallet";
import ConnectedContainer from "./components/ConnectedContainer";
import { Container, Typography, Box } from "@mui/material";
import { Global } from "./context";
import {
  getGifListService,
  createGifAccountService,
  sendGifService,
  startVoteService,
  checkIfWalletIsConnected,
  connectWalletService,
  donateService,
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

  const donate = (item) => {
    return donateService(item).then(() => getGifList());
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
        donate,
      }}
    >
      <Container component="main">
        {walletAddress && (
          <>
            <Box
              sx={{
                marginTop: 8,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Typography component="h1" variant="h5">
                Decentralized Gif Exhibition
              </Typography>
            </Box>
            <ConnectedContainer />
          </>
        )}
        {!walletAddress && <ConnecToWallet connectWallet={connectWallet} />}
      </Container>
    </Global.Provider>
  );
};

export default App;
