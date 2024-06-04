import { useState, useContext } from "react";
import { toast } from "react-toastify";
import axiosCustom from "../tools/axiosCustom";
import "../assets/css/edit.css";
import { VideoContext } from "../global-context";

const inputFields = [
  { name: "title", label: "Title", placeholder: "Enter title", type: "text" },
  {
    name: "artist",
    label: "Artist",
    placeholder: "Enter artist",
    type: "text",
  },
  { name: "code", label: "Code", placeholder: "Enter code", type: "text" },
  {
    name: "startGuess",
    label: "Start Guess",
    placeholder: "Enter start guess",
    type: "number",
  },
  {
    name: "endGuess",
    label: "End Guess",
    placeholder: "Enter end guess",
    type: "number",
  },
  {
    name: "startReveal",
    label: "Start Reveal",
    placeholder: "Enter start reveal",
    type: "number",
  },
  {
    name: "endReveal",
    label: "End Reveal",
    placeholder: "Enter end reveal",
    type: "number",
  },
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
    const toastId = toast.loading("Enregistrement");
    const axiosMethod = (body) =>
      video?.id
        ? axiosCustom.patch(`/videos/${video.id}`, body)
        : axiosCustom.post(`/videos`, body);
    try {
      const res = await axiosMethod(editVideo);
      toast.update(toastId, {
        type: "success",
        render: "Réussi",
        isLoading: false,
        closeOnClick: true,
        autoClose: 2000,
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
        type: "error",
        render: "Échoué",
        isLoading: false,
        closeOnClick: true,
        autoClose: 2000,
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
              value={editVideo?.[field.name]}
              placeholder={field.placeholder}
              type={field.type}
              onChange={(e) =>
                setEditVideo({ ...editVideo, [field.name]: e.target.value })
              }
            />
          </div>
        ))}
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

export default EditVideo;
