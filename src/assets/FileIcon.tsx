import React from "react";

const FileIcon = () => (
  <svg
    id="Layer_2"
    width="1em"
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    viewBox="0 0 834.48 1123.12"
  >
    <defs>
      <style>{`.cls-1{fill:url(#linear-gradient-2);}.cls-2{fill:#ddd;filter:url(#drop-shadow-1);}.cls-3{fill:url(#linear-gradient-3);}.cls-4{fill:url(#linear-gradient);}.cls-5{fill:url(#linear-gradient-4);}.cls-6{fill:#f2f2f2;}`}</style>
      <filter id="drop-shadow-1" filterUnits="userSpaceOnUse">
        <feOffset dx="-3" dy="2" />
        <feGaussianBlur result="blur" stdDeviation="2" />
        <feFlood floodColor="#5b5b5b" floodOpacity=".28" />
        <feComposite in2="blur" operator="in" />
        <feComposite in="SourceGraphic" />
      </filter>
      <linearGradient
        id="linear-gradient"
        x1="207.12"
        y1="563.77"
        x2="622.89"
        y2="563.77"
        gradientTransform="matrix(1, 0, 0, 1, 0, 0)"
        gradientUnits="userSpaceOnUse"
      >
        <stop offset="0" stopColor="#4e7bff" />
        <stop offset="1" stopColor="#343deb" />
      </linearGradient>
      <linearGradient
        id="linear-gradient-2"
        x1="310.39"
        y1="562.01"
        x2="519.62"
        y2="562.01"
        gradientTransform="matrix(1, 0, 0, 1, 0, 0)"
        gradientUnits="userSpaceOnUse"
      >
        <stop offset="0" stopColor="#eef9ff" />
        <stop offset="1" stopColor="#fff" />
      </linearGradient>
      <linearGradient
        id="linear-gradient-3"
        x1="360.96"
        y1="559.39"
        x2="483.02"
        y2="559.39"
        xlinkHref="#linear-gradient"
      />
      <linearGradient
        id="linear-gradient-4"
        x1="489.11"
        y1="436.84"
        x2="525.78"
        y2="436.84"
        xlinkHref="#linear-gradient-2"
      />
    </defs>
    <g id="Layer_1-2">
      <polygon
        className="cls-6"
        points="830.01 248.11 830.01 1123.12 0 1123.12 0 4.43 588.68 4.43 830.01 248.11"
      />
      <polygon
        className="cls-2"
        points="831.19 248.11 587.5 248.11 587.5 4.43 831.19 248.11"
      />
      <g>
        <circle className="cls-4" cx="415" cy="563.77" r="207.88" />
        <circle className="cls-1" cx="415" cy="562.01" r="104.62" />
        <path
          className="cls-3"
          d="M472.8,542.38c13.63,7.41,13.63,26.6,0,34.02l-82.31,44.76c-13.25,7.21-29.53-2.17-29.53-17.01v-89.52c0-14.84,16.28-24.21,29.53-17.01l82.31,44.76Z"
        />
        <circle className="cls-5" cx="507.44" cy="436.84" r="18.34" />
      </g>
    </g>
  </svg>
);

export default FileIcon;
