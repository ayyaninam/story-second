import React from "react";

const FeedAccentStyle = () => {
	return (
		<style jsx global>{`
			:root {
				--menu-item-border-color: rgba(122, 255, 180, 0.2);
				--menu-item-selected-background-color: radial-gradient(
					88.31% 100% at 0% 50%,
					rgba(102, 129, 255, 0.5) 25.5%,
					rgba(102, 129, 255, 0) 100%
				);
				--menu-item-selected-border-color: rgba(56, 142, 131, 0.2);
				--stepper-box-shadow: 0px 4px 4px 0px rgba(122, 255, 133, 0.4);

				--accent-color-50: #334155;
				--accent-color-100: #e0e7ff;
				--accent-color-200: #c7d2fe;
				--accent-color-300: #a5b4fc;
				--accent-color-400: #818cf8;
				--accent-color-500: #6366f1;
				--accent-color-600: #4f46e5;
				--accent-color-700: #4338ca;
				--accent-color-800: #3730a3;
				--accent-color-900: #312e81;
				--accent-color-950: #1e1b4b;
			}
		`}</style>
	);
};

export default FeedAccentStyle;
