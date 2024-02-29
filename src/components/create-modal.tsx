import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowRight,
  BookOpen,
  ChevronLeft,
  FlipVertical,
  Sparkles,
  Video,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { FC, useState } from "react";
import { cn } from "@/utils";
import Image from "next/image";

import {
  languages,
  TabType,
  tabs,
  videoLengths,
  videoRatios,
} from "@/features/generate/constants";

const GenerateModalContent: FC<{ isMobile: boolean }> = ({ isMobile }) => {
  const [value, setValue] = useState<TabType>(TabType.Video);
  const [input, setInput] = useState("");

  return (
    <div
      className="flex flex-col min-w-full lg:min-w-fit left-1/2 lg:left-[60%] lg:max-w-2xl p-3 lg:top-[30%]"
      style={
        !isMobile
          ? {
            borderRadius: "12px",
            border: "0.622px solid rgba(255, 255, 255, 0.64)",
            background:
              "radial-gradient(160.1% 83.28% at 24.99% 40.87%, rgba(206, 123, 255, 0.40) 0%, rgba(102, 129, 255, 0.40) 38.5%, rgba(134, 248, 255, 0.40) 100%)",
            backdropFilter: "blur(3.7341220378875732px)",
          }
          : {}
      }
    >
      <div className="flex flex-col bg-white p-2 gap-2 rounded-lg h-[calc(100vh-152px)] lg:h-fit">
        <div>
          <div className="flex flex-col lg:flex-row items-start lg:items-center lg:px-2 gap-1">
            <div className="hidden lg:block">Create New</div>
            <ToggleGroup
              type="single"
              className="grid grid-cols-3 bg-slate-100 p-0.5 rounded-md w-full lg:w-fit"
              value={value}
              onValueChange={(value) => {
                if (value) setValue(value as TabType);
              }}
            >
              <TooltipProvider>
                {tabs.map((tab, index) => {
                  const Icon = tab.icon;
                  return (
                    <Tooltip key={index}>
                      <TooltipTrigger>
                        <ToggleGroupItem
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
                              value === tab.text.toLowerCase() &&
                              "text-emerald-600"
                            )}
                          />
                          {tab.text}
                        </ToggleGroupItem>
                      </TooltipTrigger>
                      {!isMobile && (
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
                      )}
                    </Tooltip>
                  );
                })}
              </TooltipProvider>
            </ToggleGroup>
          </div>

          <div className="flex lg:hidden gap-1 flex-col items-center">
            {tabs.find((tab) => tab.text.toLowerCase() === value)?.description}
            <div className="w-full flex rounded-md gap-x-0.5">
              <Select>
                <SelectTrigger className="w-full h-fit focus:ring-0 focus:ring-offset-0 px-2">
                  <SelectValue placeholder="English" />
                </SelectTrigger>
                <SelectContent>
                  {languages.map((lang, index) => (
                    <SelectItem key={index} value={lang.value.toLowerCase()}>
                      <div className="flex gap-2">
                        <Image
                          width={16}
                          height={16}
                          alt={`logo-${index}`}
                          src={lang.icon}
                          className="rounded-full"
                        />
                        {lang.value}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select>
                <SelectTrigger className="w-full h-fit focus:ring-0 focus:ring-offset-0 px-2">
                  <SelectValue placeholder="Short 15-30s" />
                </SelectTrigger>
                <SelectContent>
                  {videoLengths.map((len, index) => (
                    <SelectItem
                      key={index}
                      value={len.value.replace(" ", "_").toLowerCase()}
                    >
                      {len.value}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select>
                <SelectTrigger className="w-full h-fit focus:ring-0 focus:ring-offset-0 px-2">
                  <SelectValue placeholder="Vertical 9:16" />
                </SelectTrigger>
                <SelectContent>
                  {videoRatios.map((ratio, index) => (
                    <SelectItem
                      key={index}
                      value={ratio.value.replace(" ", "_").toLowerCase()}
                    >
                      {ratio.value}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        <Textarea
          autoFocus
          maxLength={1000}
          rows={isMobile ? 100 : 4}
          className="max-h-fit border-border focus:border-0"
          onChange={(e) => setInput(e.target.value)}
        />
        {isMobile && (
          <div className="flex justify-between text-xs text-slate-600">
            <span>{input.length}/1000 characters</span>
            <span>Next, edit the script & choose a style.</span>
          </div>
        )}
        <div className="hidden lg:flex w-full lg:justify-between">
          <div className="max-w-md flex bg-muted rounded-md gap-x-0.5 p-0.5">
            <Select>
              <SelectTrigger className="w-32 focus:ring-0 focus:ring-offset-0">
                <SelectValue placeholder="English" />
              </SelectTrigger>
              <SelectContent>
                {languages.map((lang, index) => (
                  <SelectItem key={index} value={lang.value.toLowerCase()}>
                    <div className="flex gap-2">
                      <Image
                        width={16}
                        height={16}
                        alt={`logo-${index}`}
                        src={lang.icon}
                        className="rounded-full"
                      />
                      {lang.value}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select>
              <SelectTrigger className="w-32 focus:ring-0 focus:ring-offset-0">
                <SelectValue placeholder="Short 15-30s" />
              </SelectTrigger>
              <SelectContent>
                {videoLengths.map((len, index) => (
                  <SelectItem
                    key={index}
                    value={len.value.replace(" ", "_").toLowerCase()}
                  >
                    {len.value}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select>
              <SelectTrigger className="w-32 focus:ring-0 focus:ring-offset-0">
                <SelectValue placeholder="Vertical 9:16" />
              </SelectTrigger>
              <SelectContent>
                {videoRatios.map((ratio, index) => (
                  <SelectItem
                    key={index}
                    value={ratio.value.replace(" ", "_").toLowerCase()}
                  >
                    {ratio.value}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button type="button" className="gap-x-1">
            <Sparkles className="w-4 h-4 fill-white" />
            Generate
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>

        <div className="flex flex-row gap-x-2 lg:hidden w-full justify-between">
          <div>
            <Button
              variant="outline"
              className="text-emerald-600 opacity-60 font-normal rounded-md bg-[rgba(187, 85, 247, 0.00)] focus:text-purple-200"
            >
              <ChevronLeft className="w-5 h-5" />
              Back
            </Button>
          </div>
          <Button
            type="button"
            className="gap-x-1 rounded-md py-2 font-normal text-white px-4 focus:text-white"
            style={{
              background:
                "linear-gradient(180deg, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0.00) 100%), #031926",
              boxShadow:
                "0px -1px 12px 0px rgba(255, 255, 255, 0.12) inset, 0px 0px 0px 1px #021017",
            }}
          >
            <Sparkles className="w-4 h-4 fill-white" />
            Generate Script From Prompt
          </Button>
        </div>
      </div>
    </div>
  );
};

export default GenerateModalContent;