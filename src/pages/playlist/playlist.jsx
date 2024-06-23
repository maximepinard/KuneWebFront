import { useContext, useState, useEffect } from 'react';
import { AuthContext, VideoContext } from '../../global-context';
import EditIcon from '../../assets/svg/edit-icon';
import IconButton from '../../components/icon-button';
import DeleteIcon from '../../assets/svg/delete-icon';
import AddIcon from '../../assets/svg/add-icon';
import PlayIcon from '../../assets/svg/play-icon';
import EditPlaylist from '../../components/edit-playlist';
import axiosCustom from '../../tools/axiosCustom';
import { toast } from 'react-toastify';
import ReadPlaylist from './read-playlist';
import KuneTable from '../../components/kune-table';

function PlayList() {
  const [editPlaylist, setEditPlaylist] = useState();
  const [readPlaylist, setReadPlaylist] = useState();
  const { game } = useContext(AuthContext);
  const { playlists, videos, setVideos, setPlaylists } = useContext(VideoContext);

  useEffect(() => {
    axiosCustom
      .get('/playlists')
      .then((res) => {
        setPlaylists(res.data);
      })
      .catch((err) => {
        setPlaylists([]);
        console.error(err);
      });
    axiosCustom
      .get('/videos')
      .then((res) => {
        setVideos(res.data);
      })
      .catch((err) => {
        setVideos([]);
        console.error(err);
      });
  }, []);

  function deletePlaylist(play) {
    axiosCustom
      .delete(`/playlists/${play?.id}`)
      .then((res) => {
        toast.success('playlist supprimée');
        const newPlaylists = [...playlists].filter((p) => p.id !== play.id);
        setPlaylists(newPlaylists);
      })
      .catch((err) => {
        toast.error('erreur de suppression');
      });
  }

  function displayActions(play) {
    return (
      <div className="action">
        <IconButton icon={<EditIcon />} onClick={() => setEditPlaylist(play)} />
        <IconButton icon={<DeleteIcon />} onClick={() => deletePlaylist(play)} />
        <IconButton icon={<PlayIcon />} onClick={() => setReadPlaylist(play)} />
      </div>
    );
  }

  const columns = [
    { label: 'Nom', name: 'name' },
    {
      label: 'Actions',
      name: 'title',
      render: (item) => displayActions(item),
      headerRender: () => (
        <div className="action">
          Actions
          <IconButton icon={<AddIcon />} onClick={() => setEditPlaylist({})} />
        </div>
      )
    }
  ];

  return (
    <div id="playlist" className="basic-page">
      {editPlaylist && <EditPlaylist playlist={editPlaylist} videos={videos} close={() => setEditPlaylist()} />}
      {readPlaylist && <ReadPlaylist playlist={readPlaylist} videos={videos} close={() => setReadPlaylist()} />}
      {!editPlaylist && !readPlaylist && <KuneTable columns={columns} rows={playlists} />}
    </div>
  );
}

export default PlayList;
