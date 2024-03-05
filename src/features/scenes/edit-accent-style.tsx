import React from "react";

const EditAccentStyles = () => {
  return (
    <style jsx global>{`
				:root {
					--menu-item-border-color: rgba(122, 255, 180, 0.2);
					--menu-item-selected-background-color: radial-gradient(
						88.31% 100% at 0% 50%,
						rgba(48, 149, 136, 0.50) 25.5%,
						rgba(48, 149, 136, 0.00) 100%
					);
					--menu-item-selected-border-color: rgba(56, 142, 131, 0.20);
					--stepper-box-shadow: 0px 4px 4px 0px rgba(122, 255, 133, 0.4);

					--accent-color-50: #FAF5FF;
					--accent-color-100: #F3E8FF;
					--accent-color-200: #E9D5FF;
					--accent-color-300: #D8B4FE;
					--accent-color-400: #C084FC;
					--accent-color-500: #A855F7;
					--accent-color-600: #9333EA;
					--accent-color-700: #7E22CE;
					--accent-color-800: #6B21A8;
					--accent-color-900: #581C87;
					--accent-color-950: #3B0764;
        
          // TODO: Remove this once we have a better solution for showing the intercom launcher
          .intercom-launcher {
            display: none;
          }
				}
			`}</style>
  );
};

export default EditAccentStyles;
