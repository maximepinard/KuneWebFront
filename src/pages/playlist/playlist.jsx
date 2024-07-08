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
import ViewIcon from '../../assets/svg/view-icon';

function PlayList() {
  const [editPlaylist, setEditPlaylist] = useState();
  const [readPlaylist, setReadPlaylist] = useState();
  const [list, setList] = useState('mine');
  const { game, user } = useContext(AuthContext);
  const { playlists, videos, setVideos, setPlaylists } = useContext(VideoContext);

  useEffect(() => {
    axiosCustom
      .get('/playlists/full')
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
        {list === 'mine' && <IconButton icon={<EditIcon />} onClick={() => setEditPlaylist(play)} />}
        {list === 'mine' && <IconButton icon={<DeleteIcon />} onClick={() => deletePlaylist(play)} />}
        {list === 'public' && <IconButton icon={<ViewIcon />} onClick={() => setEditPlaylist(play)} />}
        <IconButton icon={<PlayIcon />} onClick={() => setReadPlaylist(play)} />
      </div>
    );
  }

  const columns = [
    { label: 'Nom', name: 'name' },
    { label: 'Créateur', render: (item) => item?.user?.login },
    {
      label: 'Type',
      render: (item) => {
        const content_types = new Set(item?.contentPlaylists?.map((c) => c.content_type) || []);
        const typesArray = Array.from(content_types);
        return typesArray.length > 1 ? 'mix' : typesArray[0];
      }
    },
    { label: 'Éléments', render: (item) => item?.contentPlaylists?.length },
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

  const filteredPlaylists =
    list === 'mine' ? playlists.filter((p) => !p.public || p.user_id === user.id) : playlists.filter((p) => p.public);

  return (
    <div id="playlist" className="basic-page">
      {editPlaylist && (
        <EditPlaylist
          playlist={editPlaylist}
          readOnly={list === 'public'}
          videos={videos}
          close={() => setEditPlaylist()}
        />
      )}
      {readPlaylist && <ReadPlaylist playlist={readPlaylist} close={() => setReadPlaylist()} />}
      {!editPlaylist && !readPlaylist && (
        <>
          <div style={{ display: 'flex', gap: '1rem', paddingBottom: '1rem' }}>
            <button className={list === 'mine' ? 'contained' : 'outlined'} onClick={() => setList('mine')}>
              Mes Playlists
            </button>
            <button className={list === 'public' ? 'contained' : 'outlined'} onClick={() => setList('public')}>
              Playlists publiques
            </button>
            {list === 'public' && (
              <IconButton
                icon={<PlayIcon />}
                onClick={() => {
                  let count = 0;
                  const newPlaylist = { name: 'Public', contentPlaylists: [] };
                  playlists.forEach &&
                    playlists.forEach((p) => {
                      p?.contentPlaylists?.sort &&
                        p.contentPlaylists
                          ?.sort((a, b) => a.order_num - b.order_num)
                          ?.forEach((c) => {
                            newPlaylist.contentPlaylists.push({ ...c, order_num: count });
                            count++;
                          });
                    });
                  setReadPlaylist(newPlaylist);
                }}
              />
            )}
          </div>
          <KuneTable columns={columns} rows={filteredPlaylists} />
        </>
      )}
    </div>
  );
}

export default PlayList;
