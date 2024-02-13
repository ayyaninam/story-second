"use client";
import {
	ChevronLeft,
	ChevronRight,
	Compass,
	Edit2,
	FlipVertical,
	HelpCircle,
	LucideSparkles,
	Menu,
	RefreshCcw,
	Share,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { AvatarImage } from "@radix-ui/react-avatar";
import { Badge } from "@/components/ui/badge";

import { useRouter } from "next/router";
import { useQuery } from "@tanstack/react-query";
import api from "@/api";
import { QueryKeys } from "@/lib/queryKeys";
import Format from "@/utils/format";
import StoryScreen from "./story-screen";
import { Skeleton } from "@/components/ui/skeleton";
import { useRemotionPlayerProps } from "./video-player/hooks";
import { VoiceType } from "@/utils/enums";
import { ModeToggle } from "./components/mode-toggle";
import { useEffect, useState } from "react";
import { useMediaQuery } from "usehooks-ts";
import { cn } from "@/utils";
import Routes from "@/routes";
import { GetImageRatio } from "@/utils/image-ratio";
import { mainSchema } from "@/api/schema";
import { env } from "@/env.mjs";

const MAX_SUMMARY_LENGTH = 250;

export default function EditStory({
	storyData,
}: {
	storyData: mainSchema["ReturnWebStoryDTO"];
}) {
	const router = useRouter();
	const isDesktop = useMediaQuery("(min-width: 1280px)");
	const [showFullDescription, setShowFullDescription] = useState(false);
	const [enableQuery, setEnableQuery] = useState(true);

	// Queries
	const Webstory = useQuery({
		queryFn: () =>
			api.library.get(
				router.query.genre!.toString(),
				router.query.id!.toString()
			),
		queryKey: [QueryKeys.STORY, router.query.genre, router.query.id],
		initialData: storyData,
		refetchInterval: 1000,
		// Disable once all the videoKeys are obtained
		enabled: enableQuery,
	});

	useEffect(() => {
		if (Webstory.data) {
			setEnableQuery(
				!(
					Webstory.data.storySegments?.every((segment) => !!segment.videoKey) &&
					Webstory.data.storySegments?.length > 0
				)
			);
		}
	}, [Webstory.data]);

	const isLoading = Webstory.isLoading || !Webstory.data;
	const ImageRatio = GetImageRatio(Webstory.data.resolution);

	return (
		<div className="max-w-full min-h-screen bg-secondary">
			{/* Navbar */}
			<div className="flex justify-between bg-primary-foreground border-b-[0.5px] border-border p-4">
				<div className="flex gap-x-2.5 items-center">
					<div className="flex items-center gap-x-2">
						<ChevronLeft className="w-4 h-4 opacity-50" />
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="16"
							height="16"
							viewBox="0 0 16 16"
							fill="none"
						>
							<g opacity="0.5">
								<path
									d="M8.00013 2.63336C8.01854 2.63336 8.03346 2.64829 8.03346 2.6667V13.3334C8.03346 13.3518 8.01851 13.3667 8.00013 13.3667C7.98175 13.3667 7.9668 13.3518 7.9668 13.3334V2.6667C7.9668 2.64829 7.98172 2.63336 8.00013 2.63336Z"
									fill="#020817"
									stroke="#64748B"
								/>
							</g>
						</svg>
						<span className="flex gap-x-1.5 text-slate-500 items-center">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="19"
								height="12"
								viewBox="0 0 19 12"
								fill="none"
							>
								<path
									d="M0.5 11.0625V0.9375H18.5V11.0625H0.5Z"
									stroke="#94ABB8"
								/>
							</svg>
							<p className="text-sm">
								{ImageRatio.width}:{ImageRatio.height}
							</p>
						</span>
					</div>
					<p className="text-sm">{Format.Title(Webstory.data?.storyTitle)}</p>
					{!env.NEXT_PUBLIC_DISABLE_UNIMPLEMENTED_FEATURES && (
						<Edit2 className="stroke-slate-300 h-4 w-4" />
					)}
				</div>
				<div className="hidden md:block text-muted-foreground space-x-2">
					{!env.NEXT_PUBLIC_DISABLE_UNIMPLEMENTED_FEATURES && (
						<Button className="p-2" variant="outline">
							<RefreshCcw className="mr-2 h-4 w-4" /> Remix
						</Button>
					)}
					<Button
						className="p-2"
						variant="outline"
						onClick={() =>
							router.push(
								Routes.ViewStory(
									router.query.genre as string,
									router.query.id as string
								)
							)
						}
					>
						<Share className="mr-2 h-4 w-4" /> Publish
					</Button>
				</div>
			</div>

			{/* Stepper */}
			<div className="w-full min-h-8 flex items-center justify-center">
				<Badge
					variant="outline"
					className="bg-primary-foreground font-normal text-sm"
				>
					<LucideSparkles className="stroke-purple-600 mr-1 h-4 w-4" />
					Story
				</Badge>
				<ChevronRight className="w-4 h-4 opacity-50" />
				<Badge
					variant="outline"
					className="bg-primary-foreground font-normal text-sm"
				>
					<LucideSparkles className="stroke-purple-600 mr-1 h-4 w-4" />
					Scenes
				</Badge>
				<ChevronRight className="w-4 h-4 opacity-50" />
				<Badge
					variant="outline"
					className="bg-primary-foreground font-normal text-sm"
				>
					Final
				</Badge>
				<ChevronRight className="w-4 h-4 opacity-50" />
				<Badge
					variant="outline"
					className="bg-primary-foreground font-normal text-sm border border-purple-500 bg-purple-100 text-purple-900"
					style={{ boxShadow: "0px 4px 4px 0px rgba(206, 122, 255, 0.40)" }}
				>
					Share
				</Badge>
			</div>

			{/* MainSection */}
			<div
				className={`flex bg-background min-h-[calc(100vh-196px)] p-2 gap-x-1.5`}
			>
				{!env.NEXT_PUBLIC_DISABLE_UNIMPLEMENTED_FEATURES && (
					<div className="p-2 space-y-3 hidden sm:block">
						<Menu className="h-4 w-4 stroke-muted-foreground" />
						<FlipVertical className="h-4 w-4 stroke-muted-foreground" />

						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="16"
							height="16"
							viewBox="0 0 16 16"
							fill="none"
						>
							<rect width="16" height="16" fill="white" fillOpacity="0.01" />
							<path
								d="M15.3412 10.7197L15.3412 10.7198C15.2534 11.3532 15.0881 11.7589 14.7915 12.1017L14.791 12.1023C14.7609 12.137 14.7162 12.1858 14.6818 12.2208M15.3412 10.7197L14.6813 12.2213C14.6815 12.2212 14.6817 12.221 14.6818 12.2208M15.3412 10.7197C15.4321 10.064 15.4333 9.22329 15.4333 8.02662C15.4333 6.81576 15.4321 5.96392 15.3412 5.30056C15.2534 4.65904 15.088 4.25072 14.7928 3.90909M15.3412 10.7197L14.6836 3.79018M14.6818 12.2208C14.3572 12.5525 13.9875 12.745 13.4293 12.8774L13.4293 12.8774C12.8439 13.0161 12.095 13.08 11.0152 13.17M14.6818 12.2208L11.0152 13.17M11.0152 13.17L10.9737 12.6717L11.0152 13.17C11.0152 13.17 11.0152 13.17 11.0152 13.17ZM11.0152 13.17C10.0775 13.2482 9.05676 13.3 8 13.3C6.94324 13.3 5.92247 13.2482 4.98484 13.17M11.0152 13.17L1.3164 3.7902C1.28287 3.82452 1.23877 3.87252 1.20744 3.90877L1.20743 3.90878C0.912218 4.25045 0.746672 4.65877 0.658761 5.30051M4.98484 13.17L5.02635 12.6717L4.9848 13.17C4.98482 13.17 4.98483 13.17 4.98484 13.17ZM4.98484 13.17C3.90507 13.08 3.1561 13.0161 2.5707 12.8774L2.57067 12.8774C2.01215 12.7449 1.64245 12.5523 1.31765 12.2203M1.31765 12.2203C1.31785 12.2205 1.31804 12.2207 1.31823 12.2209L1.67506 11.8706L1.31765 12.2203ZM1.31765 12.2203C1.28395 12.1859 1.23932 12.1373 1.20873 12.102L1.20849 12.1017C0.911867 11.7588 0.746589 11.3531 0.658794 10.7198L0.658793 10.7197C0.567904 10.064 0.566667 9.22329 0.566667 8.02662C0.566667 6.81579 0.567874 5.96391 0.658761 5.30051M0.658761 5.30051L1.15413 5.36838L0.658761 5.30051ZM14.6836 3.79018L14.6839 3.79047C14.7171 3.82449 14.7612 3.87249 14.7928 3.90909M14.6836 3.79018C14.3608 3.45978 13.9879 3.26595 13.4183 3.13156L14.6836 3.79018ZM14.7928 3.90909L14.4142 4.23565L14.7925 3.90871C14.7926 3.90884 14.7927 3.90897 14.7928 3.90909ZM1.15702 3.86516L1.15699 3.8652C0.850547 4.21986 0.681682 4.64195 0.592705 5.29147C0.501081 5.96031 0.5 6.81715 0.5 8.02662C0.5 9.22192 0.501105 10.0676 0.592761 10.7289C0.681649 11.3702 0.850321 11.7896 1.1581 12.1453L1.15823 12.1455C1.19007 12.1823 1.23577 12.232 1.26998 12.267C1.60579 12.6102 1.98793 12.8077 2.55529 12.9422C3.14653 13.0824 3.90087 13.1466 4.97925 13.2365C5.91842 13.3147 6.94108 13.3667 8 13.3667C9.0589 13.3667 10.0815 13.3147 11.0208 13.2365L1.15702 3.86516ZM1.15702 3.86516C1.18922 3.82788 1.23423 3.77891 1.2687 3.74363L1.26871 3.74362M1.15702 3.86516L1.26871 3.74362M1.26871 3.74362C1.60268 3.40178 1.9882 3.2031 2.56634 3.06667C3.16765 2.92478 3.93696 2.85839 5.0343 2.7655L4.99213 2.26728M1.26871 3.74362L4.99213 2.26728M4.99213 2.26728L5.03431 2.7655C5.97165 2.68615 6.97918 2.63336 8 2.63336C9.02082 2.63336 10.0283 2.68615 10.9657 2.7655C12.0631 2.85839 12.8324 2.92478 13.4337 3.06667C14.0118 3.2031 14.3973 3.40178 14.7313 3.74363L14.7314 3.7437M4.99213 2.26728L14.7314 3.7437M14.7314 3.7437C14.7656 3.77867 14.8105 3.8276 14.843 3.8652L14.7314 3.7437ZM14.8417 12.1456L14.8419 12.1453C15.1497 11.7896 15.3184 11.3702 15.4072 10.7289C15.4989 10.0676 15.5 9.22192 15.5 8.02662C15.5 6.81715 15.4989 5.96031 15.4073 5.29147C15.3183 4.64202 15.1495 4.21994 14.8431 3.8653L14.8417 12.1456ZM14.8417 12.1456C14.8099 12.1824 14.7643 12.232 14.7302 12.2667L14.73 12.267M14.8417 12.1456L14.73 12.267M14.73 12.267C14.3942 12.6102 14.0121 12.8077 13.4447 12.9422M14.73 12.267L13.4447 12.9422M5.03992 2.83193C5.9758 2.75271 6.98142 2.70003 8 2.70003C9.01858 2.70003 10.0242 2.75271 10.96 2.83193C12.0587 2.92493 12.8228 2.99102 13.4183 3.13156L5.03992 2.83193ZM5.03992 2.83193C3.94125 2.92494 3.17721 2.99102 2.58165 3.13156M5.03992 2.83193L2.58165 3.13156M2.58165 3.13156C2.01217 3.26594 1.63924 3.45977 1.31642 3.79018L2.58165 3.13156ZM13.4447 12.9422C12.8535 13.0824 12.0991 13.1466 11.0208 13.2365L13.4447 12.9422ZM6.1 9.90142V6.09864L10.4352 8.00003L6.1 9.90142Z"
								stroke="#64748B"
							/>
						</svg>

						<Compass className="h-4 w-4 stroke-muted-foreground" />
					</div>
				)}
				<div className="relative rounded-lg border-[1px] w-full border-border bg-border  bg-blend-luminosity px-2 lg:px-5 py-2 ">
					<div className="flex flex-col md:flex-row items-center justify-center h-full">
						<div
							className={cn(
								`w-full border-[1px] rounded-bl-lg rounded-br-lg lg:rounded-br-lg lg:rounded-tr-lg lg:rounded-tl-sm lg:rounded-bl-sm flex flex-col lg:flex-row justify-stretch`,
								// Based on aspect ratio we need to adjust the parent width
								ImageRatio.width === 1 && "md:max-w-[1080px]",
								ImageRatio.width === 3 && "md:max-w-[900px]",
								ImageRatio.width === 4 && "md:max-w-[1280px]",
								ImageRatio.width === 9 && "md:max-w-[780px]",
								ImageRatio.width === 16 && "md:max-w-[1620px]"
							)}
						>
							{/* eslint-disable-next-line @next/next/no-img-element */}
							{/* <img
								alt="Background Blur"
								// This url gonna change based on the current rendering frame
								src="https://ik.imagekit.io/storybird/staging/images/849ce875-b59f-442d-b18f-548ff2bc7afc/1_823376133.webp"
								className={
									"absolute invisible xl:visible xl:w-full xl:h-min xl:max-w-screen-lg left-2 top-16 blur-lg"
								}
							/> */}
							<div
								className="relative w-full rounded-t-lg lg:rounded-tr-none lg:rounded-bl-lg"
								style={{ aspectRatio: ImageRatio.ratio }}
							>
								<StoryScreen />
							</div>
							<div
								className={cn(
									`p-6 flex flex-col-reverse justify-between md:flex-col lg:max-w-sm bg-background rounded-bl-lg lg:rounded-bl-none lg:rounded-tr-lg rounded-br-lg`
								)}
							>
								<div className="relative space-y-2">
									{!env.NEXT_PUBLIC_DISABLE_UNIMPLEMENTED_FEATURES && (
										<Edit2 className="absolute -top-0.5 -right-0.5 w-4 h-4 stroke-muted-foreground" />
									)}
									<div className="flex gap-x-1 text-muted-foreground items-center text-sm">
										<p className="text-purple-500">Video</p>
										<ChevronRight className="w-4 h-4" />
										{isLoading ? (
											<Skeleton className="w-[100px] h-[20px] rounded-full" />
										) : (
											<p>{Format.Title(Webstory.data.topLevelCategory)}</p>
										)}
									</div>
									{isLoading ? (
										<Skeleton className="min-w-72 h-[24px] rounded-md" />
									) : (
										<p className="text-2xl font-bold max-w-sm -tracking-[-0.6px]">
											{Format.Title(Webstory.data.storyTitle)}
										</p>
									)}
									{isLoading ? (
										<Skeleton className="min-w-72 h-[220px] rounded-lg" />
									) : (
										<p className="text-sm text-muted-foreground text-wrap text-ellipsis whitespace-nowrap overflow-hidden self-stretch">
											{showFullDescription
												? Webstory.data.summary
												: Format.TruncateTextWithEllipses(
														Webstory.data.summary,
														MAX_SUMMARY_LENGTH
													)}
										</p>
									)}

									{(Webstory.data?.summary?.length ?? 0) > MAX_SUMMARY_LENGTH &&
										!showFullDescription && (
											<Button
												variant="link"
												className="text-indigo-500 text-sm font-normal m-0 p-0"
												onClick={() => setShowFullDescription(true)}
											>
												See full description
											</Button>
										)}
								</div>
								<div className="lg:hidden my-2.5 bg-slate-200 self-stretch h-px" />
								<div className="flex gap-x-2.5">
									{isLoading ? (
										<Skeleton className="w-[44px] h-[44px] rounded-full" />
									) : (
										<Avatar className="h-11 w-11">
											<AvatarImage
												src={Webstory.data.user?.profilePicture ?? undefined}
											/>
											<AvatarFallback>
												{Format.AvatarName(Webstory.data.user?.name)}
											</AvatarFallback>
										</Avatar>
									)}
									{isLoading ? (
										<Skeleton className="w-[168px] h-[44px] rounded-lg" />
									) : (
										<span className="flex flex-col">
											<span>{Webstory.data.user?.name} </span>
											<span className="flex text-muted-foreground gap-x-1 items-center text-sm">
												<p>
													{(Webstory.data.user?.videoCount ?? 0) +
														(Webstory.data.user?.storyCount ?? 0)}{" "}
													Stories
												</p>
												<p className="text-slate-300"> • </p>
												{/* <a
													className="p-0 m-0 text-muted-foreground font-normal"
													href="#"
												>
													See all
												</a> */}
											</span>
										</span>
									)}
								</div>
							</div>
						</div>
					</div>
					<div className="absolute bottom-4 right-4 flex flex-col gap-y-3">
						<span
							className="rounded-full w-8 h-8 bg-popover p-1.5 flex items-center justify-center"
							style={{ boxShadow: "0px 3px 6px 0px rgba(0, 0, 0, 0.13)" }}
						>
							<ModeToggle />
						</span>

						<span
							className="rounded-full w-8 h-8 bg-popover p-1.5"
							style={{ boxShadow: "0px 3px 6px 0px rgba(0, 0, 0, 0.13)" }}
						>
							<HelpCircle className="h-[18.286px] w-[18.286px] flex-shrink-0 stroke-slate-400" />
						</span>
					</div>
				</div>
			</div>
		</div>
	);
}
