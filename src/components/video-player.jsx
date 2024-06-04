import { useState, useEffect } from "react";
import { useYoutubePlayer } from "../hooks/useYoutube";
import FakeTitle from "./fake-title";

function VideoPlayer({ videos, id = "44723a" }) {
  const [isReady, setIsReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [lock, setLock] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [mode, setMode] = useState(1);
  const [end, setEnd] = useState(false);

  const { YoutubePlayer, player } = useYoutubePlayer({
    videoId: id,
    height: "390",
    width: "640",
    events: {
      onReady: () => {
        setIsReady(true);
      },
      onStateChange: (event) => {
        setIsPlaying(event.data === 1);
      },
    },
  });

  useEffect(() => {
    function doChange() {
      let newMode = 1;
      let newIndex = currentIndex;
      if (mode === 1) {
        newMode = 0;
        newIndex++;
        setCurrentIndex(newIndex);
      }
      let newVideo = videos[newIndex];
      setMode(newMode);
      if (newVideo) {
        player.loadVideoById({
          videoId: newVideo.code,
          startSeconds:
            newMode === 0 ? newVideo.startGuess : newVideo.startReveal,
          endSeconds: newMode === 0 ? newVideo.endGuess : newVideo.endReveal,
        });
      } else {
        setEnd(true);
      }
    }

    if (!isPlaying && !lock && videos && videos.length > 0 && isReady) {
      setLock(true);

      if (currentIndex > -1) {
        setTimeout(() => doChange(), mode === 0 ? 900 : 3000);
      } else {
        doChange();
      }
    }
  }, [isReady, player, lock, isPlaying, currentIndex, videos, mode]);

  useEffect(() => {
    if (!isPlaying) {
      setLock(false);
    }
  }, [isPlaying]);

  if (end) {
    return <h1>Merci d'avoir joué</h1>;
  }

  return (
    <div style={{ opacity: currentIndex < 0 ? 0 : 1 }}>
      {mode === 0 && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <FakeTitle
            timer={
              videos[currentIndex].endGuess -
              videos[currentIndex].startGuess +
              1
            }
          />
        </div>
      )}
      <div
        style={{
          position: "relative",
          overflow: mode === 0 ? "hidden" : "visible",
          width: mode === 0 ? 0 : "auto",
          height: mode === 0 ? 0 : "auto",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            opacity: mode ? 1 : 0,
            position: mode ? "block" : "absolute",
            left: "50%",
            transform: "translateX(-50%)",
          }}
        >
          <YoutubePlayer />
          <h2>{videos[currentIndex]?.title}</h2>
          <h2>{videos[currentIndex]?.artist}</h2>
        </div>
      </div>
    </div>
  );
}

export default VideoPlayer;
