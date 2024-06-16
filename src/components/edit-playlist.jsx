import { useState, useContext, useEffect } from 'react';
import { toast } from 'react-toastify';
import axiosCustom from '../tools/axiosCustom';
import { VideoContext } from '../global-context';
import IconButton from './icon-button';
import SelectingVideo from './select-video';
import DeleteIcon from '../assets/svg/delete-icon';
import '../assets/css/edit.css';
import CustomField from './CustomField';

const inputFields = [
  {
    name: 'name',
    label: 'Nom',
    placeholder: 'Nom de la playlist',
    type: 'text'
  }
];

function EditPlaylist({ playlist, videos, close }) {
  const { playlists, setPlaylists } = useContext(VideoContext);
  const [editPlaylist, setEditPlaylist] = useState({ ...playlist });
  const [playlistContent, setPlaylistContent] = useState([]);
  const [lock, setLock] = useState();

  const videosContentIds = playlistContent.filter((c) => c.content_type === 'video').map((c) => c.content_id);

  const videosInPlaylist = videos?.filter((v) => videosContentIds?.includes && videosContentIds?.includes(v.id));

  useEffect(() => {
    if (playlist?.id) {
      axiosCustom
        .get(`/playlists/${playlist?.id}`)
        .then((res) => {
          setPlaylistContent(
            res.data?.map &&
              res.data?.map((c) => ({
                content_id: c.content_id,
                content_type: c.content_type
              }))
          );
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }, [playlist]);

  async function onSubmit(e) {
    e.preventDefault(); // Prevent the default form submission
    if (lock) {
      return;
    }

    setLock(true);
    const toastId = toast.loading('Enregistrement');
    const axiosMethod = (body) =>
      playlist?.id ? axiosCustom.patch(`/playlists/${playlist.id}`, body) : axiosCustom.post(`/playlists`, body);
    try {
      const res = await axiosMethod({
        ...editPlaylist,
        playlistContent: playlistContent
      });
      toast.update(toastId, {
        type: 'success',
        render: 'Réussi',
        isLoading: false,
        closeOnClick: true,
        autoClose: 2000
      });
      if (playlist?.id) {
        const newPlaylists = [...playlists].filter((p) => p.id !== playlist.id);
        setPlaylists([...newPlaylists, res.data]);
      } else {
        setPlaylists([...playlists, res.data]);
      }

      close();
    } catch (error) {
      console.error(error);
      toast.update(toastId, {
        type: 'error',
        render: 'Échoué',
        isLoading: false,
        closeOnClick: true,
        autoClose: 2000
      });
    } finally {
      setTimeout(() => setLock(false), 500);
    }
  }

  return (
    <div>
      <form onSubmit={onSubmit}>
        {inputFields.map((field, index) => (
          <div key={index}>
            <label htmlFor={field.name}>{field.label}</label>
            <CustomField field={field} data={editPlaylist} setData={setEditPlaylist} />
          </div>
        ))}
        <div className="playlist-video-list">
          <div>
            {videosInPlaylist?.map &&
              videosInPlaylist.map((v, i) => (
                <div key={i} className="video-item">
                  <div>
                    <img src={`https://img.youtube.com/vi/${v.code}/default.jpg`} />
                  </div>
                  <div>{`${v.title} - ${v.artist}`}</div>
                  <IconButton
                    icon={<DeleteIcon />}
                    onClick={(e) => {
                      setPlaylistContent([...playlistContent].filter((c) => c.content_id !== v.id));
                      e.preventDefault();
                    }}
                  />
                </div>
              ))}
            <SelectingVideo
              videos={videos?.filter ? videos.filter((v) => !videosContentIds?.includes(v.id)) : []}
              addVideo={(id) => setPlaylistContent([...playlistContent, { content_id: id, content_type: 'video' }])}
            />
          </div>
        </div>
        <button type="reset" onClick={close}>
          Annuler
        </button>
        <button type="submit" disabled={lock}>
          Sauvegarder
        </button>
      </form>
    </div>
  );
}

export default EditPlaylist;
