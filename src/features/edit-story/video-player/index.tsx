"use client";
import dynamic from "next/dynamic";
import { Play, Pause, Scan } from "lucide-react";
import React, { useRef, useEffect, ComponentProps, useCallback } from "react";
import {
	Player,
	PlayerRef,
	RenderPlayPauseButton,
	RenderFullscreenButton,
	CallbackListener,
} from "@remotion/player";

import {
	VIDEO_FPS,
	VIDEO_HEIGHT,
	VIDEO_WIDTH,
	RemotionPlayerInputProps,
} from "./constants";
import { GetImageRatio, GetImageRatioFromVariant } from "@/utils/image-ratio";
import { useRouter } from "next/router";
import { useQuery } from "@tanstack/react-query";
import api from "@/api";
import { QueryKeys } from "@/lib/queryKeys";
import { mainSchema } from "@/api/schema";
import useWebstoryContext from "../providers/WebstoryContext";

const DynamicMain = dynamic(() => import("./Main").then((mod) => mod.Main), {
	ssr: false,
});

type RemotionPlayerProps = {
	inputProps: RemotionPlayerInputProps;
	onPlay?: CallbackListener<"play">;
	onEnded?: CallbackListener<"ended">;
	onPause?: CallbackListener<"pause">;
	onSeeked?: CallbackListener<"seeked">;
	seekedFrame?: number;
	isPlaying?: boolean;
} & Omit<Partial<ComponentProps<typeof Player>>, "component">;

const controlBackgroundStyles =
	" remotion-player-control-background flex justify-center items-center border-[#0000004A] border-[0.5px]";

const RemotionPlayer = ({
	inputProps,
	onPlay,
	onEnded,
	onPause,
	onSeeked,
	seekedFrame,
	isPlaying,
	...props
}: RemotionPlayerProps) => {
	const router = useRouter();
	const [Webstory] = useWebstoryContext();
	const ImageRatio = GetImageRatio(Webstory.resolution);

	const player: React.CSSProperties = {
		width: "100%",
		aspectRatio: ImageRatio.ratio,
	};

	const ref = useRef<PlayerRef>(null);
	const containerRef = useRef<HTMLDivElement>(null);

	// when story is loaded go to second 0 and pause it
	useEffect(() => {
		if (!inputProps.showLoadingVideo) {
			const player = ref.current;
			if (player) {
				player.seekTo(0);
				player.pause();
			}
		}
	}, [inputProps.showLoadingVideo]);

	// convert listeners to callback props
	useEffect(() => {
		const player = ref.current;
		if (!player) {
			return;
		}

		if (onPlay) {
			player.addEventListener("play", onPlay);
		}
		if (onEnded) {
			player.addEventListener("ended", onEnded);
		}
		if (onPause) {
			player.addEventListener("pause", onPause);
		}
		if (onSeeked) {
			player.addEventListener("seeked", onSeeked);
		}

		return () => {
			if (onPlay) {
				player.removeEventListener("play", onPlay);
			}
			if (onEnded) {
				player.removeEventListener("ended", onEnded);
			}
			if (onPause) {
				player.removeEventListener("pause", onPause);
			}
			if (onSeeked) {
				player.removeEventListener("seeked", onSeeked);
			}
		};

		// somehow on the past i just did this dep and it worked back then, buut when doing other values it breaks
	}, [onPlay, onEnded, onPause, onSeeked]); // the dep inputProps is related when remotionPlayerRef has a value

	useEffect(() => {
		const player = ref.current;
		if (!player) {
			return;
		}

		if (isPlaying !== undefined) {
			if (isPlaying) player.play();
			else player.pause();
		}
		if (seekedFrame !== undefined) {
			player.seekTo(seekedFrame);
		}
	}, [isPlaying, seekedFrame]);

	const renderPlayPauseButton: RenderPlayPauseButton = useCallback(
		({ playing }: { playing: boolean }) =>
			playing ? (
				<Pause color="white" size={24} strokeWidth={1} />
			) : (
				<div className="w-[28px] pl-[4px]">
					<Play color="white" size={24} strokeWidth={1} />
				</div>
			),
		[]
	);

	const renderFullscreenButton: RenderFullscreenButton = useCallback(
		() => (
			<div className={`w-10 h-10 rounded-lg ${controlBackgroundStyles}`}>
				<Scan color="white" size={24} strokeWidth={1} />
			</div>
		),
		[]
	);

	useEffect(() => {
		const hasBeenStyled = {
			"Action Groups": false,
			"Player Time": false,
			"Time Bar": false,
			"Volume Slider": false,
		};
		const observerCallback = () => {
			if (!containerRef.current) {
				return;
			}

			if (
				!hasBeenStyled["Action Groups"] &&
				containerRef.current?.querySelector(`[title="Mute sound"]`)
			) {
				const actionGroups = [
					{
						titles: ["Play video", "Pause video"],
						className: " w-10 rounded-full",
					},
					{
						titles: ["Mute sound", "Unmute sound"],
						className: " rounded-lg h-10 w-10",
					},
				];

				actionGroups.forEach((group) => {
					group.titles.forEach((title) => {
						const button = containerRef.current?.querySelector(
							`[title="${title}"]`
						);
						if (button && !button.closest(".actionGroupWrapper")) {
							const wrapperDiv = document.createElement("div");
							wrapperDiv.className = controlBackgroundStyles + group.className;
							wrapperDiv.classList.add("actionGroupWrapper");

							button.parentNode?.insertBefore(wrapperDiv, button);
							wrapperDiv.appendChild(button);

							button.className += " outline-none";
						}
					});
				});

				hasBeenStyled["Action Groups"] = true;
			}

			const muteSoundButton = containerRef.current?.querySelector(
				'[title="Mute sound"]'
			);

			// todo: fix bug that does not allow time go correctly
			// if (!hasBeenStyled["Player Time"] && muteSoundButton) {
			// 	const playerTimeElement =
			// 		muteSoundButton?.parentElement?.parentElement?.nextElementSibling
			// 			?.nextElementSibling;
			// 	if (playerTimeElement) {
			// 		playerTimeElement.className +=
			// 			" rounded-md px-2 py-0.5 remotion-player-control-background border-[#0000004A] border-[0.5px]";
			//
			// 		// change the '/' character style
			// 		const textContent = playerTimeElement.textContent || "";
			// 		playerTimeElement.innerHTML = textContent.replace(
			// 			/\//g,
			// 			'<span style="color: #ffffff; opacity: 0.4;">/</span>'
			// 		);
			// 	}
			//
			// 	hasBeenStyled["Player Time"] = true;
			// }

			if (!hasBeenStyled["Time Bar"] && muteSoundButton) {
				const timeBarContainerElement =
					muteSoundButton?.parentElement?.parentElement?.parentElement
						?.parentElement?.nextElementSibling?.nextElementSibling;
				const timeBarElement = timeBarContainerElement?.children[0];
				const circleElement = timeBarContainerElement?.children[1];
				const toFillElement = timeBarElement?.children[0];
				const filledElement = timeBarElement?.children[1];
				if (
					timeBarContainerElement &&
					timeBarElement &&
					toFillElement &&
					filledElement &&
					circleElement
				) {
					timeBarContainerElement.className +=
						"flex justify-center items-center w-full";
					timeBarElement.className += " !h-2 rounded-full relative";
					toFillElement.className += " !h-2 !rounded-full";
					filledElement.className +=
						" !h-2 !rounded-full filled-bar-background";
					circleElement.className +=
						" !bg-[#BB55F7] border-[1.5px] border-[#F0D6FF] !w-4 !h-4 !rounded-full";

					// this is in order to make the circle work correctly
					const wrapperDiv = document.createElement("div");
					timeBarContainerElement.parentNode?.insertBefore(
						wrapperDiv,
						timeBarContainerElement
					);
					wrapperDiv.appendChild(timeBarContainerElement);
					wrapperDiv.className +=
						" flex flex-row justify-center items-center px-2.5 remotion-player-control-background h-6 rounded-full";
				}

				hasBeenStyled["Time Bar"] = true;
			}

			const changeVolumeSlider: HTMLInputElement | null =
				containerRef.current?.querySelector('[aria-label="Change volume"]');
			if (changeVolumeSlider) {
				changeVolumeSlider.className = " remotion-player-volume-slider";
			}
		};

		const observer = new MutationObserver(observerCallback);
		if (containerRef.current) {
			observer.observe(containerRef.current, {
				childList: true,
				subtree: true,
			});
		}

		return () => observer.disconnect();
	}, []);

	// TODO: responsive styles
	const style: React.CSSProperties = {
		width: "100%",
		aspectRatio: GetImageRatioFromVariant(inputProps.variant ?? "landscape")
			.ratio,
	};

	return (
		<div ref={containerRef} className="w-full h-full">
			<Player
				ref={ref}
				component={DynamicMain}
				inputProps={inputProps}
				durationInFrames={inputProps.durationInFrames}
				fps={VIDEO_FPS}
				compositionHeight={VIDEO_HEIGHT[inputProps.variant]}
				compositionWidth={VIDEO_WIDTH[inputProps.variant]}
				style={style}
				className="lg:[&>div]:rounded-bl-lg"
				autoPlay={false}
				numberOfSharedAudioTags={0}
				controls={!inputProps.showLoadingVideo}
				renderPlayPauseButton={renderPlayPauseButton}
				renderFullscreenButton={renderFullscreenButton}
				{...props}
			/>
		</div>
	);
};

export default RemotionPlayer;
