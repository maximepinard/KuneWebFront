import '../assets/css/switch.css';

function Switch({ label, value, setValue }) {
  return (
    <div className="switch-wrap" onClick={setValue}>
      <span>{label}</span>
      <div className={`switch ${value ? 'active' : ''}`}>
        <div className="switch-disc"></div>
      </div>
    </div>
  );
}

export default Switch;
