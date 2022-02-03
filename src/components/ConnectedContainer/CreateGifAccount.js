import React, { useContext } from "react";
import { Global } from "../../context";

export default function LoginToWallet() {
  const { createGifAccount } = useContext(Global);
  return (
    <div className="connected-container">
      <button
        className="cta-button submit-gif-button"
        onClick={createGifAccount}
      >
        Do One-Time Initialization For GIF Program Account
      </button>
    </div>
  );
}
