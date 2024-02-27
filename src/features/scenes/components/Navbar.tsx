import { Button } from "@/components/ui/button";
import { AspectRatios, DisplayAspectRatios } from "@/utils/enums";
import Format from "@/utils/format";
import { mainSchema } from "@/api/schema";
import { PlayCircle, Plus } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

import GenerateIcon from "@/components/icons/dashboard/generate-icon";

export default function Navbar({
	ImageRatio,
	WebstoryData,
}: {
	ImageRatio: {
		width: number;
		height: number;
		ratio: number;
		enumValue: DisplayAspectRatios;
	};
	WebstoryData?: mainSchema["ReturnVideoStoryDTO"];
}) {
	const [isEditSegmentsDialogOpen, setIsEditSegmentsDialogOpen] =
		useState(false);
	return (
		<div className="flex justify-between bg-background rounded-tl-lg rounded-tr-lg border-b-[0.5px] border-border p-4">
			<div className="flex gap-x-2.5 items-center">
				<GenerateIcon />
				<div className="items-center">
					<div className="flex items-center gap-x-2">
						<p className="text-sm rounded-sm font-bold text-muted-foreground">
							{Format.Title(WebstoryData?.storyTitle)}
						</p>
					</div>
					<div className="flex items-center gap-x-2 text-slate-500">
						<span className="flex gap-x-1.5 rounded-sm bg-slate-100 p-1 items-center">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="19"
								height="12"
								viewBox="0 0 19 12"
								fill="none"
							>
								<path
									d="M0.5 11.0625V0.9375H18.5V11.0625H0.5Z"
									stroke="#94ABB8"
								/>
							</svg>
							<p className="text-xs">
								{ImageRatio.width}:{ImageRatio.height}
							</p>
						</span>
						<p className="text-xs rounded-sm bg-slate-100 p-1">
							{Format.Title(WebstoryData?.topLevelCategory)}
						</p>
					</div>
				</div>
			</div>
			<div className="hidden md:block text-muted-foreground space-x-2 items-center">
				<Button className="p-2" variant="ghost">
					<PlayCircle className="mr-2 h-4 w-4 text-purple-600" /> Tutorial
				</Button>
				<Button
					className="p-2 bg-purple-600"
					variant="default"
					onClick={() => setIsEditSegmentsDialogOpen(true)}
				>
					<Plus className="mr-2 h-4 w-4" /> Create New
				</Button>
			</div>
		</div>
	);
}
