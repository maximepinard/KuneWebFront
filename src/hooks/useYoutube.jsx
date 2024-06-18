/* eslint-disable react/prop-types */
/* eslint-disable react/display-name */
import { useRef, useMemo, useEffect, useCallback } from 'react';

export function useYoutubePlayer(options) {
  const playerRef = useRef();

  // COMPONENT
  const YoutubePlayer = useMemo(() => {
    return (props) => {
      const playerId = `youtube-player-${options?.videoId}`;
      return <div className={`${props.className || ''}`} style={props.style} id={playerId} />;
    };
  }, [options.videoId]);

  /**
   * Queueing functions
   */

  const loadVideoById = useCallback((videoId, startSeconds, suggestedVideoQuality) => {
    return playerRef.current?.loadVideoById(videoId, startSeconds, suggestedVideoQuality);
  }, []);

  const cueVideoById = useCallback((videoId, startSeconds, suggestedVideoQuality) => {
    return playerRef.current?.cueVideoById(videoId, startSeconds, suggestedVideoQuality);
  }, []);

  const cuePlaylist = useCallback((playlist, index, startSeconds) => {
    return playerRef.current?.cuePlaylist(playlist, index, startSeconds);
  }, []);

  const loadPlaylist = useCallback((playlist, index, startSeconds) => {
    return playerRef.current?.loadPlaylist(playlist, index, startSeconds);
  }, []);

  /**
   * Playback controls and player settings
   */
  const playVideo = useCallback(() => {
    return playerRef.current?.playVideo();
  }, []);

  const pauseVideo = useCallback(() => {
    return playerRef.current?.pauseVideo();
  }, []);

  const stopVideo = useCallback(() => {
    return playerRef.current?.stopVideo();
  }, []);

  const seekTo = useCallback((seconds, allowSeekAhead) => {
    return playerRef.current?.seekTo(seconds, allowSeekAhead);
  }, []);

  /*
   * Controlling playback of 360° videos
   */
  const getSphericalProperties = useCallback(() => {
    return playerRef.current?.getSphericalProperties();
  }, []);

  const setSphericalProperties = useCallback((args) => {
    return playerRef.current?.setSphericalProperties(args);
  }, []);

  /**
   * Playing a video in a playlist
   */
  const nextVideo = useCallback(() => {
    return playerRef.current?.nextVideo();
  }, []);

  const previousVideo = useCallback(() => {
    return playerRef.current?.previousVideo();
  }, []);

  const playVideoAt = useCallback((index) => {
    return playerRef.current?.playVideoAt(index);
  }, []);

  /**
   * Changing the player volume
   */
  const mute = useCallback(() => {
    return playerRef.current?.mute();
  }, []);

  const unMute = useCallback(() => {
    return playerRef.current?.unMute();
  }, []);

  const isMuted = useCallback(() => {
    return playerRef.current?.isMuted();
  }, []);

  // An integer between 0 and 100.
  const setVolume = useCallback((num) => {
    return playerRef.current?.setVolume(num);
  }, []);

  const getVolume = useCallback(() => {
    return playerRef.current?.getVolume();
  }, []);

  /**
   * Setting the player size
   */
  const setSize = useCallback((width, height) => {
    return playerRef.current?.setSize(width, height);
  }, []);

  /**
   * Setting the playback rate
   */
  const getPlaybackRate = useCallback(() => {
    return playerRef.current?.getPlaybackRate();
  }, []);

  const setPlaybackRate = useCallback((suggestedRate) => {
    return playerRef.current?.setPlaybackRate(+suggestedRate);
  }, []);

  const getAvailablePlaybackRates = useCallback(() => {
    return playerRef.current?.getAvailablePlaybackRates();
  }, []);

  /**
   *  Setting playback behavior for playlists
   */
  const setLoop = useCallback((loopPlaylists) => {
    return playerRef.current?.setLoop(loopPlaylists);
  }, []);

  const setShuffle = useCallback((shufflePlaylist) => {
    return playerRef.current?.setShuffle(shufflePlaylist);
  }, []);

  /**
   * Playback status
   */
  const getVideoLoadedFraction = useCallback(() => {
    return playerRef.current?.getVideoLoadedFraction();
  }, []);

  const getPlayerState = useCallback(() => {
    return playerRef.current?.getPlayerState();
  }, []);

  const getCurrentTime = useCallback(() => {
    return playerRef.current?.getCurrentTime && playerRef.current?.getCurrentTime();
  }, []);

  /**
   *   Retrieving video information
   */
  const getDuration = useCallback(() => {
    return playerRef.current?.getDuration();
  }, []);

  const getVideoUrl = useCallback(() => {
    return playerRef.current?.getVideoUrl();
  }, []);

  const getVideoEmbedCode = useCallback(() => {
    return playerRef.current?.getVideoEmbedCode();
  }, []);

  /**
   * Retrieving playlist information
   */
  const getPlaylist = useCallback(() => {
    return playerRef.current?.getPlaylist();
  }, []);

  const getPlaylistIndex = useCallback(() => {
    return playerRef.current?.getPlaylistIndex();
  }, []);

  /**
   * Adding or removing an event listener
   */
  const addEventListener = useCallback(() => {
    return playerRef.current?.addEventListener();
  }, []);

  const removeEventListener = useCallback(() => {
    return playerRef.current?.removeEventListener();
  }, []);

  /**
   * Accessing and modifying DOM nodes
   */
  const getIframe = useCallback(() => {
    return playerRef.current?.getIframe();
  }, []);

  const destroy = useCallback(() => {
    window.YT = undefined;
    return playerRef.current?.destroy();
  }, []);

  const loadVideo = useCallback(() => {
    playerRef.current = new window.YT.Player(`youtube-player-${options.videoId}`, {
      videoId: options.videoId,
      playerVars: options.playerVars,
      height: options.height || 390,
      width: options.width || 640,
      events: {
        ...options.events,
        onReady: (e) => {
          options.events?.onReady?.(e);
        }
      }
    });
  }, [options]);

  // INTERNAL

  useEffect(() => {
    if ((window && !window.YT) || !options.videoId) {
      new Promise((resolve) => {
        const tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/iframe_api';
        const firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
        // @ts-ignore
        window.onYouTubeIframeAPIReady = () => {
          resolve(window.YT);
        };
      }).then(() => {
        loadVideo();
      });
    }

    return destroy();
  }, []);

  const player = useMemo(() => {
    return {
      cueVideoById,
      loadVideoById,
      cuePlaylist,
      loadPlaylist,
      pauseVideo,
      stopVideo,
      playVideo,
      seekTo,
      getSphericalProperties,
      setSphericalProperties,
      nextVideo,
      previousVideo,
      playVideoAt,
      mute,
      unMute,
      isMuted,
      setVolume,
      getVolume,
      setSize,
      getPlaybackRate,
      setPlaybackRate,
      getAvailablePlaybackRates,
      setLoop,
      setShuffle,
      getVideoLoadedFraction,
      getPlayerState,
      getCurrentTime,
      getDuration,
      getVideoUrl,
      getVideoEmbedCode,
      getPlaylist,
      getPlaylistIndex,
      addEventListener,
      removeEventListener,
      getIframe,
      destroy
    };
  }, [
    addEventListener,
    cuePlaylist,
    cueVideoById,
    destroy,
    getAvailablePlaybackRates,
    getCurrentTime,
    getDuration,
    getIframe,
    getPlaybackRate,
    getPlayerState,
    getPlaylist,
    getPlaylistIndex,
    getSphericalProperties,
    getVideoEmbedCode,
    getVideoLoadedFraction,
    getVideoUrl,
    getVolume,
    isMuted,
    loadPlaylist,
    loadVideoById,
    mute,
    nextVideo,
    pauseVideo,
    playVideo,
    playVideoAt,
    previousVideo,
    removeEventListener,
    seekTo,
    setLoop,
    setPlaybackRate,
    setShuffle,
    setSize,
    setSphericalProperties,
    setVolume,
    stopVideo,
    unMute
  ]);

  return {
    YoutubePlayer,
    player
  };
}
