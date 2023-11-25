import React, { useState } from "react";
import { ContentCopy } from "@mui/icons-material";
import { IconButton, ButtonGroup, Button } from "@mui/joy";
import Snackbar from "@mui/material/Snackbar";

export default function CopyConnectionID({ remoteID }: any) {
  const [open, setOpen] = useState(false);
  const copyClick = () => {
    setOpen(true);
    navigator.clipboard.writeText(remoteID);
  };

  return (
    <>
      <ButtonGroup>
        <Button disabled>Remote ID</Button>
        <Button disabled>{remoteID}</Button>
        <IconButton onClick={copyClick}>
          <ContentCopy />
        </IconButton>
      </ButtonGroup>
      <Snackbar
        open={open}
        onClose={() => setOpen(false)}
        autoHideDuration={1000}
        message="Copied to clipboard"
      />
    </>
  );
}
