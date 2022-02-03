import { Button } from "@mui/material";
import AddLinkIcon from "@mui/icons-material/AddLink";
export default function ConnectToWallet({ connectWallet }) {
  return (
    <Button
      onClick={connectWallet}
      fullWidth
      color="success"
      variant="contained"
      sx={{ mt: "30vh" }}
    >
      <AddLinkIcon sx={{ mx: 2 }} />
      Connect to Phantom Wallet
    </Button>
  );
}
