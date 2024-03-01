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
import { useCallback, useRef, useState } from "react";
import {
  EditStoryAction,
  EditStoryDraft,
  StoryStatus,
} from "../reducers/edit-reducer";
import { mainSchema } from "@/api/schema";
import {
  ScenesGenButtonType,
  StoryImageStyles,
  VoiceType,
} from "@/utils/enums";
import clsx from "clsx";
import api from "@/api";
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
import StoryLogo from "../../../../public/auth-prompt/story-logo";
import { getImageCost, getVideoCost } from "@/utils/credit-cost";
import Format from "@/utils/format";
import { cn } from "@/utils";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import TooltipComponent from "@/components/ui/tooltip-component";
import { useSubmitEditScenesAndSegments } from "../mutations/SaveScenesAndSegments";
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

  const regenRemVideosCreditCost = getVideoCost(ungeneratedVideos.length);

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

  const SaveEdits = useSubmitEditScenesAndSegments(dispatch);

  const GenerateImagesMutation = useMutation({
    mutationFn: async () => {
      await SaveEdits.mutateAsync({
        updatedStory: story,
        prevStory: WebstoryData,
      });
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
      router.push(
        Routes.EditStoryboard(story.type, story.topLevelCategory, story.slug)
      );
    },
  });

  const GenerateStoryboardMutation = useMutation({
    mutationFn: async () => {
      await SaveEdits.mutateAsync({
        updatedStory: story,
        prevStory: WebstoryData,
      });
      router.push(
        Routes.EditStoryboard(story.type, story.topLevelCategory, story.slug)
      );
    },
  });

  const RegenerateAllImagesMutation = useMutation({
    mutationFn: async () => {
      await SaveEdits.mutateAsync({
        updatedStory: story,
        prevStory: WebstoryData,
      });
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
      api.video.regenerateAllImages({
        // @ts-expect-error
        image_style: story.settings?.style ?? StoryImageStyles.Realistic,
        story_id: story.id,
        story_type: story.type,
      });
      router.push(
        Routes.EditStoryboard(story.type, story.topLevelCategory, story.slug)
      );
    },
  });

  const GenerateVideoScenesMutation = useMutation({
    mutationFn: async () => {
      await SaveEdits.mutateAsync({
        updatedStory: story,
        prevStory: WebstoryData,
      });
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

  const RegenerateRemainingScenesMutation = useMutation({
    mutationFn: async () => {
      await SaveEdits.mutateAsync({
        updatedStory: story,
        prevStory: WebstoryData,
      });
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
    },
  });

  const RegenerateAllScenesMutation = useMutation({
    mutationFn: async () => {
      await SaveEdits.mutateAsync({
        updatedStory: story,
        prevStory: WebstoryData,
      });
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

  const scenesGenerationButtonOptions = {
    ["all"]: {
      name: "Regenerate All Scenes",
      mutation: RegenerateAllScenesMutation,
      isPending: RegenerateAllScenesMutation.isPending,
    },
    ["remaining"]: {
      name: "Regenerate Remaining Scenes",
      mutation: RegenerateRemainingScenesMutation,
      isPending: RegenerateRemainingScenesMutation.isPending,
    },
  };

  const imagesGenerationButtonOptions = {
    ["all"]: {
      name: "Regenerate All Images",
      mutation: RegenerateAllImagesMutation,
      isPending: RegenerateAllImagesMutation.isPending,
    },
    ["remaining"]: {
      name: "Generate Remaining Images",
      mutation: GenerateImagesMutation,
      isPending: GenerateImagesMutation.isPending,
    },
  };

  const [selectedScenesGenButton, setSelectedScenesGenButton] = useState<
    ScenesGenButtonType | undefined
  >();

  const [selectedImagesGenButton, setSelectedImagesGenButton] = useState<
    ScenesGenButtonType | undefined
  >();

  const View = {
    script: () => (
      <div className="flex gap-2 w-full justify-end flex-wrap">
        <div>
          <Select
            disabled={!WebstoryData.storyDone}
            onValueChange={async (value) => {
              const key =
                value === "Regenerate All Images"
                  ? ScenesGenButtonType.all
                  : ScenesGenButtonType.remaining;
              if (!imagesGenerationButtonOptions[key].isPending) {
                setSelectedImagesGenButton(key);
                await imagesGenerationButtonOptions[key].mutation.mutateAsync();
              }
            }}
          >
            <SelectTrigger
              className={`py-1.5 px-3 justify-between relative ${!selectedImagesGenButton || selectedImagesGenButton === ScenesGenButtonType.all ? "w-[225px]" : "w-[280px]"}`}
            >
              <LayoutGrid strokeWidth={1} />
              {selectedImagesGenButton &&
              imagesGenerationButtonOptions[selectedImagesGenButton]
                .isPending ? (
                <>Generating..... </>
              ) : (
                <SelectValue placeholder="Generate All Images" />
              )}
            </SelectTrigger>
            <SelectContent>
              {Object.entries(imagesGenerationButtonOptions).map(
                ([key, type]) => {
                  return (
                    <SelectItem key={key} value={type.name} className="gap-1">
                      {type.name}
                      <span>
                        {key === ScenesGenButtonType.all
                          ? ` (${regenAllImagesCreditCost} ${Format.Pluralize("Credit", regenAllImagesCreditCost)})`
                          : ` (${regenUngeneratedImagesCost} ${Format.Pluralize("Credit", regenUngeneratedImagesCost)})`}
                      </span>
                    </SelectItem>
                  );
                }
              )}
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col">
          <Button
            onClick={async () => {
              await GenerateStoryboardMutation.mutateAsync();
            }}
            className="bg-accent-600 hover:bg-accent-700 border border-accent-700 text-background text-white  space-x-1.5"
            disabled={
              GenerateStoryboardMutation.isPending || !WebstoryData.storyDone
            }
          >
            <StoryLogo />
            <p className="font-bold text-slate-50">
              {GenerateStoryboardMutation.isPending
                ? "Generating..."
                : "Generate Storyboard"}
            </p>
            <ArrowRight className="w-4 h-4 opacity-50" />
          </Button>
        </div>
      </div>
    ),
    storyboard: () => (
      <div className="flex gap-2 w-full justify-end flex-wrap">
        <div>
          <Button
            variant="outline"
            onClick={async () => {
              await RegenerateAllImagesMutation.mutateAsync();
            }}
            className={cn("stroke-muted text-muted-foreground")}
            disabled={
              RegenerateAllImagesMutation.isPending || !WebstoryData.storyDone
            }
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
            className="bg-accent-600 hover:bg-accent-700 border border-accent-700 text-background text-white  space-x-1.5"
            disabled={
              GenerateVideoScenesMutation.isPending || !WebstoryData.storyDone
            }
          >
            <StoryLogo />
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
      <div className="flex gap-2 w-full justify-end flex-wrap">
        <div>
          <Select
            disabled={!WebstoryData.storyDone}
            onValueChange={async (value) => {
              const key =
                value === "Regenerate All Scenes"
                  ? ScenesGenButtonType.all
                  : ScenesGenButtonType.remaining;
              if (!scenesGenerationButtonOptions[key].isPending) {
                setSelectedScenesGenButton(key);
                await scenesGenerationButtonOptions[key].mutation.mutateAsync();
              }
            }}
          >
            <SelectTrigger
              className={`py-1.5 px-3 justify-between relative ${!selectedScenesGenButton || selectedScenesGenButton === ScenesGenButtonType.all ? "w-[225px]" : "w-[325px]"}`}
            >
              <LayoutGrid strokeWidth={1} />
              {selectedScenesGenButton &&
              scenesGenerationButtonOptions[selectedScenesGenButton]
                .isPending ? (
                <>Regenerating..... </>
              ) : (
                <SelectValue placeholder="Regenerate All Scenes" />
              )}
            </SelectTrigger>
            <SelectContent>
              {Object.entries(scenesGenerationButtonOptions).map(
                ([key, type]) => {
                  return (
                    <SelectItem key={key} value={type.name}>
                      {type.name}
                      <span>
                        {key === ScenesGenButtonType.all
                          ? ` (${regenAllVideosCreditCost} ${Format.Pluralize("Credit", regenAllVideosCreditCost)})`
                          : ` (${regenRemVideosCreditCost} ${Format.Pluralize("Credit", regenRemVideosCreditCost)})`}
                      </span>
                    </SelectItem>
                  );
                }
              )}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Button
            onClick={() => {
              router.push(
                Routes.EditStory(story.type, story.topLevelCategory, story.slug)
              );
            }}
            className="bg-accent-600 hover:bg-accent-700 border border-accent-700 text-background text-white  space-x-1.5"
            disabled={!WebstoryData.storyDone}
          >
            <StoryLogo />
            <p className="font-bold text-slate-50">Preview Your Video</p>
            <ArrowRight className="w-4 h-4 opacity-50" />
          </Button>
        </div>
      </div>
    ),
    preview: () => (
      <div className="flex gap-2 w-full justify-end flex-wrap">
        <div className="flex flex-col">
          <Button
            disabled={
              !ungeneratedVideos.length ||
              !ungeneratedImages.length ||
              !WebstoryData.storyDone
            }
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
            className="bg-accent-600 hover:bg-accent-700 border border-accent-700 text-background text-white  space-x-1.5"
          >
            <StoryLogo size={24} />
            <p className="font-bold">Share & Export Video</p>
            <ArrowRight className="w-4 h-4 opacity-50" />
          </Button>
        </div>
      </div>
    ),
  };

  const FooterRightButtons = View[view];
  const areImagesActive = view === "script" || view === "storyboard";
  return (
    <div className="sticky bottom-0  bg-background border-border border-t-[1px] p-2 justify-between items-center overflow-hidden grid grid-cols-3 gap-4">
      <div className="flex gap-1 py-2">
        <div>
          <label className="text-sm text-slate-600 font-normal">Narrator</label>
          <Select
            onValueChange={onUpdateNarrator}
            disabled={!WebstoryData.storyDone}
          >
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

      <div className="text-center w-100 flex flex-col items-center justify-center">
        {view !== "preview" && (
          <div className="flex flex-col items-center justify-center max-w-md">
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
                                ["ring-accent-600 ring-[1.5px] ring-offset-1"]:
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
          </div>
        )}
      </div>
      <FooterRightButtons />
    </div>
  );
};

export default Footer;
