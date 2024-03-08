import { Button } from "@/components/ui/button";
import { PopoverContent } from "@/components/ui/popover";
import { cn } from "@/utils";
import { AspectRatios, StoryImageStyles, AllowanceType } from "@/utils/enums";
import Format from "@/utils/format";
import { GetDisplayImageRatio } from "@/utils/image-ratio";
import Image from "next/image";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
	EditStoryAction,
	EditStoryDraft,
	Segment,
	Settings,
	StoryStatus,
} from "../reducers/edit-reducer";
import api from "@/api";
import UncheckedCheckBox from "@/components/icons/scene-editor/unchecked-check-box";
import CheckedCheckBox from "@/components/icons/scene-editor/checked-check-box";
import RegenerateImageIcon from "@/components/icons/scene-editor/regenerate-image-icon";
import ImageRegenerationLoader from "./ImageRegenerationLoader";
import { CheckIcon, Lock, ScrollText, Sparkle, X, Plus } from "lucide-react";
import { getImageCost } from "@/utils/credit-cost";
import { useMediaQuery } from "usehooks-ts";
import useUpdateUser from "@/hooks/useUpdateUser";
import CheckoutDialog from "@/features/pricing/checkout-dialog";
import UpgradeSubscriptionDialog from "@/features/pricing/upgrade-subscription-dialog";
import { useUserCanUseCredits } from "@/utils/payment";

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
	onHover,
}: {
	segment: Segment;
	imageAspectRatio: number;
	expanded?: boolean;
	imageKey?: string;
	onSelection: (imageKey: string) => void;
	loading?: boolean;
	active?: boolean;
	onHover?: (imageKey: string) => void;
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
			onMouseEnter={() => {
				if (onHover && !loading) {
					onHover(imageKey!);
				}
			}}
			onMouseLeave={() => {
				if (onHover && !loading) {
					onHover("");
				}
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
	hidePopupTimerRef,
	showPopupTimerRef,
	imageRegenerationSegmentDetails,
	setImageRegenerationSegmentDetails,
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
	hidePopupTimerRef?: React.MutableRefObject<NodeJS.Timeout | null>;
	showPopupTimerRef?: React.MutableRefObject<NodeJS.Timeout | null>;
	imageRegenerationSegmentDetails: {
		sceneIndex: number;
		segmentIndex: number;
		segmentSettings?: Settings;
		disabledHover?: boolean;
	} | null;
	setImageRegenerationSegmentDetails: React.Dispatch<
		React.SetStateAction<{
			sceneIndex: number;
			segmentIndex: number;
			segmentSettings?: Settings;
			disabledHover?: boolean;
		} | null>
	>;
}) {
	const imageAspectRatio = GetDisplayImageRatio(story.displayResolution).ratio;
	const [isRegeneratingImages, setIsRegeneratingImages] = useState(false);
	const [regenerateImage, setRegenerateImages] = useState(false);
	const [openStoryBooksDialog, setOpenStoryBooksDialog] = useState(false);
	const [openSubscriptionDialog, setOpenSubscriptionDialog] = useState(false);

	const loading =
		segment.alternateImagesStatus === StoryStatus.PENDING ||
		isRegeneratingImages;
	const [selectedImageKey, setSelectedImageKey] = useState<string | undefined>(
		""
	);
	const [hoveredImage, setHoveredImageKey] = useState<string | undefined>("");
	const alternateImageKeys = useMemo(
		() => segment.alternateImageKeys ?? [],
		[segment.alternateImageKeys]
	);
	const segmentSettings =
		imageRegenerationSegmentDetails?.segmentSettings || segment.settings;

	const { userCanUseCredits } = useUserCanUseCredits();

	const triggerRegenerationOfImages = useCallback(async () => {
		const { error } = await userCanUseCredits({
			credits: getImageCost(4),
			variant: "credits",
		});

		console.log(error);

		if (error) {
			if (error === "using custom plan" || error === "not paid subscription") {
				setOpenSubscriptionDialog(true);
			}
			if (error === "not enough credits") {
				setOpenStoryBooksDialog(true);
			}
			return;
		}

		setIsRegeneratingImages(true);
		if (imageRegenerationSegmentDetails) {
			setImageRegenerationSegmentDetails({
				...imageRegenerationSegmentDetails,
				disabledHover: true,
			});
		}
		await handleSubmitEditSegments();
		setRegenerateImages(true);
	}, [handleSubmitEditSegments]);

	const { invalidateUser } = useUpdateUser();

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
			console.log(segment.settings);
			const regeneratedImages = await api.video.regenerateImage({
				// @ts-ignore
				image_style: segmentSettings?.style ?? StoryImageStyles.Realistic,
				prompt: segmentSettings?.prompt || segment.textContent,
				segment_idx: segment.id,
				story_id: story.id,
				story_type: story.type,
				cfg_scale: segmentSettings?.denoising ?? 2,
				sampling_steps: segmentSettings?.samplingSteps ?? 8,
				seed: segmentSettings?.seed ?? 3121472823,
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
			invalidateUser();
			setIsRegeneratingImages(false);
			setSelectedImageKey(regeneratedImages.target_paths?.[0]);
		} catch (error) {
			setIsRegeneratingImages(false);
			// TODO: handle error case
		}
	}, [segment, dispatch, sceneIndex, segmentIndex, story, segmentSettings]);

	const insertImage = useCallback(async () => {
		try {
			await api.video.saveImage({
				image_key: selectedImageKey!,
				segment_idx: segment.id,
				story_id: story.id,
				story_type: story.type,
				image_prompt: segmentSettings?.prompt || segment.textContent,
				image_cfg_scale: segmentSettings?.denoising ?? 2,
				image_resolution: story.resolution,
				image_sampling_steps: segmentSettings?.samplingSteps ?? 8,
				image_seed: segmentSettings?.seed ?? 3121472823,
				image_alt_text: segment.textContent,
				// @ts-ignore
				image_style: story.settings?.style ?? StoryImageStyles.Realistic,
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
		onClose,
		selectedImageKey,
		segment,
		story,
		segmentSettings,
		dispatch,
		sceneIndex,
		segmentIndex,
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

	const onMouseEnter = () => {
		if (hidePopupTimerRef?.current) {
			clearTimeout(hidePopupTimerRef.current);
		}
	};

	const onMouseLeave = () => {
		if (showPopupTimerRef?.current) {
			clearTimeout(showPopupTimerRef.current);
		}
		if (
			open &&
			hidePopupTimerRef &&
			imageRegenerationSegmentDetails &&
			!imageRegenerationSegmentDetails.disabledHover
		) {
			hidePopupTimerRef.current = setTimeout(() => {
				onClose();
			}, 500);
		}
	};

	const isMobile = useMediaQuery("(max-width: 1024px)");

	if (loading || alternateImageKeys.length > 0) {
		return (
			<PopoverContent
				side={isMobile ? "bottom" : "right"}
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
				onMouseEnter={onMouseEnter}
				onMouseLeave={onMouseLeave}
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
										onHover={
											imageRegenerationSegmentDetails &&
											!imageRegenerationSegmentDetails.disabledHover
												? setHoveredImageKey
												: undefined
										}
									/>
								))}
								{selectedImageKey && (
									<ImageContainer
										imageAspectRatio={imageAspectRatio}
										segment={segment}
										imageKey={hoveredImage || selectedImageKey}
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
			onMouseEnter={onMouseEnter}
			onMouseLeave={onMouseLeave}
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

			<CheckoutDialog
				variant="credits"
				allowanceType={AllowanceType.Credits}
				open={openStoryBooksDialog}
				setOpen={setOpenStoryBooksDialog}
			/>

			<UpgradeSubscriptionDialog
				open={openSubscriptionDialog}
				setOpen={setOpenSubscriptionDialog}
			/>
		</PopoverContent>
	);
}

export default ImageRegenerationPopup;
