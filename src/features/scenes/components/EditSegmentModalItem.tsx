import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
	Plus,
	ImagePlus,
	Info,
	ScrollText,
	Unlock,
	RefreshCcw,
	Shuffle,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import React from "react";
import {
	EditStoryAction,
	EditStoryDraft,
	Segment,
	Settings,
	StoryStatus,
} from "../reducers/edit-reducer";
import { StoryImageStyles } from "@/utils/enums";
import { keys } from "@/utils/enumKeys";
import Format from "@/utils/format";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { GetDisplayImageRatio } from "@/utils/image-ratio";
import { MAX_SEGMENT_LENGTH } from "@/constants/constants";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { TooltipProvider } from "@/components/ui/tooltip";
import TooltipComponent from "@/components/ui/tooltip-component";
import ImageRegenerationPopoverHOC from "./ImageRegenerationPopoverHOC";
import createSeed from "@/utils/create-seed";
import ImageRegenerationLoader from "./ImageRegenerationLoader";
import { useMutation } from "@tanstack/react-query";
import api from "@/api";
import { getImageCost } from "@/utils/credit-cost";
import { cn } from "@/utils";

export default function EditSegmentModalItem({
	segment,
	story,
	onSegmentEdit,
	segmentIndex,
	onSegmentDelete,
	imageRegenerationSegmentDetails,
	setImageRegenerationSegmentDetails,
	dispatch,
	sceneIndex,
	handleSubmitEditSegments,
}: {
	segment: Segment;
	story: EditStoryDraft;
	onSegmentEdit: (updatedSegment: Segment) => void;
	dispatch: React.Dispatch<EditStoryAction>;
	segmentIndex: number;
	onSegmentDelete: (segmentIndex: number) => void;
	imageRegenerationSegmentDetails: {
		sceneIndex: number;
		segmentIndex: number;
	} | null;
	setImageRegenerationSegmentDetails: React.Dispatch<
		React.SetStateAction<{
			sceneIndex: number;
			segmentIndex: number;
		} | null>
	>;
	sceneIndex: number;
	handleSubmitEditSegments: () => void;
}) {
	const [isChecked, setIsChecked] = useState(false);
	const [imageStatus, setImageStatus] = useState(segment.imageStatus);

	const UploadImage = useMutation({ mutationFn: api.video.uploadSegmentImage });

	useEffect(() => {
		// The idea cycle should be READY -> PENDING -> COMPLETE
		if (
			imageStatus === StoryStatus.PENDING &&
			segment.imageStatus === StoryStatus.READY
		)
			return;
		setImageStatus(segment.imageStatus);
	}, [segment.imageStatus]);

	const [regeneratingImage, setRegeneratingImage] = useState(false);
	return (
		<div className="flex bg-primary-foreground rounded-md border-border border-[1px] p-2 m-2 gap-2">
			<div className="w-full text-foreground space-y-2">
				<div className="flex flex-row space-x-2 items-center">
					<div
						className="h-56"
						style={{
							aspectRatio: GetDisplayImageRatio(story.displayResolution).ratio,
						}}
					>
						<ImageRegenerationPopoverHOC
							handleSubmitEditSegments={handleSubmitEditSegments}
							segment={segment}
							story={story}
							open={
								imageRegenerationSegmentDetails?.segmentIndex ===
									segmentIndex &&
								imageRegenerationSegmentDetails?.sceneIndex === sceneIndex
							}
							onClose={() => {
								setImageRegenerationSegmentDetails((prevSegmentId) => {
									if (
										prevSegmentId?.segmentIndex === segmentIndex &&
										prevSegmentId?.sceneIndex === sceneIndex
									)
										return null;
									return prevSegmentId;
								});
							}}
							dispatch={dispatch}
							segmentIndex={segmentIndex}
							sceneIndex={sceneIndex}
							regenerateOnOpen={regeneratingImage}
							triggerButtonClassName="w-full h-full"
						>
							<div className="relative w-full h-full">
								{segment.imageStatus !== StoryStatus.COMPLETE ? (
									<ImageRegenerationLoader
										arcSize={42}
										starSize={16}
										circleSize={48}
									/>
								) : (
									<Image
										onClick={() => {
											setImageRegenerationSegmentDetails({
												sceneIndex: sceneIndex,
												segmentIndex: segmentIndex,
											});
											setRegeneratingImage(false);
										}}
										alt={segment.textContent}
										src={Format.GetImageUrl(segment.imageKey)}
										className="rounded-sm"
										layout="fill"
										objectFit="cover" // Or use 'cover' depending on the desired effect
										style={{ objectFit: "contain" }}
									/>
								)}
							</div>
						</ImageRegenerationPopoverHOC>
					</div>
					<div className="w-full h-full self-start flex flex-col space-y-3">
						<div>
							<div className="relative w-full h-fit">
								<ScrollText className="h-6 w-6 stroke-slate-400 stroke-1 p-1 absolute top-[calc(50%-0.75rem)] left-1 " />
								<Unlock className="h-6 w-6 stroke-slate-400 stroke-1 p-1 absolute top-[calc(50%-0.75rem)] right-1 " />
								<Input
									value={segment.textContent}
									onChange={(e) => {
										if (e.target.value.length < MAX_SEGMENT_LENGTH)
											onSegmentEdit({
												...segment,
												textContent: e.target.value,
											});
									}}
									className="pl-10 h-7 active:outline-none active:border-none focus-visible:ring-accent-300 focus-visible:ring-1 text-slate-900"
								/>
							</div>
							{segment.textContent.length >= MAX_SEGMENT_LENGTH - 1 && (
								<p className="text-xs text-red-500">Character Limit Reached</p>
							)}
						</div>
						<div className="flex justify-between">
							<div className="flex items-center space-x-2">
								<Switch
									id="advanced-editing"
									style={{
										background: isChecked ? "#A734EA" : undefined,
									}}
									onCheckedChange={(checked) => setIsChecked(checked)}
								/>
								<Label className="font-normal" htmlFor="advanced-editing">
									Advanced Editing
								</Label>
							</div>
							<div className="flex items-center space-x-1 text-muted-foreground">
								<label className="flex py-[4px] w-36 justify-center gap-1 h-fit bg-muted border-border border-[1px] pl-3 pr-2 rounded-md items-center cursor-pointer hover:text-slate-700 transition-colors ease-in-out font-medium text-sm">
									<Input
										onChange={async (e) => {
											const fileElement = e.target as HTMLInputElement;
											if (fileElement.files && fileElement.files.length > 0) {
												const file = fileElement.files[0]!;
												await UploadImage.mutateAsync({
													id: story.id,
													image: file,
													index: segment.id,
												});
											}
										}}
										disabled={UploadImage.isPending}
										type="file"
										accept="image/*"
										className="hidden" // Hide the actual input but keep it functional
										// onChange={/* your file change handler here */}
									/>
									{UploadImage.isPending ? (
										<RefreshCcw
											width={"18px"}
											height={"18px"}
											className="stroke-1 animate-spin"
											style={{ animationDirection: "reverse" }}
										/>
									) : (
										<ImagePlus
											width={"18px"}
											height={"18px"}
											className="stroke-1"
										/>
									)}

									{UploadImage.isPending ? "Uploading" : "Image"}
									<Plus width={"18px"} height={"18px"} className="stroke-1" />
								</label>
								{/*
								<Button
									className="flex  py-1 gap-1 h-fit bg-muted border-border border-[1px] rounded-md items-center"
									variant="outline"
								>
									<ImagePlus
										width={"18px"}
										height={"18px"}
										className="stroke-1"
									/>
									Image
									<Plus width={"18px"} height={"18px"} className="stroke-1" />
								</Button> */}
								<Button
									className="flex py-1 gap-1 text-white h-fit  border-border border-[1px] rounded-md items-center"
									variant="default"
									onClick={() => {
										setImageRegenerationSegmentDetails({
											sceneIndex: sceneIndex,
											segmentIndex: segmentIndex,
										});
										setRegeneratingImage(true);
									}}
									disabled={
										segment.alternateImagesStatus === StoryStatus.PENDING
									}
								>
									<RefreshCcw
										className="stroke-1"
										width={"18px"}
										height={"18px"}
									/>
									{segment.alternateImagesStatus !== StoryStatus.PENDING &&
										"Regenerate"}
									{segment.alternateImagesStatus === StoryStatus.PENDING &&
										"Regenerating"}
									<p>{`(${getImageCost(1)} ${Format.Pluralize("Credit", getImageCost(1))})`}</p>
								</Button>
							</div>
						</div>
						<AdvancedEditingOptions
							show={isChecked}
							settings={segment.settings}
							onSettingsChange={(settings) => {
								onSegmentEdit({
									...segment,
									settings: settings,
								});
							}}
						/>
					</div>
				</div>
			</div>
		</div>
	);
}

function AdvancedEditingOptions({
	settings,
	onSettingsChange,
	show,
}: {
	settings?: Settings;
	onSettingsChange: (settings: Settings) => void;
	show: boolean;
}) {
	const [seed, setSeed] = useState(`${settings?.seed ?? -1}`);
	useEffect(() => {
		setSeed(`${settings?.seed ?? -1}`);
	}, [settings?.seed]);
	return (
		<TooltipProvider>
			{/* <div
				className={cn(
					"border-[1px] rounded-md p-5 text-sm hidden transition transform ease-in-out duration-10000",
					show && "block"
				)}
				style={{
					boxShadow: "0px 0px 6px 0px #D7CBE1",
					border: "0.5px solid #BB55F7",
				}}
			> */}
			<div
				className={cn(
					"border-[1px] rounded-md p-5 text-sm transition-transform ease-in-out duration-200 overflow-hidden transform",
					show ? "scale-y-100 opacity-100" : "scale-y-0 opacity-0 max-h-0"
				)}
				style={{
					boxShadow: "0px 0px 6px 0px #D7CBE1",
					border: "0.5px solid #BB55F7",
					transition: "transform 200ms ease-in-out, opacity 200ms ease-in-out",
					// Ensuring transform origin is top to scale from top to bottom
					transformOrigin: "top",
				}}
			>
				<label
					htmlFor="image-animation-prompt"
					className="flex items-center gap-1"
				>
					Image Prompt
					<TooltipComponent label="The Image Prompt">
						<Info width={"18px"} height={"18px"} color="#A6B6FC" />
					</TooltipComponent>
					<p className="text-gray-500">
						{settings?.prompt
							? "Prompt is used, text is ignored"
							: "Prompt is generated based on text"}
					</p>
				</label>

				<Textarea
					id="image-animation-prompt"
					rows={3}
					className="w-full border-[1px] m-1 rounded-md p-2"
					placeholder="Write your image animation prompt here"
					value={settings?.prompt ?? ""}
					onChange={(e) => {
						onSettingsChange({
							...settings,
							prompt: e.target.value,
						});
					}}
				/>

				<div className="flex gap-6">
					<div className="w-[50%] ">
						<label
							htmlFor="image-animation-style"
							className="flex items-center gap-1"
						>
							Style
							<TooltipComponent label="The Image Style">
								<Info width={"18px"} height={"18px"} color="#A6B6FC" />
							</TooltipComponent>
						</label>
						<Select
							defaultValue={(
								settings?.style ?? StoryImageStyles.Realistic
							).toString()}
							onValueChange={(value) =>
								onSettingsChange({ ...settings, style: Number(value) })
							}
						>
							<SelectTrigger className="w-full m-1">
								<SelectValue
									placeholder="Select a style"
									defaultValue={StoryImageStyles.Realistic}
								/>
							</SelectTrigger>
							<SelectContent>
								{keys(StoryImageStyles).map((label, index) => (
									<SelectItem key={index} value={index.toString()}>
										{label}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
					<div className="w-[50%] ">
						<label
							htmlFor="image-animation-prompt"
							className="flex items-center gap-1"
						>
							Seed
							<TooltipComponent label="A random seed for the image">
								<Info width={"18px"} height={"18px"} color="#A6B6FC" />
							</TooltipComponent>
						</label>

						<div className="relative">
							<Input
								id="seed"
								type="number"
								min={-1}
								max={2e16 - 1}
								className="w-full border-[1px] rounded-md m-1 p-2"
								placeholder="2"
								value={seed}
								onChange={(e) => {
									const parsedSeed = parseInt(e.target.value);
									if (isNaN(parsedSeed)) return setSeed(e.target.value);
									const newSeed =
										parsedSeed < -1
											? -1
											: parsedSeed > 2e16 - 1
												? 2e16 - 1
												: parsedSeed;
									onSettingsChange({
										...settings,
										seed: newSeed,
									});
									setSeed(newSeed.toString());
								}}
							/>
							<Shuffle
								className="h-8 w-8 absolute stroke-1 right-0 top-1 p-1 rounded-sm shadow-sm hover:cursor-pointer border-border border-[1px]"
								onClick={() => {
									onSettingsChange({
										...settings,
										seed: createSeed(),
									});
								}}
							/>
						</div>
					</div>
				</div>
				<div className="flex gap-6">
					<div className="w-[50%] ">
						<label
							htmlFor="denoising-factor"
							className="flex items-center gap-1"
						>
							Prompt Guidance
							<TooltipComponent label="How much the image should follow the instructions of the prompt">
								<Info width={"18px"} height={"18px"} color="#A6B6FC" />
							</TooltipComponent>
						</label>
						<div className="flex w-full gap-1 px-1 rounded-sm bg-gradient-to-l from-blue-200 via-white to-transparent">
							<Input
								id="denoising-factor"
								className="w-16"
								type="number"
								min={0}
								max={100}
								step={1}
								placeholder="2"
								value={settings?.denoising ?? 2}
								onChange={(e) => {
									onSettingsChange({
										...settings,
										denoising: parseInt(e.target.value),
									});
								}}
							/>
							<Slider
								value={[settings?.denoising ?? 2]}
								max={5}
								min={0}
								trackBgColor="bg-indigo-600"
								trackBorderColor="border-indigo-600"
								step={0.5}
								onValueChange={(value) => {
									onSettingsChange({
										...settings,
										denoising: value[0],
									});
								}}
							/>
						</div>
					</div>
					<div className="w-[50%] ">
						<label
							htmlFor="image-animation-prompt"
							className="flex items-center gap-1"
						>
							Quality & Details
							<TooltipComponent label="The quality and level of detail in the image">
								<Info width={"18px"} height={"18px"} color="#A6B6FC" />
							</TooltipComponent>
						</label>
						<div className="flex w-full gap-1 px-1 rounded-sm bg-gradient-to-l from-blue-200 via-white to-transparent">
							<Input
								id="sampling-steps"
								type="number"
								min={1}
								max={15}
								className="w-16"
								placeholder="2"
								value={settings?.samplingSteps ?? 8}
								onChange={(e) => {
									onSettingsChange({
										...settings,
										samplingSteps: parseInt(e.target.value),
									});
								}}
							/>
							<Slider
								value={[settings?.samplingSteps ?? 8]}
								max={15}
								min={2}
								step={1}
								trackBgColor="bg-indigo-600"
								trackBorderColor="border-indigo-600"
								onValueChange={(value) => {
									onSettingsChange({
										...settings,
										samplingSteps: value[0],
									});
								}}
							/>
						</div>
					</div>
				</div>
			</div>
		</TooltipProvider>
	);
}
