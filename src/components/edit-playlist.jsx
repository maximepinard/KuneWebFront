import { useState, useContext, useEffect } from 'react';
import { toast } from 'react-toastify';
import axiosCustom from '../tools/axiosCustom';
import { VideoContext } from '../global-context';
import IconButton from './icon-button';
import AddIcon from '../assets/svg/add-icon';
import SelectingVideo from './select-video';
import DeleteIcon from '../assets/svg/delete-icon';
import '../assets/css/edit.css';

const inputFields = [{ name: 'name', label: 'Nom', placeholder: 'Entrer le Nom', type: 'text' }];

function EditPlaylist({ playlist, videos, close }) {
  const { playlists, setPlaylists } = useContext(VideoContext);
  const [editPlaylist, setEditPlaylist] = useState({ ...playlist });
  const [videoIds, setVideosIds] = useState([]);
  const [lock, setLock] = useState();

  const videosPlaylists = videos?.filter((v) => videoIds?.includes && videoIds?.includes(v.id));

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
      const res = await axiosMethod({ ...editPlaylist, videoIds: videoIds });
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
            <label htmlFor={field.name}>{field.label}:</label>
            <input
              id={field.name}
              name={field.name}
              value={editPlaylist?.[field.name]}
              placeholder={field.placeholder}
              type={field.type}
              onChange={(e) =>
                setEditPlaylist({
                  ...editPlaylist,
                  [field.name]: e.target.value
                })
              }
            />
          </div>
        ))}
        <div className="playlist-video-list">
          <div>
            {videosPlaylists?.map &&
              videosPlaylists.map((v, i) => (
                <div key={i} className="video-item">
                  <div>
                    <img src={`https://img.youtube.com/vi/${v.code}/default.jpg`} />
                  </div>
                  <div>{`${v.title} - ${v.artist}`}</div>
                  <IconButton
                    icon={<DeleteIcon />}
                    onClick={() => setVideosIds([...videoIds].filter((id) => id !== v.id))}
                  />
                </div>
              ))}
            <SelectingVideo
              videos={videos?.filter ? videos.filter((v) => !videoIds?.includes(v.id)) : []}
              addVideo={(id) => setVideosIds([...videoIds, id])}
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
