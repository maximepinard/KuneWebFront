import { useContext, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Outlet } from 'react-router-dom';
import { AuthContext } from '../global-context';
import axiosCustom from '../tools/axiosCustom';
import { toast } from 'react-toastify';

import './layout.css';
import { getMedia } from '../tools/input-tools';
import LogoutIcon from '../assets/svg/logout-icon';
import LoginIcon from '../assets/svg/login-icon';
import MenuIcon from '../assets/svg/menu-icon';

export const GAME_BLIND_TEST = 'blind-test';
export const GAME_PIXEL_IMAGE = 'pixel-image';
export const GAME_PANEL_IMAGE = 'panel-image';

function GameMenu({ game }) {
  if (game === GAME_PIXEL_IMAGE) {
    return (
      <>
        <NavLink to="/image">images</NavLink>
        <NavLink to="/playlist">playlists</NavLink>
        <NavLink to="/play">Jouer</NavLink>
      </>
    );
  }
  return (
    <>
      <NavLink to="/video">videos</NavLink>
      <NavLink to="/playlist">playlists</NavLink>
    </>
  );
}

function MobileGameMenu({ game }) {
  const [open, setOpen] = useState(false);
  if (game === GAME_PIXEL_IMAGE) {
    return (
      <div className="submenu">
        <NavLink to="/image">images</NavLink>
        <NavLink to="/playlist">playlists</NavLink>
      </div>
    );
  }
  return (
    <div
      className={`submenu ${open === GAME_BLIND_TEST ? 'open' : ''}`}
      onClick={() => setOpen(open === GAME_BLIND_TEST ? false : GAME_BLIND_TEST)}
    >
      <div className="submenu-title">
        <MenuIcon />
      </div>
      <div className="submenu-content">
        <NavLink to="/video">videos</NavLink>
        <NavLink to="/playlist">playlists</NavLink>
      </div>
    </div>
  );
}

function Root() {
  const { user, setUser, game } = useContext(AuthContext);
  const media = getMedia();

  function logout() {
    axiosCustom
      .post('/user/logout')
      .then((res) => {
        toast.info('Déconnexion réussie');
      })
      .catch((err) => {
        console.error(err);
        toast.warn('Déconnexion réussie');
      })
      .finally(() => {
        setUser();
      });
  }

  if (media === 'pc') {
    return (
      <div id="layout">
        <header>
          <nav>
            <div className="title logo shine-text">
              <NavLink to="/">Kune</NavLink>
            </div>
            {user?.login && <GameMenu game={game} />}
            <div>
              {user?.login && (
                <NavLink to="/" onClick={logout}>
                  Déconnexion
                </NavLink>
              )}
              {!user?.login && <NavLink to="/login">Connexion</NavLink>}
            </div>
          </nav>
        </header>
        <main>
          <Outlet />
        </main>
      </div>
    );
  }

  return (
    <div id="layout">
      <header>
        <nav>
          {user?.login && <MobileGameMenu game={game} />}
          <div className="title logo shine-text">
            <NavLink to="/">Kune</NavLink>
          </div>
          <div>
            {user?.login && (
              <NavLink to="/" onClick={logout}>
                <LogoutIcon />
              </NavLink>
            )}
            {!user?.login && (
              <NavLink to="/login">
                <LoginIcon />
              </NavLink>
            )}
          </div>
        </nav>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
}

export default Root;
