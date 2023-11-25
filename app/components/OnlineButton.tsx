import React from "react";
import { Videocam } from "@mui/icons-material";
import { Button } from "@mui/joy";
import { useRouter } from "next/navigation";

export default function OnlineButton() {
  const router = useRouter();
  return (
    <>
      <Button
        fullWidth
        variant="outlined"
        color="neutral"
        endDecorator={<Videocam />}
        onClick={() => router.push("/stream")}
      >
        Online
      </Button>
    </>
  );
}
