import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
	GripVertical,
	Trash2,
	ChevronDown,
	Plus,
	ImagePlus,
	Palette,
	Volume2,
	Info,
	ScrollText,
	Unlock,
} from "lucide-react";
import Image from "next/image";
import { PropsWithChildren, useState } from "react";
import * as Select from "@radix-ui/react-select";
import React from "react";
import { Segment, Settings, StoryStatus } from "../reducers/edit-reducer";
import { StoryImageStyles } from "@/utils/enums";
import { keys } from "@/utils/enumKeys";
import Format from "@/utils/format";
import { Skeleton } from "@/components/ui/skeleton";
import { Slider } from "@/components/ui/slider";

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
		<div className="flex items-center gap-1 w-full rounded-sm border-border border-[1px] justify-between">
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

			<ScrollText className="stroke-slate-500" />

			<input
				className="bg-slate-50 border-none outline-none px-1 flex-grow text-gray-600"
				placeholder="Type something here..."
				disabled
				value={segment.textContent}
				onChange={(e) => {
					onTextContentChange(e.target.value);
				}}
			/>
			<Unlock className="stroke-slate-500" />
			{/* <Select.Root>
				<Select.Trigger
					className="inline-flex items-center justify-center rounded-md p-1 m-1 text-sm bg-purple-700 gap-1 text-white shadow-md"
					aria-label="Food"
				>
					<Select.Value />
					<Select.Icon>
						<ChevronDownIcon />
					</Select.Icon>
				</Select.Trigger>
				<Select.Portal>
					<Select.Content className="overflow-hidden bg-white rounded-sm">
						<Select.ScrollUpButton className="flex items-center justify-center h-[25px] bg-white text-purple-400 cursor-default">
							<ChevronUpIcon />
						</Select.ScrollUpButton>
						<Select.Viewport>
							<SelectItem value="regenerate-segment">
								<div className="flex gap-1 items-center hover:cursor-pointer hover:bg-slate-100">
									<SparkleIcon width={"18px"} height={"18px"} />
									<p className="text-sm">Regenerate Segment</p>
								</div>
							</SelectItem>
							<SelectItem value="regenerate-image-n-script">
								<div className="flex gap-1 items-center hover:cursor-pointer hover:bg-slate-100">
									<RefreshCw width={"18px"} height={"18px"} />
									<p className="text-sm">Regenerate Image & Script</p>
								</div>
							</SelectItem>
							<SelectItem value="use-script-to-regenerate-image">
								<div className="flex gap-1 items-center hover:cursor-pointer hover:bg-slate-100">
									<ScrollText width={"18px"} height={"18px"} />
									<p className="text-sm">Use Script To Regenerate Image</p>
								</div>
							</SelectItem>
							<SelectItem value="undo-script-edits">
								<div className="flex gap-1 items-center hover:cursor-pointer hover:bg-slate-100">
									<Undo2 width={"18px"} height={"18px"} />
									<p className="text-sm">Undo Script Edits</p>
								</div>
							</SelectItem>
							<SelectItem value="regenerate-script">
								<div className="flex gap-1 items-center hover:cursor-pointer hover:bg-slate-100">
									<Zap width={"18px"} height={"18px"} />
									<p className="text-sm">Regenerate Script</p>
								</div>
							</SelectItem>
							<SelectItem value="hide-segment">
								<div className="flex gap-1 items-center hover:cursor-pointer hover:bg-slate-100">
									<EyeOff width={"18px"} height={"18px"} />
									<p className="text-sm">Hide Segment</p>
								</div>
							</SelectItem>
						</Select.Viewport>
						<Select.ScrollDownButton className="flex items-center justify-center h-[25px] bg-white text-purple-500 cursor-default">
							<ChevronDownIcon />
						</Select.ScrollDownButton>
					</Select.Content>
				</Select.Portal>
			</Select.Root> */}
		</div>
	);
}

function AdvancedEditingBar({
	checked,
	onCheckedChange,
}: {
	checked?: boolean;
	onCheckedChange: (checked: boolean) => void;
}) {
	return (
		<div className="flex justify-between">
			<div className="flex items-center space-x-2">
				<Switch
					id="advanced-editing"
					style={{
						background: checked ? "#A734EA" : undefined,
					}}
					onCheckedChange={onCheckedChange}
				/>
				<Label htmlFor="advanced-editing">Advanced Editing</Label>
			</div>
			<div className="flex items-center space-x-1 ">
				<div className="flex p-1 m-1 gap-1 bg-slate-50 text-slate-500 border-border border-[1px] rounded-md items-center">
					<ImagePlus width={"18px"} height={"18px"} />
					<p className="text-sm ">Image</p>
					<Plus width={"18px"} height={"18px"} />
				</div>
				<div className="flex p-1 m-1 gap-1 bg-slate-50 text-slate-500 border-border border-[1px] rounded-md items-center">
					<Palette width={"18px"} height={"18px"} />
					<p className="text-sm ">Style</p>
					<ChevronDown width={"18px"} height={"18px"} />
				</div>
				<div className="flex p-1 m-1 gap-1 bg-slate-50 text-slate-500 border-border border-[1px] rounded-md items-center">
					<Volume2 width={"18px"} height={"18px"} />
					<p className="text-sm ">Voice</p>
					<ChevronDown width={"18px"} height={"18px"} />
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
				<Info width={"18px"} height={"18px"} color="#A6B6FC" />
			</label>
			<textarea
				id="image-animation-prompt"
				rows={2}
				className="w-full border-[1px] bg-slate-50 m-1 rounded-md p-2"
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
						Style
						<Info width={"18px"} height={"18px"} color="#A6B6FC" />
					</label>
					<select
						id="image-animation-style"
						className="w-full border-[1px] bg-slate-50 m-1 rounded-md p-2"
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
						// min={0}
						// max={2e16 - 1}
						className="w-full border-[1px] bg-slate-50 rounded-md m-1 p-2"
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
			</div>
			<div className="flex gap-6">
				<div className="w-[50%] ">
					<label htmlFor="denoising-factor" className="flex items-center gap-1">
						Prompt Guidance
						<Info width={"18px"} height={"18px"} color="#A6B6FC" />
					</label>
					<div
						className="flex w-full gap-1 px-1 rounded-sm"
						style={{
							background:
								"linear-gradient(270deg, #E0E7FF 8.49%, rgba(224, 231, 255, 0.00) 88.35%)",
						}}
					>
						<input
							id="denoising-factor"
							className="border-[1px] bg-slate-50 rounded-md p-2"
							type="number"
							min={0}
							max={100}
							step={1}
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
						<Slider
							value={[settings?.denoising ?? 2]}
							max={100}
							step={1}
							onValueChange={(value) => {
								if (settings)
									onSettingsChange({
										...settings,
										denoising: value[0],
									});
								else
									onSettingsChange({
										denoising: value[0],
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
				<div className="w-[50%] ">
					<label
						htmlFor="image-animation-prompt"
						className="flex items-center gap-1"
					>
						Quality & Details
						<Info width={"18px"} height={"18px"} color="#A6B6FC" />
					</label>
					<div
						className="flex w-full gap-1 px-1 rounded-sm"
						style={{
							background:
								"linear-gradient(270deg, #E0E7FF 8.49%, rgba(224, 231, 255, 0.00) 88.35%)",
						}}
					>
						<input
							id="sampling-steps"
							type="number"
							min={1}
							max={15}
							className="border-[1px] bg-slate-50 rounded-md p-2"
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
						<Slider
							value={[settings?.samplingSteps ?? 2]}
							max={15}
							step={1}
							onValueChange={(value) => {
								if (settings)
									onSettingsChange({
										...settings,
										samplingSteps: value[0],
									});
								else
									onSettingsChange({
										denoising: 0,
										prompt: "",
										samplingSteps: value[0],
										style: StoryImageStyles.Realistic,
										seed: 1,
									});
							}}
						/>
					</div>
				</div>
			</div>
		</div>
	);
}

function VerticalControlButtons({ onDelete }: { onDelete: () => void }) {
	return (
		<div className="space-y-2 stroke-slate-500">
			<GripVertical
				className="hover:cursor-pointer"
				width={18}
				height={18}
				strokeWidth={1}
			/>
			<Trash2
				className="hover:cursor-pointer"
				width={18}
				height={18}
				strokeWidth={1}
				onClick={onDelete}
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
}: {
	segment: Segment;
	onSegmentEdit: (updatedSegment: Segment) => void;
	onSegmentDelete: () => void;
	onRegenerateImage: () => void;
	regeneratingImage: boolean;
}) {
	const [isChecked, setIsChecked] = useState(false);

	return (
		<div className="flex bg-slate-50 rounded-md border-border border-[1px] p-2 m-2 gap-2">
			<VerticalControlButtons onDelete={onSegmentDelete} />
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
				<AdvancedEditingBar
					checked={isChecked}
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
			</div>
		</div>
	);
}
