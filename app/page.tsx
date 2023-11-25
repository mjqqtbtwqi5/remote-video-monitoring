"use client";

import ConnectButton from "./components/ConnectButton";
import OnlineButton from "./components/OnlineButton";

export default function Home() {
  return (
    <>
      <div>
        <OnlineButton />
      </div>
      <div>
        <ConnectButton />
      </div>
    </>
  );
}
