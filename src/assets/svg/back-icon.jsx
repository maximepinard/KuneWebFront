function BackIcon({ props }) {
  return (
    <svg {...props} focusable="false" aria-hidden="true" viewBox="0 0 24 24" width={24} height={24}>
      <path fill="currentColor" d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20z"></path>
    </svg>
  );
}

export default BackIcon;
