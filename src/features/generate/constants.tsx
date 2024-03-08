import { BookOpen, FlipVertical, Video } from "lucide-react";
import React from "react";
import VerticalOrientationIcon from "@/components/icons/vertical-orientation";
import WideOrientationIcon from "@/components/icons/wide-orientation";
import BookOrientationIcon from "@/components/icons/book-orientation";
import {
	AspectRatios,
	DisplayAspectRatios,
	StoryLanguages,
	StoryLengths,
	StoryOutputTypes,
} from "@/utils/enums";

export const tabs = [
	{
		icon: Video,
		text: "Video",
		description: (
			<span className="font-normal text-xs text-slate-600">
				Write a short prompt to describe the{" "}
				<span className="font-medium text-slate-950">video</span> you want to
				imagine.
			</span>
		),
		enumValue: StoryOutputTypes.Video,
	},
	{
		icon: FlipVertical,
		text: "Trends",
		description: (
			<span className="font-normal text-xs text-slate-600">
				Upload a draft video you want to product for the{" "}
				<span className="font-medium text-slate-950">trend</span> you want to
				produce.
			</span>
		),
		enumValue: StoryOutputTypes.SplitScreen,
	},
	{
		icon: BookOpen,
		text: "Storybook",
		description: (
			<span className="font-normal text-xs text-slate-600">
				Write a short prompt to describe the{" "}
				<span className="font-medium text-slate-950">storybook</span> you want
				to imagine.
			</span>
		),
		enumValue: StoryOutputTypes.Story,
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
		enumValue: StoryLanguages.English,
	},
	{
		icon: "/flags/es.svg",
		value: "Spanish",
		enumValue: StoryLanguages.Spanish,
	},
	{
		icon: "/flags/fr.svg",
		value: "French",
		enumValue: StoryLanguages.French,
	},
	{
		icon: "/flags/de.svg",
		value: "German",
		enumValue: StoryLanguages.German,
	},
	{
		icon: "/flags/it.svg",
		value: "Italian",
		enumValue: StoryLanguages.Italian,
	},
	{
		icon: "/flags/pr.svg",
		value: "Portuguese",
		enumValue: StoryLanguages.Portuguese,
	},
	{
		icon: "/flags/ru.svg",
		value: "Russian",
		enumValue: StoryLanguages.Russian,
	},
	{
		icon: "/flags/jp.svg",
		value: "Japanese",
		enumValue: StoryLanguages.Japanese,
	},
	{
		icon: "/flags/ch.svg",
		value: "Chinese",
		enumValue: StoryLanguages.Chinese,
	},
	{
		icon: "/flags/kr.svg",
		value: "Korean",
		enumValue: StoryLanguages.Korean,
	},
	{
		icon: "/flags/ae.svg",
		value: "Arabic",
		enumValue: StoryLanguages.Arabic,
	},
	{
		icon: "/flags/in.svg",
		value: "Hindi",
		enumValue: StoryLanguages.Hindi,
	},
	{
		icon: "/flags/pk.svg",
		value: "Urdu",
		enumValue: StoryLanguages.Urdu,
	},
	{
		icon: "/flags/ir.svg",
		value: "Persian",
		enumValue: StoryLanguages.Persian,
	},
	{
		icon: "/flags/tr.svg",
		value: "Turkish",
		enumValue: StoryLanguages.Turkish,
	},
	{
		icon: "/flags/nl.svg",
		value: "Dutch",
		enumValue: StoryLanguages.Dutch,
	},
	{
		icon: "/flags/pl.svg",
		value: "Polish",
		enumValue: StoryLanguages.Polish,
	},
	{
		icon: "/flags/se.svg",
		value: "Swedish",
		enumValue: StoryLanguages.Swedish,
	},
	{
		icon: "/flags/sk.svg",
		value: "Danish",
		enumValue: StoryLanguages.Danish,
	},
	{
		icon: "/flags/gr.svg",
		value: "Greek",
		enumValue: StoryLanguages.Greek,
	},
	{
		icon: "/flags/my.svg",
		value: "Malay",
		enumValue: StoryLanguages.Malay,
	},
	{
		icon: "/flags/th.svg",
		value: "Thai",
		enumValue: StoryLanguages.Thai,
	},
	{
		icon: "/flags/bg.svg",
		value: "Bulgarian",
		enumValue: StoryLanguages.Bulgarian,
	},
	{
		icon: "/flags/hr.svg",
		value: "Croatian",
		enumValue: StoryLanguages.Croatian,
	},
	{
		icon: "/flags/sr.svg",
		value: "Serbian",
		enumValue: StoryLanguages.Serbian,
	},
	{
		icon: "/flags/ua.svg",
		value: "Ukrainian",
		enumValue: StoryLanguages.Ukrainian,
	},
	{
		icon: "/flags/il.svg",
		value: "Hebrew",
		enumValue: StoryLanguages.Hebrew,
	},
	{
		icon: "/flags/eu.svg",
		value: "Yiddish",
		enumValue: StoryLanguages.Yiddish,
	},
];

export const videoLengths = [
	{ value: "Short 15-30s", enumValue: StoryLengths.Short },
	{ value: "Medium 30-45s", enumValue: StoryLengths.Medium },
	{ value: "Long 45-60s", enumValue: StoryLengths.Long },
];

export const videoRatios = [
	{
		value: "16:9",
		icon: <WideOrientationIcon />,
		enumValue: DisplayAspectRatios["1024x576"],
	},
	{
		value: "9:16",
		icon: <VerticalOrientationIcon />,
		enumValue: DisplayAspectRatios["576x1024"],
	},
	{
		value: "1:1",
		icon: <BookOrientationIcon />,
		enumValue: DisplayAspectRatios["1024x1024"],
	},
];
