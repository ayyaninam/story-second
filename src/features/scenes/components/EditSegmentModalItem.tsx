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
import { PropsWithChildren, useState } from "react";
import * as Select from "@radix-ui/react-select";
import React from "react";
import { Segment, Settings } from "../reducers/edit-reducer";
import { StoryImageStyles } from "@/utils/enums";

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
	textContent,
	onTextContentChange,
}: {
	textContent: string;
	onTextContentChange: (change: string) => void;
}) {
	return (
		<div className="flex w-full rounded-sm border-border border-[1px] justify-between">
			<Image
				alt="hello"
				src={"/edit-segment-item-thumb.svg"}
				width={66}
				height={42}
			/>
			<input
				className="bg-slate-50 border-none outline-none px-1 flex-grow"
				placeholder="Type something here..."
				value={textContent}
				onChange={(e) => {
					onTextContentChange(e.target.value);
				}}
			/>
			<Select.Root>
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
							<SelectItem value="regenerate-video-n-script">
								<div className="flex gap-1 items-center hover:cursor-pointer hover:bg-slate-100">
									<RefreshCw width={"18px"} height={"18px"} />
									<p className="text-sm">Regenerate Video & Script</p>
								</div>
							</SelectItem>
							<SelectItem value="use-script-to-regenerate-video">
								<div className="flex gap-1 items-center hover:cursor-pointer hover:bg-slate-100">
									<ScrollText width={"18px"} height={"18px"} />
									<p className="text-sm">Use Script To Regenerate Video</p>
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
			</Select.Root>
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
				htmlFor="video-animation-prompt"
				className="flex items-center gap-1"
			>
				Video Animation Prompt
				<Info width={"18px"} height={"18px"} color="#A6B6FC" />
			</label>
			<textarea
				id="video-animation-prompt"
				rows={2}
				className="w-full bg-slate-50 m-1 rounded-md p-2"
				placeholder="Write your video animation prompt here"
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
						htmlFor="video-animation-style"
						className="flex items-center gap-1"
					>
						Video Animation Style
						<Info width={"18px"} height={"18px"} color="#A6B6FC" />
					</label>
					<select
						id="video-animation-style"
						className="w-full bg-slate-50 m-1 rounded-md p-2"
						value={settings?.style ?? StoryImageStyles.Realistic}
						onChange={(e) => {
							if (settings)
								onSettingsChange({
									...settings,
									style: e.target.value as StoryImageStyles,
								});
							else
								onSettingsChange({
									denoising: 0,
									prompt: "",
									samplingSteps: 1,
									style: e.target.value as StoryImageStyles,
									voice: "",
								});
						}}
					>
						<option value={StoryImageStyles.Realistic}>
							{StoryImageStyles.Realistic}
						</option>
						<option value={StoryImageStyles.Auto}>
							{StoryImageStyles.Auto}
						</option>
						<option value={StoryImageStyles.Cartoon}>
							{StoryImageStyles.Cartoon}
						</option>
						<option value={StoryImageStyles.Sketch}>
							{StoryImageStyles.Sketch}
						</option>
						<option value={StoryImageStyles.WaterColor}>
							{StoryImageStyles.WaterColor}
						</option>
						<option value={StoryImageStyles.SciFi}>
							{StoryImageStyles.SciFi}
						</option>
						<option value={StoryImageStyles.Anime}>
							{StoryImageStyles.Anime}
						</option>
						<option value={StoryImageStyles.Horror}>
							{StoryImageStyles.Horror}
						</option>
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
						max={1000}
						step={10}
						placeholder="300"
						value={settings?.denoising ?? 0}
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
									voice: "",
								});
						}}
					/>
				</div>
			</div>
			<label
				htmlFor="video-animation-prompt"
				className="flex items-center gap-1"
			>
				Seed
				<Info width={"18px"} height={"18px"} color="#A6B6FC" />
			</label>
			<input
				id="seed"
				className="w-full bg-slate-50 rounded-md p-2"
				placeholder="I nodded eagerly"
				value={settings?.voice ?? ""}
				onChange={(e) => {
					if (settings)
						onSettingsChange({
							...settings,
							voice: e.target.value,
						});
					else
						onSettingsChange({
							denoising: 0,
							prompt: "",
							samplingSteps: 1,
							style: StoryImageStyles.Realistic,
							voice: e.target.value,
						});
				}}
			/>
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
}: {
	segment: Segment;
	onSegmentEdit: (updatedSegment: Segment) => void;
	onSegmentDelete: () => void;
}) {
	const [isChecked, setIsChecked] = useState(false);

	return (
		<div className="flex bg-slate-100 rounded-md border-border border-[1px] p-2 m-2 gap-2">
			<VerticalControlButtons onDelete={onSegmentDelete} />
			<div className="w-full text-slate-950 space-y-2">
				<RegenerateSegmentBar
					textContent={segment.textContent || ""}
					onTextContentChange={(change) =>
						onSegmentEdit({
							...segment,
							textContent: change,
						})
					}
				/>
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
			</div>
		</div>
	);
}
