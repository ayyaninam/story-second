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
		value: "English",
		enumValue: StoryLanguages.English,
	},
	{
		value: "Spanish",
		enumValue: StoryLanguages.Spanish,
	},
	{
		value: "French",
		enumValue: StoryLanguages.French,
	},
	{
		value: "German",
		enumValue: StoryLanguages.German,
	},
	{
		value: "Italian",
		enumValue: StoryLanguages.Italian,
	},
	{
		value: "Portuguese",
		enumValue: StoryLanguages.Portuguese,
	},
	{
		value: "Russian",
		enumValue: StoryLanguages.Russian,
	},
	{
		value: "Japanese",
		enumValue: StoryLanguages.Japanese,
	},
	{
		value: "Chinese",
		enumValue: StoryLanguages.Chinese,
	},
	{
		value: "Korean",
		enumValue: StoryLanguages.Korean,
	},
	{
		value: "Arabic",
		enumValue: StoryLanguages.Arabic,
	},
	{
		value: "Hindi",
		enumValue: StoryLanguages.Hindi,
	},
	{
		value: "Urdu",
		enumValue: StoryLanguages.Urdu,
	},
	{
		value: "Persian",
		enumValue: StoryLanguages.Persian,
	},
	{
		value: "Turkish",
		enumValue: StoryLanguages.Turkish,
	},
	{
		value: "Dutch",
		enumValue: StoryLanguages.Dutch,
	},
	{
		value: "Polish",
		enumValue: StoryLanguages.Polish,
	},
	{
		value: "Swedish",
		enumValue: StoryLanguages.Swedish,
	},
	{
		value: "Danish",
		enumValue: StoryLanguages.Danish,
	},
	{
		value: "Greek",
		enumValue: StoryLanguages.Greek,
	},
	{
		value: "Malay",
		enumValue: StoryLanguages.Malay,
	},
	{
		value: "Thai",
		enumValue: StoryLanguages.Thai,
	},
	{
		value: "Bulgarian",
		enumValue: StoryLanguages.Bulgarian,
	},
	{
		value: "Croatian",
		enumValue: StoryLanguages.Croatian,
	},
	{
		value: "Serbian",
		enumValue: StoryLanguages.Serbian,
	},
	{
		value: "Ukrainian",
		enumValue: StoryLanguages.Ukrainian,
	},
	{
		value: "Hebrew",
		enumValue: StoryLanguages.Hebrew,
	},
	{
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
