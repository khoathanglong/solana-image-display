import React, { useContext } from "react";
import Paper from "@mui/material/Paper";
import InputBase from "@mui/material/InputBase";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import PublishIcon from "@mui/icons-material/Publish";
import { Global } from "../../context";

export default function CustomizedInputBase() {
  const { sendGif, inputValue, onInputChange } = useContext(Global);
  return (
    <Paper sx={{ p: "2px 4px", display: "flex", alignItems: "center" }}>
      <InputBase
        onChange={onInputChange}
        value={inputValue}
        sx={{ ml: 1, flex: 1 }}
        placeholder="Put the Gif link here"
      />
      <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
      <IconButton
        color="primary"
        sx={{ p: "10px" }}
        aria-label="directions"
        onClick={sendGif}
      >
        <PublishIcon />
      </IconButton>
    </Paper>
  );
}
