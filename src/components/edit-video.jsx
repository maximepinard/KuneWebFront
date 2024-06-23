import { useState, useContext } from "react";
import { toast } from "react-toastify";
import axiosCustom from "../tools/axiosCustom";
import { VideoContext } from "../global-context";
import CustomField from "./CustomField";
import {
  convertIntegerToTime,
  convertTimeToInteger,
  extractParamFromUrl,
} from "../tools/input-tools";
import NewVideoPlayer from "./new-video-player";

import "../assets/css/edit.css";

const getInputFields = () => [
  { name: "title", label: "Title", placeholder: "Entrer titre", type: "text" },
  {
    name: "artist",
    label: "Artist",
    placeholder: `Nom de l'artist`,
    type: "text",
  },
  {
    name: "code",
    label: "Code",
    placeholder: "Entrer code",
    type: "text",
    formatOutput: (val) => {
      const res = extractParamFromUrl(val);
      if (res?.v) {
        return res.v;
      } else {
        return val;
      }
    },
  },
  {
    name: "date",
    label: "Date",
    placeholder: "Date du média",
    type: "date",
  },
  {
    InputType: "label-group",
    title: "Deviner",
  },
  {
    name: "startGuess",
    label: "De",
    placeholder: "Timestamp en s",
    type: "time",
    step: 1,
    isValueOnlyDefault: true,
    formatInput: convertIntegerToTime,
    formatOutput: convertTimeToInteger,
  },
  {
    name: "endGuess",
    label: "À",
    placeholder: "Timestamp en s",
    type: "time",
    step: 1,
    isValueOnlyDefault: true,
    formatInput: convertIntegerToTime,
    formatOutput: convertTimeToInteger,
  },
  {
    InputType: "label-group",
    title: "Révéler",
  },
  {
    name: "startReveal",
    label: "De",
    placeholder: "Timestamp en s",
    type: "time",
    step: 1,
    isValueOnlyDefault: true,
    formatInput: convertIntegerToTime,
    formatOutput: convertTimeToInteger,
  },
  {
    name: "endReveal",
    label: "À",
    placeholder: "Timestamp en s",
    type: "time",
    step: 1,
    isValueOnlyDefault: true,
    formatInput: convertIntegerToTime,
    formatOutput: convertTimeToInteger,
  },
  {
    name: "type",
    label: "Type",
    placeholder: "Type de média",
    type: "select",
    options: [],
  },
];

function EditVideo({ video, close }) {
  const { videos, setVideos } = useContext(VideoContext);
  const [editVideo, setEditVideo] = useState({ ...video });
  const [previewVideo, setPreviewVideo] = useState({ ...video });
  const [preview, setPreview] = useState(0);
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
        const newVideos = [...videos];
        const index = newVideos.findIndex((v) => v.id === video.id);
        if (index > -1) {
          newVideos[index] = res.data;
          setVideos(newVideos);
        }
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

  function handleNext() {
    if (previewVideo.show) {
      setPreviewVideo({
        ...editVideo,
        start: editVideo.startGuess,
        end: editVideo.endGuess,
        show: false,
      });
    } else {
      setPreviewVideo({
        ...editVideo,
        start: editVideo.startReveal,
        end: editVideo.endReveal,
        show: true,
      });
    }
  }

  function handlePrevious() {
    if (previewVideo.show) {
      setPreviewVideo({
        ...editVideo,
        start: editVideo.startGuess,
        end: editVideo.endGuess,
        show: false,
      });
    } else {
      setPreviewVideo({
        ...editVideo,
        start: editVideo.startReveal,
        end: editVideo.endReveal,
        show: true,
      });
    }
  }

  return (
    <div>
      <form onSubmit={onSubmit}>
        {getInputFields().map((field, index) => (
          <div key={index}>
            {field.label && <label htmlFor={field.name}>{field.label}</label>}
            <CustomField
              field={field}
              data={editVideo}
              setData={setEditVideo}
            />
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
        <div className="preview">
          <button
            onClick={(e) => {
              e.preventDefault();
              setPreview(!preview);
              setPreviewVideo({
                ...editVideo,
                start: editVideo.startGuess,
                end: editVideo.endGuess,
                show: false,
              });
            }}
          >
            {!preview ? "Previsualiser" : "Stop"}
          </button>
          {editVideo && editVideo.code && Boolean(preview) && (
            <div style={{ width: 640, height: 360, paddingBottom: "4rem" }}>
              <NewVideoPlayer
                video={previewVideo}
                getNext={handleNext}
                getPrevious={handlePrevious}
                noControls={true}
              />
            </div>
          )}
        </div>
      </form>
    </div>
  );
}

export default EditVideo;
