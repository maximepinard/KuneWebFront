import SelectCustom from './select';

function SelectingVideo({ videos, addVideo }) {
  function handleSave(value) {
    addVideo(parseInt(value));
  }

  const options = videos.map((v) => ({
    id: v.id,
    label: `${v.title} - ${v.artist}`,
    image: `https://img.youtube.com/vi/${v.code}/default.jpg`
  }));

  return <SelectCustom options={options} setValue={handleSave} />;
}

export default SelectingVideo;
