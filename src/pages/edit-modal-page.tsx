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
import { DropdownMenuCheckboxItemProps } from "@radix-ui/react-dropdown-menu";
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
} from "lucide-react";
import Image from "next/image";

type Checked = DropdownMenuCheckboxItemProps["checked"];

export default function EditModalPage() {
	return (
		<div className="flex bg-slate-100 rounded-md border-border border-[1px] p-2 m-2 gap-2">
			<div className="space-y-2">
				<GripVertical
					width={"22px"}
					height={"22px"}
					color="#020817"
					strokeWidth={1}
				/>
				<Trash2
					width={"22px"}
					height={"22px"}
					color="#020817"
					strokeWidth={1}
				/>
				<RefreshCw
					width={"22px"}
					height={"22px"}
					color="#020817"
					strokeWidth={1}
				/>
			</div>
			<div className="w-full text-slate-950 space-y-2">
				<div className="flex w-full rounded-sm border-border border-[1px] justify-between">
					<Image
						alt="hello"
						src={"/edit-segment-item-thumb.svg"}
						width={66}
						height={42}
					/>
					<input
						className="bg-slate-50 border-none outline-none px-1 flex-grow"
						placeholder="I nodded eagerly"
					/>
					<div className="flex p-1 m-1 shadow-sm bg-purple-700 gap-1 rounded-md items-center">
						<SparkleIcon width={"18px"} height={"18px"} color="#FFFFFF" />
						<p className="text-sm text-slate-50">Regenerate Segment</p>
						<ChevronDown width={"18px"} height={"18px"} color="#FFFFFF" />
					</div>
				</div>
				<div className="flex justify-between">
					<div className="flex items-center space-x-2">
						<Switch id="advanced-editing" />
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
							<input
								id="video-animation-style"
								className="w-full bg-slate-50 m-1 rounded-md p-2"
								placeholder="Majestic"
							/>
						</div>
						<div className="w-[50%] ">
							<label
								htmlFor="denoising-factor"
								className="flex items-center gap-1"
							>
								Denoising Factor
								<Info width={"18px"} height={"18px"} color="#A6B6FC" />
							</label>
							<input
								id="denoising-factor"
								className="w-full bg-slate-50 m-1 rounded-md p-2"
								placeholder="300"
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
					/>
				</div>
			</div>
		</div>
	);
}
