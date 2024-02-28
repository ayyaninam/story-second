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
	Radio,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/router";
import { useCallback, useRef } from "react";
import {
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
import { getImageCost, getVideoCost } from "@/utils/credit-cost";
import Format from "@/utils/format";
import { cn } from "@/utils";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import TooltipComponent from "@/components/ui/tooltip-component";
const images = [
	{
		key: StoryImageStyles.Auto,
		src: AutoImg,
		label: "Auto",
	},
	{
		key: StoryImageStyles.Realistic,
		src: RealisticImg,
		label: "Realistic",
	},
	{
		key: StoryImageStyles.Cartoon,
		src: CartoonImg,
		label: "Cartoon",
	},
	{
		key: StoryImageStyles.Sketch,
		src: SketchImg,
		label: "Sketch",
	},
	{
		key: StoryImageStyles.WaterColor,
		src: WaterColorImg,
		label: "Water Color",
	},
	{
		key: StoryImageStyles.Anime,
		src: AnimeImg,
		label: "Anime",
	},
	{
		key: StoryImageStyles.Horror,
		src: HorrorImg,
		label: "Horror",
	},
	{
		key: StoryImageStyles.SciFi,
		src: SciFiImg,
		label: "Sci-Fi",
	},
];

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
	view: "script" | "storyboard" | "scene" | "preview";
}) => {
	const router = useRouter();

	const scrollRef = useRef<HTMLDivElement | null>(null);

	const scrollLeft = useCallback(() => {
		scrollRef.current?.scroll({ left: -50, behavior: "smooth" });
	}, []);
	const scrollRight = useCallback(() => {
		scrollRef.current?.scroll({ left: 50, behavior: "smooth" });
	}, []);

	const generationStyle = story.settings?.style ?? StoryImageStyles.Realistic;

	const ungeneratedImages = story.scenes?.flatMap((scene) =>
		scene.segments
			?.map((el, index) => ({ ...el, sceneId: scene.id }))
			?.filter((segment) => !segment.imageKey)
	);

	const ungeneratedVideos = story.scenes?.flatMap((scene) =>
		scene.segments
			?.map((el, index) => ({ ...el, sceneId: scene.id }))
			?.filter((segment) => !segment.videoKey)
	);
	const regenUngeneratedImagesCost = getImageCost(ungeneratedImages.length);

	const numImages = story.scenes.flatMap((el) => el.segments);
	const regenAllImagesCreditCost = getImageCost(numImages.length);

	const regenAllVideosCreditCost = getVideoCost(numImages.length);

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

	const saveEdits = useCallback(async () => {
		const diff = GenerateStoryDiff(WebstoryToStoryDraft(WebstoryData!), story);
		console.log(diff);
		// console.log(WebstoryToStoryDraft(WebstoryData!), story);
		const edits: SegmentModificationData[] = diff.edits.map((segment) => ({
			details: { Ind: segment.id, Text: segment.textContent },
			operation: SegmentModifications.Edit,
		}));
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

		const deletions: SegmentModificationData[] = diff.subtractions.map(
			(segment) => ({
				details: {
					Ind: segment.id,
				},
				operation: SegmentModifications.Delete,
			})
		);
		if (additions.length || edits.length || deletions.length) {
			const editedResponse = await EditSegment.mutateAsync({
				story_id: WebstoryData?.id as string,
				story_type: WebstoryData?.storyType,
				edits: [...edits, ...additions, ...deletions],
			});
		}
	}, [WebstoryData, story, EditSegment]);

	const GenerateImagesMutation = useMutation({
		mutationFn: async () => {
			await saveEdits();
			const newStory = await api.video.get(
				story.topLevelCategory,
				story.slug,
				story.type
			);
			const ungeneratedImages = newStory.scenes?.flatMap((scene) =>
				scene.videoSegments
					?.map((el, index) => ({ ...el, sceneId: scene.id }))
					?.filter((segment) => !segment.imageKey)
			);
			console.log(ungeneratedImages, newStory);
			if (ungeneratedImages && ungeneratedImages?.length > 0) {
				const Promises = ungeneratedImages?.map(
					async (el) =>
						(await api.video.regenerateImage({
							segment_idx: el?.index!,
							story_id: story.id,
							story_type: story.type!,
							// @ts-expect-error
							image_style: story.settings?.style ?? StoryImageStyles.Realistic,
							prompt: el?.textContent!,
						})) ?? Promise.resolve()
				);
				Promise.all(Promises).then((val) => val.map((el) => console.log(el)));
			}

			// api.video.regenerateAllImages({
			// 	// @ts-expect-error
			// 	image_style:
			// 		story.settings?.style ?? StoryImageStyles.Realistic,
			// 	story_id: story.id,
			// 	story_type: story.type,
			// });
			router.push(
				Routes.EditStoryboard(story.type, story.topLevelCategory, story.slug)
			);
		},
	});

	const GenerateStoryboardMutation = useMutation({
		mutationFn: async () => {
			await saveEdits();
			router.push(
				Routes.EditStoryboard(story.type, story.topLevelCategory, story.slug)
			);
		},
	});

	const RegenerateAllImagesMutation = useMutation({
		mutationFn: async () => {
			await saveEdits();
			dispatch({
				type: "update_segment_statuses",
				key: "imageStatus",
				segmentIndices: story.scenes.flatMap((el, sceneIndex) =>
					el.segments.map((el, segmentIndex) => ({
						sceneIndex,
						segmentIndex,
					}))
				),
				status: StoryStatus.PENDING,
			});
			await api.video.regenerateAllImages({
				// @ts-expect-error
				image_style: story.settings?.style ?? StoryImageStyles.Realistic,
				story_id: story.id,
				story_type: story.type,
			});
		},
	});

	const GenerateVideoScenesMutation = useMutation({
		mutationFn: async () => {
			await saveEdits();
			const newStory = await api.video.get(
				story.topLevelCategory,
				story.slug,
				story.type
			);
			const ungeneratedVideos = newStory.scenes?.flatMap((scene) =>
				scene.videoSegments
					?.map((el, index) => ({ ...el, sceneId: scene.id }))
					?.filter((segment) => !segment.videoKey && !segment.videoRegenerating)
			);

			if (ungeneratedVideos && ungeneratedVideos?.length > 0) {
				const Promises = ungeneratedVideos?.map(async (video) => {
					return await api.video.regenerateVideo({
						segment_idx: video?.index!,
						story_id: story.id,
						story_type: story.type,
					});
				});
				Promise.all(Promises).then((val) => val.map((el) => console.log(el)));
			}

			router.push(
				Routes.EditScenes(story.type, story.topLevelCategory, story.slug)
			);
		},
	});

	const RegenerateAllScenesMutation = useMutation({
		mutationFn: async () => {
			await saveEdits();
			dispatch({
				type: "update_segment_statuses",
				key: "videoStatus",
				segmentIndices: story.scenes.flatMap((el, sceneIndex) =>
					el.segments.map((el, segmentIndex) => ({
						sceneIndex,
						segmentIndex,
					}))
				),
				status: StoryStatus.PENDING,
			});
			await api.video.regenerateAllVideos({
				// @ts-expect-error
				image_style: story.settings?.style ?? StoryImageStyles.Realistic,
				story_id: story.id,
				story_type: story.type,
			});
		},
	});

	const View = {
		script: () => (
			<div className="flex gap-2 mt-6 w-full justify-end">
				<div>
					<Button
						variant="outline"
						onClick={async () => {
							await GenerateImagesMutation.mutateAsync();
						}}
						className={cn(
							"stroke-muted text-muted-foreground",
							regenUngeneratedImagesCost === 0 && "hidden"
						)}
						disabled={GenerateImagesMutation.isPending}
					>
						<LayoutGrid strokeWidth={1} className="mr-2" />
						{GenerateImagesMutation.isPending ? (
							<>Generating..... </>
						) : (
							<>Generate Image </>
						)}

						<span className="ml-1">
							({regenUngeneratedImagesCost}{" "}
							{Format.Pluralize("Credit", regenUngeneratedImagesCost)})
						</span>
					</Button>
				</div>
				<div className="flex flex-col">
					<Button
						onClick={async () => {
							await GenerateStoryboardMutation.mutateAsync();
						}}
						className="space-x-1.5"
						disabled={GenerateStoryboardMutation.isPending}
					>
						<BrandShortLogo />
						<p className="font-bold text-slate-50">
							{GenerateStoryboardMutation.isPending
								? "Generating...."
								: "Generate Storyboard"}
						</p>
						<ArrowRight className="w-4 h-4 opacity-50" />
					</Button>
				</div>
			</div>
		),
		storyboard: () => (
			<div className="flex gap-2 mt-6 w-full justify-end">
				<div>
					<Button
						variant="outline"
						onClick={async () => {
							await RegenerateAllImagesMutation.mutateAsync();
						}}
						className={cn("stroke-muted text-muted-foreground")}
						disabled={RegenerateAllImagesMutation.isPending}
					>
						<LayoutGrid strokeWidth={1} className="mr-2" />
						{RegenerateAllImagesMutation.isPending ? (
							<>Regenerating..... </>
						) : (
							<>Regenerate All Images </>
						)}

						<span className="ml-1">
							({regenAllImagesCreditCost}{" "}
							{Format.Pluralize("Credit", regenAllImagesCreditCost)})
						</span>
					</Button>
				</div>
				<div>
					<Button
						onClick={async () => {
							await GenerateVideoScenesMutation.mutateAsync();
						}}
						className="bg-purple-700 space-x-1.5"
						disabled={GenerateVideoScenesMutation.isPending}
					>
						<BrandShortLogo />
						{GenerateVideoScenesMutation.isPending ? (
							<p className="font-bold text-slate-50">Generating.....</p>
						) : (
							<p className="font-bold text-slate-50">Generate Video Scenes</p>
						)}

						<ArrowRight className="w-4 h-4 opacity-50" />
					</Button>
				</div>
			</div>
		),
		scene: () => (
			<div className="flex gap-2 mt-6 w-full justify-end">
				<div>
					<Button
						variant="outline"
						onClick={async () => {
							await RegenerateAllScenesMutation.mutateAsync();
						}}
						className={cn("stroke-muted text-muted-foreground")}
						disabled={RegenerateAllScenesMutation.isPending}
					>
						<LayoutGrid strokeWidth={1} className="mr-2" />
						{RegenerateAllScenesMutation.isPending ? (
							<>Regenerating..... </>
						) : (
							<>Regenerate All Scenes </>
						)}

						<span className="ml-1">
							({regenAllVideosCreditCost}{" "}
							{Format.Pluralize("Credit", regenAllVideosCreditCost)})
						</span>
					</Button>
				</div>
				<div>
					<Button
						onClick={() => {
							router.push(
								Routes.EditStory(story.type, story.topLevelCategory, story.slug)
							);
						}}
						className="space-x-1.5"
					>
						<BrandShortLogo />
						<p className="font-bold text-slate-50">Preview Your Video</p>
						<ArrowRight className="w-4 h-4 opacity-50" />
					</Button>
				</div>
			</div>
		),
		preview: () => (
			<div className="flex gap-2 mt-6 w-full justify-end">
				<div className="flex flex-col">
					<Button
						disabled={!ungeneratedVideos.length || !ungeneratedImages.length}
						onClick={() => {
							if (ungeneratedVideos.length && ungeneratedImages.length) {
								router.push(
									Routes.EditStory(
										story.type,
										story.topLevelCategory,
										story.slug
									)
								);
							}
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
	const areImagesActive = view === "script" || view === "storyboard";
	return (
		<div className="sticky bottom-0  bg-background border-border border-t-[1px] p-3 pt-1.5 justify-between items-center overflow-hidden grid grid-cols-3 gap-4">
			<div className="flex gap-1 py-2">
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
			</div>

			<div className="text-center max-w-md">
				{view !== "preview" && (
					<>
						<span className="text-sm font-normal">
							<span className="text-slate-600">Primary Image Style:</span>{" "}
							<span className="text-purple-600">
								{images.find(
									(el) =>
										el.key === story.settings?.style ??
										(StoryImageStyles.Realistic as StoryImageStyles)
								)?.label ?? "Realistic"}
							</span>
						</span>

						<div className="flex space-x-1 items-center">
							<ChevronLeft
								onClick={scrollLeft}
								className="w-8 h-8 opacity-50 "
							/>
							<div
								ref={scrollRef}
								className="flex 2xl:overflow-x-visible overflow-x-hidden "
							>
								<div className="flex gap-x-1 py-1">
									<TooltipProvider>
										{images.map(({ key, label, src }, index) => (
											<>
												<TooltipComponent label={label} align="center">
													<Image
														src={src}
														alt={label}
														key={index}
														width={64}
														height={48}
														className={clsx(
															`w-16 h-12 rounded-lg transition-opacity ease-in-out ${areImagesActive || generationStyle === Number(key) ? "hover:opacity-80" : "opacity-40"}`,
															{
																["ring-purple-600 ring-[1.5px] ring-offset-1"]:
																	generationStyle === Number(key),
															}
														)}
														role="button"
														onClick={() => {
															if (areImagesActive)
																updateImageStyle(
																	Number(key) as unknown as StoryImageStyles
																);
														}}
														style={{ objectFit: "cover" }}
													/>
												</TooltipComponent>
											</>
										))}
									</TooltipProvider>
								</div>
							</div>
							<ChevronRight
								onClick={scrollRight}
								className="w-8 h-8 opacity-50 hover:bg-slate-200 hover:cursor-pointer rounded-sm"
							/>
						</div>
					</>
				)}
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
