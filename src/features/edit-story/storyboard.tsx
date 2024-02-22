import { useImmerReducer } from "use-immer";
import editStoryReducer, {
	EditStoryAction,
	EditStoryDraft,
	StoryStatus,
} from "./reducers/edit-reducer";
import { StoryImageStyles } from "@/utils/enums";

export default function Storyboard() {
	const [story, dispatch] = useImmerReducer<EditStoryDraft, EditStoryAction>(
		editStoryReducer,
		initialData
	);
	return (
		<div>
			{story.scenes.map((scene, sceneIndex) => (
				<div key={sceneIndex}>
					<h2>Scene {scene.id}</h2>
					{scene.segments.map((segment, segIndex) => (
						<div key={segIndex}>
							<button
								onClick={() =>
									dispatch({
										type: "create_segment",
										sceneIndex: sceneIndex,
										segmentIndex: segIndex,
										segment: {
											audioKey: "",
											audioStatus: StoryStatus.READY,
											id: segment.id,
											imageKey: "",
											imageStatus: StoryStatus.READY,
											textContent: "Hello!",
											videoKey: "",
											videoStatus: StoryStatus.READY,
										},
									})
								}
							>
								+
							</button>
							<button>-</button>
							<span>
								({segment.id}) {segment.textContent}
							</span>
						</div>
					))}
					<hr />
				</div>
			))}
		</div>
	);
}

const initialData: EditStoryDraft = {
	id: "unique_story_id",
	title: "Journey Through the Unknown",
	settings: {
		style: StoryImageStyles.Anime,
		voice: "Inspiring",
	},
	status: StoryStatus.READY,
	scenes: [
		{
			id: 1,
			status: StoryStatus.READY,
			settings: {
				modifier_prompt: "The beginning of a journey",
				style: StoryImageStyles.Anime,
				voice: "Excited",
			},
			segments: [
				{
					id: 101,
					settings: {
						samplingSteps: 6,
						denoising: 0.7,
						prompt: "The hero sets out",
						style: StoryImageStyles.Anime,
						voice: "Heroic",
					},
					textContent:
						"Our hero begins their journey, filled with determination and a sense of adventure...",
					imageKey: "image_101",
					videoKey: "video_101",
					audioKey: "audio_101",
					imageStatus: StoryStatus.READY,
					videoStatus: StoryStatus.READY,
					audioStatus: StoryStatus.READY,
				},
				{
					id: 102,
					settings: {
						samplingSteps: 8,
						denoising: 0.6,
						prompt: "A companion joins",
						style: StoryImageStyles.Anime,
						voice: "Friendly",
					},
					textContent:
						"A loyal companion joins the journey, bringing skills and humor to the adventure...",
					imageKey: "image_102",
					videoKey: "video_102",
					audioKey: "audio_102",
					imageStatus: StoryStatus.READY,
					videoStatus: StoryStatus.READY,
					audioStatus: StoryStatus.READY,
				},
				{
					id: 103,
					settings: {
						samplingSteps: 7,
						denoising: 0.5,
						prompt: "The first challenge",
						style: StoryImageStyles.Anime,
						voice: "Intense",
					},
					textContent:
						"The duo faces their first challenge, a test of wit and courage...",
					imageKey: "image_103",
					videoKey: "video_103",
					audioKey: "audio_103",
					imageStatus: StoryStatus.READY,
					videoStatus: StoryStatus.READY,
					audioStatus: StoryStatus.READY,
				},
				{
					id: 104,
					settings: {
						samplingSteps: 5,
						denoising: 0.4,
						prompt: "A moment of respite",
						style: StoryImageStyles.Anime,
						voice: "Calm",
					},
					textContent:
						"Finding a moment of peace, the travelers reflect on their journey so far...",
					imageKey: "image_104",
					videoKey: "video_104",
					audioKey: "audio_104",
					imageStatus: StoryStatus.READY,
					videoStatus: StoryStatus.READY,
					audioStatus: StoryStatus.READY,
				},
			],
		},
		{
			id: 2,
			status: StoryStatus.READY,
			settings: {
				modifier_prompt: "The heart of the adventure",
				style: StoryImageStyles.Anime,
				voice: "Mysterious",
			},
			segments: [
				{
					id: 201,
					settings: {
						samplingSteps: 6,
						denoising: 0.7,
						prompt: "An ancient mystery",
						style: StoryImageStyles.Anime,
						voice: "Inquisitive",
					},
					textContent:
						"The heroes stumble upon an ancient mystery, buried for centuries...",
					imageKey: "image_201",
					videoKey: "video_201",
					audioKey: "audio_201",
					imageStatus: StoryStatus.READY,
					videoStatus: StoryStatus.READY,
					audioStatus: StoryStatus.READY,
				},
				{
					id: 202,
					settings: {
						samplingSteps: 8,
						denoising: 0.5,
						prompt: "A daring rescue",
						style: StoryImageStyles.Anime,
						voice: "Dramatic",
					},
					textContent:
						"A daring rescue in the nick of time proves the strength of their bond...",
					imageKey: "image_202",
					videoKey: "video_202",
					audioKey: "audio_202",
					imageStatus: StoryStatus.READY,
					videoStatus: StoryStatus.READY,
					audioStatus: StoryStatus.READY,
				},
				{
					id: 203,
					settings: {
						samplingSteps: 7,
						denoising: 0.6,
						prompt: "The turning point",
						style: StoryImageStyles.Anime,
						voice: "Reflective",
					},
					textContent:
						"A revelation changes everything, challenging their beliefs and goals...",
					imageKey: "image_203",
					videoKey: "video_203",
					audioKey: "audio_203",
					imageStatus: StoryStatus.READY,
					videoStatus: StoryStatus.READY,
					audioStatus: StoryStatus.READY,
				},
				{
					id: 204,
					settings: {
						samplingSteps: 5,
						denoising: 0.8,
						prompt: "The power of unity",
						style: StoryImageStyles.Anime,
						voice: "Uplifting",
					},
					textContent:
						"The group discovers the true power of unity, facing adversity together...",
					imageKey: "image_204",
					videoKey: "video_204",
					audioKey: "audio_204",
					imageStatus: StoryStatus.READY,
					videoStatus: StoryStatus.READY,
					audioStatus: StoryStatus.READY,
				},
			],
		},
		{
			id: 3,
			status: StoryStatus.READY,
			settings: {
				modifier_prompt: "The climax and resolution",
				style: StoryImageStyles.Anime,
				voice: "Epic",
			},
			segments: [
				{
					id: 301,
					settings: {
						samplingSteps: 6,
						denoising: 0.5,
						prompt: "The final battle",
						style: StoryImageStyles.Anime,
						voice: "Epic",
					},
					textContent:
						"The final battle looms large, a test of all they have learned and become...",
					imageKey: "image_301",
					videoKey: "video_301",
					audioKey: "audio_301",
					imageStatus: StoryStatus.READY,
					videoStatus: StoryStatus.READY,
					audioStatus: StoryStatus.READY,
				},
				{
					id: 302,
					settings: {
						samplingSteps: 8,
						denoising: 0.7,
						prompt: "Sacrifices made",
						style: StoryImageStyles.Anime,
						voice: "Somber",
					},
					textContent:
						"Sacrifices are made, and heroes are born in the face of despair...",
					imageKey: "image_302",
					videoKey: "video_302",
					audioKey: "audio_302",
					imageStatus: StoryStatus.READY,
					videoStatus: StoryStatus.READY,
					audioStatus: StoryStatus.READY,
				},
				{
					id: 303,
					settings: {
						samplingSteps: 7,
						denoising: 0.6,
						prompt: "The moment of truth",
						style: StoryImageStyles.Anime,
						voice: "Determined",
					},
					textContent:
						"The moment of truth arrives, with the fate of many hanging in the balance...",
					imageKey: "image_303",
					videoKey: "video_303",
					audioKey: "audio_303",
					imageStatus: StoryStatus.READY,
					videoStatus: StoryStatus.READY,
					audioStatus: StoryStatus.READY,
				},
				{
					id: 304,
					settings: {
						samplingSteps: 5,
						denoising: 0.4,
						prompt: "A new dawn",
						style: StoryImageStyles.Anime,
						voice: "Hopeful",
					},
					textContent:
						"In the aftermath, a new dawn rises, heralding a future full of possibilities...",
					imageKey: "image_304",
					videoKey: "video_304",
					audioKey: "audio_304",
					imageStatus: StoryStatus.READY,
					videoStatus: StoryStatus.READY,
					audioStatus: StoryStatus.READY,
				},
			],
		},
	],
};
