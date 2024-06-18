function PauseIcon({ props }) {
  return (
    <svg {...props} focusable="false" aria-hidden="true" viewBox="0 0 24 24" width={24} height={24}>
      <path fill="currentColor" d="M6 19h4V5H6zm8-14v14h4V5z"></path>
    </svg>
  );
}

export default PauseIcon;
