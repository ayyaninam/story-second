import React from "react";
import StoryLogo from "../../../../public/auth-prompt/story-logo";

export const LandingSubmitButton: React.FC = () => {
	return (
		<button type="submit" className="flex flex-nowrap prompt-default-button">
			<StoryLogo />

			<span>Generate</span>
			<svg
				width="16"
				height="16"
				viewBox="0 0 16 16"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
			>
				<g opacity="0.5">
					<path
						d="M3.3335 8H12.6668"
						stroke="#F8FAFC"
						stroke-width="0.866667"
						stroke-linecap="round"
						stroke-linejoin="round"
					/>
					<path
						d="M8 3.33333L12.6667 8L8 12.6667"
						stroke="#F8FAFC"
						stroke-width="0.866667"
						stroke-linecap="round"
						stroke-linejoin="round"
					/>
				</g>
			</svg>
		</button>
	);
};
