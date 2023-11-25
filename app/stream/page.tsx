"use client";

import { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import axios from "axios";
import Snackbar from "@mui/material/Snackbar";
import CopyConnectionID from "../components/CopyConnectionID";

export default function Page() {
  const hostname =
    typeof window !== "undefined" && window.location.hostname
      ? window.location.hostname
      : "";

  const streamRef = useRef<HTMLVideoElement>(null);
  const [remoteID, setRemoteID] = useState<string>("");
  const [live, setLive] = useState<Boolean>(false);
  const [stream, setStream] = useState<MediaStream>();

  useEffect(() => {
    // return () => goLive();
    goLive();
  }, []);

  useEffect(() => {
    if (!remoteID) {
      return;
    }
    (async function createConnection() {
      try {
        const peer = new (await import("peerjs")).default(remoteID);
        peer.on("open", () => {
          createRemote();
        });
        peer.on("call", (call) => {
          call.answer(stream);
        });
      } catch (err) {
        console.error(err);
      }
    })();
  }, [remoteID]);

  const createRemote = () => {
    axios
      // .post(`https://${hostname}:3001/createRemote`, {
      .post(
        `https://8080-cs-4579d115-4c8d-4e33-a5f6-6d58ed6c55cf.cs-asia-east1-vger.cloudshell.dev:8080/api/createRemote`,
        {
          remoteID: remoteID,
        }
      )
      .then((resp) => {
        console.log(`${resp.data.created ? "Created" : "Fail connection"}`);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const goLive = () => {
    navigator.mediaDevices
      .getUserMedia({
        // video: { width: 1280, height: 720 },
        video: true,
        audio: true,
      })
      .then((stream) => {
        if (streamRef.current) {
          setStream(stream);
          streamRef.current.srcObject = stream;
          // const socket = io(`https://${hostname}:3001`);
          const socket = io(
            `https://8080-cs-4579d115-4c8d-4e33-a5f6-6d58ed6c55cf.cs-asia-east1-vger.cloudshell.dev:443`,
            {
              withCredentials: true,
            }
          );

          socket.on("connect", () => {
            setRemoteID(socket.id);
          });
        }
      })
      .catch((err) => {
        console.error(err);
      });
  };

  return (
    <>
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="max-w-lg">
          <video
            onLoadedMetadata={() => setLive(true)}
            ref={streamRef}
            autoPlay
            muted
          />
          <div>{live && <CopyConnectionID remoteID={remoteID} />}</div>
        </div>
      </div>
    </>
  );
}
