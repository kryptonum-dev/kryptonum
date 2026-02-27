export function Logo() {
  return (
    <svg fill="none" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M20.762 16a5.88 5.88 0 0 1-1.039 3.325 6.299 6.299 0 0 1-2.776 2.241v10.218h-5.088v-10.22a6.294 6.294 0 0 1-2.777-2.24A5.875 5.875 0 0 1 8.043 16c0-1.181.361-2.337 1.039-3.325a6.294 6.294 0 0 1 2.777-2.239V.215h5.088v10.217a6.296 6.296 0 0 1 2.777 2.24A5.877 5.877 0 0 1 20.762 16Z"
        fill="url(#logoGradientA)"
      />
      <path
        d="M29.892 0v7.285l-5.313 5.072-2.543-2.428-1.638 1.563c-.373-.451-.8-.859-1.273-1.215L29.892 0Z"
        fill="url(#logoGradientB)"
      />
      <path
        d="m24.581 19.64 5.314 5.073v7.285L19.129 21.721c.472-.355.9-.763 1.272-1.214l1.637 1.562 2.543-2.428Z"
        fill="url(#logoGradientC)"
      />
      <path
        d="M6.772 16.002a7.037 7.037 0 0 0 1.636 4.507l-6.724 6.42v-7.285l2.544-2.428v-2.429L1.684 12.36V5.074l6.724 6.42a7.036 7.036 0 0 0-1.636 4.508Z"
        fill="#F0F7F7"
      />
      <defs>
        <linearGradient id="logoGradientA" gradientUnits="userSpaceOnUse" x1="20.524" x2="7.242" y1=".215" y2=".556">
          <stop stopColor="#2DD282" />
          <stop offset="1" stopColor="#90F4E8" />
        </linearGradient>
        <linearGradient id="logoGradientB" gradientUnits="userSpaceOnUse" x1="29.691" x2="18.474" y1="0" y2=".623">
          <stop stopColor="#2DD282" />
          <stop offset="1" stopColor="#90F4E8" />
        </linearGradient>
        <linearGradient id="logoGradientC" gradientUnits="userSpaceOnUse" x1="29.693" x2="18.478" y1="19.641" y2="20.263">
          <stop stopColor="#2DD282" />
          <stop offset="1" stopColor="#90F4E8" />
        </linearGradient>
      </defs>
    </svg>
  );
}
