import { useContext, useState, useEffect } from 'react';
import { VideoContext } from '../../global-context';
import EditIcon from '../../assets/svg/edit-icon';
import DeleteIcon from '../../assets/svg/delete-icon';
import IconButton from '../../components/icon-button';
import AddIcon from '../../assets/svg/add-icon';
import EditVideo from '../../components/edit-video';
import axiosCustom from '../../tools/axiosCustom';
import { toast } from 'react-toastify';
import { extractParamFromUrl, getMedia } from '../../tools/input-tools';
import KuneTable from '../../components/kune-table';
import ImportIcon from '../../assets/svg/import-icon';

function VideoList() {
  const [editVideo, setEditVideo] = useState();
  const [importPlaylist, setImportPlaylist] = useState();
  const [importSummary, setImportSummary] = useState();
  const { videos, setVideos } = useContext(VideoContext);
  const media = getMedia();

  useEffect(() => {
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

  function deleteVideo(vid) {
    axiosCustom
      .delete(`/videos/${vid?.id}`)
      .then((res) => {
        toast.success('vidéo supprimée');
        const newVideos = [...videos].filter((v) => v.id !== vid.id);
        setVideos(newVideos);
      })
      .catch((err) => {
        toast.error('erreur de suppression');
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

  let columns = [
    { label: 'Nom', name: 'title' },
    { label: 'Artist', name: 'artist' },
    { label: 'Type', name: 'type' },
    {
      label: 'Année',
      name: 'date',
      render: (item) =>
        item?.date?.includes && item?.date?.includes('-') && item.date.split ? item?.date?.split('-')[0] : ''
    },
    {
      label: 'Video',
      render: (item) => (
        <a href={`https://www.youtube.com/watch?v=${item.code}`} target="_blank">
          <img src={`https://img.youtube.com/vi/${item.code}/default.jpg`} />
        </a>
      ),
      style: { padding: 0 }
    },
    { label: 'Debut', name: 'startGuess' },
    { label: 'Fin', name: 'endGuess' },
    {
      label: 'Actions',
      name: 'title',
      render: (item) => displayActions(item),
      headerRender: () => (
        <div className="action">
          Actions
          <IconButton icon={<AddIcon />} onClick={() => setEditVideo({})} />
          <IconButton icon={<ImportIcon />} onClick={() => setImportPlaylist({})} />
        </div>
      )
    }
  ];

  if (media !== 'pc') {
    columns = columns.filter((c) => !['Debut', 'Fin', 'Code'].includes(c.label));
  }

  function loadSummary(id) {
    axiosCustom
      .get(`/playlists/youtube/${id}`)
      .then((res) => {
        setImportSummary(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  }

  function importBulkVideos(_videos) {
    axiosCustom
      .post(`/videos/addBulk`, _videos?.map ? _videos.map((v) => ({ title: v.title, code: v.videoId })) : [])
      .then((res) => {
        const newVideoList = [...videos];
        res.data.forEach((v) => newVideoList.push(v));
        console.log('res.data', res.data);
        console.log('newVideoList', newVideoList);
        setVideos(newVideoList);
      })
      .catch((err) => {
        console.error(err);
      });
  }

  return (
    <div id="video" className="basic-page">
      {editVideo && <EditVideo video={editVideo} close={() => setEditVideo()} />}
      {importPlaylist && (
        <div>
          <form>
            <h3>Importer des vidéos depuis une playlist youtube</h3>
            <div style={{ width: '100%' }}>
              <label htmlFor="playlistid">URL</label>
              <input
                id="playlistid"
                name="playlistid"
                placeholder="Playlist youtube à importer"
                value={importPlaylist && typeof importPlaylist === 'string' ? importPlaylist : ''}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val) {
                    const params = extractParamFromUrl(val);
                    if (params?.list) {
                      setImportPlaylist(params.list);
                    }
                  }
                }}
              />
            </div>
            <button
              className="outlined"
              onClick={(e) => {
                setImportPlaylist(undefined);
                e.preventDefault();
              }}
            >
              Annuler
            </button>
            <button
              onClick={(e) => {
                loadSummary(importPlaylist);
                setImportPlaylist(undefined);
                setImportSummary([]);
                e.preventDefault();
              }}
            >
              Importer
            </button>
          </form>
        </div>
      )}
      {importSummary && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h2>{`${importSummary.length} vidéos`}</h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
            {importSummary.map((i) => (
              <div
                style={{
                  width: '20%',
                  minWidth: '200px',
                  background: 'rgb(var(--bg-color-2nd))',
                  borderRadius: '10px',
                  padding: '1rem'
                }}
              >
                <p>{i.title}</p>
                <p>
                  <img src={`https://img.youtube.com/vi/${i.videoId}/default.jpg`} />
                </p>
              </div>
            ))}
          </div>
          <button
            className="outlined"
            onClick={(e) => {
              setImportSummary(undefined);
              e.preventDefault();
            }}
          >
            Annuler
          </button>
          <button
            onClick={(e) => {
              importBulkVideos(importSummary);
              setImportSummary(undefined);
              e.preventDefault();
            }}
          >
            Importer
          </button>
        </div>
      )}
      {!editVideo && !importPlaylist && !importSummary && <KuneTable rows={videos} columns={columns} />}
    </div>
  );
}

export default VideoList;
