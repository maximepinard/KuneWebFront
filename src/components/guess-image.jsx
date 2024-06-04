import { useEffect, useState, useRef } from "react";
import Pixelify from "./pixelify";

function GuessImage({ src, timer = 60, nom, description, loop }) {
  const [localTimer, setLocalTimer] = useState(timer);

  useEffect(() => {
    if (localTimer > 0) {
      setTimeout(() => setLocalTimer(localTimer - 1), 250);
    } else if (loop) {
      setTimeout(() => setLocalTimer(timer), 3000);
    }
  }, [localTimer, timer, loop]);

  return (
    <div>
      <div
        style={{
          overflow: "hidden",
          position: "relative",
          display: "flex",
          justifyContent: "center",
          alignContent: "center",
        }}
      >
        <img
          src={src}
          style={{ visibility: localTimer ? "hidden" : "visible" }}
        />
        <div
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transform: `scale(${1 + localTimer * 0.1 * 0.1})`,
          }}
        >
          {localTimer > 0 && (
            <Pixelify src={src} pixelSize={Math.max(2, localTimer / 2)} />
          )}
        </div>
      </div>
      {localTimer === 0 && (
        <div>
          <h2>{nom}</h2>
          <h3>{description}</h3>
        </div>
      )}
    </div>
  );
}

export default GuessImage;
