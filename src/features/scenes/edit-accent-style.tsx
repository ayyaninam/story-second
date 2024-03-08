import React from "react";

const EditAccentStyles = () => {
	return (
		<style jsx global>{`
			:root {
				--menu-item-border-color: rgba(122, 255, 180, 0.2);
				--menu-item-selected-background-color: radial-gradient(
					88.31% 100% at 0% 50%,
					rgba(48, 149, 136, 0.5) 25.5%,
					rgba(48, 149, 136, 0) 100%
				);
				--menu-item-selected-border-color: rgba(56, 142, 131, 0.2);
				--stepper-box-shadow: 0px 4px 4px 0px rgba(122, 255, 133, 0.4);

				--accent-color-50: #faf5ff;
				--accent-color-100: #f3e8ff;
				--accent-color-200: #e9d5ff;
				--accent-color-300: #d8b4fe;
				--accent-color-400: #c084fc;
				--accent-color-500: #a855f7;
				--accent-color-600: #9333ea;
				--accent-color-700: #7e22ce;
				--accent-color-800: #6b21a8;
				--accent-color-900: #581c87;
				--accent-color-950: #3b0764;

				// TODO: Remove this once we have a better solution for showing the intercom launcher
				.intercom-launcher {
					display: none;
				}
			}
		`}</style>
	);
};

export default EditAccentStyles;
