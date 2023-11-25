"use client";

import { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import axios from "axios";
import CopyConnectionID from "../components/CopyConnectionID";

export default function Page() {
  const streamRef = useRef<HTMLVideoElement>(null);
  const [remoteID, setRemoteID] = useState<string>("");
  const [live, setLive] = useState<Boolean>(false);
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

  const createRemote = () => {
    axios
      .post(`https://fair-gray-rhinoceros-vest.cyclic.app/api/createRemote`, {
        remoteID: remoteID,
      })
      .then((resp) => {
        console.log(`${resp.data.created ? "Created" : "Fail connection"}`);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const deleteRemote = () => {
    axios
      .post(`https://fair-gray-rhinoceros-vest.cyclic.app/api/deleteRemote`, {
        remoteID: remoteID,
      })
      .then((resp) => {
        console.log(`${resp.data.deleted ? "Deleted" : "Fail connection"}`);
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
          getUUID();
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
