import React from "react";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import ImageListItemBar from "@mui/material/ImageListItemBar";
import IconButton from "@mui/material/IconButton";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
export default ({ gifList, startVote }) => {
  return (
    <ImageList gap={20} cols={2}>
      {gifList.map((item, index) => (
        <ImageListItem key={item.gifLink + index}>
          <img
            src={`${item.gifLink}`}
            srcSet={`${item.gifLink}`}
            loading="lazy"
          />
          <ImageListItemBar
            subtitle={<span>Uploaded By: {item.userAddress?.toString()}</span>}
            actionIcon={
              <IconButton
                onClick={() => startVote(item)}
                aria-label={`Upvote button`}
                sx={{ color: "white" }}
              >
                <ThumbUpIcon /> {item.vote || 0}
              </IconButton>
            }
          />
        </ImageListItem>
      ))}
    </ImageList>
  );
};
