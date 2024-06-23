import { useContext, useState, useEffect } from 'react';
import { VideoContext } from '../../global-context';
import EditIcon from '../../assets/svg/edit-icon';
import DeleteIcon from '../../assets/svg/delete-icon';
import IconButton from '../../components/icon-button';
import AddIcon from '../../assets/svg/add-icon';
import EditVideo from '../../components/edit-video';
import axiosCustom from '../../tools/axiosCustom';
import { toast } from 'react-toastify';
import { getMedia } from '../../tools/input-tools';
import KuneTable from '../../components/kune-table';

function VideoList() {
  const [editVideo, setEditVideo] = useState();
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
    {
      label: 'Code',
      render: (item) => (
        <a href={`https://www.youtube.com/watch?v=${item.code}`} target="_blank">
          {item.code}
        </a>
      )
    },
    {
      label: 'Miniature',
      render: (item) => <img src={`https://img.youtube.com/vi/${item.code}/default.jpg`} />,
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
        </div>
      )
    }
  ];

  if (media !== 'pc') {
    columns = columns.filter((c) => !['Debut', 'Fin', 'Code'].includes(c.label));
  }

  return (
    <div id="video" className="basic-page">
      {editVideo ? (
        <EditVideo video={editVideo} close={() => setEditVideo()} />
      ) : (
        <KuneTable rows={videos} columns={columns} />
      )}
    </div>
  );
}

export default VideoList;
