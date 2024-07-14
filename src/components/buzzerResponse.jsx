import { useState, useContext, useEffect } from 'react';
import { io } from 'socket.io-client';
import { AuthContext } from '../global-context';
import '../assets/css/buzzer-response.css';

const url = import.meta.env.VITE_API_URL;
const port = import.meta.env.VITE_API_PORT;
const protocol = import.meta.env.VITE_API_PROTOCOL;

function BuzzerResponse({ gameId, setPause, setContinue }) {
  const { user } = useContext(AuthContext);
  const [socket, setSocket] = useState(null);
  const [players, setPlayers] = useState([]);
  const [buzzerPressed, setBuzzerPressed] = useState(false);
  const [firstPlayer, setFirstPlayer] = useState(null);

  useEffect(() => {
    const newSocket = io(`${protocol}://${url}${port}`);
    setSocket(newSocket);

    newSocket.on('updatePlayers', (updatedPlayers) => {
      console.log('upadtedPlayers');
      setPlayers(updatedPlayers);
    });

    newSocket.on('buzzerPressed', (infos) => {
      console.log('buzzerPressed', infos);
      setBuzzerPressed(true);
    });

    if (newSocket) {
      newSocket.emit('joinGame', { gameId, playerName: user?.login });
    }

    return () => newSocket.close();
  }, [gameId]);

  const resetBuzzer = () => {
    setBuzzerPressed(false);
    setFirstPlayer(null);
  };

  return (
    <div className="buzzer-response">
      <div className="player-list">
        <h3>Liste des joueurs</h3>
        <ul>{players?.map && players.map((p) => <li className="player">{p.name}</li>)}</ul>
      </div>
    </div>
  );
}

export default BuzzerResponse;
