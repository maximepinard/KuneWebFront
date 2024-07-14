import { useState, useContext, useEffect, useRef, useMemo } from 'react';
import axiosCustom from '../tools/axiosCustom';
import { toast } from 'react-toastify';
import { VideoContext } from '../global-context';
import IconButton from './icon-button';
import SelectingVideo from './select-video';
import DeleteIcon from '../assets/svg/delete-icon';
import CustomField from './CustomField';
import KuneTable from './kune-table';
import { getVideoColumns } from '../pages/video/video';
import '../assets/css/edit.css';

const inputFields = [
  {
    name: 'name',
    label: 'Nom',
    placeholder: 'Nom de la playlist',
    type: 'text'
  },
  {
    name: 'public',
    label: 'Publique',
    type: 'switch'
  }
];

function EditPlaylist({ playlist, videos, close, readOnly = false }) {
  const { playlists, setPlaylists } = useContext(VideoContext);
  const [editPlaylist, setEditPlaylist] = useState({ ...playlist });
  const [playlistContent, setPlaylistContent] = useState([]);
  const [mode, setMode] = useState('list');
  const [lock, setLock] = useState();

  const getContentInOrder = (contents) => {
    const newContent = [];
    contents
      .sort((a, b) => a.order_num - b.order_num)
      .forEach((c, i) => {
        if (c.content_type === 'video') {
          newContent.push(c);
        }
      });
    return newContent;
  };

  const contentInPlaylist = useMemo(() => getContentInOrder(playlistContent || []), [playlistContent]);

  useEffect(() => {
    if (playlist?.id) {
      setPlaylistContent(
        playlist.contentPlaylists?.map
          ? playlist.contentPlaylists
              ?.sort((a, b) => a.order_num - b.order_num)
              ?.map((c, i) => ({
                ...c,
                content_type: c.content_type,
                order_num: c.order_num || i
              }))
          : []
      );
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
        const newPlaylists = [...playlists];
        const index = newPlaylists.findIndex((p) => p.id === playlist.id);
        if (index > -1) {
          newPlaylists[index] = res.data;
          setPlaylists(newPlaylists);
        }
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

    // Swap the order_num properties
    const tempOrder = dragItemContent.order_num;
    dragItemContent.order_num = dragOverItemContent.order_num;
    dragOverItemContent.order_num = tempOrder;

    // Update the playlist content with the new order
    setPlaylistContent([...copyRows.sort((a, b) => a.order_num - b.order_num)]);

    dragItem.current = null;
    dragOverItem.current = null;
  };

  function displayVideo(content, i) {
    const video = content.video;
    if (!video) {
      return (
        <div key={i} className="playlist-item">
          <div>error</div>
          {!readOnly && (
            <IconButton
              icon={<DeleteIcon />}
              onClick={(e) => {
                setPlaylistContent(
                  [...playlistContent].filter(
                    (c) => c.content_id !== content.content_id || c.content_type !== content.content_type
                  )
                );
                e.preventDefault();
              }}
            />
          )}
        </div>
      );
    }
    return (
      <div
        key={i}
        className="playlist-item"
        draggable={!readOnly}
        onDragStart={(e) => handleDragStart(e, i)}
        onDragEnter={(e) => handleDragEnter(e, i)}
        onDragEnd={handleDragEnd}
        onDragOver={(e) => e.preventDefault()}
      >
        <div>
          <img src={`https://img.youtube.com/vi/${video.code}/default.jpg`} />
        </div>
        <div>{`${video.title || ''} - ${video.artist || ''}`}</div>
        {!readOnly && (
          <IconButton
            icon={<DeleteIcon />}
            onClick={(e) => {
              setPlaylistContent(
                [...playlistContent].filter(
                  (c) => c.content_id !== content.content_id || c.content_type !== content.content_type
                )
              );
              e.preventDefault();
            }}
          />
        )}
      </div>
    );
  }

  function handleAddSelection(e) {
    e.preventDefault();
    setMode(mode === 'add' ? 'list' : 'add');
  }

  const videoColumns = getVideoColumns(
    () => {},
    () => {},
    null
  );

  function handleClose(e) {
    e.preventDefault();
    if (mode === 'list') {
      close(e);
    } else {
      setMode('list');
    }
  }

  function handleConfirm(e) {
    e.preventDefault();
    if (mode === 'list') {
      onSubmit(e);
    } else {
      setMode('list');
    }
  }

  return (
    <div>
      <form onSubmit={onSubmit}>
        {inputFields.map((field, index) => (
          <div key={index}>
            <label htmlFor={field.name}>{field.label}</label>
            <CustomField field={field} disabled={readOnly} data={editPlaylist} setData={setEditPlaylist} />
          </div>
        ))}
        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
          {`${contentInPlaylist.length} éléments`}
          <button onClick={handleAddSelection}>Modifier</button>
        </div>
        <div className="playlist-item-list">
          {mode === 'list' && (
            <div className="wrapper">
              {contentInPlaylist?.map &&
                contentInPlaylist
                  .sort((a, b) => a.order_num - b.order_num)
                  .map((c, i) => {
                    if (c.content_type === 'video') {
                      return displayVideo(c, i);
                    }
                  })}
            </div>
          )}
          {mode === 'add' && (
            <div class="wrapper">
              <KuneTable
                rows={videos}
                columns={videoColumns}
                select
                selectedRows={contentInPlaylist.map((c) => c.content_id)}
                setSelectedRows={(ids) => {
                  console.log('ids', ids);
                  setPlaylistContent(
                    ids.map &&
                      ids.map((id) => ({
                        content_id: id,
                        content_type: 'video',
                        video: videos.find((v) => v.id === id),
                        order_num: playlistContent.length
                      }))
                  );
                }}
              />
            </div>
          )}
        </div>
        <button type="reset" onClick={handleClose}>
          Annuler
        </button>
        <button type="submit" onClick={handleConfirm} disabled={lock || readOnly}>
          Sauvegarder
        </button>
      </form>
    </div>
  );
}

export default EditPlaylist;
