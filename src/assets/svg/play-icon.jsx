function PlayIcon({ props }) {
  return (
    <svg
      {...props}
      focusable="false"
      aria-hidden="true"
      viewBox="0 0 24 24"
      width={24}
      height={24}
    >
      <path fill="currentColor" d="M8 5v14l11-7z"></path>
    </svg>
  );
}

export default PlayIcon;
