import SelectCustom from './select';

function SelectingVideo({ videos, addVideo }) {
  function handleSave(value) {
    addVideo(parseInt(value));
  }

  const options = videos.map((v) => ({
    id: v.id,
    label: `${v.title} - ${v.artist}`,
    code: v.code
  }));

  return <SelectCustom options={options} setValue={handleSave} />;
}

export default SelectingVideo;
