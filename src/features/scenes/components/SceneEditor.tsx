import { ChevronDown, MoreHorizontal, Settings2, Sparkle } from "lucide-react";
import { useImmerReducer } from "use-immer";
import editStoryReducer, {
	EditStoryAction,
	EditStoryDraft,
	Scene,
	Segment,
	StoryStatus,
} from "../reducers/edit-reducer";
import { WebstoryToStoryDraft } from "../utils/storydraft";
import { mainSchema } from "@/api/schema";
import React, { useEffect, useRef, useState } from "react";
import Editor from "./Editor";
import { cn } from "@/utils";
import Format from "@/utils/format";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import VideoPlayer, {
	VideoPlayerHandler,
} from "@/features/edit-story/components/video-player";
import { AspectRatios } from "@/utils/enums";
import api from "@/api";
import SceneEditSegmentModal from "./SceneEditSegmentModal";

const Dropdown = ({
	items,
}: {
	items: Array<{ label: string; value: string }>;
}) => {
	return (
		<Select>
			<SelectTrigger className="border-0 w-fit p-0 h-fit focus:ring-0">
				<span className="underline">
					<SelectValue placeholder="Select" />
				</span>
			</SelectTrigger>
			<SelectContent>
				{items.map((item, index) => (
					<SelectItem key={index} value={item.value}>
						{item.label}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);
};

const Loader = ({
	percentage,
	index,
}: {
	percentage: number;
	index: number;
}) => {
	const withOffset = `${60 + percentage}deg`;
	return (
		<span className={`absolute -left-[25px] top-${index + 1 / 4}`}>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="19"
				height="19"
				viewBox="0 0 19 19"
				fill="none"
				style={{ transform: `rotate(${withOffset})` }}
			>
				<rect
					x="0.5"
					y="0.5"
					width="18"
					height="18"
					rx="9"
					fill="white"
					stroke="#CE7AFF"
				/>
				<path
					d="M3.87083 6.25C3.1554 7.48917 2.86884 8.92979 3.05561 10.3484C3.24237 11.7671 3.89203 13.0844 4.90381 14.0962C5.91559 15.108 7.23295 15.7576 8.65158 15.9444C10.0702 16.1312 11.5108 15.8446 12.75 15.1292C13.9892 14.4137 14.9576 13.3094 15.5052 11.9874C16.0528 10.6655 16.1489 9.19979 15.7785 7.81768C15.4082 6.43556 14.5921 5.21426 13.4569 4.3432C12.3218 3.47214 10.9309 3 9.5 3L9.5 9.5L3.87083 6.25Z"
					fill="#BB55F7"
				/>
			</svg>
		</span>
	);
};

const images = [
	"https://s3-alpha-sig.figma.com/img/df90/21a4/e692a49276e76580e568857e2e98ecfd?Expires=1709510400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=M8YPtAuPLlNk0hxZEUVte3QslxvEXaB4oCE~CKGSTELDpn9~0yElSFzbxR2o6kyT4IGx3HeKt0-Aa-YAOfCha3mBUW5I9pyvLCEU8R-jCq~R8TkgMZHW-dRxxahRuPS3ui1wNYvzWLPTE7X6PscEcV~FB5eP9nPWyMdvCgjDhrfw8Iwo-T64KzbZpIu8PFYUGeEBgYGuSmLOK-kOTbyDOopch8H2JaaId5E-NEna2gbXVlIr-wjKL0Kh34~1mWYJnAumIeIVkRPTPcoWnKduksrd3mzCHO6d78WQxar~6JTNveiz8Enws4d1PBgiRZ65jqWcKNNDnzsekL8SH9M~3Q__",
	"https://s3-alpha-sig.figma.com/img/4b74/a308/440aa6436990ba59544eec4ffcdc563e?Expires=1709510400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=NQuNSbFJk~IubBDht3JCZXWMewISqVltZtHPQN~XOIoMhBzh8Syk7wfE8XAUEEjwrW-3qYgN~yWut8QsQzuVkqg5d01Y-TWO2sIAXRbIfgDFex--Ev~ZgkPxDGxciPhy16O4PehAB-g4eq9j~Qq9fPfLKFJuqj9tTVO-GzOqROI~cGrduXj6O6BrwkFWRzbVHBzOzzzXbWaXgpTb83SOa1Mw8xIx8ij7foDG8Gs4NSVw56HeJ6NtTasw15DSL3N16NWD6DNfox~X1q1O4Z0Ty235gmjYh9FdsNjoKCX6qPcoCjpuxqiKIoCJEl~Kmr9~p7ypcu2HTlQ0eNmYuBHt8Q__",
	"https://s3-alpha-sig.figma.com/img/37d6/3067/52049c46979d73390a22ddd36c091858?Expires=1709510400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=jQxcQDduYjzAFCBraADR4Hh6LB0FpMIAYdzRhd0CqoBdC6TC6tdXP0~8mx7RRUGY7qeHGuc4p3QNqvQnm4OIhh8lnx6sVBIo7KeZxP89xIBTmbHVriNKyNQyucBBYt9aM72oNJ30MTTywI7j8RUnH-XmNRJKsPWrm3HhVdKRV6Iqb2DxWs5cVDHUpnIApxn16dG3KZgaXGchTF8dinm-Y5P-W17Gu218AeMrz9uzlNTa28iM38vBxKrm8O74OKGroY6XdhozST17dh6ouknWEI0qmmvxMcYacwZEjr-bJDWi1fZc6w0pVxYv8syc2RYHx51STgMiqWzbmfxTRasJzw__",
	"https://s3-alpha-sig.figma.com/img/f693/d943/4a89adb3a043999da9fd93a00f46d036?Expires=1709510400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=pHNVfsEyAMgYra620NFC5qLHp67xEp0lXuXdP3aDPJCkNECPqN51er1-J4f2imxeyu4Lf1lBbHoj3oQtxjpe2Xzv6Bq6mKt5Gfz16vDvG5LelsCkOelLaJJUO45i2PvkYbTZO7~-8LovqRDEan36E6x-JZxS4zmwcFIbVcXcc87ciNM6EoDdiG6UEhOLXn0W206d5YCO5TJwoRkrcgnINdwMNnAJs26zkwlf8GCIPVNZBRmI21DEwjg2N2rpWdcGgSmVUgocHekhxp8PO-HYESUwfaMxKhLlUMQxuGx9eqXxXtJlf-QaswTrZGu3FWXiyxbSMmtOm46ko9BL0WMLkA__",
	"https://s3-alpha-sig.figma.com/img/db3e/2276/a5d1b15a94d2b0e6350dee3a7c20ff16?Expires=1709510400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=cVCnfj7qxDhPX9xAUXksB7-dC8-NDeZL30EKw5rGeYkYJ-CnF4dMrGflFfnyVUgfZ0z7O5s7YuVEs-Wy2lGkwSXFrQg8UYCo99kf3beKvVJ8~gfq0jH3fsLv~64rBVFVC0pGEuibP3ZTA2uCyrX6Fws2ry5JsEXm0iTlmInyNqz2n~l6uqMr7wXpOvX-8PQrVJz~cLeWFz8qGZjOBR60UMaK7VlKeoi1QScNc~lHEOjwFKWPSM6w0DCpbjVbifr-FpbzOmhuZBgctGgQFCn3hCwQ1-LUDycccnbuS3sKf8G2113cP3QmkeqfMul0scskop482kiKNEXGTTtgs7g3CA__",
	"https://s3-alpha-sig.figma.com/img/97c3/38ab/3840b8e82a3b15f65887698279769256?Expires=1709510400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=BMYVki7bunQUrg~NoRX5~o9huPumsKjE1pYA1L6tHbvSdsfXdqTAp4zzp0IN8SphEnSIln2ZvlvYtjpf4N5STKBfgPVq4b6KWvjT8weDYM3kLi~bX7OLFn2N~-DRd5KFNfcbMAcMbZS4PCF8WVuXywLnf-bRbg7bMpyRYXkw7EluzZKkFozfutSLoqZxDKZsapMeuNb1TTPdD3NrmzHGeuxo5CbGz0YeBOJYInSe0mxnZJkjsbPS7WWdFKlHwxCeJiG74fN5wgG5hhfOUMW~exe79CkosefWuuHoBjYpJ0XIiFrq0pGHG8T0Zo0yzEsLRBJ5ogWLO8soekPenP6RMg__",
	"https://s3-alpha-sig.figma.com/img/a4f0/438b/9fd5442c1e9eb8d094a4188d4adc9fea?Expires=1709510400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=jsvJq0~YWdDwXOImQPvDFl~rPY3nmOF1ToG8re6IhR7IXk9j9BjeYIayiicYEdyz41K~tP2PJYpA0hv~fTnODHWtvC1XoWCP6CC-3eJyQbtDmVXlqrBRgHXAP1QesdP02ng2k-5Zru7fEXUsEcLwgRCPmUVsTA1RAGxJ~QKqaJHRXQiouxitBl2RS8PCcHsluIwxppCJz40x4q8pWIHMX4Z925meQhEfsamVR4ldA6bDMxAVZlz0gV06Fm5y60zeCoeEdvHqvQpwWHUQf4HipSm9BWJE6hKRIH4NmxsZ~6qEScz-iLtyAP05Kbl7ep78Bqi8vy8tFA0ema5sRsq90w__",
	"https://s3-alpha-sig.figma.com/img/4b74/a308/440aa6436990ba59544eec4ffcdc563e?Expires=1709510400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=NQuNSbFJk~IubBDht3JCZXWMewISqVltZtHPQN~XOIoMhBzh8Syk7wfE8XAUEEjwrW-3qYgN~yWut8QsQzuVkqg5d01Y-TWO2sIAXRbIfgDFex--Ev~ZgkPxDGxciPhy16O4PehAB-g4eq9j~Qq9fPfLKFJuqj9tTVO-GzOqROI~cGrduXj6O6BrwkFWRzbVHBzOzzzXbWaXgpTb83SOa1Mw8xIx8ij7foDG8Gs4NSVw56HeJ6NtTasw15DSL3N16NWD6DNfox~X1q1O4Z0Ty235gmjYh9FdsNjoKCX6qPcoCjpuxqiKIoCJEl~Kmr9~p7ypcu2HTlQ0eNmYuBHt8Q__",
	"https://s3-alpha-sig.figma.com/img/37d6/3067/52049c46979d73390a22ddd36c091858?Expires=1709510400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=jQxcQDduYjzAFCBraADR4Hh6LB0FpMIAYdzRhd0CqoBdC6TC6tdXP0~8mx7RRUGY7qeHGuc4p3QNqvQnm4OIhh8lnx6sVBIo7KeZxP89xIBTmbHVriNKyNQyucBBYt9aM72oNJ30MTTywI7j8RUnH-XmNRJKsPWrm3HhVdKRV6Iqb2DxWs5cVDHUpnIApxn16dG3KZgaXGchTF8dinm-Y5P-W17Gu218AeMrz9uzlNTa28iM38vBxKrm8O74OKGroY6XdhozST17dh6ouknWEI0qmmvxMcYacwZEjr-bJDWi1fZc6w0pVxYv8syc2RYHx51STgMiqWzbmfxTRasJzw__",
	"https://s3-alpha-sig.figma.com/img/f693/d943/4a89adb3a043999da9fd93a00f46d036?Expires=1709510400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=pHNVfsEyAMgYra620NFC5qLHp67xEp0lXuXdP3aDPJCkNECPqN51er1-J4f2imxeyu4Lf1lBbHoj3oQtxjpe2Xzv6Bq6mKt5Gfz16vDvG5LelsCkOelLaJJUO45i2PvkYbTZO7~-8LovqRDEan36E6x-JZxS4zmwcFIbVcXcc87ciNM6EoDdiG6UEhOLXn0W206d5YCO5TJwoRkrcgnINdwMNnAJs26zkwlf8GCIPVNZBRmI21DEwjg2N2rpWdcGgSmVUgocHekhxp8PO-HYESUwfaMxKhLlUMQxuGx9eqXxXtJlf-QaswTrZGu3FWXiyxbSMmtOm46ko9BL0WMLkA__",
	"https://s3-alpha-sig.figma.com/img/db3e/2276/a5d1b15a94d2b0e6350dee3a7c20ff16?Expires=1709510400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=cVCnfj7qxDhPX9xAUXksB7-dC8-NDeZL30EKw5rGeYkYJ-CnF4dMrGflFfnyVUgfZ0z7O5s7YuVEs-Wy2lGkwSXFrQg8UYCo99kf3beKvVJ8~gfq0jH3fsLv~64rBVFVC0pGEuibP3ZTA2uCyrX6Fws2ry5JsEXm0iTlmInyNqz2n~l6uqMr7wXpOvX-8PQrVJz~cLeWFz8qGZjOBR60UMaK7VlKeoi1QScNc~lHEOjwFKWPSM6w0DCpbjVbifr-FpbzOmhuZBgctGgQFCn3hCwQ1-LUDycccnbuS3sKf8G2113cP3QmkeqfMul0scskop482kiKNEXGTTtgs7g3CA__",
	"https://s3-alpha-sig.figma.com/img/97c3/38ab/3840b8e82a3b15f65887698279769256?Expires=1709510400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=BMYVki7bunQUrg~NoRX5~o9huPumsKjE1pYA1L6tHbvSdsfXdqTAp4zzp0IN8SphEnSIln2ZvlvYtjpf4N5STKBfgPVq4b6KWvjT8weDYM3kLi~bX7OLFn2N~-DRd5KFNfcbMAcMbZS4PCF8WVuXywLnf-bRbg7bMpyRYXkw7EluzZKkFozfutSLoqZxDKZsapMeuNb1TTPdD3NrmzHGeuxo5CbGz0YeBOJYInSe0mxnZJkjsbPS7WWdFKlHwxCeJiG74fN5wgG5hhfOUMW~exe79CkosefWuuHoBjYpJ0XIiFrq0pGHG8T0Zo0yzEsLRBJ5ogWLO8soekPenP6RMg__",
	"https://s3-alpha-sig.figma.com/img/a4f0/438b/9fd5442c1e9eb8d094a4188d4adc9fea?Expires=1709510400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=jsvJq0~YWdDwXOImQPvDFl~rPY3nmOF1ToG8re6IhR7IXk9j9BjeYIayiicYEdyz41K~tP2PJYpA0hv~fTnODHWtvC1XoWCP6CC-3eJyQbtDmVXlqrBRgHXAP1QesdP02ng2k-5Zru7fEXUsEcLwgRCPmUVsTA1RAGxJ~QKqaJHRXQiouxitBl2RS8PCcHsluIwxppCJz40x4q8pWIHMX4Z925meQhEfsamVR4ldA6bDMxAVZlz0gV06Fm5y60zeCoeEdvHqvQpwWHUQf4HipSm9BWJE6hKRIH4NmxsZ~6qEScz-iLtyAP05Kbl7ep78Bqi8vy8tFA0ema5sRsq90w__",
];

const SceneEditorView = ({
	WebstoryData,
	ImageRatio,
}: {
	WebstoryData?: mainSchema["ReturnVideoStoryDTO"];
	ImageRatio: {
		width: number;
		height: number;
		ratio: number;
		enumValue: AspectRatios;
	};
}) => {
	const videoPlayerRef = useRef<VideoPlayerHandler | null>(null);
	const [story, dispatch] = useImmerReducer<EditStoryDraft, EditStoryAction>(
		editStoryReducer,
		WebstoryToStoryDraft(WebstoryData!)
	);
	const [editSegmentsModalState, setEditSegmentsModalState] = useState<{
		open?: boolean;
		scene?: Scene;
		sceneId?: number;
		dispatch?: React.Dispatch<EditStoryAction>;
		story?: EditStoryDraft;
	}>();

	useEffect(() => {
		if (WebstoryData) {
			console.log(
				"Resetting webstory with new data:",
				WebstoryToStoryDraft(WebstoryData)
			);
			dispatch({ type: "reset", draft: WebstoryToStoryDraft(WebstoryData) });
		}
	}, [WebstoryData, dispatch]);

	const statuses = story.scenes.flatMap((el) =>
		el.segments.map((el) => el.videoStatus)
	);
	useEffect(() => {
		console.log("Statuses changed:", statuses);
	}, [statuses]);

	const handleRegenerateVideo = async (
		segment: Segment,
		sceneIndex: number,
		segmentIndex: number
	) => {
		dispatch({
			type: "edit_segment",
			sceneIndex,
			segmentIndex: segmentIndex,
			segment: { ...segment, videoStatus: StoryStatus.PENDING },
		});
		await api.video.regenerateVideo({
			story_id: WebstoryData?.id!,
			segment_idx: segment.id,
			story_type: WebstoryData?.storyType,
		});
	};

	return (
		<>
			<div
				className="w-4/5 h-4/5 m-auto overflow-hidden"
				style={{
					borderRadius: "8px",
					background: "#FEFEFF",
					boxShadow:
						"0px 0px 0px 1px rgba(18, 55, 105, 0.08), 0px 1px 2px 0px #E1EAEF, 0px 24px 32px -12px rgba(54, 57, 74, 0.24)",
					backdropFilter: "blur(5px)",
				}}
			>
				<div className="w-full flex justify-between py-1.5 px-3.5 rounded-tl-lg rounded-tr-lg bg-primary-foreground font-normal text-xs border border-purple-200 bg-purple-100 text-purple-600">
					<div className="flex items-center gap-1">
						<p className="font-medium text-sm">
							Scene Editor • Playing Scene 3
						</p>
						<ChevronDown className="w-4 h-4 opacity-50" />
					</div>
					<p className="font-medium text-sm">
						Pro Tip — You can individually regenerate images in this Storyboard.{" "}
						<a className="underline" href="#">
							Learn how
						</a>
					</p>
				</div>
				<div className="relative h-full border-l border-slate-200 pl-4 flex flex-row m-6 gap-x-24 items-start">
					<div className="relative h-full items-start flex flex-col max-w-md">
						<div className="border-b pb-4 w-full bg-[#FEFEFF]">
							<p className="text-2xl font-bold -tracking-[-0.6px]">
								{Format.Title(WebstoryData?.storyTitle)}
							</p>

							<div className="flex gap-1 text-slate-600 text-sm py-1">
								<Dropdown
									items={[
										{ label: "60 Second", value: "60" },
										{ label: "90 Second", value: "90" },
									]}
								/>
								<Dropdown
									items={[
										{ label: "Adventure", value: "adventure" },
										{ label: "Suspense", value: "suspense" },
										{ label: "Thriller", value: "thriller" },
									]}
								/>
								<Dropdown
									items={[
										{ label: "Video", value: "video" },
										{ label: "Audio", value: "audio" },
										{ label: "None", value: "none" },
									]}
								/>
								<p>by Anthony Deloso</p>
							</div>
						</div>
						<div className="flex flex-col h-screen justify-between overflow-y-scroll">
							<div className="flex flex-col my-3 md:flex-row items-center w-full">
								<div className="w-full h-full bg-background  rounded-bl-lg rounded-br-lg lg:rounded-br-lg lg:rounded-bl-lg flex flex-col lg:flex-row justify-stretch">
									<div className="flex w-full h-full space-y-2 flex-col-reverse justify-between md:flex-col rounded-t-lg lg:rounded-bl-lg lg:rounded-tl-lg lg:rounded-tr-none lg:rounded-br-none">
										<Editor
											Webstory={WebstoryData!}
											dispatch={dispatch}
											story={story}
										>
											{({ handleEnter, handleInput, refs }) => {
												return (
													<>
														{story.scenes.map((scene, sceneIndex) => (
															<div
																key={sceneIndex}
																className="flex group hover:border rounded-sm items-center justify-between"
															>
																{scene.status === StoryStatus.PENDING && (
																	<Loader percentage={20} index={sceneIndex} />
																)}
																<div className="flex flex-shrink-0 flex-col -space-y-3 overflow-hidden mx-1 my-[18px] items-center justify-center">
																	{images.slice(0, 4).map((image, index) => (
																		<div
																			key={index}
																			className="w-8 h-5 rounded-[1px]"
																			style={{
																				border:
																					"0.2px solid rgba(0, 0, 0, 0.40)",
																				background: `url(${image})`,
																				backgroundSize: "cover",
																				backgroundRepeat: "no-repeat",
																			}}
																		/>
																	))}
																</div>

																<div className="flex flex-wrap">
																	{scene.segments.map(
																		(segment, segmentIndex) => (
																			<span
																				key={segmentIndex}
																				style={{
																					backgroundColor: "transparent",
																				}}
																				className={cn(
																					"flex max-w-sm focus:!bg-purple-200 hover:!bg-purple-100 rounded-sm px-1 cursor-pointer",
																					segment.videoStatus ===
																						StoryStatus.PENDING &&
																						"text-purple-800"
																				)}
																				onClick={() => {
																					videoPlayerRef.current?.seekToSegment(
																						{
																							...segment,
																							sceneId: scene.id,
																							index: segment.id,
																						}
																					);
																					handleRegenerateVideo(
																						segment,
																						sceneIndex,
																						segmentIndex
																					);
																				}}
																			>
																				{segment.textContent}
																			</span>
																		)
																	)}
																</div>
																<div className="hidden group-hover:flex gap-x-1 p-2">
																	<span className="hover:bg-gray-100 cursor-pointer rounded-sm p-1">
																		<Settings2
																			className="w-4 h-4 stroke-slate-500"
																			onClick={() =>
																				setEditSegmentsModalState({
																					open: true,
																					scene: scene,
																					sceneId: sceneIndex,
																					dispatch,
																					story,
																				})
																			}
																		/>
																	</span>
																	<span className="hover:bg-gray-100 cursor-pointer rounded-sm p-1">
																		<MoreHorizontal className="w-4 h-4 stroke-slate-500" />
																	</span>
																</div>
															</div>
														))}
													</>
												);
											}}
										</Editor>
									</div>
								</div>
							</div>
						</div>
						<div className="w-full mt-auto mb-[5.25rem] flex flex-col justify-end border-t">
							<span className="font-medium text-slate-400 mx-1.5 mt-1.5 mb-2.5 text-sm">
								Use 25 credits to regenerate ·{" "}
								<Link className="text-purple-600" href="#">
									See plans
								</Link>
							</span>
							<div className="flex gap-2">
								<Button className="w-full text-xs flex gap-2 text-white bg-[#8F22CE] px-3 py-2">
									<Sparkle fill="white" className="w-4 h-4" />
									Regenerate 2 Edited Scenes
								</Button>
								<Button variant="outline" className="w-full text-xs px-3 py-2">
									Or, Save Without Regenerating
								</Button>
							</div>
						</div>
					</div>

					<div
						className={cn(
							"absolute right-0 rounded-none",
							ImageRatio.width === 16 ? "w-[440px] mt-20" : "w-[220px] mr-20"
						)}
					>
						<VideoPlayer ref={videoPlayerRef} Webstory={WebstoryData} />
					</div>
				</div>
			</div>
			{editSegmentsModalState?.scene !== undefined &&
				editSegmentsModalState?.sceneId !== undefined && (
					<SceneEditSegmentModal
						open={
							editSegmentsModalState?.open &&
							editSegmentsModalState.scene !== undefined &&
							editSegmentsModalState.sceneId !== undefined
						}
						story={story}
						scene={editSegmentsModalState.scene}
						sceneId={editSegmentsModalState.sceneId}
						onClose={() => setEditSegmentsModalState({})}
						dispatch={dispatch}
					/>
				)}
		</>
	);
};

export default SceneEditorView;
