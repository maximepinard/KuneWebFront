import { useEffect, useState } from 'react';
import { useYoutubePlayer } from '../hooks/useYoutube';
import FakeTitle from './fake-title';
import PauseIcon from '../assets/svg/pause-icon';
import PlayIcon from '../assets/svg/play-icon';
import IconButton from './icon-button';
import FastForward from '../assets/svg/fast-forwad';
import FastRewind from '../assets/svg/fast-rewind';

const PlayerState = {
  UNSTARTED: -1,
  ENDED: 0,
  PLAYING: 1,
  PAUSED: 2,
  BUFFERING: 3,
  CUED: 5
};

function NewVideoPlayer({ video, getPrevious, getNext, noControls = false, width = 680, height = 360 }) {
  const [currentVideo, setCurrentVideo] = useState();
  const [playerState, setPlayerState] = useState(PlayerState.UNSTARTED);
  const [isReady, setReady] = useState(false);
  const [autoplay, setAutoplay] = useState(true); // noControls);
  const [lastEnd, setLastEnd] = useState(null);
  const { player, YoutubePlayer } = useYoutubePlayer({
    width,
    height,
    playerVars: { controls: 0, showinfo: 0, disablekb: 1, fs: 0, autoplay: noControls ? 1 : 0 },
    events: {
      onReady: () => {
        setReady(true);
      },
      onStateChange: (event) => {
        setPlayerState(event.data);
      },
      onError: (event) => {
        console.log('onError event fired.', event);
      }
    }
  });

  /* useEffect(() => {
    console.log('video', video);
  }, [video]);

  useEffect(() => {
    console.log('currentVideo', currentVideo);
  }, [currentVideo]);

  useEffect(() => {
    console.log('playerState', playerState);
  }, [playerState]);

  useEffect(() => {
    console.log('isReady', isReady);
  }, [isReady]);

  useEffect(() => {
    console.log('autoplay', autoplay);
  }, [autoplay]); */

  useEffect(() => {
    if (
      player &&
      video &&
      isReady &&
      (!currentVideo ||
        currentVideo.code !== video.code ||
        currentVideo.start !== video.start ||
        ((playerState === PlayerState.UNSTARTED || playerState === PlayerState.CUED) && autoplay))
    ) {
      if (autoplay) {
        player.loadVideoById({
          videoId: video.code,
          startSeconds: video.start,
          endSeconds: video.end
        });
      } else {
        player.cueVideoById({
          videoId: video.code,
          startSeconds: video.start,
          endSeconds: video.end
        });
      }
      if (!currentVideo || currentVideo.code !== video.code) {
        setCurrentVideo(video);
      }
    }
  }, [player, video, autoplay, isReady, currentVideo]);

  useEffect(() => {
    if (playerState === PlayerState.ENDED && autoplay && player) {
      setPlayerState(-1);
      if (!lastEnd || lastEnd + 500 < Date.now()) {
        getNext();
        setLastEnd(Date.now());
      }
    } else if (playerState === PlayerState.CUED && autoplay && player) {
      player.playVideo();
    }
  }, [autoplay, playerState, player]);

  return (
    <div>
      <div onClick={(e) => e.stopPropagation()} style={{ position: 'relative' }}>
        <div style={{ position: 'absolute', width: '100%', height: '100%', zIndex: 2 }}></div>
        <div
          style={{
            position: video?.show ? 'initial' : 'absolute',
            opacity: video?.show ? 1 : 0.01,
            maxHeight: '100%',
            maxWidth: '100%'
          }}
        >
          <YoutubePlayer />
          <div>
            <h3>{`${video.artist} - ${video.title}`}</h3>
          </div>
        </div>
        {video && !video?.show && (
          <FakeTitle
            auto={false}
            total={video?.end}
            start={video?.start}
            player={player}
            size={width ? width / 680 : 680}
          />
        )}
      </div>

      <div style={{ display: noControls ? 'none' : 'flex', gap: '1rem', alignItems: 'center' }}>
        {/*<label>
          Autoplay
          <input type="checkbox" checked={autoplay} onChange={(e) => setAutoplay(e.target.checked)} />
        </label> */}

        <IconButton
          onClick={() => {
            if (player.getCurrentTime() <= video.start) {
              getPrevious();
            } else {
              if (autoplay) {
                player.loadVideoById({
                  videoId: video.code,
                  startSeconds: video.start,
                  endSeconds: video.end
                });
              } else {
                player.cueVideoById({
                  videoId: video.code,
                  startSeconds: video.start,
                  endSeconds: video.end
                });
              }
            }
          }}
          icon={<FastRewind />}
        />

        {!isReady ? (
          <span>...loading</span>
        ) : (
          <IconButton
            onClick={() => {
              if (playerState === PlayerState.PLAYING) {
                player.pauseVideo();
              } else if (playerState !== PlayerState.PLAYING && isReady) {
                player.playVideo();
              }
            }}
            icon={playerState === PlayerState.PLAYING ? <PauseIcon /> : <PlayIcon />}
          />
        )}

        <IconButton
          onClick={() => {
            getNext();
          }}
          icon={<FastForward />}
        />
      </div>
    </div>
  );
}

export default NewVideoPlayer;
