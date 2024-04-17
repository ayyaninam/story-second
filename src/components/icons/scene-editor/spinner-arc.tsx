import React from "react";

function SpinnerArc({ width = 43, height = 43 }) {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width={width}
			height={height}
			viewBox="0 0 43 43"
			fill="none"
		>
			<path
				d="M41.8359 21.251C41.8357 25.4745 40.4985 29.5896 38.0158 33.0064C35.5331 36.4232 32.0325 38.9663 28.0157 40.2713C23.9988 41.5763 19.6719 41.5762 15.6551 40.271C11.6384 38.9657 8.13789 36.4224 5.65541 33.0055C3.17294 29.5885 1.83591 25.4734 1.83594 21.2499C1.83597 17.0263 3.17306 12.9112 5.65558 9.49431C8.13811 6.0774 11.6386 3.53411 15.6554 2.22893C19.6722 0.923748 23.9991 0.923689 28.0159 2.22876"
				stroke="url(#paint0_angular_4312_29372)"
				strokeWidth="2"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
			<defs>
				<radialGradient
					id="paint0_angular_4312_29372"
					cx="0"
					cy="0"
					r="1"
					gradientUnits="userSpaceOnUse"
					gradientTransform="translate(21.8359 21.25) rotate(-63.4349) scale(22.3607)"
				>
					<stop stopColor="#A734EA" />
					<stop offset="1" stopColor="#A734EA" stopOpacity="0" />
				</radialGradient>
			</defs>
		</svg>
	);
}

export default SpinnerArc;
