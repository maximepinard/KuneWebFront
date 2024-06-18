import '../assets/css/icon-button.css';

function IconButton({ icon, ...props }) {
  return (
    <button
      className="icon"
      style={{
        ...props?.style
      }}
      {...props}
    >
      {icon}
    </button>
  );
}

export default IconButton;
