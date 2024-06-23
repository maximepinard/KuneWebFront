import '../assets/css/guess-image.css';
import { useEffect, useState } from 'react';

function GuessImage({
  src = '/guess_img/Arnold.jpg',
  timer = 140,
  nom = 'Arnold',
  description = 'Acteur (Terminator)',
  loop
}) {
  const [localTimer, setLocalTimer] = useState(timer);

  useEffect(() => {
    if (localTimer > 0) {
      setTimeout(() => setLocalTimer(localTimer - 1), 250);
    } else if (loop) {
      setTimeout(() => setLocalTimer(timer), 5000);
    }
  }, [localTimer, timer, loop]);

  function exponentialFunction(x) {
    const b = Math.log(35) / 140;
    return Math.exp(b * x);
  }

  const pixelSize = Math.round(Math.max(1, exponentialFunction(localTimer)));
  const scaleX = (localTimer * 2) / timer;
  const scale = scaleX > 1 ? Math.round(scaleX * 50) / 50 : 1;

  return (
    <div id="pixelGuess">
      <div id="block" style={{ transform: `scale(${scale})`, transition: 'transform 0.25s linear' }}>
        <div className="inside">
          <img src={src} />
        </div>
      </div>
      {localTimer > 1 && (
        <svg style={{ position: 'absolute' }}>
          <filter id="pixelate" x="0" y="0">
            <feFlood x="4" y="4" height="1" width="1" />
            <feComposite id="composite1" width={pixelSize * 2} height={pixelSize * 2} />
            <feTile result="a" />
            <feComposite in="SourceGraphic" in2="a" operator="in" />
            <feMorphology id="morphology" operator="dilate" radius={pixelSize} />
          </filter>
        </svg>
      )}
      {localTimer < 1 && (
        <div>
          <h2>{nom}</h2>
          <h3>{description}</h3>
        </div>
      )}
    </div>
  );
}

export default GuessImage;
