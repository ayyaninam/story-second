import { Button } from "@/components/ui/button";
import { PopoverContent } from "@/components/ui/popover";
import { cn } from "@/utils";
import { AspectRatios, StoryImageStyles } from "@/utils/enums";
import Format from "@/utils/format";
import { GetImageRatio } from "@/utils/image-ratio";
import Image from "next/image";
import React, {
	ReactNode,
	useCallback,
	useEffect,
	useMemo,
	useState,
} from "react";
import {
	EditStoryAction,
	EditStoryDraft,
	Segment,
	StoryStatus,
} from "../reducers/edit-reducer";
import { Input } from "@/components/ui/input";
import api from "@/api";
import UncheckedCheckBox from "@/components/icons/scene-editor/unchecked-check-box";
import CheckedCheckBox from "@/components/icons/scene-editor/checked-check-box";
import RegenerateImageIcon from "@/components/icons/scene-editor/regenerate-image-icon";
import ScriptNotesIcon from "@/components/icons/scene-editor/script-notes-icon";
import LockIcon from "@/components/icons/scene-editor/lock-icon";
import PurpleStarIcon from "@/components/icons/scene-editor/purple-star-icon";
import SpinnerArc from "@/components/icons/scene-editor/spinner-arc";

function RegenerationPopupHeader({
	title,
	onClose,
}: {
	title: string;
	onClose: () => void;
}) {
	return (
		<div className="flex w-full gap-1 items-center">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="15"
				height="16"
				viewBox="0 0 15 16"
				fill="none"
			>
				<path
					d="M7.5 0.5L5.91667 5.33333C5.83559 5.58435 5.69609 5.81253 5.50964 5.99913C5.32319 6.18572 5.09512 6.3254 4.84417 6.40667L0 8L4.83333 9.58333C5.08435 9.66441 5.31253 9.80391 5.49913 9.99036C5.68572 10.1768 5.8254 10.4049 5.90667 10.6558L7.5 15.5L9.08333 10.6667C9.16441 10.4157 9.30391 10.1875 9.49036 10.0009C9.67681 9.81428 9.90488 9.6746 10.1558 9.59333L15 8L10.1667 6.41667C9.91565 6.33559 9.68747 6.19609 9.50087 6.00964C9.31428 5.82319 9.1746 5.59512 9.09333 5.34417L7.5 0.5Z"
					fill="#A734EA"
				/>
			</svg>
			<div className="text-[#06070F] text-sm font-medium grow">{title}</div>
			<div
				className="p-1 cursor-pointer"
				onClick={() => {
					onClose();
				}}
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="14"
					height="14"
					viewBox="0 0 14 14"
					fill="none"
				>
					<path
						d="M10.5 3.5L3.5 10.5L10.5 3.5Z"
						fill="#0F1324"
						fill-opacity="0.6"
					/>
					<path
						d="M3.5 3.5L10.5 10.5L3.5 3.5Z"
						fill="#0F1324"
						fill-opacity="0.6"
					/>
					<path
						d="M10.5 3.5L3.5 10.5M3.5 3.5L10.5 10.5"
						stroke="#020817"
						stroke-linecap="round"
						stroke-linejoin="round"
					/>
				</svg>
			</div>
		</div>
	);
}

function RegenerationPopupScriptContent({ text }: { text: string }) {
	return (
		<div className="py-1 px-2 items-center bg-slate-100 rounded-sm border border-input w-full flex gap-2 overflow-hidden">
			<ScriptNotesIcon />
			<div className="text-xs grow whitespace-nowrap text-ellipsis overflow-hidden">
				{text}
			</div>
			<LockIcon />
		</div>
	);
}

const ImageContainer = ({
	segment,
	imageAspectRatio,
	expanded,
	imageKey,
	onSelection,
	loading,
	active,
}: {
	segment: Segment;
	imageAspectRatio: number;
	expanded?: boolean;
	imageKey?: string;
	onSelection: (imageKey: string) => void;
	loading?: boolean;
	active?: boolean;
}) => {
	return (
		<div
			className={cn(
				"grow flex gap-1 w-full bg-muted",
				active ? "" : "opacity-50 hover:opacity-100",
				expanded
					? "row-span-4 col-span-4 opacity-100 hover:opacity-100"
					: "cursor-pointer",
				loading ? "opacity-100 hover:opacity-100 cursor-auto" : ""
			)}
			onClick={() => {
				imageKey && onSelection(imageKey);
			}}
			style={{
				boxShadow:
					active && !loading
						? "0px 0px 3.468px 0.991px #924FE8, 0px 0px 0px 0.991px #924FE8, 0px 0px 0px 0.495px #FFF inset"
						: "none",
			}}
		>
			<div
				className="relative w-full"
				style={{
					aspectRatio: imageAspectRatio,
				}}
			>
				{imageKey && !loading ? (
					<Image
						alt={segment.textContent}
						src={Format.GetImageUrl(imageKey)}
						className="rounded-sm"
						layout="fill"
						objectFit="cover"
						style={{}}
					/>
				) : (
					<div
						className="border-[0.5px] border-purple-200 rounded=[1.5px] flex justify-center items-center w-full h-full"
						style={{
							background: "linear-gradient(180deg, #F1F6F9 0%, #FBF5FF 100%)",
						}}
					>
						<div
							className={cn(
								"rounded-full p-2.5 flex justify-center items-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2",
								expanded ? "w-12 h-12" : "w-6 h-6"
							)}
							style={{
								background:
									"linear-gradient(180deg, rgba(151, 71, 255, 0.20) 0%, rgba(151, 71, 255, 0.00) 100%)",
							}}
						>
							<div className="animate-spin absolute w-full h-full flex justify-center items-center">
								<SpinnerArc
									width={expanded ? 43 : 21}
									height={expanded ? 43 : 21}
								/>
							</div>
							<div className="absolute w-full h-full flex justify-center items-center">
								<PurpleStarIcon
									width={expanded ? 16 : 8}
									height={expanded ? 16 : 8}
								/>
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

function RegenerateButton({
	text = "Regenerate",
	onClick = () => {},
	loading,
}: {
	text: string;
	onClick: () => void;
	loading: boolean;
}) {
	return (
		<Button
			className="flex px-2 py-1 w-full h-fit justify-center items-center gap-1 grow h-fit-content rounded-sm border border-[#DEE0E3] bg-[#FFF]"
			style={{
				boxShadow: "0px 1px 2px 0px rgba(20, 21, 26, 0.05)",
			}}
			variant={"outline"}
			onClick={onClick}
			disabled={loading}
		>
			<div
				className={loading ? "animate-spin" : ""}
				style={{
					animationDirection: "reverse",
				}}
			>
				<RegenerateImageIcon />
			</div>
			<div className="text-xs font-medium">
				{loading ? "Generating..." : text}{" "}
				{!loading && <span className="text-purple-600">(4 Credits)</span>}
			</div>
		</Button>
	);
}

function ImageRegenerationPopup({
	story,
	segment,
	onClose,
	dispatch,
	segmentIndex,
	sceneIndex,
	regenerateOnOpen,
	open,
}: {
	segment: Segment;
	story: EditStoryDraft;
	onClose: () => void;
	dispatch: React.Dispatch<EditStoryAction>;
	segmentIndex: number;
	sceneIndex: number;
	regenerateOnOpen?: boolean;
	open: boolean;
}) {
	const imageAspectRatio = GetImageRatio(story.resolution).ratio;
	const loading = segment.alternateImagesStatus === StoryStatus.PENDING;
	const [selectedImageKey, setSelectedImageKey] = useState<string | undefined>(
		""
	);
	const alternateImageKeys = useMemo(
		() => segment.alternateImageKeys ?? [],
		[segment.alternateImageKeys]
	);

	const generateAlternateImageOptions = useCallback(async () => {
		dispatch({
			type: "edit_segment",
			sceneIndex,
			segmentIndex: segmentIndex,
			segment: { ...segment, alternateImagesStatus: StoryStatus.PENDING },
		});

		try {
			const regeneratedImages = await api.video.regenerateImage({
				// @ts-ignore
				image_style: segment.settings?.style ?? StoryImageStyles.Realistic,
				prompt: segment.settings?.prompt ?? segment.textContent,
				segment_idx: segment.id,
				story_id: story.id,
				story_type: story.type,
				cfg_scale: segment.settings?.denoising ?? 7,
				sampling_steps: segment.settings?.samplingSteps ?? 8,
				seed: segment.settings?.seed ?? 3121472823,
				batch_size: 4,
			});
			dispatch({
				type: "edit_segment",
				sceneIndex,
				segmentIndex: segmentIndex,
				segment: {
					...segment,
					alternateImagesStatus: StoryStatus.COMPLETE,
					alternateImageKeys: regeneratedImages.target_paths,
				},
			});
			setSelectedImageKey(regeneratedImages.target_paths?.[0]);
		} catch (error) {
			// TODO: handle error case
		}
	}, [segment, story, dispatch, segmentIndex, sceneIndex]);

	const insertImage = useCallback(async () => {
		try {
			await api.video.saveImage({
				image_key: selectedImageKey!,
				segment_idx: segment.id,
				story_id: story.id,
				story_type: story.type,
			});

			dispatch({
				type: "edit_segment",
				sceneIndex,
				segmentIndex: segmentIndex,
				segment: {
					...segment,
					imageKey: selectedImageKey!,
					alternateImageKeys: [],
				},
			});
		} catch (error) {
			// TODO: handle error case
		}
		onClose();
	}, [
		selectedImageKey,
		segment,
		story.id,
		story.type,
		dispatch,
		sceneIndex,
		segmentIndex,
		onClose,
	]);

	useEffect(() => {
		if (open && regenerateOnOpen && !loading) {
			generateAlternateImageOptions();
		}
	}, [open]);

	if (loading || alternateImageKeys.length > 0) {
		return (
			<PopoverContent
				side="right"
				onInteractOutside={(e) => {
					if (loading) {
						e.preventDefault();
					} else {
						onClose();
					}
				}}
				className={cn(
					"rounded-[10px] bg-white p-3 flex flex-col gap-2 items-start backdrop-blur-[5px]",
					story.resolution === AspectRatios["1024x576"]
						? "w-[436px]"
						: "w-[276px]"
				)}
				style={{
					boxShadow:
						"0px 0px 0px 1px rgba(18, 55, 105, 0.08), 0px 1px 2px 0px #E1EAEF, 0px 24px 32px -12px rgba(54, 57, 74, 0.24)",
				}}
			>
				<RegenerationPopupHeader
					title="Generate & Select New Image"
					onClose={onClose}
				/>
				<div className="relative w-full flex gap-1.5">
					{!loading && (
						<>
							<div className="flex flex-col gap-1.5">
								{alternateImageKeys.map((imageKey) => (
									<div
										className="flex grow items-center justify-center cursor-pointer"
										key={imageKey}
										onClick={() => {
											setSelectedImageKey(imageKey);
										}}
									>
										{selectedImageKey === imageKey ? (
											<CheckedCheckBox />
										) : (
											<UncheckedCheckBox />
										)}
									</div>
								))}
							</div>
							<div className="bg-gray min-h-full gap-1.5 w-full grid grid-col-5 grid-flow-col">
								{alternateImageKeys.map((imageKey) => (
									<ImageContainer
										key={imageKey}
										imageAspectRatio={imageAspectRatio}
										segment={segment}
										imageKey={imageKey}
										onSelection={setSelectedImageKey}
										active={selectedImageKey === imageKey}
									/>
								))}
								{selectedImageKey && (
									<ImageContainer
										imageAspectRatio={imageAspectRatio}
										segment={segment}
										imageKey={selectedImageKey}
										expanded
										onSelection={setSelectedImageKey}
									/>
								)}
							</div>
						</>
					)}
					{loading && (
						<>
							<div className="flex flex-col gap-1.5">
								{Array(4)
									.fill(0)
									.map((_, index) => (
										<div
											className="flex grow items-center justify-center"
											key={index}
										>
											<UncheckedCheckBox />
										</div>
									))}
							</div>
							<div className="bg-gray min-h-full gap-1.5 w-full grid grid-col-5 grid-flow-col">
								{Array(4)
									.fill(0)
									.map((_, index) => (
										<ImageContainer
											key={index}
											imageAspectRatio={imageAspectRatio}
											segment={segment}
											onSelection={setSelectedImageKey}
											loading
											active
										/>
									))}
								{(selectedImageKey || loading) && (
									<ImageContainer
										imageAspectRatio={imageAspectRatio}
										segment={segment}
										expanded
										onSelection={setSelectedImageKey}
										loading
									/>
								)}
							</div>
						</>
					)}
				</div>
				<RegenerationPopupScriptContent text={segment.textContent} />
				<RegenerateButton
					text="Regenerate Choices"
					onClick={() => {
						generateAlternateImageOptions();
					}}
					loading={loading}
				/>
				<Button
					className={cn(
						"flex gap-0.5 items-center justify-center w-full h-fit rounded-sm bg-[#8F22CE] text-white text-sm font-medium py-1.5 px-2 grow hover:bg-[#5f1586]",
						loading ? "bg-slate-100 text-slate-400 border-slate-400" : ""
					)}
					style={{
						boxShadow: !loading
							? "0px -1px 12px 0px rgba(255, 255, 255, 0.12) inset, 0px 0px 0px 1px #8F22CE"
							: "none",
					}}
					disabled={!selectedImageKey || loading}
					onClick={insertImage}
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="16"
						height="16"
						viewBox="0 0 16 16"
						fill="none"
					>
						<path
							fill-rule="evenodd"
							clip-rule="evenodd"
							d="M12.2306 3.97533C12.5387 4.17683 12.6252 4.58999 12.4238 4.89815L7.89041 11.8315C7.78357 11.9949 7.61048 12.1032 7.41684 12.1279C7.22319 12.1527 7.02843 12.0912 6.88398 11.9599L3.95064 9.29328C3.6782 9.04561 3.65813 8.62397 3.9058 8.35154C4.15347 8.0791 4.5751 8.05901 4.84754 8.30669L7.20233 10.4474L11.3078 4.16849C11.5093 3.86033 11.9224 3.77385 12.2306 3.97533Z"
							fill="currentColor"
						/>
					</svg>
					Insert Selected
				</Button>
			</PopoverContent>
		);
	}

	return (
		<PopoverContent
			side="right"
			onInteractOutside={() => {
				onClose();
			}}
			className={cn(
				"rounded-[10px] bg-white p-3 flex flex-col gap-2 items-start backdrop-blur-[5px]",
				story.resolution === AspectRatios["1024x576"]
					? "w-[340px]"
					: "w-[208px]"
			)}
			style={{
				boxShadow:
					"0px 0px 0px 1px rgba(18, 55, 105, 0.08), 0px 1px 2px 0px #E1EAEF, 0px 24px 32px -12px rgba(54, 57, 74, 0.24)",
			}}
		>
			<RegenerationPopupHeader title="Generated Image" onClose={onClose} />
			<div
				className="relative w-full"
				style={{
					aspectRatio: imageAspectRatio,
				}}
			>
				<Image
					alt={segment.textContent}
					src={Format.GetImageUrl(segment.imageKey)}
					className="rounded-sm"
					layout="fill"
					objectFit="cover" // Or use 'cover' depending on the desired effect
					style={{ objectFit: "contain" }}
				/>
			</div>
			<RegenerationPopupScriptContent text={segment.textContent} />
			<RegenerateButton
				text="Regenerate"
				onClick={() => {
					generateAlternateImageOptions();
				}}
				loading={false}
			/>
		</PopoverContent>
	);
}

export default ImageRegenerationPopup;
