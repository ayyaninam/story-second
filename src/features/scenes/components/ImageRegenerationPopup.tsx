import { Button } from "@/components/ui/button";
import { PopoverContent } from "@/components/ui/popover";
import { cn } from "@/utils";
import { AspectRatios, StoryImageStyles } from "@/utils/enums";
import Format from "@/utils/format";
import { GetDisplayImageRatio } from "@/utils/image-ratio";
import Image from "next/image";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
	EditStoryAction,
	EditStoryDraft,
	Segment,
	StoryStatus,
} from "../reducers/edit-reducer";
import api from "@/api";
import UncheckedCheckBox from "@/components/icons/scene-editor/unchecked-check-box";
import CheckedCheckBox from "@/components/icons/scene-editor/checked-check-box";
import RegenerateImageIcon from "@/components/icons/scene-editor/regenerate-image-icon";
import ImageRegenerationLoader from "./ImageRegenerationLoader";
import { CheckIcon, Lock, ScrollText, Sparkle, X, Plus } from "lucide-react";
import { getImageCost } from "@/utils/credit-cost";
import { useSubmitEditScenesAndSegments } from "../mutations/SaveScenesAndSegments";
import useWebstoryContext from "@/features/edit-story/providers/WebstoryContext";

function RegenerationPopupHeader({
	title,
	onClose,
}: {
	title: string;
	onClose: () => void;
}) {
	return (
		<div className="flex w-full gap-1 items-center">
			<Sparkle fill="#A734EA" stroke="transparent" width={18} height={18} />
			<div className="text-foreground text-sm font-medium grow">{title}</div>
			<div
				className="p-1 cursor-pointer rounded-full bg-muted w-6 h-6 overflow-hidden flex items-center justify-center"
				onClick={() => {
					onClose();
				}}
			>
				<X className="text-foreground" strokeWidth={2} width={16} />
			</div>
		</div>
	);
}

function RegenerationPopupScriptContent({ text }: { text: string }) {
	return (
		<div className="py-1 px-2 items-center bg-muted rounded-sm border border-input w-full flex gap-2 overflow-hidden">
			<ScrollText className="min-w-4 min-h-4 text-muted-foreground" />
			<div className="text-xs grow whitespace-nowrap text-ellipsis overflow-hidden">
				{text}
			</div>
			<Lock className="min-w-4 min-h-4 text-muted-foreground" />
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
			// style={{
			// 	boxShadow:
			// 		active && !loading
			// 			? "0px 0px 3.468px 0.991px #924FE8, 0px 0px 0px 0.991px #924FE8, 0px 0px 0px 0.495px #FFF inset"
			// 			: "none",
			// }}
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
					<ImageRegenerationLoader
						arcSize={expanded ? 43 : 21}
						starSize={expanded ? 16 : 8}
						circleSize={expanded ? 48 : 24}
					/>
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
			className="flex px-2 py-1 w-full h-fit justify-center items-center gap-1 grow h-fit-content rounded-sm border border-border bg-background shadow-sm"
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
			<div className="text-xs font-medium text-foreground">
				{loading ? "Generating..." : text}{" "}
				{!loading && (
					<span className="text-purple-600">
						{`(${getImageCost(4)} ${Format.Pluralize("Credit", getImageCost(4))})`}
					</span>
				)}
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
	handleSubmitEditSegments,
}: {
	segment: Segment;
	story: EditStoryDraft;
	onClose: () => void;
	dispatch: React.Dispatch<EditStoryAction>;
	segmentIndex: number;
	sceneIndex: number;
	regenerateOnOpen?: boolean;
	open: boolean;
	handleSubmitEditSegments: () => void;
}) {
	const imageAspectRatio = GetDisplayImageRatio(story.displayResolution).ratio;
	const [isRegeneratingImages, setIsRegeneratingImages] = useState(false);
	const [regenerateImage, setRegenerateImages] = useState(false);

	const loading =
		segment.alternateImagesStatus === StoryStatus.PENDING ||
		isRegeneratingImages;
	const [selectedImageKey, setSelectedImageKey] = useState<string | undefined>(
		""
	);
	const alternateImageKeys = useMemo(
		() => segment.alternateImageKeys ?? [],
		[segment.alternateImageKeys]
	);

	const triggerRegenerationOfImages = useCallback(async () => {
		setRegenerateImages(true);
		await handleSubmitEditSegments();
	}, [handleSubmitEditSegments]);

	const generateAlternateImageOptions = useCallback(async () => {
		const prevImageStatus = segment.imageStatus;
		dispatch({
			type: "edit_segment",
			sceneIndex,
			segmentIndex: segmentIndex,
			segment: {
				...segment,
				alternateImagesStatus: StoryStatus.PENDING,
				imageStatus: StoryStatus.PENDING,
			},
		});
		setIsRegeneratingImages(true);

		try {
			const regeneratedImages = await api.video.regenerateImage({
				// @ts-ignore
				image_style: segment.settings?.style ?? StoryImageStyles.Realistic,
				prompt: segment.settings?.prompt || segment.textContent,
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
					imageStatus: prevImageStatus,
					alternateImagesStatus: StoryStatus.COMPLETE,
					alternateImageKeys: regeneratedImages.target_paths,
				},
			});
			setIsRegeneratingImages(false);
			setSelectedImageKey(regeneratedImages.target_paths?.[0]);
		} catch (error) {
			setIsRegeneratingImages(false);
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
					imageStatus: StoryStatus.COMPLETE,
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

	// To trigger regeneration when the popup is opened and regenerateOnOpen is true
	useEffect(() => {
		if (open && regenerateOnOpen && !loading) {
			triggerRegenerationOfImages();
		}
	}, [open]);

	// To trigger regeneration after saving the segments
	useEffect(() => {
		if (regenerateImage) {
			setRegenerateImages(false);
			generateAlternateImageOptions();
		}
	}, [regenerateImage]);

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
					"rounded-[10px] bg-background p-3 flex flex-col gap-2 items-start backdrop-blur-[5px] shadow-md",
					story.resolution === AspectRatios["1024x576"]
						? "w-[436px]"
						: "w-[276px]"
				)}
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
							<div className="min-h-full gap-1.5 w-full grid grid-col-5 grid-flow-col">
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
						triggerRegenerationOfImages();
					}}
					loading={loading}
				/>
				<Button
					className={cn(
						"flex gap-0.5 items-center justify-center w-full h-fit rounded-sm bg-[#8F22CE] text-white text-sm font-medium py-1.5 px-2 grow hover:bg-[#5f1586] shadow-sm",
						loading ? "bg-muted text-muted-foreground border-border" : ""
					)}
					disabled={!selectedImageKey || loading}
					onClick={insertImage}
				>
					<CheckIcon className="h-4 w-4" />
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
				"rounded-[10px] bg-background p-3 flex flex-col gap-2 items-start backdrop-blur-[5px] shadow-sm",
				story.resolution === AspectRatios["1024x576"]
					? "w-[340px]"
					: "w-[208px]"
			)}
		>
			<RegenerationPopupHeader title="Generated Image" onClose={onClose} />
			<div
				className="relative w-full"
				style={{
					aspectRatio: imageAspectRatio,
				}}
			>
				{segment.imageStatus === StoryStatus.READY ? (
					<div className="w-full h-full bg-slate-100 rounded-sm border border-slate-300 flex items-center justify-center border-dashed">
						<div className="rounded-full w-6 h-6 bg-slate-200 flex items-center justify-center">
							<Plus
								className="text-slate-500 stroke-2"
								width={12}
								height={12}
							/>
						</div>
					</div>
				) : (
					<Image
						alt={segment.textContent}
						src={Format.GetImageUrl(segment.imageKey)}
						className="rounded-sm"
						layout="fill"
						objectFit="cover" // Or use 'cover' depending on the desired effect
						style={{ objectFit: "contain" }}
					/>
				)}
			</div>
			<RegenerationPopupScriptContent text={segment.textContent} />
			<RegenerateButton
				text="Regenerate"
				onClick={() => {
					triggerRegenerationOfImages();
				}}
				loading={false}
			/>
		</PopoverContent>
	);
}

export default ImageRegenerationPopup;
