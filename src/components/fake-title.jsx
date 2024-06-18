import { useEffect, useState } from 'react';
import '../assets/css/fake-title.css';

function FakeTitle({ size, player, total, start, timer = 10, auto = true, type, year }) {
  const [localTimer, setLocalTimer] = useState(timer * 10 - 2);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setLocalTimer((prevLocalTimer) => {
        if (prevLocalTimer > 0) {
          return prevLocalTimer - 1;
        } else {
          return timer * 10;
        }
      });
    }, 100);

    return () => clearInterval(intervalId);
  }, [timer]);

  let displayTimer = '';
  if ((player && player?.getCurrentTime && total && start !== null) || start !== undefined) {
    let timeLeft = total - start;
    let currentVideoTime = !isNaN(parseInt(player.getCurrentTime())) ? total - parseInt(player.getCurrentTime()) : 9999;
    displayTimer = Math.min(timeLeft, currentVideoTime);
  }

  if (auto) {
    displayTimer = localTimer ? Math.round(localTimer / 10) : 0;
  }

  displayTimer = displayTimer < 0 ? 0 : displayTimer;

  return (
    <div className={`fake-title guess`} style={{ zoom: size ? size : 1 }}>
      <div className="disc"></div>
      <div className="timer">
        <div>
          <span className="timer-timer">{displayTimer}</span>
          <span className="timer-type">{type}</span>
          <span className="timer-year">{year ? year.split('-')[0] : ''}</span>
        </div>
      </div>
    </div>
  );
}

export default FakeTitle;
