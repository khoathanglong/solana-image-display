import React from "react";

export default ({ createGifAccount }) => {
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
};
