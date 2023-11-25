"use client";

import { AspectRatio, Card, CardContent, CardOverflow, Grid } from "@mui/joy";
import ConnectButton from "./components/ConnectButton";
import OnlineButton from "./components/OnlineButton";
import { useEffect, useState } from "react";

export default function Home() {
  const [dateTime, setDateTime] = useState<Date>(new Date());
  useEffect(() => {
    setInterval(() => {
      setDateTime(new Date());
    }, 1000);
  }, []);
  return (
    <main>
      <div className="w-300 h-screen flex items-center justify-center">
        <Card
          sx={{ width: 300 }}
          color="neutral"
          invertedColors={false}
          orientation="vertical"
          size="lg"
          variant="outlined"
        >
          <CardOverflow>
            <AspectRatio ratio="2">
              <div className="relative">
                <div className="absolute">
                  <div className="text-6xl text-white flex justify-center">
                    {dateTime.toLocaleString("en-US", {
                      hour: "numeric",
                      minute: "numeric",
                      hour12: true,
                    })}
                  </div>
                  <div className="text-sm text-white flex justify-center">
                    {`${dateTime.toLocaleDateString("default", {
                      weekday: "short",
                    })}, ${dateTime.getDate()} ${dateTime.toLocaleString(
                      "default",
                      { month: "short" }
                    )} ${dateTime.getFullYear()}`}
                  </div>
                </div>
                <img
                  src="https://images.unsplash.com/photo-1502657877623-f66bf489d236?auto=format&fit=crop&w=800"
                  srcSet="https://images.unsplash.com/photo-1502657877623-f66bf489d236?auto=format&fit=crop&w=800&dpr=2 2x"
                  loading="lazy"
                  alt=""
                />
              </div>
            </AspectRatio>
          </CardOverflow>
          <CardContent>
            <div className="grid grid-cols-2 my-5">
              <div className="justify-self-center">
                <OnlineButton />
              </div>
              <div className="justify-self-center">
                <ConnectButton />
              </div>
              <div className="justify-self-center text-xs pt-0.5">Online</div>
              <div className="justify-self-center text-xs pt-0.5">Connect</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
