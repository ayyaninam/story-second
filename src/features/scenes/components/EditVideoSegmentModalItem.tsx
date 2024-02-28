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
					<div className="bg-muted w-[66px] h-[42px]"></div>
				</Skeleton>
			)}
			<p className="text-muted-foreground">{segment.textContent}</p>
			<Button
				className="w-[150px] text-background bg-purple-600"
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

export default function EditSegmentModalItem({
	segment,
	onSegmentEdit,
	onSegmentDelete,
	onRegenerateImage,
	regeneratingImage,
}: {
	segment: Segment;
	onSegmentEdit: (updatedSegment: Segment) => void;
	onSegmentDelete?: () => void;
	onRegenerateImage: () => void;
	regeneratingImage: boolean;
}) {
	return (
		<div className="flex bg-primary-foreground rounded-md border-border border-[1px] p-2 m-2 gap-2">
			<div className="w-full text-background space-y-2">
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
			</div>
		</div>
	);
}
