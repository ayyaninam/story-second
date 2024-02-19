import StoryScreen from "@/features/edit-story/story-screen";
import { StoryScreenBgBlurProps } from "@/types";
import { FC } from "react";

const StoryScreenBgBlur: FC<StoryScreenBgBlurProps> = ({
	blur,
	isError,
	isPlaying,
	Webstory,
	seekedFrame,
}) => {
	return (
		<div
			className={`relative w-full lg:max-w-[100%] rounded-tl-lg rounded-bl-lg blur-lg`}
		>
			<StoryScreen
				Webstory={Webstory}
				isError={isError}
				isPlaying={isPlaying}
				seekedFrame={seekedFrame}
				isMuted={true}
			/>
		</div>
	);
};

export default StoryScreenBgBlur;
