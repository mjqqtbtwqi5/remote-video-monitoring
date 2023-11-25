"use client";

import React, { useState } from "react";
import Button from "@mui/joy/Button";
import { Box, DialogTitle, Input, Modal, ModalDialog } from "@mui/joy";
import { Add } from "@mui/icons-material";
import Snackbar from "@mui/material/Snackbar";
import { useRouter } from "next/navigation";

export default function ConnectButton() {
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);
  const [remoteID, setRemoteID] = useState<string>("");
  const [snackbarMsg, setSnackbarMsg] = useState<string>("");

  const router = useRouter();

  const handleRemoteIdChange = (event: any) => {
    setRemoteID(event.target.value);
  };

  const getRemoteID = () => {
    if (remoteID) {
      router.push(`/monitor?remoteID=${remoteID}`);
    } else {
      setSnackbarMsg("Please enter a remote ID.");
      setOpenSnackbar(true);
    }
  };
  return (
    <>
      <div
        className="w-16 h-16 bg-blue-600 rounded-2xl flex justify-center items-center cursor-pointer"
        onClick={() => setOpenModal(true)}
      >
        <div className="w-8 h-8  bg-white rounded-lg flex justify-center items-center">
          <Add color="primary" />
        </div>
      </div>
      <Modal open={openModal} onClose={() => setOpenModal(false)}>
        <ModalDialog>
          <DialogTitle>Please enter a remote ID</DialogTitle>
          <Input placeholder="Remote ID" onChange={handleRemoteIdChange} />
          <Box
            sx={{
              mt: 1,
              display: "flex",
              gap: 1,
              flexDirection: { xs: "column", sm: "row-reverse" },
            }}
          >
            <Button variant="solid" color="primary" onClick={getRemoteID}>
              Enter
            </Button>
            <Button
              variant="outlined"
              color="neutral"
              onClick={() => setOpenModal(false)}
            >
              Cancel
            </Button>
          </Box>
        </ModalDialog>
      </Modal>
      <Snackbar
        open={openSnackbar}
        onClose={() => setOpenSnackbar(false)}
        autoHideDuration={5000}
        message={snackbarMsg}
      />
    </>
  );
}
