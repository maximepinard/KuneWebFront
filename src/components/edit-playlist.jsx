import { useState, useContext, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import axiosCustom from '../tools/axiosCustom';
import { VideoContext } from '../global-context';
import IconButton from './icon-button';
import SelectingVideo from './select-video';
import DeleteIcon from '../assets/svg/delete-icon';
import CustomField from './CustomField';
import '../assets/css/edit.css';
import { useMemo } from 'react';

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

  const getContentInOrder = (contents, vids) => {
    const newContent = [];
    contents
      .sort((c) => c.order_num)
      .forEach((c, i) => {
        if (c.content_type === 'video') {
          const vid = vids.find((v) => v.id === c.content_id);
          newContent.push({ order_num: i, content_id: c.content_id, content: vid });
        }
      });
    return newContent;
  };

  const contentInPlaylist = useMemo(() => getContentInOrder(playlistContent, videos), [playlistContent, videos]);

  useEffect(() => {
    if (playlist?.id) {
      axiosCustom
        .get(`/playlists/${playlist?.id}`)
        .then((res) => {
          setPlaylistContent(
            res.data?.map &&
              res.data
                ?.sort((c) => c.order_num)
                ?.map((c, i) => ({
                  content_id: c.content_id,
                  content_type: c.content_type,
                  order_num: i
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

  const dragItem = useRef();
  const dragOverItem = useRef();

  const handleDragStart = (_e, position) => {
    dragItem.current = position;
  };

  const handleDragEnter = (_e, position) => {
    dragOverItem.current = position;
  };

  const handleDragEnd = (_e) => {
    const copyRows = [...playlistContent];
    const dragItemContent = copyRows[dragItem.current];
    const dragOverItemContent = copyRows[dragOverItem.current];

    console.log('copyRows', copyRows);
    console.log('dragItem', dragItem);
    console.log('dragOverItem', dragOverItem);
    console.log('dragItemContent', dragItemContent);
    console.log('dragOverItemContent', dragOverItemContent);

    // Swap the order_num properties
    const tempOrder = dragItemContent.order_num;
    dragItemContent.order_num = dragOverItemContent.order_num;
    dragOverItemContent.order_num = tempOrder;

    // Update the playlist content with the new order
    setPlaylistContent([...copyRows]);

    dragItem.current = null;
    dragOverItem.current = null;
  };

  const contentsIds = contentInPlaylist?.map((c) => c.content_id);
  console.log('playlistContent', playlistContent);

  return (
    <div>
      <form onSubmit={onSubmit}>
        {inputFields.map((field, index) => (
          <div key={index}>
            <label htmlFor={field.name}>{field.label}</label>
            <CustomField field={field} data={editPlaylist} setData={setEditPlaylist} />
          </div>
        ))}
        <div className="playlist-item-list">
          <div>
            {contentInPlaylist?.map &&
              contentInPlaylist
                .sort((c) => c.order_num)
                .map((c, i) => {
                  const v = c.content;
                  return (
                    <div
                      key={i}
                      className="playlist-item"
                      draggable
                      onDragStart={(e) => handleDragStart(e, i)}
                      onDragEnter={(e) => handleDragEnter(e, i)}
                      onDragEnd={handleDragEnd}
                      onDragOver={(e) => e.preventDefault()}
                    >
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
                  );
                })}
            <SelectingVideo
              videos={videos?.filter ? videos.filter((v) => !contentsIds?.includes(v.id)) : []}
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
