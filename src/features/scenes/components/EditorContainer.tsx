import { FC, ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import {
	Film,
	HelpCircle,
	ScrollText,
	LayoutList,
	Video,
	Upload,
} from "lucide-react";
import { ModeToggle } from "@/features/edit-story/components/mode-toggle";

const getBadgeData = (view: "script" | "story" | "scene" | "preview") => {
	switch (view) {
		default:
		case "script":
			return {
				top: {
					text: "Edit Your Script",
					icon: <ScrollText className="stroke-purple-600 mr-1 h-4 w-4" />,
				},
				bottom: {
					text: "Next — Select Options & Generate Storyboard",
					icon: <Film className="stroke-purple-600 mr-1 h-4 w-4" />,
				},
			};
		case "story":
			return {
				top: {
					text: "Edit Your Storyboard",
					icon: <LayoutList className="stroke-purple-600 mr-1 h-4 w-4" />,
				},
				bottom: {
					text: "Next — Produce Animated Video Scenes",
					icon: <Film className="stroke-purple-600 mr-1 h-4 w-4" />,
				},
			};
		case "scene":
			return {
				top: {
					text: "Generate & Edit Your Scenes",
					icon: <Film className="stroke-purple-600 mr-1 h-4 w-4" />,
				},
				bottom: {
					text: "View & Share The Final Cut",
					icon: <Video className="stroke-purple-600 mr-1 h-4 w-4" />,
				},
			};
		case "preview":
			return {
				top: {
					text: "Review Your Final Version",
					icon: <Video className="stroke-purple-600 mr-1 h-4 w-4" />,
				},
				bottom: {
					text: "Publish Your Masterpiece",
					icon: <Upload className="stroke-purple-600 mr-1 h-4 w-4" />,
				},
			};
	}
};

const EditorContainer: FC<{
	children: ReactNode;
	view: "script" | "story" | "scene" | "preview";
}> = ({ children, view = "script" }) => {
	const badgeData = getBadgeData(view);
	return (
		<div className="relative z-0 w-full gap-1 items-center justify-center flex flex-col h-full px-2 lg:px-5 py-2">
			<div className="flex justify-center mt-auto mb-auto">
				<Badge
					variant="outline"
					className={`bg-primary-foreground font-normal text-sm`}
				>
					{badgeData.top.icon}
					{badgeData.top.text}
				</Badge>
			</div>
			{children}
			<div className="flex justify-center mt-auto mb-auto">
				<Badge
					variant="outline"
					className={`bg-primary-foreground font-normal text-sm`}
				>
					{badgeData.bottom.icon}
					{badgeData.bottom.text}
				</Badge>
			</div>
			<div className="absolute bottom-4 right-4 flex flex-col gap-y-3">
				<span
					className="rounded-full w-8 h-8 bg-popover p-1.5 flex items-center justify-center"
					style={{ boxShadow: "0px 3px 6px 0px rgba(0, 0, 0, 0.13)" }}
				>
					<ModeToggle />
				</span>

				<span
					className="rounded-full w-8 h-8 bg-popover p-1.5"
					style={{ boxShadow: "0px 3px 6px 0px rgba(0, 0, 0, 0.13)" }}
				>
					<HelpCircle className="h-[18.286px] w-[18.286px] flex-shrink-0 stroke-slate-400" />
				</span>
			</div>
			<div className="absolute w-[1px] h-screen bg-purple-300 z-[-1] mix-blend-multiply" />
		</div>
	);
};

export default EditorContainer;
