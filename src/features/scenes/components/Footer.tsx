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

const images = {
	Realistic:
		"https://s3-alpha-sig.figma.com/img/df90/21a4/e692a49276e76580e568857e2e98ecfd?Expires=1709510400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=M8YPtAuPLlNk0hxZEUVte3QslxvEXaB4oCE~CKGSTELDpn9~0yElSFzbxR2o6kyT4IGx3HeKt0-Aa-YAOfCha3mBUW5I9pyvLCEU8R-jCq~R8TkgMZHW-dRxxahRuPS3ui1wNYvzWLPTE7X6PscEcV~FB5eP9nPWyMdvCgjDhrfw8Iwo-T64KzbZpIu8PFYUGeEBgYGuSmLOK-kOTbyDOopch8H2JaaId5E-NEna2gbXVlIr-wjKL0Kh34~1mWYJnAumIeIVkRPTPcoWnKduksrd3mzCHO6d78WQxar~6JTNveiz8Enws4d1PBgiRZ65jqWcKNNDnzsekL8SH9M~3Q__",
	Auto: "https://s3-alpha-sig.figma.com/img/4b74/a308/440aa6436990ba59544eec4ffcdc563e?Expires=1709510400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=NQuNSbFJk~IubBDht3JCZXWMewISqVltZtHPQN~XOIoMhBzh8Syk7wfE8XAUEEjwrW-3qYgN~yWut8QsQzuVkqg5d01Y-TWO2sIAXRbIfgDFex--Ev~ZgkPxDGxciPhy16O4PehAB-g4eq9j~Qq9fPfLKFJuqj9tTVO-GzOqROI~cGrduXj6O6BrwkFWRzbVHBzOzzzXbWaXgpTb83SOa1Mw8xIx8ij7foDG8Gs4NSVw56HeJ6NtTasw15DSL3N16NWD6DNfox~X1q1O4Z0Ty235gmjYh9FdsNjoKCX6qPcoCjpuxqiKIoCJEl~Kmr9~p7ypcu2HTlQ0eNmYuBHt8Q__",
	Cartoon:
		"https://s3-alpha-sig.figma.com/img/37d6/3067/52049c46979d73390a22ddd36c091858?Expires=1709510400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=jQxcQDduYjzAFCBraADR4Hh6LB0FpMIAYdzRhd0CqoBdC6TC6tdXP0~8mx7RRUGY7qeHGuc4p3QNqvQnm4OIhh8lnx6sVBIo7KeZxP89xIBTmbHVriNKyNQyucBBYt9aM72oNJ30MTTywI7j8RUnH-XmNRJKsPWrm3HhVdKRV6Iqb2DxWs5cVDHUpnIApxn16dG3KZgaXGchTF8dinm-Y5P-W17Gu218AeMrz9uzlNTa28iM38vBxKrm8O74OKGroY6XdhozST17dh6ouknWEI0qmmvxMcYacwZEjr-bJDWi1fZc6w0pVxYv8syc2RYHx51STgMiqWzbmfxTRasJzw__",
	Sketch:
		"https://s3-alpha-sig.figma.com/img/f693/d943/4a89adb3a043999da9fd93a00f46d036?Expires=1709510400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=pHNVfsEyAMgYra620NFC5qLHp67xEp0lXuXdP3aDPJCkNECPqN51er1-J4f2imxeyu4Lf1lBbHoj3oQtxjpe2Xzv6Bq6mKt5Gfz16vDvG5LelsCkOelLaJJUO45i2PvkYbTZO7~-8LovqRDEan36E6x-JZxS4zmwcFIbVcXcc87ciNM6EoDdiG6UEhOLXn0W206d5YCO5TJwoRkrcgnINdwMNnAJs26zkwlf8GCIPVNZBRmI21DEwjg2N2rpWdcGgSmVUgocHekhxp8PO-HYESUwfaMxKhLlUMQxuGx9eqXxXtJlf-QaswTrZGu3FWXiyxbSMmtOm46ko9BL0WMLkA__",
	WaterColor:
		"https://s3-alpha-sig.figma.com/img/db3e/2276/a5d1b15a94d2b0e6350dee3a7c20ff16?Expires=1709510400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=cVCnfj7qxDhPX9xAUXksB7-dC8-NDeZL30EKw5rGeYkYJ-CnF4dMrGflFfnyVUgfZ0z7O5s7YuVEs-Wy2lGkwSXFrQg8UYCo99kf3beKvVJ8~gfq0jH3fsLv~64rBVFVC0pGEuibP3ZTA2uCyrX6Fws2ry5JsEXm0iTlmInyNqz2n~l6uqMr7wXpOvX-8PQrVJz~cLeWFz8qGZjOBR60UMaK7VlKeoi1QScNc~lHEOjwFKWPSM6w0DCpbjVbifr-FpbzOmhuZBgctGgQFCn3hCwQ1-LUDycccnbuS3sKf8G2113cP3QmkeqfMul0scskop482kiKNEXGTTtgs7g3CA__",
	SciFi:
		"https://s3-alpha-sig.figma.com/img/97c3/38ab/3840b8e82a3b15f65887698279769256?Expires=1709510400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=BMYVki7bunQUrg~NoRX5~o9huPumsKjE1pYA1L6tHbvSdsfXdqTAp4zzp0IN8SphEnSIln2ZvlvYtjpf4N5STKBfgPVq4b6KWvjT8weDYM3kLi~bX7OLFn2N~-DRd5KFNfcbMAcMbZS4PCF8WVuXywLnf-bRbg7bMpyRYXkw7EluzZKkFozfutSLoqZxDKZsapMeuNb1TTPdD3NrmzHGeuxo5CbGz0YeBOJYInSe0mxnZJkjsbPS7WWdFKlHwxCeJiG74fN5wgG5hhfOUMW~exe79CkosefWuuHoBjYpJ0XIiFrq0pGHG8T0Zo0yzEsLRBJ5ogWLO8soekPenP6RMg__",
	Anime:
		"https://s3-alpha-sig.figma.com/img/a4f0/438b/9fd5442c1e9eb8d094a4188d4adc9fea?Expires=1709510400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=jsvJq0~YWdDwXOImQPvDFl~rPY3nmOF1ToG8re6IhR7IXk9j9BjeYIayiicYEdyz41K~tP2PJYpA0hv~fTnODHWtvC1XoWCP6CC-3eJyQbtDmVXlqrBRgHXAP1QesdP02ng2k-5Zru7fEXUsEcLwgRCPmUVsTA1RAGxJ~QKqaJHRXQiouxitBl2RS8PCcHsluIwxppCJz40x4q8pWIHMX4Z925meQhEfsamVR4ldA6bDMxAVZlz0gV06Fm5y60zeCoeEdvHqvQpwWHUQf4HipSm9BWJE6hKRIH4NmxsZ~6qEScz-iLtyAP05Kbl7ep78Bqi8vy8tFA0ema5sRsq90w__",
	Horror:
		"https://s3-alpha-sig.figma.com/img/4b74/a308/440aa6436990ba59544eec4ffcdc563e?Expires=1709510400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=NQuNSbFJk~IubBDht3JCZXWMewISqVltZtHPQN~XOIoMhBzh8Syk7wfE8XAUEEjwrW-3qYgN~yWut8QsQzuVkqg5d01Y-TWO2sIAXRbIfgDFex--Ev~ZgkPxDGxciPhy16O4PehAB-g4eq9j~Qq9fPfLKFJuqj9tTVO-GzOqROI~cGrduXj6O6BrwkFWRzbVHBzOzzzXbWaXgpTb83SOa1Mw8xIx8ij7foDG8Gs4NSVw56HeJ6NtTasw15DSL3N16NWD6DNfox~X1q1O4Z0Ty235gmjYh9FdsNjoKCX6qPcoCjpuxqiKIoCJEl~Kmr9~p7ypcu2HTlQ0eNmYuBHt8Q__",
	// "https://s3-alpha-sig.figma.com/img/37d6/3067/52049c46979d73390a22ddd36c091858?Expires=1709510400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=jQxcQDduYjzAFCBraADR4Hh6LB0FpMIAYdzRhd0CqoBdC6TC6tdXP0~8mx7RRUGY7qeHGuc4p3QNqvQnm4OIhh8lnx6sVBIo7KeZxP89xIBTmbHVriNKyNQyucBBYt9aM72oNJ30MTTywI7j8RUnH-XmNRJKsPWrm3HhVdKRV6Iqb2DxWs5cVDHUpnIApxn16dG3KZgaXGchTF8dinm-Y5P-W17Gu218AeMrz9uzlNTa28iM38vBxKrm8O74OKGroY6XdhozST17dh6ouknWEI0qmmvxMcYacwZEjr-bJDWi1fZc6w0pVxYv8syc2RYHx51STgMiqWzbmfxTRasJzw__",
	// "https://s3-alpha-sig.figma.com/img/f693/d943/4a89adb3a043999da9fd93a00f46d036?Expires=1709510400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=pHNVfsEyAMgYra620NFC5qLHp67xEp0lXuXdP3aDPJCkNECPqN51er1-J4f2imxeyu4Lf1lBbHoj3oQtxjpe2Xzv6Bq6mKt5Gfz16vDvG5LelsCkOelLaJJUO45i2PvkYbTZO7~-8LovqRDEan36E6x-JZxS4zmwcFIbVcXcc87ciNM6EoDdiG6UEhOLXn0W206d5YCO5TJwoRkrcgnINdwMNnAJs26zkwlf8GCIPVNZBRmI21DEwjg2N2rpWdcGgSmVUgocHekhxp8PO-HYESUwfaMxKhLlUMQxuGx9eqXxXtJlf-QaswTrZGu3FWXiyxbSMmtOm46ko9BL0WMLkA__",
	// "https://s3-alpha-sig.figma.com/img/db3e/2276/a5d1b15a94d2b0e6350dee3a7c20ff16?Expires=1709510400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=cVCnfj7qxDhPX9xAUXksB7-dC8-NDeZL30EKw5rGeYkYJ-CnF4dMrGflFfnyVUgfZ0z7O5s7YuVEs-Wy2lGkwSXFrQg8UYCo99kf3beKvVJ8~gfq0jH3fsLv~64rBVFVC0pGEuibP3ZTA2uCyrX6Fws2ry5JsEXm0iTlmInyNqz2n~l6uqMr7wXpOvX-8PQrVJz~cLeWFz8qGZjOBR60UMaK7VlKeoi1QScNc~lHEOjwFKWPSM6w0DCpbjVbifr-FpbzOmhuZBgctGgQFCn3hCwQ1-LUDycccnbuS3sKf8G2113cP3QmkeqfMul0scskop482kiKNEXGTTtgs7g3CA__",
	// "https://s3-alpha-sig.figma.com/img/97c3/38ab/3840b8e82a3b15f65887698279769256?Expires=1709510400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=BMYVki7bunQUrg~NoRX5~o9huPumsKjE1pYA1L6tHbvSdsfXdqTAp4zzp0IN8SphEnSIln2ZvlvYtjpf4N5STKBfgPVq4b6KWvjT8weDYM3kLi~bX7OLFn2N~-DRd5KFNfcbMAcMbZS4PCF8WVuXywLnf-bRbg7bMpyRYXkw7EluzZKkFozfutSLoqZxDKZsapMeuNb1TTPdD3NrmzHGeuxo5CbGz0YeBOJYInSe0mxnZJkjsbPS7WWdFKlHwxCeJiG74fN5wgG5hhfOUMW~exe79CkosefWuuHoBjYpJ0XIiFrq0pGHG8T0Zo0yzEsLRBJ5ogWLO8soekPenP6RMg__",
	// "https://s3-alpha-sig.figma.com/img/a4f0/438b/9fd5442c1e9eb8d094a4188d4adc9fea?Expires=1709510400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=jsvJq0~YWdDwXOImQPvDFl~rPY3nmOF1ToG8re6IhR7IXk9j9BjeYIayiicYEdyz41K~tP2PJYpA0hv~fTnODHWtvC1XoWCP6CC-3eJyQbtDmVXlqrBRgHXAP1QesdP02ng2k-5Zru7fEXUsEcLwgRCPmUVsTA1RAGxJ~QKqaJHRXQiouxitBl2RS8PCcHsluIwxppCJz40x4q8pWIHMX4Z925meQhEfsamVR4ldA6bDMxAVZlz0gV06Fm5y60zeCoeEdvHqvQpwWHUQf4HipSm9BWJE6hKRIH4NmxsZ~6qEScz-iLtyAP05Kbl7ep78Bqi8vy8tFA0ema5sRsq90w__",
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
	useEffect(() => {
		dispatch({
			type: "reset",
			draft: WebstoryToStoryDraft(WebstoryData),
		});
	}, [WebstoryData]);
	const router = useRouter();

	const { genre } = router.query;

	const scrollRef = useRef<HTMLDivElement | null>(null);

	const scrollLeft = useCallback(() => {
		scrollRef.current?.scroll({ left: -50, behavior: "smooth" });
	}, []);
	const scrollRight = useCallback(() => {
		scrollRef.current?.scroll({ left: 50, behavior: "smooth" });
	}, []);

	const generationStyle = useMemo(
		() =>
			_.startCase(story.settings?.style?.toString() || (genre as string) || ""),
		[genre, story.settings]
	);

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

	const onGenerate = useCallback(() => {
		console.log(story, "story..");
	}, [story]);

	const EditSegment = useMutation({
		mutationFn: api.video.editSegment,
	});

	const View = {
		script: () => (
			<div className="flex gap-2 mt-6">
				<div>
					<Button variant="outline" className="stroke-slate-600 text-slate-600">
						<LayoutGrid strokeWidth={1} className="mr-2" />
						Generate Images & Continue
					</Button>
				</div>
				<div className="flex flex-col">
					<Button
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
								(segment) => ({
									details: {
										Ind: segment.id,
										segments: [
											{ Text: segment.textContent, SceneId: segment.sceneId },
										],
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
							if (!additions.length && !edits.length && !deletions.length) {
								console.log("No edits found");
								return;
							}

							const editedResponse = await EditSegment.mutateAsync({
								story_id: WebstoryData?.id as string,
								story_type: WebstoryData?.storyType,
								edits: [...edits, ...additions, ...deletions],
							});

							// await api.video.regenerateAllImages({
							//   image_style: story.settings?.style,
							//   story_id: story.storyId,story_type:
							// })
						}}
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
			<div className="flex gap-2 mt-6">
				<div>
					<Button variant="outline" className="invisible">
						Generate Images & Continue
					</Button>
				</div>
				<div className="flex flex-col">
					<Button onClick={onGenerate} className="bg-purple-700 space-x-1.5">
						<BrandShortLogo />
						<p className="font-bold text-slate-50">Generate Video Scenes</p>
						<ArrowRight className="w-4 h-4 opacity-50" />
					</Button>
				</div>
			</div>
		),
		scene: () => (
			<div className="flex gap-2 mt-6">
				<div>
					<Button variant="outline" className="invisible">
						Generate Images & Continue
					</Button>
				</div>
				<div className="flex flex-col">
					<Button onClick={onGenerate} className="bg-purple-700 space-x-1.5">
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
		<div className="flex sticky bottom-0 bg-background border-border border-t-[1px] p-3 pt-1.5 justify-between items-center overflow-hidden">
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
					<span className="text-purple-600">{generationStyle}</span>
				</span>

				<div className="flex space-x-1 items-center">
					<ChevronLeft onClick={scrollLeft} className="w-8 h-8 opacity-50" />
					<div ref={scrollRef} className="flex 2xl:overflow-x-visible overflow-x-hidden ">
						<div className="flex gap-x-1">
							{Object.entries(images).map(([key, image], index) => (
								<div
									key={index}
									className={clsx("w-16 h-12 rounded-lg", {
										["border-purple-600 border-[1px]"]: generationStyle === key,
									})}
									role="button"
									onClick={() =>
										updateImageStyle(key as unknown as StoryImageStyles)
									}
									style={{
										background: `url(${image})`,
										backgroundSize: "cover",
										backgroundRepeat: "no-repeat",
										boxShadow:
											"0px 0px 0px 1px rgba(18, 55, 105, 0.08), 0px 1px 2px 0px #E1EAEF, 0px 24px 32px -12px rgba(54, 57, 74, 0.24)",
										backdropFilter: "blur(5px)",
									}}
								/>
							))}
						</div>
					</div>
					<ChevronRight onClick={scrollRight} className="w-8 h-8 opacity-50" />
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
