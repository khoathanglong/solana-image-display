import React, { useContext } from "react";
import { DONATE_AMOUNT } from "../../constant";

import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import {
  Tooltip,
  ImageList,
  ImageListItem,
  ImageListItemBar,
  IconButton,
} from "@mui/material";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import { Global } from "../../context";
const GifList = () => {
  const { gifList, startVote, donate } = useContext(Global);
  return (
    <ImageList gap={20} cols={2}>
      {gifList.map((item, index) => (
        <ImageListItem key={item.gifLink + index}>
          <img
            src={`${item.gifLink}`}
            srcSet={`${item.gifLink}`}
            loading="lazy"
            alt={`${item.gifLink}`}
          />
          <ImageListItemBar
            subtitle={<span>Uploaded By: {item.userAddress?.toString()}</span>}
            actionIcon={
              <>
                <IconButton
                  aria-label={`Upvote button`}
                  sx={{ color: "white" }}
                >
                  <span> {item.vote || 0}</span>
                  <Tooltip title="Upvote">
                    <ThumbUpIcon
                      sx={{ pl: 1, pr: 3 }}
                      onClick={() => startVote(item)}
                    />
                  </Tooltip>
                  <Tooltip title={`Donate ${DONATE_AMOUNT} SOL`}>
                    <AttachMoneyIcon onClick={() => donate(item)} />
                  </Tooltip>
                </IconButton>
              </>
            }
          />
        </ImageListItem>
      ))}
    </ImageList>
  );
};

export default GifList;
