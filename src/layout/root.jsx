import { useContext } from "react";
import { NavLink } from "react-router-dom";
import { Outlet } from "react-router-dom";
import { AuthContext } from "../global-context";
import axiosCustom from "../tools/axiosCustom";
import { toast } from "react-toastify";

import "./layout.css";

export const GAME_BLIND_TEST = "blind-test";
export const GAME_PIXEL_IMAGE = "pixel-image";
export const GAME_PANEL_IMAGE = "panel-image";

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
      <NavLink to="/play">Jouer</NavLink>
    </>
  );
}

function Root() {
  const { user, setUser, game } = useContext(AuthContext);

  function logout() {
    axiosCustom
      .post("/user/logout")
      .then((res) => {
        toast.info("Déconnexion réussie");
      })
      .catch((err) => {
        console.error(err);
        toast.warn("Déconnexion réussie");
      })
      .finally(() => {
        setUser();
      });
  }

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

export default Root;
