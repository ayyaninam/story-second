import {BookOpen, FlipVertical, Video} from "lucide-react";
import React from "react";

export const tabs = [
  {
    icon: Video,
    text: "Video",
    description: (
      <span className="font-normal text-xs text-slate-600">
				Write a short prompt to describe the{" "}
        <span className="font-medium text-slate-950">video</span> you want to
				produce. Then, select language, duration & aspect ratio.,
			</span>
    ),
  },
  {
    icon: FlipVertical,
    text: "Trends",
    description: (
      <span className="font-normal text-xs text-slate-600">
				Write a short prompt to describe the{" "}
        <span className="font-medium text-slate-950">video</span> you want to
				produce. Then, select language, duration & aspect ratio.,
			</span>
    ),
  },
  {
    icon: BookOpen,
    text: "Storybook",
    description: (
      <span className="font-normal text-xs text-slate-600">
				Write a short prompt to describe the{" "}
        <span className="font-medium text-slate-950">video</span> you want to
				produce. Then, select language, duration & aspect ratio.,
			</span>
    ),
  },
];

export enum TabType {
  Video = "video",
  Trends = "trends",
  Storybook = "storybook",
}

export const languages = [
  {
    icon: "/flags/us.svg",
    value: "English",
  },
  {
    icon: "/flags/es.svg",
    value: "Spanish",
  },
  {
    icon: "/flags/fr.svg",
    value: "French",
  },
  {
    icon: "/flags/de.svg",
    value: "German",
  },
  {
    icon: "/flags/it.svg",
    value: "Italian",
  },
  {
    icon: "/flags/pr.svg",
    value: "Portuguese",
  },
  {
    icon: "/flags/ru.svg",
    value: "Russian",
  },
  {
    icon: "/flags/jp.svg",
    value: "Japanese",
  },
  {
    icon: "/flags/ch.svg",
    value: "Chinese",
  },
  {
    icon: "/flags/kr.svg",
    value: "Korean",
  },
  {
    icon: "/flags/ae.svg",
    value: "Arabic",
  },
  {
    icon: "/flags/in.svg",
    value: "Hindi",
  },
  {
    icon: "/flags/pk.svg",
    value: "Urdu",
  },
  {
    icon: "/flags/ir.svg",
    value: "Persian",
  },
  {
    icon: "/flags/tr.svg",
    value: "Turkish",
  },
  {
    icon: "/flags/nl.svg",
    value: "Dutch",
  },
  {
    icon: "/flags/pl.svg",
    value: "Polish",
  },
  {
    icon: "/flags/se.svg",
    value: "Swedish",
  },
  {
    icon: "/flags/sk.svg",
    value: "Danish",
  },
  {
    icon: "/flags/gr.svg",
    value: "Greek",
  },
  {
    icon: "/flags/my.svg",
    value: "Malay",
  },
  {
    icon: "/flags/th.svg",
    value: "Thai",
  },
  {
    icon: "/flags/bg.svg",
    value: "Bulgarian",
  },
  {
    icon: "/flags/hr.svg",
    value: "Croatian",
  },
  {
    icon: "/flags/sr.svg",
    value: "Serbian",
  },
  {
    icon: "/flags/ua.svg",
    value: "Ukrainian",
  },
  {
    icon: "/flags/il.svg",
    value: "Hebrew",
  },
  {
    icon: "/flags/eu.svg",
    value: "Yiddish",
  },
];

export const videoLengths = [
  { value: "Short 15-30s" },
  { value: "Medium 30-45s" },
  { value: "Long 45-60s" },
];

export const videoRatios = [
  { value: "Vertical 9:16" },
  { value: "Landscape 16:9" },
  { value: "Square 1:1" },
];