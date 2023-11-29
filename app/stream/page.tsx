"use client";

import { useEffect, useRef, useState } from "react";
import axios from "axios";
import CopyRemoteID from "../components/CopyRemoteID";
import Snackbar from "@mui/joy/Snackbar";
import { ShareOutlined } from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  CardContent,
  DialogTitle,
  Modal,
  ModalDialog,
  Typography,
} from "@mui/joy";
import CopyRemoteURL from "../components/CopyRemoteURL";
import ShareWhatsApp from "../components/ShareWhatsApp";

import { isMobileDevice } from "../util/checkMobileBrowser";

export default function Page() {
  const streamRef = useRef<HTMLVideoElement>(null);
  const [remoteID, setRemoteID] = useState<string>("");
  const [openShare, setOpenShare] = useState(false);
  const [stream, setStream] = useState<MediaStream>();
  const [openModal, setOpenModal] = useState<boolean>(true);
  const [isMobile, setIsMobile] = useState<boolean>(false);

  const [videoDevices, setVideoDevices] = useState<{}[]>([]);

  useEffect(() => {
    setIsMobile(isMobileDevice());
    getMediaDevices();
  }, []);

  const getMediaDevices = async () => {
    if (isMobile) {
      await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
    }
    const devices = await navigator.mediaDevices.enumerateDevices();
    const videoDevices = devices.filter(
      (device) => device.kind === "videoinput"
    );
    setVideoDevices(videoDevices);
  };

  const getRemoteID = async () => {
    await axios
      .post(`https://fair-gray-rhinoceros-vest.cyclic.app/api/uuid`)
      .then((resp) => {
        setRemoteID(resp.data.remoteID);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  useEffect(() => {
    if (!remoteID) {
      return;
    }
    (async function createConnection() {
      try {
        const peer = new (await import("peerjs")).default(remoteID);

        peer.on("call", (call) => {
          call.answer(stream);
        });
      } catch (err) {
        console.error(err);
      }
    })();
  }, [remoteID]);

  const shareCameraContent = (deviceId: string) => {
    navigator.mediaDevices
      .getUserMedia({
        video: { width: 1280, height: 720, deviceId: { exact: deviceId } },
        audio: true,
      })
      .then((stream) => {
        if (streamRef.current) {
          streamRef.current.srcObject = stream;
          setStream(stream);
          getRemoteID();
        }
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const shareScreenContent = () => {
    navigator.mediaDevices
      .getDisplayMedia({
        video: { width: 1280, height: 720, displaySurface: "window" },
        audio: true,
      })
      .then((stream) => {
        if (streamRef.current) {
          streamRef.current.srcObject = stream;
          setStream(stream);
          getRemoteID();
        }
      })
      .catch((err) => {
        console.error(err);
      });
  };

  return (
    <main>
      <Modal open={openModal} onClose={() => setOpenModal(false)}>
        <ModalDialog>
          <DialogTitle>Please select a video content.</DialogTitle>
          <Box
            sx={{
              mt: 1,
              display: "flex",
              gap: 1,
              flexDirection: { xs: "column" },
            }}
          >
            {videoDevices.map((videoDevice: any) => {
              return (
                <Button
                  key={videoDevice.deviceId}
                  variant="outlined"
                  color="neutral"
                  onClick={() => {
                    shareCameraContent(videoDevice.deviceId);
                    setOpenModal(false);
                  }}
                >
                  {videoDevice.label}
                </Button>
              );
            })}

            {!isMobile && (
              <Button
                variant="outlined"
                color="neutral"
                onClick={() => {
                  shareScreenContent();
                  setOpenModal(false);
                }}
              >
                Screen
              </Button>
            )}
          </Box>
        </ModalDialog>
      </Modal>

      {isMobile ? (
        <div className="flex items-center justify-center">
          <div className="relative">
            <video
              width={1280}
              height={720}
              ref={streamRef}
              autoPlay
              controls
            />
            <div
              className="absolute top-3 right-3 cursor-pointer"
              onClick={() => setOpenShare(true)}
            >
              {remoteID && (
                <ShareOutlined fontSize="medium" sx={{ color: "#fff" }} />
              )}
            </div>
          </div>

          <Snackbar
            anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            open={openShare}
            onClose={() => setOpenShare(false)}
          >
            <Card
              sx={{
                width: "100%",
                "--Card-padding": "0",
              }}
              variant="plain"
            >
              <CardContent>
                <Typography level="title-lg">SHARE</Typography>
                <div className="grid grid-cols-3 mt-3">
                  <div className="justify-self-center">
                    <CopyRemoteID remoteID={remoteID} />
                  </div>
                  <div className="justify-self-center">
                    <CopyRemoteURL remoteID={remoteID} />
                  </div>
                  <div className="justify-self-center">
                    <ShareWhatsApp remoteID={remoteID} />
                  </div>
                  <div className="justify-self-center text-xs pt-0.5">
                    Remote ID
                  </div>
                  <div className="justify-self-center text-xs pt-0.5">URL</div>
                  <div className="justify-self-center text-xs pt-0.5">
                    WhatsApp
                  </div>
                </div>
              </CardContent>
            </Card>
          </Snackbar>
        </div>
      ) : (
        <div className="h-screen flex items-center justify-center">
          <div className="relative">
            <video
              width={1280}
              height={720}
              ref={streamRef}
              autoPlay
              controls
            />
            <div
              className="absolute top-8 right-8 cursor-pointer bg-black bg-opacity-10 p-1.5"
              onClick={() => setOpenShare(true)}
            >
              {remoteID && (
                <ShareOutlined fontSize="large" sx={{ color: "#fff" }} />
              )}
            </div>
          </div>
          <Snackbar
            anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            open={openShare}
            onClose={() => setOpenShare(false)}
          >
            <Card
              sx={{
                width: "100%",
                "--Card-padding": "0",
              }}
              variant="plain"
            >
              <CardContent>
                <Typography level="title-lg">SHARE</Typography>
                <div className="grid grid-cols-3 mt-3">
                  <div className="justify-self-center">
                    <CopyRemoteID remoteID={remoteID} />
                  </div>
                  <div className="justify-self-center">
                    <CopyRemoteURL remoteID={remoteID} />
                  </div>
                  <div className="justify-self-center">
                    <ShareWhatsApp remoteID={remoteID} />
                  </div>
                  <div className="justify-self-center text-xs pt-0.5">
                    Remote ID
                  </div>
                  <div className="justify-self-center text-xs pt-0.5">URL</div>
                  <div className="justify-self-center text-xs pt-0.5">
                    WhatsApp
                  </div>
                </div>
              </CardContent>
            </Card>
          </Snackbar>
        </div>
      )}
    </main>
  );
}
