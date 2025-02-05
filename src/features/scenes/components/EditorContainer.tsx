import { FC, ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import {
	Film,
	HelpCircle,
	ScrollText,
	LayoutList,
	Video,
	Upload,
	Scroll,
} from "lucide-react";
import { ModeToggle } from "@/features/edit-story/components/mode-toggle";
import { env } from "@/env.mjs";

const getBadgeData = (
	view: "script" | "story" | "scene" | "preview",
	isStoryBook = false
) => {
	switch (view) {
		default:
		case "script":
			return {
				top: {
					text: "Edit Your Script",
					icon: <ScrollText className="stroke-accent-600 mr-1 h-4 w-4" />,
				},
				bottom: {
					text: "Next — Select Options & Generate Storyboard",
					icon: <Film className="stroke-accent-600 mr-1 h-4 w-4" />,
				},
			};
		case "story":
			return {
				top: {
					text: "Edit Your Storyboard",
					icon: <LayoutList className="stroke-accent-600 mr-1 h-4 w-4" />,
				},
				bottom: {
					text: isStoryBook
						? "View & Share The Final Storybook"
						: "Next — Produce Animated Video Scenes",
					icon: isStoryBook ? (
						<Scroll className="stroke-accent-600 mr-1 h-4 w-4" />
					) : (
						<Film className="stroke-accent-600 mr-1 h-4 w-4" />
					),
				},
			};
		case "scene":
			return {
				top: {
					text: "Generate & Edit Your Scenes",
					icon: <Film className="stroke-accent-600 mr-1 h-4 w-4" />,
				},
				bottom: {
					text: "View & Share The Final Cut",
					icon: <Video className="stroke-accent-600 mr-1 h-4 w-4" />,
				},
			};
		case "preview":
			return {
				top: {
					text: "Review Your Final Version",
					icon: <Video className="stroke-accent-600 mr-1 h-4 w-4" />,
				},
				bottom: {
					text: "Publish Your Masterpiece",
					icon: <Upload className="stroke-accent-600 mr-1 h-4 w-4" />,
				},
			};
	}
};

const EditorContainer: FC<{
	children: ReactNode;
	view: "script" | "story" | "scene" | "preview";
	isStoryBook?: boolean;
}> = ({ children, view = "script", isStoryBook }) => {
	const badgeData = getBadgeData(view, isStoryBook);
	return (
		<div className="relative z-0 w-full gap-1 items-center justify-center flex flex-col h-full px-2 lg:px-5 py-2">
			<div className="hidden lg:flex justify-center mt-auto mb-auto">
				<Badge
					variant="outline"
					className={`bg-primary-foreground font-normal text-sm`}
				>
					{badgeData.top.icon}
					{badgeData.top.text}
				</Badge>
			</div>
			{children}
			<div className="hidden lg:flex justify-center mt-auto mb-auto">
				<Badge
					variant="outline"
					className={`bg-primary-foreground font-normal text-sm`}
				>
					{badgeData.bottom.icon}
					{badgeData.bottom.text}
				</Badge>
			</div>
			{!env.NEXT_PUBLIC_DISABLE_UNIMPLEMENTED_FEATURES && (
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
			)}
		</div>
	);
};

export default EditorContainer;
