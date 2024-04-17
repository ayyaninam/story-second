export default function CheckedCheckBox() {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="20"
			height="20"
			viewBox="0 0 20 20"
			fill="none"
		>
			<g filter="url(#filter0_d_3836_25097)">
				<path
					d="M2 5C2 2.79086 3.79086 1 6 1H14C16.2091 1 18 2.79086 18 5V13C18 15.2091 16.2091 17 14 17H6C3.79086 17 2 15.2091 2 13V5Z"
					fill="#A734EA"
				/>
			</g>
			<path
				d="M6 8.28571L8.91667 12L14 6"
				stroke="white"
				strokeWidth="1.5"
				stroke-linejoin="round"
			/>
			<defs>
				<filter
					id="filter0_d_3836_25097"
					x="0"
					y="0"
					width="20"
					height="20"
					filterUnits="userSpaceOnUse"
					color-interpolation-filters="sRGB"
				>
					<feFlood floodOpacity="0" result="BackgroundImageFix" />
					<feColorMatrix
						in="SourceAlpha"
						type="matrix"
						values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
						result="hardAlpha"
					/>
					<feOffset dy="1" />
					<feGaussianBlur stdDeviation="1" />
					<feComposite in2="hardAlpha" operator="out" />
					<feColorMatrix
						type="matrix"
						values="0 0 0 0 0.0784314 0 0 0 0 0.0823529 0 0 0 0 0.101961 0 0 0 0.05 0"
					/>
					<feBlend
						mode="normal"
						in2="BackgroundImageFix"
						result="effect1_dropShadow_3836_25097"
					/>
					<feBlend
						mode="normal"
						in="SourceGraphic"
						in2="effect1_dropShadow_3836_25097"
						result="shape"
					/>
				</filter>
			</defs>
		</svg>
	);
}
