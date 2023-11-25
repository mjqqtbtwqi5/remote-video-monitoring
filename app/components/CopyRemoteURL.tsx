import React, { useState } from "react";
import { Link } from "@mui/icons-material";
import Snackbar from "@mui/material/Snackbar";

export default function CopyRemoteURL({ remoteID }: any) {
  const URL = `https://${window.location.hostname}/monitor?remoteID=${remoteID}`;
  const [open, setOpen] = useState(false);
  const copyClick = () => {
    setOpen(true);
    navigator.clipboard.writeText(URL);
  };

  return (
    <>
      <div
        className="w-12 h-12 bg-gray-200 rounded-full flex justify-center items-center cursor-pointer"
        onClick={copyClick}
      >
        <Link />
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
