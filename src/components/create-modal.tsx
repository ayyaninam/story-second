import { FC, useState } from "react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {Button} from "@/components/ui/button";
import {
  Sparkles,
} from "lucide-react";
import {
  languages,
  TabType,
  tabs,
  videoRatios,
} from "@/features/generate/constants";
import Router from "next/router";
import FileUpload from "@/features/tiktok/components/file-upload";
import {CreateInitialStoryQueryParams} from "@/types";
import {ImageRatios} from "@/utils/image-ratio";
import {DisplayAspectRatios, StoryInputTypes, StoryLanguages, StoryLengths, StoryOutputTypes} from "@/utils/enums";
import Routes from "@/routes";
import {LanguageSelect, VideoRatioSelect} from "@/features/generate/components/selection-constants";

const GenerateModalContent: FC = () => {
  const [value, setValue] = useState<TabType>(TabType.Video);
  const [input, setInput] = useState("");
  const tabIndex = tabs.findIndex((tab) => tab.text.toLowerCase() === value);

  const [selectedVideoRatio, setSelectedVideoRatio] = useState(videoRatios[0]?.value.toString() || "");
  const [selectedVideoLength, setSelectedVideoLength] = useState(StoryLengths.Short);
  const [selectedLanguage, setSelectedLanguage] = useState(languages[0]?.value || "English");
  const [videoFileId, setVideoFileId] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const isSubmitDisabled = isLoading || (!input.trim() && !videoFileId);

  const onSubmit = async () => {
    console.log(input, selectedLanguage, selectedVideoLength, selectedVideoRatio, videoFileId, tabIndex, tabs[tabIndex]?.enumValue);
    const videoRatio = tabIndex === 0 ? selectedVideoRatio : tabIndex === 2 ? "1:1" : "9:16";
    setIsLoading(true);
    const params: CreateInitialStoryQueryParams = {
      input_type: StoryInputTypes.Text,
      output_type: tabs.find((tab) => tab.text.toLowerCase() === value)?.enumValue as StoryOutputTypes,
      prompt: input,

      length: selectedVideoLength,
      language: StoryLanguages[selectedLanguage as keyof typeof StoryLanguages],
      image_resolution: ImageRatios[videoRatio.replace(":", "x") as keyof typeof ImageRatios].enumValue,
      video_key: "",
      display_resolution: videoRatios.find((ratio) => ratio.value === videoRatio)?.enumValue || DisplayAspectRatios["1024x576"],
    };

    if (videoFileId) {
      params["input_type"] = StoryInputTypes.Video;
      params["output_type"] = StoryOutputTypes.SplitScreen;
      params["video_key"] = videoFileId;
      params["image_resolution"] = ImageRatios["9x8"].enumValue;
    }
    const response = Routes.CreateStoryFromRoute(params);
    Router.push(response);
    setIsLoading(false);
  };

  return (
    <div className="mt-24 w-full flex flex-col items-center">
    <div
      className={`flex flex-col w-4/5 gap-4 p-4`}
      style={{
            borderRadius: "12px",
            border: "0.622px solid rgba(255, 255, 255, 0.64)",
            background:
              "radial-gradient(160.1% 83.28% at 24.99% 40.87%, rgba(206, 123, 255, 0.40) 0%, rgba(102, 129, 255, 0.40) 38.5%, rgba(134, 248, 255, 0.40) 100%)",
            backdropFilter: "blur(3.7341220378875732px)",
      }}
    >
      <div className="flex flex-col bg-white items-center p-2 gap-2 rounded-lg h-[calc(100vh-152px)] lg:h-fit overflow-auto">
        <ToggleGroup
          type="single"
          className="grid grid-cols-3 bg-slate-100 p-0.5 rounded-md w-full lg:w-fit"
          value={value}
          onValueChange={(newValue) => {
            if (newValue) setValue(newValue as TabType);
          }}
        >
          <TooltipProvider>
            {tabs.map((tab, index) => {
              const Icon = tab.icon;
              return (
                <Tooltip key={index}>
                  <TooltipTrigger asChild>
                    <ToggleGroupItem
                      value={tab.text.toLowerCase()}
                      className={`w-full h-fit lg:h-7 py-1 px-3 flex flex-col lg:flex-row gap-4 text-slate-400 rounded-sm ${value === tab.text.toLowerCase() ? "bg-white shadow" : ""}`}
                    >
                      <Icon className={`w-4 h-4 ${value === tab.text.toLowerCase() ? "text-accent-600" : ""}`} />
                      {tab.text}
                    </ToggleGroupItem>
                  </TooltipTrigger>
                  <TooltipContent className="w-80 p-4 flex items-start gap-x-4">
                    <div className="w-10 h-10 p-2 rounded-full bg-slate-100">
                      <Icon className="w-6 h-6 flex-shrink-0" />
                    </div>
                    <div className="space-y-1">
                      <p className="font-bold text-popover-foreground">
                        {tab.text}
                      </p>
                      {tab.description}
                    </div>
                  </TooltipContent>
                </Tooltip>
              );
            })}
          </TooltipProvider>
        </ToggleGroup>

        <Textarea
          autoFocus={false}
          maxLength={3000}
          rows={4}
          className="max-h-fit border-border focus:border-0 focus:ring-0 text-md"
          onChange={(e) => setInput(e.target.value)}
          placeholder={`What's your story?`}
        />

        <div className="flex flex-col lg:flex-row items-start lg:items-center lg:px-2 gap-1 w-full">
          <div className="flex flex-grow gap-4 w-4/5">
            {/* Centered content with controlled width */}
            <div className="flex flex-col lg:flex-row gap-4 w-3/5">
              {/* Always display LanguageSelect */}

              {tabIndex !== 1 && (
                <LanguageSelect
                  selectedLanguage={selectedLanguage}
                  setSelectedLanguage={setSelectedLanguage}
                />
              )}

              {tabIndex === 1 && (
                <FileUpload setVideoFileId={setVideoFileId} videoFileId={videoFileId} />
              )}

              {/* Conditionally display VideoLengthSelect */}
              {/*{tabIndex !== 1 && (*/}
              {/*  <VideoLengthSelect*/}
              {/*    selectedVideoLength={selectedVideoLength}*/}
              {/*    setSelectedVideoLength={setSelectedVideoLength}*/}
              {/*  />*/}
              {/*)}*/}

              {/* Conditionally display VideoRatioSelect */}
              {tabIndex === 0 && (
                <>
                <VideoRatioSelect
                  selectedVideoRatio={selectedVideoRatio}
                  setSelectedVideoRatio={setSelectedVideoRatio}
                />
                </>
              )}
            </div>
          </div>

          <div className="flex flex-col lg:flex-row w-1/5">
            <div className="flex justify-end w-full">
              <Button
                disabled={isSubmitDisabled}
                className="flex gap-2 items-center w-full"
                variant="default"
                onClick={() => onSubmit()}
              >
                <Sparkles className="h-4 w-4" />
                {isLoading ? "Generating Experience" : "Generate"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default GenerateModalContent;
