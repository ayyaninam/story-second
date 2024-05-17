import React from 'react';

interface StoryLogoProps {
  size?: number;
  height?: number;
  width?: number;
  fill?: string;
  pathFill?: string;
}

const StoryLogo: React.FC<StoryLogoProps> = ({
  size = 24,
  height,
  width,
  fill = "white",
  pathFill,
}) => {
  if (!width || !height) {
    width = size;
    height = size;
  }

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 33 32"
      fill="white"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M16.2298 2.46143C16.2333 2.46143 16.2362 2.46424 16.2363 2.46774C16.4589 9.83728 22.3925 15.7709 29.762 15.9935C29.7655 15.9936 29.7683 15.9965 29.7683 16C29.7683 16.0035 29.7655 16.0064 29.762 16.0065C22.3925 16.2291 16.4589 22.1627 16.2363 29.5322C16.2362 29.5357 16.2333 29.5386 16.2298 29.5386C16.2263 29.5386 16.2235 29.5357 16.2234 29.5322C16.0007 22.1627 10.0672 16.2291 2.69772 16.0065C2.69422 16.0064 2.69141 16.0035 2.69141 16C2.69141 15.9965 2.69422 15.9936 2.69772 15.9935C10.0672 15.7709 16.0007 9.83728 16.2234 2.46774C16.2235 2.46424 16.2263 2.46143 16.2298 2.46143ZM19.343 16.5025L15.0144 19.0403C14.9274 19.0937 14.8278 19.1226 14.726 19.1237C14.6241 19.1249 14.5239 19.0983 14.4357 19.0468C14.3476 18.9953 14.2748 18.9209 14.2251 18.8312C14.1754 18.7415 14.1506 18.64 14.1532 18.5373V13.4616C14.1506 13.3589 14.1754 13.2574 14.2251 13.1677C14.2748 13.0781 14.3476 13.0036 14.4357 12.9521C14.5239 12.9006 14.6241 12.8741 14.726 12.8752C14.8278 12.8764 14.9274 12.9052 15.0144 12.9587L19.343 15.5193C19.4276 15.5699 19.4976 15.6419 19.5463 15.7281C19.5949 15.8142 19.6205 15.9117 19.6205 16.0109C19.6205 16.1101 19.5949 16.2075 19.5463 16.2937C19.4976 16.3799 19.4276 16.4518 19.343 16.5025Z"
        fill={pathFill || fill}
      />
    </svg>
  );
};

export default StoryLogo;
