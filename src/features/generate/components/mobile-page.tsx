import {ToggleGroup, ToggleGroupItem} from "@/components/ui/toggle-group";
import {languages, tabs, TabType, videoLengths, videoRatios} from "@/features/generate/constants";
import {cn} from "@/utils";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import Image from "next/image";
import {Textarea} from "@/components/ui/textarea";
import {Button} from "@/components/ui/button";
import {ChevronLeft, Sparkles} from "lucide-react";
import React, {useState} from "react";
import {CreateInitialStoryQueryParams} from "@/types";
import {DisplayAspectRatios, StoryInputTypes, StoryLanguages, StoryLengths, StoryOutputTypes} from "@/utils/enums";
import {ImageRatios} from "@/utils/image-ratio";
import Routes from "@/routes";
import {LanguageSelect, VideoLengthSelect, VideoRatioSelect} from "@/features/generate/components/selection-constants";
import FileUpload from "@/features/tiktok/components/file-upload";
import Router from "next/router";

export default function MobileGeneratePage() {
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
    Router.push(response).then(() => {
      setIsLoading(false);
    }).catch(error => {
      console.error('Navigation error:', error);
      setIsLoading(false); // Ensure loading state is reset even if navigation fails
    });
  };

  return (
    <div
      className="lg:hidden h-full overflow-y-scroll bg-background lg:rounded-lg flex-grow"
      style={{
        background: "linear-gradient(180deg, #A734EA 86.59%, #020817 100%)",
      }}
    >
      <div
        className="rounded-lg p-1.5 m-1"
        style={{
          background: "linear-gradient(180deg, #F1F6F9 0%, #FFF 100%)",
        }}
      >
        <div className="flex w-full gap-1 m-1">
          <div
            className="w-10 h-10 flex-shrink-0"
            style={{
              borderRadius: "10px",
              background:
                "linear-gradient(180deg, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0.00) 100%), #8F22CE",
              boxShadow:
                "0px -1px 12px 0px rgba(255, 255, 255, 0.12) inset, 0px 0px 0px 1px #8F22CE",
            }}
          >
            <div className="w-[35px] h-[35px] rounded-full bg-purple-950 mx-0.5 my-0.5 p-0.5">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="30"
                height="30"
                viewBox="0 0 30 30"
                fill="none"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M23.4125 11.3125L25.925 12.0375H25.9125C26.1125 12.1 26.25 12.275 26.25 12.4875C26.25 12.7 26.1125 12.8875 25.9125 12.9375L23.4 13.6625C21.0875 14.325 19.3125 16.1 18.65 18.4125L17.9375 20.925C17.8875 21.125 17.7 21.2625 17.5 21.2625C17.3 21.2625 17.125 21.125 17.0625 20.925L16.35 18.4125C15.6875 16.1 13.9125 14.325 11.6 13.6625L9.0875 12.9375C8.8875 12.875 8.75 12.7 8.75 12.4875C8.75 12.275 8.8875 12.0875 9.0875 12.0375L11.6 11.3125C13.9125 10.65 15.6875 8.875 16.35 6.5625L17.0625 4.05C17.175 3.65 17.8375 3.65 17.95 4.05L18.6625 6.5625C19.325 8.875 21.1 10.65 23.4125 11.3125ZM11.5625 20.9625L12.9 21.35C13 21.3875 13.075 21.475 13.075 21.5875C13.075 21.7 13 21.8 12.9 21.825L11.5625 22.2125C10.3375 22.5625 9.3875 23.5 9.0375 24.7375L8.65 26.075C8.6125 26.175 8.525 26.25 8.4125 26.25C8.3 26.25 8.2 26.175 8.175 26.075L7.7875 24.7375C7.4375 23.5125 6.4875 22.5625 5.2625 22.2125L3.925 21.825C3.825 21.7875 3.75 21.7 3.75 21.5875C3.75 21.475 3.825 21.375 3.925 21.35L5.2625 20.9625C6.4875 20.6125 7.4375 19.675 7.7875 18.4375L8.175 17.1C8.2375 16.8875 8.5875 16.8875 8.65 17.1L9.0375 18.4375C9.3875 19.6625 10.3375 20.6125 11.5625 20.9625Z"
                  fill="white"
                />
              </svg>
            </div>
          </div>
          <span className="space-y-1">
						<p className="text-base font-bold text-slate-950">
							Generate Something New
						</p>
						<p className="text-xs font-normal text-slate-600">
							Select what you want to generate.
						</p>
					</span>
        </div>

        <div className="flex flex-col border-[0.5px] border-slate-300 bg-background p-2 gap-2 rounded-lg h-[calc(100vh-192px)]">
          <div className="flex flex-col lg:flex-row items-start lg:items-center lg:px-2 gap-1">
            <ToggleGroup
              type="single"
              className="grid grid-cols-3 bg-slate-100 p-0.5 rounded-md w-full lg:w-fit"
              value={value}
              onValueChange={(newValue) => {
                if (newValue) setValue(newValue as TabType);
              }}
            >
              {tabs.map((tab, index) => {
                const Icon = tab.icon;
                return (
                  <ToggleGroupItem
                    key={index}
                    className="w-full h-fit lg:h-7 py-1 px-3 flex flex-col lg:flex-row gap-1 text-slate-400 rounded-sm"
                    style={{
                      background:
                        value === tab.text.toLowerCase() ? "white" : "",
                      boxShadow:
                        value === tab.text.toLowerCase()
                          ? "0px 1px 2px 0px rgba(9, 25, 72, 0.13), 0px 3px 8px 0px rgba(9, 25, 72, 0.05)"
                          : "none",
                    }}
                    value={tab.text.toLowerCase()}
                    aria-label="Toggle video"
                  >
                    <Icon
                      className={cn(
                        "w-4 h-4 flex-shrink-0",
                        value === tab.text.toLowerCase() && "text-purple-600"
                      )}
                    />
                    {tab.text}
                  </ToggleGroupItem>
                );
              })}
            </ToggleGroup>
          </div>

          <div className="flex lg:hidden gap-1 flex-col items-center">
            {tabs.find((tab) => tab.text.toLowerCase() === value)?.description}
            <div className="w-full flex flex-col lg:flex-row items-start lg:items-center lg:px-2 gap-1">
              {/* Conditionally display LanguageSelect if not in the Image tab */}
              {tabIndex !== 1 && (
                <LanguageSelect
                  selectedLanguage={selectedLanguage}
                  setSelectedLanguage={setSelectedLanguage}
                />
              )}

              {/* Conditionally display FileUpload if in the Video tab */}
              {tabIndex === 1 && (
                <div className="flex items-center flex-col w-full">
                <FileUpload setVideoFileId={setVideoFileId} videoFileId={videoFileId} /></div>
              )}

              {/* Display VideoLengthSelect for tabs other than Image tab */}
              {/*{tabIndex !== 1 && (*/}
              {/*  <VideoLengthSelect*/}
              {/*    selectedVideoLength={selectedVideoLength}*/}
              {/*    setSelectedVideoLength={setSelectedVideoLength}*/}
              {/*  />*/}
              {/*)}*/}

              {/* Display VideoRatioSelect for the Video tab */}
              {tabIndex === 0 && (
                <VideoRatioSelect
                  selectedVideoRatio={selectedVideoRatio}
                  setSelectedVideoRatio={setSelectedVideoRatio}
                />
              )}
            </div>

          </div>
          <Textarea
            autoFocus
            maxLength={1000}
            className="h-full border-border focus:border-0"
            onChange={(e) => setInput(e.target.value)}
          />
          <div className="flex justify-between text-xs text-slate-600">
            <span>{input.length}/1000 characters</span>
            <span>Next, edit the script & choose a style.</span>
          </div>
        </div>
      </div>
      <div className="px-4 py-1 flex w-full justify-between gap-2">

        <Button
          disabled={isSubmitDisabled}
          type="button"
          className="w-full gap-x-1 rounded-md py-2 font-normal text-white px-4 focus:text-white"
          style={{
            background:
              "linear-gradient(180deg, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0.00) 100%), #A734EA",
            boxShadow:
              "0px -1px 12px 0px rgba(255, 255, 255, 0.12) inset, 0px 8px 20px -2px #3E095D, 0px 0px 0px 1px #CE7AFF",
          }}
          onClick={onSubmit}
        >
          <Sparkles className="w-4 h-4 fill-white" />
          {isLoading ? "Generating Your Experience" : "Generate Script From Prompt"}
        </Button>
      </div>
    </div>
  )
}