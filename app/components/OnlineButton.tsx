import React from "react";
import { Videocam } from "@mui/icons-material";
import { useRouter } from "next/navigation";

export default function OnlineButton() {
  const router = useRouter();
  return (
    <div
      className="w-16 h-16 bg-blue-600 rounded-2xl flex justify-center items-center cursor-pointer"
      onClick={() => router.push("/stream")}
    >
      <div className="w-8 h-8  bg-white rounded-lg flex justify-center items-center">
        <Videocam color="primary" />
      </div>
    </div>
  );
}
