import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
	Settings2,
	GripVertical,
	RefreshCw,
	Trash2,
	SparkleIcon,
	ChevronDown,
	Plus,
	ImagePlus,
	Palette,
	Volume2,
	Info,
	CheckIcon,
	ChevronDownIcon,
	ChevronUpIcon,
	ScrollText,
	Undo2,
	Zap,
	EyeOff,
} from "lucide-react";
import Image from "next/image";
import { PropsWithChildren, useEffect, useState } from "react";
import * as Select from "@radix-ui/react-select";
import React from "react";
import { Segment, Settings, StoryStatus } from "../reducers/edit-reducer";
import { StoryImageStyles } from "@/utils/enums";
import { keys } from "@/utils/enumKeys";
import Format from "@/utils/format";
import { Skeleton } from "@/components/ui/skeleton";

type SelectItemProps = {
	value: string;
	disabled?: boolean;
};

const SelectItem = ({
	children,
	...props
}: PropsWithChildren<SelectItemProps>) => {
	return (
		<Select.Item {...props}>
			<Select.ItemText>{children}</Select.ItemText>
		</Select.Item>
	);
};

function RegenerateSegmentBar({
	segment,
	onTextContentChange,
	onRegenerateImage,
	regeneratingImage,
}: {
	segment: Segment;
	onTextContentChange: (change: string) => void;
	onRegenerateImage: () => void;
	regeneratingImage: boolean;
}) {
	return (
		<div className="flex w-full items-center rounded-sm  justify-between">
			{segment.imageStatus === StoryStatus.COMPLETE ? (
				<Image
					alt={segment.textContent}
					src={Format.GetImageUrl(segment.imageKey)}
					width={66}
					height={42}
				/>
			) : (
				<Skeleton>
					<div className="bg-slate-500 w-[66px] h-[42px]"></div>
				</Skeleton>
			)}
			<p className="text-gray-600">{segment.textContent}</p>
			<Button
				className="w-[150px] bg-accent-600"
				disabled={segment.videoStatus === StoryStatus.PENDING}
				onClick={() => onRegenerateImage()}
			>
				{segment.videoStatus === StoryStatus.PENDING
					? "Loading"
					: "Regenerate Video"}
			</Button>
		</div>
	);
}

function AdvancedEditingBar({
	onCheckedChange,
}: {
	onCheckedChange: (checked: boolean) => void;
}) {
	return (
		<div className="flex justify-between">
			<div className="flex items-center space-x-2">
				<Switch id="advanced-editing" onCheckedChange={onCheckedChange} />
				<Label htmlFor="advanced-editing">Advanced Editing</Label>
			</div>
			<div className="flex items-center space-x-1 ">
				<div className="flex p-1 m-1 gap-1 bg-slate-50 border-border border-[1px] rounded-md items-center">
					<ImagePlus width={"18px"} height={"18px"} color="#020817" />
					<p className="text-sm ">Image</p>
					<Plus width={"18px"} height={"18px"} color="#020817" />
				</div>
				<div className="flex p-1 m-1 gap-1 bg-slate-50 border-border border-[1px] rounded-md items-center">
					<Palette width={"18px"} height={"18px"} color="#020817" />
					<p className="text-sm ">Style</p>
					<ChevronDown width={"18px"} height={"18px"} color="#020817" />
				</div>
				<div className="flex p-1 m-1 gap-1 bg-slate-50 border-border border-[1px] rounded-md items-center">
					<Volume2 width={"18px"} height={"18px"} color="#020817" />
					<p className="text-sm ">Voice</p>
					<ChevronDown width={"18px"} height={"18px"} color="#020817" />
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
		<div className="bg-indigo-100 border-[1px] border-indigo-100 rounded-sm p-5">
			<label
				htmlFor="image-animation-prompt"
				className="flex items-center gap-1"
			>
				Image Prompt
				<Info width={"18px"} height={"18px"} color="#A6B6FC" />
			</label>
			<textarea
				id="image-animation-prompt"
				rows={2}
				className="w-full bg-slate-50 m-1 rounded-md p-2"
				placeholder="Write your image animation prompt here"
				value={settings?.prompt ?? ""}
				onChange={(e) => {
					if (settings)
						onSettingsChange({
							...settings,
							prompt: e.target.value,
						});
					else
						onSettingsChange({
							denoising: 0,
							prompt: e.target.value,
							samplingSteps: 1,
							style: StoryImageStyles.Realistic,
							voice: "",
						});
				}}
			/>

			<div className="flex gap-6">
				<div className="w-[50%] ">
					<label
						htmlFor="image-animation-style"
						className="flex items-center gap-1"
					>
						Image Style
						<Info width={"18px"} height={"18px"} color="#A6B6FC" />
					</label>
					<select
						id="image-animation-style"
						className="w-full bg-slate-50 m-1 rounded-md p-2"
						value={settings?.style ?? StoryImageStyles.Realistic}
						onChange={(e) => {
							if (settings)
								onSettingsChange({
									...settings,
									style: Number(e.target.value) as StoryImageStyles,
								});
							else
								onSettingsChange({
									denoising: 0,
									prompt: "",
									samplingSteps: 1,
									style: Number(e.target.value) as StoryImageStyles,
									voice: "",
								});
						}}
					>
						{keys(StoryImageStyles).map((label, index) => (
							<option key={index} value={index}>
								{label}
							</option>
						))}
					</select>
				</div>
				<div className="w-[50%] ">
					<label htmlFor="denoising-factor" className="flex items-center gap-1">
						Denoising Factor
						<Info width={"18px"} height={"18px"} color="#A6B6FC" />
					</label>
					<input
						id="denoising-factor"
						className="w-full bg-slate-50 m-1 rounded-md p-2"
						type="number"
						min={0}
						max={5}
						step={0.25}
						placeholder="2"
						value={settings?.denoising ?? 2}
						onChange={(e) => {
							if (settings)
								onSettingsChange({
									...settings,
									denoising: parseInt(e.target.value),
								});
							else
								onSettingsChange({
									denoising: parseInt(e.target.value),
									prompt: "",
									samplingSteps: 1,
									style: StoryImageStyles.Realistic,
									seed: 1,
									voice: "",
								});
						}}
					/>
				</div>
			</div>
			<div className="flex gap-6">
				<div className="w-[50%] ">
					<label
						htmlFor="image-animation-prompt"
						className="flex items-center gap-1"
					>
						Seed
						<Info width={"18px"} height={"18px"} color="#A6B6FC" />
					</label>
					<input
						id="seed"
						type="number"
						min={0}
						max={2e16 - 1}
						className="w-full bg-slate-50 rounded-md p-2"
						placeholder="2"
						value={settings?.seed ?? 1}
						onChange={(e) => {
							if (settings)
								onSettingsChange({
									...settings,
									seed: parseInt(e.target.value),
								});
							else
								onSettingsChange({
									denoising: 0,
									prompt: "",
									samplingSteps: 1,
									style: StoryImageStyles.Realistic,
									seed: parseInt(e.target.value),
								});
						}}
					/>
				</div>
				<div className="w-[50%] ">
					<label
						htmlFor="image-animation-prompt"
						className="flex items-center gap-1"
					>
						Sampling Steps
						<Info width={"18px"} height={"18px"} color="#A6B6FC" />
					</label>
					<input
						id="sampling-steps"
						type="number"
						min={2}
						max={10}
						className="w-full bg-slate-50 rounded-md p-2"
						placeholder="2"
						value={settings?.samplingSteps ?? 1}
						onChange={(e) => {
							if (settings)
								onSettingsChange({
									...settings,
									samplingSteps: parseInt(e.target.value),
								});
							else
								onSettingsChange({
									denoising: 0,
									prompt: "",
									samplingSteps: parseInt(e.target.value),
									style: StoryImageStyles.Realistic,
									seed: 1,
								});
						}}
					/>
				</div>
			</div>
		</div>
	);
}

function VerticalControlButtons({ onDelete }: { onDelete: () => void }) {
	return (
		<div className="space-y-2">
			<GripVertical
				className="hover:cursor-pointer"
				width={"22px"}
				height={"22px"}
				color="#020817"
				strokeWidth={1}
			/>
			<Trash2
				className="hover:cursor-pointer"
				width={"22px"}
				height={"22px"}
				color="#020817"
				strokeWidth={1}
				onClick={onDelete}
			/>
			<RefreshCw
				className="hover:cursor-pointer"
				width={"22px"}
				height={"22px"}
				color="#020817"
				strokeWidth={1}
			/>
		</div>
	);
}

export default function EditSegmentModalItem({
	segment,
	onSegmentEdit,
	onSegmentDelete,
	onRegenerateImage,
	regeneratingImage,
	showAdvancedSettings = true,
}: {
	segment: Segment;
	onSegmentEdit: (updatedSegment: Segment) => void;
	onSegmentDelete?: () => void;
	onRegenerateImage: () => void;
	regeneratingImage: boolean;
	showAdvancedSettings?: boolean;
}) {
	const [isChecked, setIsChecked] = useState(showAdvancedSettings);

	return (
		<div className="flex bg-slate-100 rounded-md border-border border-[1px] p-2 m-2 gap-2">
			{showAdvancedSettings && (
				<VerticalControlButtons onDelete={() => onSegmentDelete?.()} />
			)}
			<div className="w-full text-slate-950 space-y-2">
				<RegenerateSegmentBar
					segment={segment}
					onRegenerateImage={onRegenerateImage}
					regeneratingImage={regeneratingImage}
					onTextContentChange={(change) => {
						onSegmentEdit({
							...segment,
							textContent: change,
						});
					}}
				/>
				{showAdvancedSettings && (
					<>
						<AdvancedEditingBar
							onCheckedChange={(checked) => {
								setIsChecked(checked);
							}}
						/>
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
					</>
				)}
			</div>
		</div>
	);
}
