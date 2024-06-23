import { useState } from 'react';
import { extractParamFromUrl } from '../../tools/input-tools';
import '../../assets/css/buzzer.css';

function Buzzer() {
  const [url, setUrl] = useState(extractParamFromUrl(window.location.href)?.gameId);

  return (
    <div id="buzzer-page">
      <div className="buzzer-outer">
        <div className="buzzer-inner"></div>
      </div>
    </div>
  );
}

export default Buzzer;
