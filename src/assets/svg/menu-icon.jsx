function MenuIcon({ props }) {
  return (
    <svg {...props} focusable="false" aria-hidden="true" viewBox="0 0 24 24" width={24} height={24}>
      <path fill="currentColor" d="M3 18h18v-2H3zm0-5h18v-2H3zm0-7v2h18V6z"></path>
    </svg>
  );
}

export default MenuIcon;
