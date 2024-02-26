import BrandShortLogo from "@/components/icons/brand-short-logo";
import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import _ from "lodash";
import {
	ArrowRight,
	ChevronLeft,
	ChevronRight,
	LayoutGrid,
	Music,
	Radio,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/router";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { useImmerReducer } from "use-immer";
import editStoryReducer, {
	EditStoryAction,
	EditStoryDraft,
	StoryStatus,
} from "../reducers/edit-reducer";
import { GenerateStoryDiff, WebstoryToStoryDraft } from "../utils/storydraft";
import { mainSchema } from "@/api/schema";
import {
	SegmentModifications,
	StoryImageStyles,
	VoiceType,
} from "@/utils/enums";
import clsx from "clsx";
import api from "@/api";
import { SegmentModificationData } from "@/types";
import { useMutation } from "@tanstack/react-query";
import AutoImg from "/public/images/editor/auto.png";
import RealisticImg from "/public/images/editor/realistic.png";
import CartoonImg from "/public/images/editor/cartoon.png";
import SketchImg from "/public/images/editor/sketch.png";
import WaterColorImg from "/public/images/editor/watercolor.png";
import AnimeImg from "/public/images/editor/anime.png";
import HorrorImg from "/public/images/editor/horror.png";
import SciFiImg from "/public/images/editor/scifi.png";
import Routes from "@/routes";

const images = {
	[StoryImageStyles.Auto]: {
		src: AutoImg,
		label: "Auto",
	},
	[StoryImageStyles.Realistic]: {
		src: RealisticImg,
		label: "Realistic",
	},
	[StoryImageStyles.Cartoon]: {
		src: CartoonImg,
		label: "Cartoon",
	},
	[StoryImageStyles.Sketch]: {
		src: SketchImg,
		label: "Sketch",
	},
	[StoryImageStyles.WaterColor]: {
		src: WaterColorImg,
		label: "Water Color",
	},
	[StoryImageStyles.Anime]: {
		src: AnimeImg,
		label: "Anime",
	},
	[StoryImageStyles.Horror]: {
		src: HorrorImg,
		label: "Horror",
	},
	[StoryImageStyles.SciFi]: {
		src: SciFiImg,
		label: "Sci-Fi",
	},
};

const voiceTypes = {
	[VoiceType.GenericFemale]: "Generic Female",
	[VoiceType.GenericMale]: "Generic Male",
	[VoiceType.Portuguese]: "Portuguese",
	[VoiceType.Custom]: "Custom",
	[VoiceType.None]: "None ",
};

const Footer = ({
	WebstoryData,
	dispatch,
	story,
	view,
}: {
	WebstoryData: mainSchema["ReturnVideoStoryDTO"];
	dispatch: React.Dispatch<EditStoryAction>;
	story: EditStoryDraft;
	view: "script" | "storyboard" | "scene";
}) => {
	const router = useRouter();

	const { genre } = router.query;

	const scrollRef = useRef<HTMLDivElement | null>(null);

	const scrollLeft = useCallback(() => {
		scrollRef.current?.scroll({ left: -50, behavior: "smooth" });
	}, []);
	const scrollRight = useCallback(() => {
		scrollRef.current?.scroll({ left: 50, behavior: "smooth" });
	}, []);

	const generationStyle = story.settings?.style ?? StoryImageStyles.Auto;

	const updateImageStyle = useCallback(
		(style: StoryImageStyles) => {
			dispatch({ type: "update_image_style", style: style });
		},
		[dispatch]
	);

	const onUpdateNarrator = useCallback(
		(narrator: string) => {
			dispatch({ type: "update_narrator", voiceType: narrator });
		},
		[dispatch]
	);

	const EditSegment = useMutation({
		mutationFn: api.video.editSegment,
	});

	const View = {
		script: () => (
			<div className="flex gap-2 mt-6 w-full justify-end">
				<div>
					<Button
						variant="outline"
						onClick={async () => {
							const diff = GenerateStoryDiff(
								WebstoryToStoryDraft(WebstoryData!),
								story
							);
							console.log(diff);
							// console.log(WebstoryToStoryDraft(WebstoryData!), story);
							const edits: SegmentModificationData[] = diff.edits.map(
								(segment) => ({
									details: { Ind: segment.id, Text: segment.textContent },
									operation: SegmentModifications.Edit,
								})
							);
							const additions: SegmentModificationData[] = diff.additions.map(
								(segmentSet) => ({
									details: {
										// @ts-ignore should be defined though??
										Ind: segmentSet[0].id + 1,
										segments: segmentSet.map((el) => ({
											Text: el.textContent,
											SceneId: el.sceneId,
										})),
									},
									operation: SegmentModifications.Add,
								})
							);

							const deletions: SegmentModificationData[] =
								diff.subtractions.map((segment) => ({
									details: {
										Ind: segment.id,
									},
									operation: SegmentModifications.Delete,
								}));
							if (additions.length || edits.length || deletions.length) {
								const editedResponse = await EditSegment.mutateAsync({
									story_id: WebstoryData?.id as string,
									story_type: WebstoryData?.storyType,
									edits: [...edits, ...additions, ...deletions],
								});
							}

							api.video.regenerateAllImages({
								// @ts-expect-error
								image_style: story.settings?.style ?? StoryImageStyles.Auto,
								story_id: story.id,
								story_type: story.type,
							});
							router.push(
								Routes.EditStoryboard(
									story.type,
									story.topLevelCategory,
									story.slug
								)
							);
							// dispatch({
							// 	type: "update_segment_statuses",
							// 	key: "imageStatus",
							// 	segmentIndices: story.scenes.flatMap((el, sceneIdx) =>
							// 		el.segments.map((_, segIdx) => ({
							// 			segmentIndex: segIdx,
							// 			sceneIndex: sceneIdx,
							// 		}))
							// 	),
							// 	status: StoryStatus.PENDING,
							// });
						}}
						className="stroke-slate-600 text-slate-600"
					>
						<LayoutGrid strokeWidth={1} className="mr-2" />
						Generate Images & Continue
					</Button>
				</div>
				<div className="flex flex-col">
					<Button
						onClick={() =>
							router.push(
								Routes.EditStoryboard(
									story.type,
									story.topLevelCategory,
									story.slug
								)
							)
						}
						className="bg-purple-700 space-x-1.5"
					>
						<BrandShortLogo />
						<p className="font-bold text-slate-50">Generate Storyboard</p>
						<ArrowRight className="w-4 h-4 opacity-50" />
					</Button>
				</div>
			</div>
		),
		storyboard: () => (
			<div className="flex gap-2 mt-6 w-full justify-end">
				<div className="flex flex-col">
					<Button
						onClick={() => {
							router.push(
								Routes.EditScenes(
									story.type,
									story.topLevelCategory,
									story.slug
								)
							);
						}}
						className="bg-purple-700 space-x-1.5"
					>
						<BrandShortLogo />
						<p className="font-bold text-slate-50">Generate Video Scenes</p>
						<ArrowRight className="w-4 h-4 opacity-50" />
					</Button>
				</div>
			</div>
		),
		scene: () => (
			<div className="flex gap-2 mt-6 w-full justify-end">
				<div className="flex flex-col">
					<Button
						onClick={() => {
							router.push(
								Routes.EditStory(story.type, story.topLevelCategory, story.slug)
							);
						}}
						className="bg-purple-700 space-x-1.5"
					>
						<BrandShortLogo />
						<p className="font-bold text-slate-50">Share & Export Video</p>
						<ArrowRight className="w-4 h-4 opacity-50" />
					</Button>
				</div>
			</div>
		),
	};

	const FooterRightButtons = View[view];
	return (
		<div className="sticky bottom-0 bg-background border-border border-t-[1px] p-3 pt-1.5 justify-between items-center overflow-hidden grid grid-cols-3 gap-4">
			<div className="flex gap-1 ">
				<div>
					<label className="text-sm text-slate-600 font-normal">Narrator</label>
					<Select onValueChange={onUpdateNarrator}>
						<SelectTrigger className=" py-1.5 px-3 w-[180px]">
							<Radio className="stroke-1 opacity-50 pr-1" />
							<SelectValue placeholder="Generic Male" />
						</SelectTrigger>
						<SelectContent>
							{Object.entries(voiceTypes).map(([key, type]) => {
								return (
									<SelectItem key={key} value={key}>
										{type}
									</SelectItem>
								);
							})}
						</SelectContent>
					</Select>
				</div>

				{/* <div>
					<Select>
						<label className="text-sm text-slate-600 font-normal">Music</label>
						<SelectTrigger className="max-w-fit py-1.5 px-3 space-x-1.5">
							<Music className="stroke-1 opacity-50" />
							<SelectValue placeholder="None" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="none">None</SelectItem>
						</SelectContent>
					</Select>
				</div> */}
			</div>

			<div className="text-center max-w-md">
				<span className="text-sm font-normal">
					<span className="text-slate-600">Primary Image Style:</span>{" "}
					<span className="text-purple-600">
						{
							images[
								story.settings?.style ??
									(StoryImageStyles.Auto as StoryImageStyles)
							].label
						}
					</span>
				</span>

				<div className="flex space-x-1 items-center">
					<ChevronLeft onClick={scrollLeft} className="w-8 h-8 opacity-50 " />
					<div
						ref={scrollRef}
						className="flex 2xl:overflow-x-visible overflow-x-hidden "
					>
						<div className="flex gap-x-1 py-1">
							{Object.entries(images).map(([key, image], index) => (
								<>
									<Image
										src={image.src}
										alt={image.label}
										key={index}
										width={64}
										height={48}
										className={clsx(
											"w-16 h-12 rounded-lg hover:opacity-80 transition-opacity ease-in-out ",
											{
												["ring-purple-600 ring-[1.5px] ring-offset-1"]:
													generationStyle === Number(key),
											}
										)}
										role="button"
										onClick={() =>
											updateImageStyle(
												Number(key) as unknown as StoryImageStyles
											)
										}
										style={{ objectFit: "cover" }}
									/>
								</>
							))}
						</div>
					</div>
					<ChevronRight
						onClick={scrollRight}
						className="w-8 h-8 opacity-50 hover:bg-slate-200 hover:cursor-pointer rounded-sm"
					/>
				</div>
			</div>
			<FooterRightButtons />

			{/* <div className="flex gap-2">
				<div>
					<Select>
						<label className="text-sm text-slate-600 font-normal">
							Storyboard Images
						</label>
						<SelectTrigger className="max-w-fit py-1.5 px-3 space-x-1.5">
							<LayoutGrid className="stroke-1 opacity-50" />
							<SelectValue placeholder="Batch Generate All" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="none">None</SelectItem>
						</SelectContent>
					</Select>
				</div>
				<div className="flex flex-col">
					<label className="text-sm text-slate-600 font-normal text-right">
						~30s to Generate Storyboard
					</label>
					<Button onClick={onGenerate} className="bg-purple-700 space-x-1.5">
						<BrandShortLogo />
						<p className="font-bold text-slate-50">Generate Storyboard</p>
						<ArrowRight className="w-4 h-4 opacity-50" />
					</Button>
				</div>
			</div> */}
		</div>
	);
};

export default Footer;
