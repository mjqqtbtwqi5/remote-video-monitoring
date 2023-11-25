"use client";

import { useEffect, useRef, useState } from "react";
import axios from "axios";
import CopyRemoteID from "../components/CopyRemoteID";
import Snackbar from "@mui/joy/Snackbar";
import { ShareOutlined } from "@mui/icons-material";
import { Card, CardContent, Typography } from "@mui/joy";
import CopyRemoteURL from "../components/CopyRemoteURL";
import ShareWhatsApp from "../components/ShareWhatsApp";

export default function Page() {
  const streamRef = useRef<HTMLVideoElement>(null);
  const [remoteID, setRemoteID] = useState<string>("");
  const [openShare, setOpenShare] = useState(false);
  const [stream, setStream] = useState<MediaStream>();

  useEffect(() => {
    goLive();
  }, []);

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

  const getUUID = () => {
    axios
      .post(`https://fair-gray-rhinoceros-vest.cyclic.app/api/uuid`)
      .then((resp) => {
        setRemoteID(resp.data.remoteID);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const goLive = () => {
    navigator.mediaDevices
      .getUserMedia({
        video: { width: 1280, height: 720 },
        // video: true,
        audio: true,
      })
      .then((stream) => {
        if (streamRef.current) {
          setStream(stream);
          streamRef.current.srcObject = stream;
          getUUID();
        }
      })
      .catch((err) => {
        console.error(err);
      });
  };

  return (
    <main className="bg-black">
      {/* <div className="h-screen flex items-center justify-center"> */}
      <div className="h-screen flex items-center justify-center">
        <div className="relative">
          <video ref={streamRef} autoPlay muted />
          <div
            className="absolute top-5 right-5 cursor-pointer"
            onClick={() => setOpenShare(true)}
          >
            <ShareOutlined fontSize="large" />
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
              {/* <div className="mt-3">
                <CopyRemoteID remoteID={remoteID} />
              </div> */}
            </CardContent>
          </Card>
        </Snackbar>
      </div>
    </main>
  );
}
