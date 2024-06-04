import { useState, useEffect, useMemo } from "react";
import axiosCustom from "../../tools/axiosCustom";
import VideoPlayer from "../../components/video-player";
import { randomString } from "../../tools/random";

function ReadPlaylist({ playlist, videos, close }) {
  const [videoIds, setVideosIds] = useState([]);
  const randomId = useMemo(() => randomString(10), []);

  const videosPlaylists = videos?.filter(
    (v) => videoIds?.includes && videoIds?.includes(v.id),
  );

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
          setVideosIds(res.data?.map && res.data?.map((v) => v.id));
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }, [playlist]);

  return (
    <div>
      {videosPlaylists && videosPlaylists.length > 0 && (
        <VideoPlayer videos={shuffleArray(videosPlaylists)} id={randomId} />
      )}
    </div>
  );
}

export default ReadPlaylist;
