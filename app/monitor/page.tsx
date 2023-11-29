"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import Snackbar from "@mui/material/Snackbar";

const createEmptyAudioTrack = () => {
  const ctx = new AudioContext();
  const oscillator = ctx.createOscillator();
  //   const dst = oscillator.connect(ctx.createMediaStreamDestination());
  const dst = ctx.createMediaStreamDestination();
  oscillator.start();
  const track = dst.stream.getAudioTracks()[0];
  return Object.assign(track, { enabled: false });
};

// const createEmptyVideoTrack = ({ width, height }: any) => {
const createEmptyVideoTrack = () => {
  // const canvas = Object.assign(document.createElement("canvas"), {
  //   width,
  //   height,
  // });
  const canvas = Object.assign(document.createElement("canvas"));

  // canvas.getContext("2d")?.fillRect(0, 0, width, height);
  canvas.getContext("2d")?.fillRect(0, 0, 0, 0);

  const stream = canvas.captureStream();
  const track = stream.getVideoTracks()[0];

  return Object.assign(track, { enabled: false });
};

export default function Page() {
  const streamRef = useRef<HTMLVideoElement>(null);
  const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);
  const searchParams = useSearchParams();

  useEffect(() => {
    const remoteID = searchParams.get("remoteID") || "";
    if (!remoteID) {
      setOpenSnackbar(true);
    } else {
      (async function createPeerAndJoinRoom() {
        try {
          const peer = new (await import("peerjs")).default();
          peer.on("open", () => {
            const audioTrack = createEmptyAudioTrack();
            // const videoTrack = createEmptyVideoTrack({ width: 0, height: 0 });
            const videoTrack = createEmptyVideoTrack();
            const mediaStream = new MediaStream([audioTrack, videoTrack]);
            console.log(remoteID);
            const call = peer.call(remoteID, mediaStream);
            call.on("stream", (stream) => {
              if (streamRef.current) {
                streamRef.current.srcObject = stream;
              }
            });
          });
        } catch (e) {
          console.error(e);
        }
      })();
    }
  }, []);

  return (
    <main>
      <div className="h-screen flex items-center justify-center">
        <div>
          <video width={1280} height={720} ref={streamRef} autoPlay controls />
        </div>
      </div>

      <Snackbar
        open={openSnackbar}
        onClose={() => setOpenSnackbar(false)}
        autoHideDuration={5000}
        message="Server ERROR"
      />
    </main>
  );
}
