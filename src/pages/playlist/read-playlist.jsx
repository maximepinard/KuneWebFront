import { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
import IconButton from '../../components/icon-button';
import NewVideoPlayer from '../../components/new-video-player';
import { getMax16by9Dimensions } from '../../tools/input-tools';
import Switch from '../../components/switch';
import CancelIcon from '../../assets/svg/cancel-icon';
import QRCode from 'react-qr-code';
import '../../assets/css/read-playlist.css';

const url = import.meta.env.VITE_API_URL;
const protocol = import.meta.env.VITE_API_PROTOCOL;

function ReadPlaylist({ playlist, close }) {
  const [originalPlaylistContent, setOriginalPlaylistContent] = useState([]);
  const [randomPlaylistContent, setRandomPlaylistContent] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [contentIndex, setContentIndex] = useState(0);
  const [preset, setPreset] = useState(true);
  const [random, setRandom] = useState(false);
  const [videoConf, setVideoConf] = useState({});
  const playlistContent = random ? randomPlaylistContent : originalPlaylistContent;

  function getVideo() {
    if (playlistContent && playlistContent[contentIndex] && playlistContent[contentIndex].video) {
      const vid = playlistContent[contentIndex].video;
      if (currentStep === 1) {
        return {
          ...vid,
          start: vid?.startReveal,
          end: vid?.endReveal,
          show: true
        };
      }
      return {
        ...vid,
        start: vid?.startGuess,
        end: vid?.endGuess
      };
    }
    return null;
  }

  function goNext() {
    if (playlistContent && playlistContent[contentIndex] && currentStep < playlistContent[contentIndex].content_step) {
      setCurrentStep((prev) => prev + 1);
    } else {
      setContentIndex((prev) => prev + 1);
      setCurrentStep(0);
    }
  }

  function goPrevious() {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    } else {
      setContentIndex((prev) => prev - 1);
      setCurrentStep(0);
    }
  }

  function getStepNumber(content_id, content_type) {
    if (content_type === 'video') {
      return 1;
    }
    return 0;
  }

  function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
    return array;
  }

  useEffect(() => {
    const array = playlist.contentPlaylists?.map
      ? playlist.contentPlaylists
          ?.sort((a, b) => a.order_num - b.order_num)
          ?.map((c) => ({
            ...c,
            content_step: getStepNumber(c.content_id, c.content_type)
          }))
      : [];
    const randomArray = [...array];
    shuffleArray(randomArray);
    setRandomPlaylistContent(randomArray);
    setOriginalPlaylistContent(array);
  }, [playlist]);

  const { width, height } = getMax16by9Dimensions(document.querySelector('main'), 0, 144);

  function diplaySwitchContentPlaylist() {
    return (content_types = new Set(item?.contentPlaylists?.map((c) => c.content_type) || []));
  }

  if (preset) {
    return (
      <div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h3 style={{ margin: 0 }}>{playlist.name}</h3>
          <div className="section-playlist">
            <div className="section-title">Général</div>
            <Switch label="Playlist en ordre aléatoire" value={random} setValue={() => setRandom(!random)} />
          </div>
          <div className="section-playlist">
            <div className="section-title">Types</div>
          </div>
          <div className="section-playlist">
            <div className="section-title">Videos</div>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <Switch
                label="Afficher le type"
                value={videoConf?.type}
                setValue={() => setVideoConf({ ...videoConf, type: !videoConf?.type })}
              />
              <Switch
                label="Afficher l'année"
                value={videoConf?.year}
                setValue={() => setVideoConf({ ...videoConf, year: !videoConf?.year })}
              />
            </div>
          </div>
          <div className="section-playlist">
            <div className="section-title">Rejoindre</div>
            <div style={{ padding: '15px', background: 'white', width: 'fit-content' }}>
              <QRCode
                value={`${protocol}://${url}/buzzer?hash=1550`}
                size={Math.min(350, window.innerHeight * 0.8, window.innerWidth * 0.8)}
              />
            </div>
            <span>{`${protocol}://${url}/buzzer?hash=1550`}</span>
          </div>
          <button onClick={() => setPreset(false)}>LANCER</button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="playing"
      style={{
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'column',
        position: 'relative',
        gap: '0.25rem'
      }}
    >
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', justifyContent: 'center' }}>
        <IconButton
          icon={<CancelIcon style={{ margin: 0 }} />}
          onClick={close}
          style={{ zoom: 1.5, maxWidth: '24px', maxHeight: '24px', minWidth: '24px' }}
        />
        <div
          style={{ zoom: 1.5, zIndex: 99 }}
        >{`${Math.min(contentIndex + 1, playlistContent.length)}/${playlistContent.length}`}</div>
      </div>
      {contentIndex === playlistContent?.length ? (
        <div className="end">
          <h2>FIN</h2>
        </div>
      ) : (
        playlistContent &&
        playlistContent[contentIndex] &&
        playlistContent[contentIndex].content_type === 'video' && (
          <NewVideoPlayer
            video={getVideo()}
            getPrevious={goPrevious}
            getNext={goNext}
            width={width}
            height={height}
            conf={videoConf}
          />
        )
      )}
      <div />
    </div>
  );
}

export default ReadPlaylist;
