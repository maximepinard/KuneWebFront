import { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
import axiosCustom from '../../tools/axiosCustom';
import IconButton from '../../components/icon-button';
import BackIcon from '../../assets/svg/back-icon';
import NewVideoPlayer from '../../components/new-video-player';
import { getMax16by9Dimensions } from '../../tools/input-tools';
import Switch from '../../components/switch';

function ReadPlaylist({ playlist, videos, close }) {
  const [originalPlaylistContent, setOriginalPlaylistContent] = useState([]);
  const [randomPlaylistContent, setRandomPlaylistContent] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [contentIndex, setContentIndex] = useState(0);
  const [preset, setPreset] = useState(true);
  const [random, setRandom] = useState(false);
  const [videoConf, setVideoConf] = useState({});
  const playlistContent = random ? randomPlaylistContent : originalPlaylistContent;

  // const videosContentIds = playlistContent.filter((c) => c.content_type === 'video').map((c) => c.content_id);

  // const videosInPlaylist = videos?.filter((v) => videosContentIds?.includes && videosContentIds?.includes(v.id));

  function getVideo() {
    if (
      videos &&
      videos.find &&
      playlistContent &&
      playlistContent[contentIndex] &&
      playlistContent[contentIndex].content_id
    ) {
      const vid = videos.find((v) => v.id === playlistContent[contentIndex].content_id);
      if (currentStep === 1) {
        return {
          ...vid,
          start: vid.startReveal,
          end: vid.endReveal,
          show: true
        };
      }
      return {
        ...vid,
        start: vid.startGuess,
        end: vid.endGuess
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
    if (playlist?.id) {
      axiosCustom
        .get(`/playlists/${playlist?.id}`)
        .then((res) => {
          const array = res.data?.map
            ? res.data
                ?.sort((a, b) => a.order_num - b.order_num)
                ?.map((c) => ({
                  content_id: c.content_id,
                  content_type: c.content_type,
                  content_step: getStepNumber(c.content_id, c.content_type)
                }))
            : [];
          const randomArray = [...array];
          shuffleArray(randomArray);
          setRandomPlaylistContent(randomArray);
          setOriginalPlaylistContent(array);
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }, [playlist]);

  const { width, height } = getMax16by9Dimensions(document.querySelector('main'), 0, 144);

  if (preset) {
    return (
      <div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h2>{playlist.name}</h2>
          <Switch label="Playlist en ordre aléatoire" value={random} setValue={() => setRandom(!random)} />
          <p>--- Vidéos ---</p>
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
          <button onClick={() => setPreset(false)}>LANCER</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '-1rem' }}>
      <IconButton icon={<BackIcon />} onClick={close} style={{ zoom: 1.8 }} />
      {contentIndex === playlistContent.length ? (
        <div>
          <h2>FIN</h2>
        </div>
      ) : (
        playlistContent &&
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
