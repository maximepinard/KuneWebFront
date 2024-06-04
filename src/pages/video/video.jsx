import { useContext, useState, useEffect } from "react";
import { VideoContext } from "../../global-context";
import EditIcon from "../../assets/svg/edit-icon";
import DeleteIcon from "../../assets/svg/delete-icon";
import IconButton from "../../components/icon-button";
import AddIcon from "../../assets/svg/add-icon";
import EditVideo from "../../components/edit-video";
import axiosCustom from "../../tools/axiosCustom";
import { toast } from "react-toastify";

function VideoList() {
  const [editVideo, setEditVideo] = useState();
  const { videos, setVideos } = useContext(VideoContext);

  useEffect(() => {
    axiosCustom
      .get("/videos")
      .then((res) => {
        setVideos(res.data);
      })
      .catch((err) => {
        setVideos([]);
        console.error(err);
      });
  }, []);

  function deleteVideo(vid) {
    axiosCustom
      .delete(`/videos/${vid?.id}`)
      .then((res) => {
        toast.success("vidéo supprimée");
        const newVideos = [...videos].filter((v) => v.id !== vid.id);
        setVideos(newVideos);
      })
      .catch((err) => {
        toast.error("erreur de suppression");
      });
  }

  function displayActions(vid) {
    return (
      <div className="action">
        <IconButton icon={<EditIcon />} onClick={() => setEditVideo(vid)} />
        <IconButton icon={<DeleteIcon />} onClick={() => deleteVideo(vid)} />
      </div>
    );
  }

  return (
    <div id="video" className="basic-page">
      {editVideo ? (
        <EditVideo video={editVideo} close={() => setEditVideo()} />
      ) : (
        <table>
          <thead>
            <tr>
              <th>Nom</th>
              <th>Artist</th>
              <th>Code</th>
              <th>Miniature</th>
              <th>Debut</th>
              <th>Fin</th>
              <th>
                <div className="action">
                  Actions
                  <IconButton
                    icon={<AddIcon />}
                    onClick={() => setEditVideo({})}
                  />
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {videos?.map &&
              videos.map((vid, i) => (
                <tr key={i}>
                  <td>{vid.title}</td>
                  <td>{vid.artist}</td>
                  <td>
                    <a
                      href={`https://www.youtube.com/watch?v=${vid.code}`}
                      target="_blank"
                    >
                      {vid.code}
                    </a>
                  </td>
                  <td style={{ padding: 0 }}>
                    <img
                      src={`https://img.youtube.com/vi/${vid.code}/default.jpg`}
                    />
                  </td>
                  <td>{vid.startGuess}</td>
                  <td>{vid.endGuess}</td>
                  <td>{displayActions(vid)}</td>
                </tr>
              ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default VideoList;
