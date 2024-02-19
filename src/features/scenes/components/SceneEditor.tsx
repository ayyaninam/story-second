import { useImmerReducer } from "use-immer";
import editStoryReducer, {
	EditStoryAction,
	EditStoryDraft,
	StoryStatus,
} from "../reducers/edit-reducer";
import { StoryImageStyles } from "@/utils/enums";
import { WebstoryToStoryDraft } from "../utils/storydraft";
import { mainSchema } from "@/api/schema";

const SceneEditor = (props: {
	initialData: mainSchema["ReturnWebStoryDTO"];
}) => {
	const [story, dispatch] = useImmerReducer<EditStoryDraft, EditStoryAction>(
		editStoryReducer,
		WebstoryToStoryDraft(props.initialData)
	);
	return story.scenes.map((scene, sceneIndex) => (
		<div key={sceneIndex}>
			<div className="flex flex-row max-w-sm ">
				<input type="text" className="" />
				<input type="text" />
				<input type="text" />
				<input type="text" />
				<input type="text" />
			</div>
		</div>
	));
};

export default SceneEditor;
