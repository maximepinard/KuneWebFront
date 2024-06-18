import { useEffect, useState } from 'react';
import '../assets/css/fake-title.css';

function FakeTitle({ size, player, total, start, timer = 10, auto = true }) {
  const [localTimer, setLocalTimer] = useState(timer * 10);

  useEffect(() => {
    if (localTimer > 0) {
      setTimeout(() => setLocalTimer(localTimer - 1), 100);
    } else {
      setTimeout(() => setLocalTimer(timer * 10), 100);
    }
  }, [localTimer, timer]);

  if ((player && player?.getCurrentTime && total && start !== null) || start !== undefined) {
    let timeLeft = total - start;
    let currentVideoTime = !isNaN(parseInt(player.getCurrentTime())) ? total - parseInt(player.getCurrentTime()) : 9999;
    let time = Math.min(timeLeft, currentVideoTime);
    return (
      <div className={`fake-title ${time ? 'guess' : ''}`} style={{ zoom: size ? size : 1 }}>
        <div className="disc"></div>
        <div className="timer">{time}</div>
      </div>
    );
  }

  if (auto) {
    return (
      <div className={`fake-title  ${timer ? 'guess' : ''}`} style={{ zoom: size ? size : 1 }}>
        <div className="disc"></div>
        <div className="timer">{localTimer ? parseInt(localTimer / 10) : 0}</div>
      </div>
    );
  }

  return (
    <div className={`fake-title guess`} style={{ zoom: size ? size : 1 }}>
      <div className="disc"></div>
      <div className="timer"></div>
    </div>
  );
}

export default FakeTitle;
