import { cn } from "@/utils";
import React, { useEffect, useRef, useState } from "react";

export default function CustomVideoPlayer({
	coverImageURL,
	inputProps,
	renderPlayPauseButton,
	renderFullscreenButton,
}: any) {
	const videoRef = useRef<HTMLVideoElement>(null);
	const [isPlaying, setIsPlaying] = useState(false);
	const [currentTime, setCurrentTime] = useState(0);
	const [duration, setDuration] = useState(0);
	const [volume, setVolume] = useState(0.5); // Initial volume set to 50%

	const togglePlay = () => {
		const video = videoRef.current;
		if (video) {
			if (isPlaying) {
				video.pause();
			} else {
				video.play();
			}
			setIsPlaying(!isPlaying);
		}
	};

	const toggleFullscreen = () => {
		const video = videoRef.current;
		if (video) {
			if (video.requestFullscreen) {
				video.requestFullscreen();
			} else if (video.requestFullscreen) {
				video.requestFullscreen();
			}
		}
	};

	const updateTime = () => {
		const video = videoRef.current;
		if (video) {
			setCurrentTime(video.currentTime);
			setDuration(video.duration);
		}
	};

	useEffect(() => {
		const video = videoRef.current;
		if (video) {
			video.addEventListener("timeupdate", updateTime);
			return () => video.removeEventListener("timeupdate", updateTime);
		}
	}, []);

	const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const video = videoRef.current;
		if (video) {
			const newTime = (parseInt(e.target.value) / 100) * video.duration;
			video.currentTime = newTime;
			setCurrentTime(newTime);
		}
	};

	const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const newVolume = parseFloat(e.target.value);
		setVolume(newVolume);
		if (videoRef.current) {
			videoRef.current.volume = newVolume;
		}
	};

	return (
		<div className="relative video-container">
			<video
				controls={false}
				preload="metadata"
				className="rounded-tl-lg rounded-tr-lg"
				poster={coverImageURL}
				ref={videoRef}
				onClick={togglePlay}
			>
				<source src={inputProps.renderedVideoURL} type="video/mp4" />
				Your browser does not support the video tag.
			</video>
			<div className="absolute bottom-0 w-full pt-10 px-3 pb-2 transition-opacity  flex flex-col z-10 controls">
				<div className="flex justify-between">
					<div className="flex gap-2 items-center">
						<button onClick={togglePlay}>
							{renderPlayPauseButton({ playing: isPlaying })}
						</button>
						<div className="group flex gap-2">
							<svg width="25" height="25" viewBox="0 0 24 24">
								<path
									d="M3 10v4c0 .55.45 1 1 1h3l3.29 3.29c.63.63 1.71.18 1.71-.71V6.41c0-.89-1.08-1.34-1.71-.71L7 9H4c-.55 0-1 .45-1 1zm13.5 2A4.5 4.5 0 0014 7.97v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 4.45v.2c0 .38.25.71.6.85C17.18 6.53 19 9.06 19 12s-1.82 5.47-4.4 6.5c-.36.14-.6.47-.6.85v.2c0 .63.63 1.07 1.21.85C18.6 19.11 21 15.84 21 12s-2.4-7.11-5.79-8.4c-.58-.23-1.21.22-1.21.85z"
									fill="#fff"
								></path>
							</svg>
							{/* <GradientRangeSlider
								active="linear-gradient(270deg, #bb55f7 1.38%, rgba(110, 129, 135, 1) 100%)"
								className={"hidden group-hover:flex"}

							/> */}
						</div>
						<div className="text-white text-sm">
							{formatTime(currentTime)} / {formatTime(duration)}
						</div>
					</div>
					<button onClick={toggleFullscreen}>
						{renderFullscreenButton({ isFullscreen: false })}
					</button>
				</div>
				<GradientRangeSlider
					active="linear-gradient(270deg, #bb55f7 1.38%, rgba(110, 129, 135, 1) 100%)"
					value={(currentTime / duration) * 100}
					onChange={handleProgressChange}
				/>
			</div>
		</div>
	);
}

const GradientRangeSlider = ({
	active,
	className,
	value,
	onChange,
}: {
	active?: string;
	className?: string;
	value: number;
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => {
	const inputRef = useRef(null);

	useEffect(() => {
		const input = inputRef.current;

		const update = () => {
			const min = input.min || 0;
			const max = input.max || 100;
			const percentRaw = ((value - min) / (max - min)) * 100;
			const percent = +percentRaw.toFixed(2);
			const handle = 0.9 * (1 - percent / 100) - 0.5;
			const percentStyle = `calc(${percent}% + ${handle}em)`;
			console.log("test1214", percentStyle);
			input.parentElement?.style.setProperty("--percent", percentStyle);
		};
		update();
	}, [value]);
	return (
		<span className={cn(className, "gr-glow")}>
			<input
				className="gr-input"
				type="range"
				value={value}
				min="0"
				max="100"
				ref={inputRef}
				onChange={onChange}
			/>
		</span>
	);
};

function formatTime(time: number) {
	const minutes = Math.floor(time / 60);
	const seconds = Math.floor(time % 60);
	return `${padZero(minutes)}:${padZero(seconds)}`;
}

function padZero(num: number) {
	return num < 10 ? `0${num}` : num;
}
