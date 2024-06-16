import { useState, useEffect, useMemo } from "react";
import axiosCustom from "../../tools/axiosCustom";
import VideoPlayer from "../../components/video-player";
import { randomString } from "../../tools/random";

function ReadPlaylist({ playlist, videos, close }) {
  const [playlistContent, setPlaylistContent] = useState([]);
  const randomId = useMemo(() => randomString(10), []);

  const videosContentIds = playlistContent
    .filter((c) => c.content_type === "video")
    .map((c) => c.content_id);

  const videosInPlaylist = videos?.filter(
    (v) => videosContentIds?.includes && videosContentIds?.includes(v.id),
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
          setPlaylistContent(
            res.data?.map &&
              res.data?.map((c) => ({
                content_id: c.content_id,
                content_type: c.content_type,
              })),
          );
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }, [playlist]);

  return (
    <div>
      {videosInPlaylist && videosInPlaylist.length > 0 && (
        <VideoPlayer videos={shuffleArray(videosInPlaylist)} id={randomId} />
      )}
    </div>
  );
}

export default ReadPlaylist;
