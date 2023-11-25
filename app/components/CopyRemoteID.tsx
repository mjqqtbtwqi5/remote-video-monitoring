import React, { useState } from "react";
import { ContentCopy } from "@mui/icons-material";
import Snackbar from "@mui/material/Snackbar";

export default function CopyRemoteID({ remoteID }: any) {
  const [open, setOpen] = useState(false);
  const copyClick = () => {
    setOpen(true);
    navigator.clipboard.writeText(remoteID);
  };

  return (
    <>
      <div
        className="w-12 h-12 bg-gray-200 rounded-full flex justify-center items-center cursor-pointer"
        onClick={copyClick}
      >
        <ContentCopy />
      </div>

      <Snackbar
        open={open}
        onClose={() => setOpen(false)}
        autoHideDuration={1000}
        message="Copied to clipboard"
      />
    </>
  );
}
