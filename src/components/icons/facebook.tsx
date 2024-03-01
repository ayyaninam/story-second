const Facebook = ({
	size,
	fill = "none",
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
			viewBox="0 0 24 24"
			fill={fill}
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
			className="feather feather-facebook"
		>
			<path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
		</svg>
	);
};

export default Facebook;
