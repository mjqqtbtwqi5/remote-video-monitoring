import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

import { library } from "@fortawesome/fontawesome-svg-core";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";

library.add(faWhatsapp);

export default function ShareWhatsApp({ remoteID }: any) {
  const URL = `https://${window.location.hostname}/monitor?remoteID=${remoteID}`;
  const shareClick = () => {
    window.open(`https://api.whatsapp.com:/send?text=${URL}`);
  };

  return (
    <>
      <div
        className="w-12 h-12 bg-whatsApp rounded-full flex justify-center items-center cursor-pointer"
        onClick={shareClick}
      >
        <FontAwesomeIcon
          icon={faWhatsapp}
          size="lg"
          style={{ color: "#fff" }}
        />
      </div>
    </>
  );
}
