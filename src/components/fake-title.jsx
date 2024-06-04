import { useEffect, useState } from "react";
import "../assets/css/fake-title.css";

function FakeTitle({ title, artist, genre, year, timer = 10 }) {
  const [localTimer, setLocalTimer] = useState(timer);

  useEffect(() => {
    if (localTimer > 0) {
      setTimeout(() => setLocalTimer(localTimer - 1), 1000);
    } else {
      setTimeout(() => setLocalTimer(timer), 1000);
    }
  }, [localTimer, timer]);

  return (
    <div className={`fake-title ${timer ? "guess" : ""}`}>
      <div className="disc"></div>
      <div className="timer">{localTimer ? localTimer : 0}</div>
      {title && <p>{title}</p>}
      {artist && <p>{artist}</p>}
      {genre && <p>{genre}</p>}
      {year && <p>{year}</p>}
    </div>
  );
}

export default FakeTitle;
