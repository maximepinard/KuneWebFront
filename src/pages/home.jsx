import { useContext } from "react";
import FakeTitle from "../components/fake-title";
import GuessImage from "../components/guess-image";
import { AuthContext } from "../global-context";
import { GAME_BLIND_TEST, GAME_PIXEL_IMAGE } from "../layout/root";
import "../assets/css/home.css";

function home() {
  const { user, setGame, game } = useContext(AuthContext);
  return (
    <>
      {/*user?.login && (
        <div className="game-menu">
          <h3>Jeux</h3>
          <div>
            <button className="outlined" onClick={() => setGame(GAME_BLIND_TEST)}>
              Blind Test
            </button>
            <button className="outlined" onClick={() => setGame(GAME_PIXEL_IMAGE)}>
              Pixel Images
            </button>
          </div>
        </div>
      )*/}
      <div id="home" className="basic-page">
        <h2>Plusieurs jeux à jouer entre amis</h2>
        <section id="GTS">
          <h3>BLIND TEST</h3>
          <p>
            Ajoutez des chansons à partir d'un lien YouTube, ajoutez des
            playlists et invitez vos amis à les deviner.
          </p>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <FakeTitle />
          </div>
        </section>
        <section id="GTI" className="work-in-progress">
          <h3>Puzzle Pixel [prochainement]</h3>
          <p>
            Une grande image se révèle et se dépixelise - fais deviner à tes
            amis !
          </p>
          <GuessImage
            src={"/guess_img/Arnold.jpg"}
            nom={"ARNOLD SWHWARZENEGGER"}
            loop={true}
          />
        </section>
        <section id="ImagePanel" className="work-in-progress">
          <h3>LE PANEL [prochainement]</h3>
          <img src="/guess_img/pxfuel.jpg" />
        </section>
      </div>
    </>
  );
}

export default home;
