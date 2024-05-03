const X = ({
	size,
	fill,
	width,
	height,
}: {
	size: number;
	fill?: string;
	width?: number;
	height?: number;
}) => {
	if (!width && !height) {
		width = size;
		height = size;
	}
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width={width}
			height={height}
			viewBox="0 0 19 18"
			fill={fill}
		>
			<path
				d="M11.1734 7.6215L17.7307 0H16.1767L10.4834 6.618L5.93541 0H0.691406L7.56816 10.0072L0.691406 18H2.24541L8.2574 11.0115L13.0604 18H18.3052L11.1734 7.6215ZM9.04565 10.0958L8.34815 9.099L2.80641 1.17H5.19291L9.6659 7.569L10.3634 8.56575L16.1782 16.8832H13.7917L9.04565 10.0958Z"
				fill="white"
			/>
		</svg>
	);
};

export default X;