import { useState, useContext } from 'react';
import { toast } from 'react-toastify';
import axiosCustom from '../tools/axiosCustom';
import '../assets/css/edit.css';
import { VideoContext } from '../global-context';
import CustomField from './CustomField';

const getInputFields = () => [
  { name: 'title', label: 'Title', placeholder: 'Entrer titre', type: 'text' },
  {
    name: 'artist',
    label: 'Artist',
    placeholder: `Nom de l'artist`,
    type: 'text'
  },
  { name: 'code', label: 'Code', placeholder: 'Entrer code', type: 'text' },
  {
    name: 'date',
    label: 'Date',
    placeholder: 'Date du média',
    type: 'date'
  },
  {
    name: 'startGuess',
    label: 'De',
    placeholder: 'Timestamp en s',
    type: 'number'
  },
  {
    name: 'endGuess',
    label: 'À',
    placeholder: 'Timestamp en s',
    type: 'number'
  },
  {
    name: 'startReveal',
    label: 'De',
    placeholder: 'Timestamp en s',
    type: 'number'
  },
  {
    name: 'endReveal',
    label: 'À',
    placeholder: 'Timestamp en s',
    type: 'number'
  },
  {
    name: 'type',
    label: 'Type',
    placeholder: 'Type de média',
    type: 'select',
    options: []
  }
];

function EditVideo({ video, close }) {
  const { videos, setVideos } = useContext(VideoContext);
  const [editVideo, setEditVideo] = useState({ ...video });
  const [lock, setLock] = useState();

  async function onSubmit(e) {
    e.preventDefault(); // Prevent the default form submission
    if (lock) {
      return;
    }

    setLock(true);
    const toastId = toast.loading('Enregistrement');
    const axiosMethod = (body) =>
      video?.id ? axiosCustom.patch(`/videos/${video.id}`, body) : axiosCustom.post(`/videos`, body);
    try {
      const res = await axiosMethod(editVideo);
      toast.update(toastId, {
        type: 'success',
        render: 'Réussi',
        isLoading: false,
        closeOnClick: true,
        autoClose: 2000
      });
      if (video?.id) {
        const newVideos = [...videos].filter((v) => v.id !== video.id);
        setVideos([...newVideos, res.data]);
      } else {
        setVideos([...videos, res.data]);
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
        {getInputFields().map((field, index) => (
          <div key={index}>
            <label htmlFor={field.name}>{field.label}</label>
            <CustomField field={field} data={editVideo} setData={setEditVideo} />
          </div>
        ))}
        <div className="form-actions">
          <button type="reset" onClick={close} className="outlined">
            Annuler
          </button>
          <button type="submit" disabled={lock}>
            Sauvegarder
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditVideo;
