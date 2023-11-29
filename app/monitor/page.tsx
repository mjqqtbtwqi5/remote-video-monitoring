"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import Snackbar from "@mui/joy/Snackbar";
import { isMobileDevice } from "../util/checkDeviceBrowser";
import {
  PhotoCameraBackOutlined,
  PhotoCameraOutlined,
  TuneOutlined,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  CardContent,
  Slider,
  Switch,
  Typography,
} from "@mui/joy";
import CopyRemoteID from "../components/CopyRemoteID";
import CopyRemoteURL from "../components/CopyRemoteURL";
import ShareWhatsApp from "../components/ShareWhatsApp";

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
  const searchParams = useSearchParams();
  const [remoteID, setRemoteID] = useState<string>("");
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [openSetting, setOpenSetting] = useState(false);
  const [videoPlay, setVideoPlay] = useState<boolean>(true);
  const [videoMute, setVideoMute] = useState<boolean>(true);
  const [videoFlip, setVideoFlip] = useState<boolean>(false);
  const [videoVolume, setVideoVolume] = useState<number>(100);

  useEffect(() => {
    setIsMobile(isMobileDevice());
    const rid = searchParams.get("remoteID") || "";
    setRemoteID(rid);
  }, []);

  useEffect(() => {
    if (streamRef.current) {
      if (videoPlay) {
        streamRef.current.play();
      } else {
        streamRef.current.pause();
      }
    }
  }, [videoPlay]);

  useEffect(() => {
    if (streamRef.current) {
      if (videoMute) {
        streamRef.current.muted = true;
      } else {
        streamRef.current.muted = false;
      }
    }
  }, [videoMute]);

  useEffect(() => {
    if (streamRef.current) {
      if (!videoMute) {
        streamRef.current.volume = videoVolume / 100;
      }
    }
  }, [videoVolume]);

  useEffect(() => {
    if (remoteID) {
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
  }, [remoteID]);

  const capture = () => {
    if (streamRef.current) {
      const canvas = Object.assign(document.createElement("canvas"));

      canvas.width = streamRef.current.videoWidth;
      canvas.height = streamRef.current.videoHeight;
      canvas
        .getContext("2d")
        .drawImage(
          streamRef.current,
          0,
          0,
          streamRef.current.videoWidth,
          streamRef.current.videoHeight
        );
      var blob = canvas.toBlob(function (blob: any) {
        var anchor = document.createElement("a");
        anchor.style.display = "none";
        document.body.appendChild(anchor);
        var url = window.URL.createObjectURL(blob);
        anchor.href = url;
        anchor.download = "capture.png";
        anchor.click();
        window.setTimeout(() => {
          window.URL.revokeObjectURL(url);
          document.body.removeChild(anchor);
        }, 100);
      }, "image/png");
    }
  };

  return (
    <main>
      <div className="h-screen flex items-center justify-center">
        <div className="relative">
          <video
            width={1280}
            height={720}
            ref={streamRef}
            autoPlay
            muted
            className={`${videoFlip ? "rotate-y-180" : ""}`}
          />
          {isMobile ? (
            <div
              className="absolute top-6 right-6 cursor-pointer bg-black bg-opacity-10 p-1"
              onClick={() => setOpenSetting(true)}
            >
              {remoteID && (
                <TuneOutlined fontSize="small" sx={{ color: "#fff" }} />
              )}
            </div>
          ) : (
            <div
              className="absolute top-9 right-9 cursor-pointer bg-black bg-opacity-10 p-1.5"
              onClick={() => setOpenSetting(true)}
            >
              {remoteID && (
                <TuneOutlined fontSize="large" sx={{ color: "#fff" }} />
              )}
            </div>
          )}
        </div>
        <Snackbar
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
          open={openSetting}
          onClose={() => setOpenSetting(false)}
        >
          <Card
            sx={{
              width: "100%",
              "--Card-padding": "0",
            }}
            variant="plain"
          >
            <CardContent>
              <Typography level="title-lg">Controls</Typography>

              <div className="grid grid-cols-2 mx-3 my-5 gap-y-7">
                <div className="self-center">
                  <Switch
                    checked={videoPlay}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                      setVideoPlay(event.target.checked)
                    }
                    color={videoPlay ? "success" : "danger"}
                    variant={videoPlay ? "solid" : "outlined"}
                    // endDecorator={videoPlay ? "Play" : "Pause"}
                    // slotProps={{
                    //   endDecorator: {
                    //     sx: {
                    //       minWidth: 24,
                    //     },
                    //   },
                    // }}
                    slotProps={{
                      track: {
                        children: (
                          <>
                            <Typography
                              component="span"
                              level="inherit"
                              sx={{ ml: "6px" }}
                            >
                              Play
                            </Typography>
                            <Typography
                              component="span"
                              level="inherit"
                              sx={{ mr: "3px" }}
                            >
                              Stop
                            </Typography>
                          </>
                        ),
                      },
                    }}
                    sx={{
                      "--Switch-thumbSize": "30px",
                      "--Switch-trackWidth": "70px",
                      "--Switch-trackHeight": "38px",
                    }}
                  />
                </div>
                <div>
                  <Button
                    startDecorator={<PhotoCameraOutlined />}
                    onClick={capture}
                    size="sm"
                    variant="outlined"
                    sx={{ fontSize: "12px" }}
                  >
                    Capture
                  </Button>
                </div>
                <div className="self-center">
                  <Switch
                    checked={videoMute}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                      setVideoMute(event.target.checked)
                    }
                    variant={videoMute ? "solid" : "outlined"}
                    endDecorator="Mute"
                    slotProps={{
                      endDecorator: {
                        sx: {
                          minWidth: 24,
                        },
                      },
                    }}
                  />
                </div>
                <div>
                  <Slider
                    color="primary"
                    disabled={videoMute}
                    size="md"
                    defaultValue={videoVolume}
                    onChange={(event: Event, newValue: number | number[]) => {
                      setVideoVolume(newValue as number);
                    }}
                    valueLabelDisplay="on"
                    variant="solid"
                  />
                </div>
                <div>
                  <Switch
                    checked={videoFlip}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                      setVideoFlip(event.target.checked)
                    }
                    variant={videoFlip ? "solid" : "outlined"}
                    endDecorator="Flip"
                    slotProps={{
                      endDecorator: {
                        sx: {
                          minWidth: 24,
                        },
                      },
                    }}
                  />
                </div>
              </div>
            </CardContent>
            <CardContent>
              <Typography level="title-lg">Share</Typography>
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
    </main>
  );
}
