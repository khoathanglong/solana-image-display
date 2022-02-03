import CreateGifAccount from "./CreateGifAccount";
import ImageLinkInput from "./ImageLinkInput";
import ImageList from "./ImageList";
import { useContext } from "react";
import { Global } from "../../context";

export default () => {
  // If we hit this, it means the program account hasn't been initialized.
  const { gifList } = useContext(Global);
  if (gifList === null) {
    return <CreateGifAccount />;
  }
  // Otherwise, we're good! Account exists. User can submit GIFs.
  else {
    return (
      <>
        <ImageLinkInput />
        <ImageList />
      </>
    );
  }
};
