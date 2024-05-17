import React from 'react';

interface LibraryIconProps {
  size?: number;
  height?: number;
  width?: number;
  fill?: string;
  pathFill?: string;
}

const LibraryIcon: React.FC<LibraryIconProps> = ({
  size = 44,
  height,
  width,
  fill = "#157A6E",
  pathFill = "white"
}) => {
  const computedHeight = height || size;
  const computedWidth = width || size;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={computedWidth}
      height={computedHeight}
      viewBox="0 0 44 44"
      fill="none"
    >
      <g filter="url(#filter0_d_1776_16331)">
        <g filter="url(#filter1_di_1776_16331)">
          <rect x="2" y="2" width="40" height="40" rx="10" fill={fill} />
          <rect x="2" y="2" width="40" height="40" rx="10" fill="url(#paint0_linear_1776_16331)" />
        </g>
        <mask id="mask0_1776_16331" style={{ maskType: 'alpha' }} maskUnits="userSpaceOnUse" x="4" y="4" width="36" height="36">
          <circle cx="22" cy="22" r="17.5" fill="url(#paint1_linear_1776_16331)" />
        </mask>
        <g mask="url(#mask0_1776_16331)">
          <g filter="url(#filter2_di_1776_16331)">
            <circle cx="22" cy="22" r="17.5" fill="#042F2E" />
            <circle cx="22" cy="22" r="17.25" stroke="url(#paint2_linear_1776_16331)" strokeWidth="0.5" />
          </g>
          <path
            d="M30.7831 16.4409H13.2169C13.0599 16.4409 12.9093 16.5033 12.7984 16.6143C12.6874 16.7253 12.625 16.8758 12.625 17.0328V29.4381C12.625 29.595 12.6874 29.7456 12.7984 29.8566C12.9093 29.9676 13.0599 30.0299 13.2169 30.0299H30.7831C30.9401 30.0299 31.0907 29.9676 31.2017 29.8566C31.3126 29.7456 31.375 29.595 31.375 29.4381V17.0328C31.375 16.8758 31.3126 16.7253 31.2017 16.6143C31.0907 16.5033 30.9401 16.4409 30.7831 16.4409ZM24.8409 23.7563L20.3191 26.3841C20.2283 26.4395 20.1242 26.4693 20.0178 26.4705C19.9114 26.4717 19.8067 26.4442 19.7146 26.3909C19.6226 26.3376 19.5466 26.2604 19.4946 26.1676C19.4427 26.0747 19.4167 25.9696 19.4195 25.8633V20.6076C19.4167 20.5012 19.4427 20.3961 19.4946 20.3033C19.5466 20.2104 19.6226 20.1333 19.7146 20.08C19.8067 20.0267 19.9114 19.9992 20.0178 20.0004C20.1242 20.0015 20.2283 20.0314 20.3191 20.0868L24.8409 22.7383C24.9292 22.7907 25.0024 22.8652 25.0532 22.9544C25.104 23.0436 25.1307 23.1446 25.1307 23.2473C25.1307 23.35 25.104 23.4509 25.0532 23.5401C25.0024 23.6294 24.9292 23.7039 24.8409 23.7563Z"
            fill={pathFill}
          />
          <path
            d="M28.7744 13.9552H15.209C14.8822 13.9552 14.6172 14.2202 14.6172 14.5471C14.6172 14.8739 14.8822 15.1389 15.209 15.1389H28.7744C29.1013 15.1389 29.3662 14.8739 29.3662 14.5471C29.3662 14.2202 29.1013 13.9552 28.7744 13.9552Z"
            fill={pathFill}
          />
          <path
            d="M26.8088 11.4694H17.2208C16.8939 11.4694 16.6289 11.7343 16.6289 12.0612C16.6289 12.3881 16.8939 12.6531 17.2208 12.6531H26.8088C27.1357 12.6531 27.4007 12.3881 27.4007 12.0612C27.4007 11.7343 27.1357 11.4694 26.8088 11.4694Z"
            fill={pathFill}
          />
        </g>
      </g>
      <defs>
        <filter
          id="filter0_d_1776_16331"
          x="0.75"
          y="1.375"
          width="42.5"
          height="42.5"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy="0.625" />
          <feGaussianBlur stdDeviation="0.625" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0.121569 0 0 0 0 0.639216 0 0 0 0 0.576471 0 0 0 1 0"
          />
          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_1776_16331" />
          <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_1776_16331" result="shape" />
        </filter>
        <filter
          id="filter1_di_1776_16331"
          x="1"
          y="1"
          width="42"
          height="42"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feMorphology radius="1" operator="dilate" in="SourceAlpha" result="effect1_dropShadow_1776_16331" />
          <feOffset />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0.121569 0 0 0 0 0.639216 0 0 0 0 0.576471 0 0 0 1 0"
          />
          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_1776_16331" />
          <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_1776_16331" result="shape" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy="-1" />
          <feGaussianBlur stdDeviation="6" />
          <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.12 0"
          />
          <feBlend mode="normal" in2="shape" result="effect2_innerShadow_1776_16331" />
        </filter>
        <filter
          id="filter2_di_1776_16331"
          x="4.5"
          y="4.5"
          width="35"
          height="35.3125"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy="0.3125" />
          <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.53 0" />
          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_1776_16331" />
          <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_1776_16331" result="shape" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy="0.3125" />
          <feGaussianBlur stdDeviation="0.625" />
          <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
          <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
          <feBlend mode="normal" in2="shape" result="effect2_innerShadow_1776_16331" />
        </filter>
        <linearGradient
          id="paint0_linear_1776_16331"
          x1="22"
          y1="2"
          x2="22"
          y2="42"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="white" stopOpacity="0.12" />
          <stop offset="1" stopColor="white" stopOpacity="0" />
        </linearGradient>
        <linearGradient
          id="paint1_linear_1776_16331"
          x1="28.9079"
          y1="7.95395"
          x2="22"
          y2="39.5"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#6060A6" />
          <stop offset="1" stopColor="#F0D2FC" />
        </linearGradient>
        <linearGradient
          id="paint2_linear_1776_16331"
          x1="22"
          y1="4.5"
          x2="22"
          y2="39.5"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#042F2E" />
          <stop offset="1" stopColor="#9FEAE1" />
        </linearGradient>
      </defs>
    </svg>
  );
};

export default LibraryIcon;
