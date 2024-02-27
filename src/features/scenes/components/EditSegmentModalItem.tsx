import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
	Plus,
	ImagePlus,
	Info,
	ScrollText,
	Unlock,
	RefreshCcw,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import React from "react";
import {
	EditStoryDraft,
	Segment,
	Settings,
	StoryStatus,
} from "../reducers/edit-reducer";
import { StoryImageStyles } from "@/utils/enums";
import { keys } from "@/utils/enumKeys";
import Format from "@/utils/format";
import { Skeleton } from "@/components/ui/skeleton";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { GetImageRatio } from "@/utils/image-ratio";
import { MAX_SEGMENT_LENGTH } from "@/constants";
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

export default function EditSegmentModalItem({
	segment,
	story,
	onSegmentEdit,
	onRegenerateImage,
}: {
	segment: Segment;
	story: EditStoryDraft;
	onSegmentEdit: (updatedSegment: Segment) => void;
	onSegmentDelete: () => void;
	onRegenerateImage: () => void;
	regeneratingImage: boolean;
}) {
	const [isChecked, setIsChecked] = useState(false);
	return (
		<div className="flex bg-slate-50 rounded-md border-border border-[1px] p-2 m-2 gap-2">
			<div className="w-full text-slate-950 space-y-2">
				<div className="flex flex-row space-x-2">
					<div
						className="relative h-56"
						style={{ aspectRatio: GetImageRatio(story.resolution).ratio }}
					>
						{segment.imageStatus !== StoryStatus.COMPLETE ? (
							<Skeleton className="w-full h-full" />
						) : (
							<Image
								alt={segment.textContent}
								src={Format.GetImageUrl(segment.imageKey)}
								className="rounded-sm"
								layout="fill"
								objectFit="cover"
								style={{ objectFit: "contain" }}
							/>
						)}
					</div>
					<div className="w-full h-full flex flex-col space-y-3">
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
									className="pl-10 h-7 focus-visible:ring-purple-300 focus-visible:ring-1 text-slate-900"
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
							<div className="flex items-center space-x-1 ">
								<Button
									className="flex  py-1 gap-1 h-fit bg-slate-50 text-slate-500 border-border border-[1px] rounded-md items-center"
									variant="outline"
								>
									<ImagePlus
										width={"18px"}
										height={"18px"}
										className="stroke-1"
									/>
									Image
									<Plus width={"18px"} height={"18px"} className="stroke-1" />
								</Button>
								<Button
									className="flex py-1 gap-1 bg-slate-50 h-fit text-slate-500 border-border border-[1px] rounded-md items-center"
									variant="outline"
									onClick={onRegenerateImage}
									disabled={segment.imageStatus === StoryStatus.PENDING}
								>
									<RefreshCcw
										className="stroke-1"
										width={"18px"}
										height={"18px"}
									/>
									{segment.imageStatus === StoryStatus.COMPLETE && "Regenerate"}
									{segment.imageStatus === StoryStatus.PENDING &&
										"Regenerating"}
									{segment.imageStatus === StoryStatus.READY &&
										"Save & Generate"}
								</Button>
							</div>
						</div>
						{isChecked && (
							<AdvancedEditingOptions
								settings={segment.settings}
								onSettingsChange={(settings) => {
									onSegmentEdit({
										...segment,
										settings: settings,
									});
								}}
							/>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}

function AdvancedEditingOptions({
	settings,
	onSettingsChange,
}: {
	settings?: Settings;
	onSettingsChange: (settings: Settings) => void;
}) {
	return (
		<TooltipProvider>
			<div
				className="border-[1px] rounded-md p-5 text-sm"
				style={{
					background: "linear-gradient(180deg, #FFF 0%, #F8FAFC 100%)",
					boxShadow: "0px 0px 6px 0px #D7CBE1",
					border: "0.5px solid #BB55F7",
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
						<Input
							id="seed"
							type="number"
							min={-1}
							max={2e16 - 1}
							className="w-full border-[1px] rounded-md m-1 p-2"
							placeholder="2"
							value={settings?.seed ?? -1}
							onChange={(e) => {
								onSettingsChange({
									...settings,
									seed: parseInt(e.target.value),
								});
							}}
						/>
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
						<div
							className="flex w-full gap-1 px-1 rounded-sm"
							style={{
								background:
									"linear-gradient(270deg, #E0E7FF 8.49%, rgba(224, 231, 255, 0.00) 88.35%)",
							}}
						>
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
						<div
							className="flex w-full gap-1 px-1 rounded-sm"
							style={{
								background:
									"linear-gradient(270deg, #E0E7FF 8.49%, rgba(224, 231, 255, 0.00) 88.35%)",
							}}
						>
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
