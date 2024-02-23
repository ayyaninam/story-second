import { StoryboardViewType } from "@/utils/enums";

export default function StoryboardViewTypes({
	type,
}: {
	type: StoryboardViewType;
}) {
	return (
		<div className="bg-purple-200 flex rounded-full p-[1px]">
			<div
				className={`flex items-center px-2 text-xs ${type === StoryboardViewType.Outline ? "text-primary rounded-full bg-background shadow-md" : "text-slate-400"} `}
			>
				<p>Outline</p>
			</div>
			<div
				className={`flex items-center px-2 py-1 text-xs ${type === StoryboardViewType.Slides ? "text-primary rounded-full bg-background shadow-md" : "text-slate-400"} `}
			>
				<p>Slides</p>
			</div>
		</div>
	);
}
