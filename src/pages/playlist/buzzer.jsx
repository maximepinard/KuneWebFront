import { useState } from 'react';
import { extractParamFromUrl } from '../../tools/input-tools';
import '../../assets/css/buzzer.css';
import { useContext } from 'react';
import { AuthContext } from '../../global-context';
import { useEffect } from 'react';
import { io } from 'socket.io-client';

const url = import.meta.env.VITE_API_URL;
const port = import.meta.env.VITE_API_PORT;
const protocol = import.meta.env.VITE_API_PROTOCOL;

function Buzzer() {
  const [socket, setSocket] = useState(null);
  const [joined, setJoined] = useState(false);
  const { user } = useContext(AuthContext);
  const [playerName, setPlayerName] = useState(user?.login);
  const gameId = extractParamFromUrl(window.location.href)?.hash;

  useEffect(() => {
    const newSocket = io(`${protocol}://${url}${port}`);
    setSocket(newSocket);

    return () => newSocket.close();
  }, []);

  function joinGame() {
    console.log(gameId);
    socket.emit('joinGame', { gameId, playerName });
    setJoined(true);
  }

  function pressBuzzer() {
    socket.emit('buzzer', { gameId });
  }

  return (
    <div id="buzzer-page">
      <div>
        {!joined && (
          <>
            <input type="text" onChange={(e) => setPlayerName(e.target.value)} value={playerName} />
            <button onClick={() => playerName && joinGame()}>Rejoindre</button>
          </>
        )}
        {joined && <span>{playerName}</span>}
      </div>
      {joined && (
        <div className="buzzer-outer">
          <div className="buzzer-inner" onClick={pressBuzzer}></div>
        </div>
      )}
    </div>
  );
}

export default Buzzer;
