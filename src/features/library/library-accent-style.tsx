import React from "react";

const LibraryAccentStyle = () => {
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

				--accent-color-50: #f0fdfa;
				--accent-color-100: #ccfbf1;
				--accent-color-200: #99f6e4;
				--accent-color-300: #5eead4;
				--accent-color-400: #2dd4bf;
				--accent-color-500: #14b8a6;
				--accent-color-600: #0d9488;
				--accent-color-700: #0f766e;
				--accent-color-800: #115e59;
				--accent-color-900: #134e4a;
				--accent-color-950: #042f2e;
			}
		`}</style>
	);
};

export default LibraryAccentStyle;
