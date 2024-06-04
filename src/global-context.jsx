import { createContext, useState, useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import AppRouter from './app-router';
import 'react-toastify/dist/ReactToastify.css';
import axiosCustom from './tools/axiosCustom';

export const AuthContext = createContext('Auth');
export const VideoContext = createContext('Video');

function GlobalContext() {
  const [user, setUser] = useState({ loaded: false });
  const [game, setGame] = useState();
  const [playlists, setPlaylists] = useState([]);
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    axiosCustom.get('/user').then((res) => {
      if (res.data) {
        setUser({ login: res.data });
      } else {
        setUser({});
      }
    });
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, game, setGame }}>
      <VideoContext.Provider value={{ videos, setVideos, playlists, setPlaylists }}>
        <AppRouter />
        <ToastContainer
          position="bottom-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={true}
          closeOnClick
          pauseOnHover
          theme="dark"
        />
      </VideoContext.Provider>
    </AuthContext.Provider>
  );
}

export default GlobalContext;
