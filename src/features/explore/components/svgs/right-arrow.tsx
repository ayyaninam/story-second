// components/svgs/right-arrow.tsx

import React from "react";

const RightArrow = ({ fill = 'white', fill_opacity = "1" }) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M10.7817 7.33312L7.20566 3.75712L8.14833 2.81445L13.3337 7.99979L8.14833 13.1851L7.20566 12.2425L10.7817 8.66645H2.66699V7.33312H10.7817Z"
      fill={fill}
      fillOpacity={fill_opacity}
    />
  </svg>
);

export default RightArrow;
