import { ScriptEditorViewType } from "@/utils/enums";

export default function ScriptEditorViewTypes({
	type,
}: {
	type: ScriptEditorViewType;
}) {
	return (
		<div className="bg-purple-200 flex rounded-full p-[1px]">
			<div
				className={`flex items-center px-2 text-xs ${type === ScriptEditorViewType.Title_Scenes ? "text-primary rounded-full bg-background shadow-md" : "text-slate-400"} `}
			>
				<p>Title Scenes</p>
			</div>
			<div
				className={`flex items-center px-2 py-1 text-xs ${type === ScriptEditorViewType.Just_Text ? "text-primary rounded-full bg-background shadow-md" : "text-slate-400"} `}
			>
				<p>Just Text</p>
			</div>
		</div>
	);
}
