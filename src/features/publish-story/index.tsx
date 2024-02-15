import { Button } from "@/components/ui/button";
import Format from "@/utils/format";
import {
	ChevronRight,
	DownloadIcon,
	Heart,
	HelpCircle,
	Share2,
	Star,
	Video,
} from "lucide-react";
import { useRouter } from "next/router";
import MadeInAuthorly from "public/publish/made-in-authorly.svg";
import MadeInAuthorlyDark from "public/publish/made-in-authorly-dark.svg";

import { ModeToggle } from "../edit-story/components/mode-toggle";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useEffect, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import api from "@/api";
import { QueryKeys } from "@/lib/queryKeys";
import StoryScreen from "../edit-story/story-screen";
import { useMediaQuery } from "usehooks-ts";
import { GetImageRatio } from "@/utils/image-ratio";
import { cn } from "@/utils";
import { mainSchema } from "@/api/schema";
import { env } from "@/env.mjs";
import Routes from "@/routes";
import { useUser } from "@auth0/nextjs-auth0/client";
import { getJwt } from "@/utils/jwt";

const MAX_SUMMARY_LENGTH = 250;

export default function PublishedStory({
	storyData,
	interactionData,
}: {
	storyData: mainSchema["ReturnVideoStoryDTO"];
	interactionData: mainSchema["ReturnStoryInteractionDTO"] | null;
}) {
	const User = useUser();
	const router = useRouter();
	const isDesktop = useMediaQuery("(min-width: 1280px)");
	const [showFullDescription, setShowFullDescription] = useState(false);
	const [enableQuery, setEnableQuery] = useState(true);
	// Queries
	const Webstory = useQuery<mainSchema["ReturnVideoStoryDTO"]>({
		queryFn: () =>
			api.video.get(
				router.query.genre!.toString(),
				router.query.id!.toString(),
				storyData.storyType
			),
		// eslint-disable-next-line @tanstack/query/exhaustive-deps -- pathname includes everything we need
		queryKey: [QueryKeys.STORY, router.pathname],
		refetchInterval: 1000,
		initialData: storyData,
		// Disable once all the videoKeys are obtained
		enabled: enableQuery,
	});

	const Interactions = useQuery<mainSchema["ReturnStoryInteractionDTO"]>({
		queryFn: () => api.webstory.interactions(storyData.id!),
		initialData: interactionData,
		// eslint-disable-next-line @tanstack/query/exhaustive-deps -- pathname includes everything we need
		queryKey: [QueryKeys.INTERACTIONS, router.pathname],
	});

	const LikeVideo = useMutation({ mutationFn: api.library.likeVideo });

	const ImageRatio = GetImageRatio(Webstory.data?.resolution);
	const isLoading = Webstory.isLoading || !Webstory.data;

	useEffect(() => {
		if (Webstory.data) {
			setEnableQuery(
				!(
					Webstory.data.videoSegments?.every((segment) => !!segment.videoKey) &&
					Webstory.data.videoSegments?.length > 0
				)
			);
		}
	}, [Webstory.data]);

	const handleLikeVideo = async (liked: boolean) => {
		if (!getJwt()) {
			router.push(
				Routes.ToAuthPage(
					Routes.ViewStory(
						storyData.storyType,
						router.query.genre!.toString(),
						router.query.id!.toString()
					),
					{ liked }
				)
			);
		}
		await LikeVideo.mutateAsync({ id: storyData.id!, params: { liked } });
		await Interactions.refetch();
	};
	return (
		<div className={`max-w-full min-h-screen bg-reverse items-center`}>
			{/* Navbar */}
			<div className="flex justify-between p-4">
				<div
					className={`flex gap-x-2.5 px-3 items-center shadow-sm bg-gradient-to-r from-button-start to-button-end border-[1px] border-border rounded-bl-sm rounded-br-sm lg:rounded-br-sm lg:rounded-tr-sm lg:rounded-tl-sm lg:rounded-bl-sm`}
				>
					<div className="flex items-center gap-x-2 py-3">
						<svg
							width="16"
							height="16"
							viewBox="0 0 16 16"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								d="M0 8.30408C0.102418 12.5006 3.47197 15.8762 7.66086 15.9891C7.65062 11.7618 4.21961 8.3246 0 8.30408Z"
								fill="#657D8B"
							/>
							<path
								d="M15.9714 7.6756C15.869 3.47912 12.4994 0.103458 8.31055 0.000854492C8.32079 4.22811 11.7518 7.66533 15.9714 7.6756Z"
								fill="#657D8B"
							/>
							<path
								d="M7.66965 -0.00952148C3.48076 0.0930818 0.111207 3.46874 0.00878906 7.66522C4.2284 7.65496 7.65941 4.21774 7.66965 -0.00952148Z"
								fill="#657D8B"
							/>
							<path
								d="M8.30788 16.0096H8.11328H15.9995V8.30408C11.7594 8.30408 8.30788 11.7618 8.30788 16.0096Z"
								fill="#657D8B"
							/>
						</svg>
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
					</div>
					<p className="text-sm">{Format.Title(Webstory.data.storyTitle)}</p>
				</div>
				<div className="hidden md:block space-x-2">
					<div className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium">
						<svg
							width="130"
							height="17"
							viewBox="0 0 130 17"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								d="M1.41614 13V2.98857H5.14643L6.18871 6.81486C6.47671 7.89829 6.80585 9.09143 7.16243 10.5589H7.20357C7.60128 8.98171 7.903 7.88457 8.23214 6.63657L9.17842 2.98857H12.895V13H10.6047V7.95314C10.6047 6.88343 10.6321 5.95086 10.6459 4.99086H10.591C10.4127 5.78629 10.1659 6.77371 9.90528 7.69257L8.383 13H5.887L4.33728 7.73371C4.063 6.81486 3.85728 5.88229 3.679 5.01829H3.62414C3.65157 5.81371 3.66528 6.70514 3.66528 7.67886V13H1.41614ZM16.3176 13.1097C14.7953 13.1097 13.6981 12.3143 13.6981 10.9291C13.6981 9.65371 14.5073 9.17371 15.9884 8.83086C16.8799 8.62514 17.2501 8.57029 17.6479 8.50171C18.1827 8.40571 18.2924 8.37829 18.2924 8.06286C18.2924 7.55543 17.8947 7.24 17.1816 7.24C16.4273 7.24 16.0296 7.66514 15.9884 8.28229L13.9176 8.17257C14.0136 6.76 15.2753 5.66286 17.2913 5.66286C19.3759 5.66286 20.4181 6.55429 20.4181 8.51543V12.6571C20.4181 12.8217 20.4319 12.9451 20.4319 13H18.5804C18.5667 12.8903 18.5667 12.7943 18.5667 12.6709V12.3966H18.5393C18.1004 12.8354 17.401 13.1097 16.3176 13.1097ZM16.8799 11.6971C17.7301 11.6971 18.3336 11.2446 18.3336 10.2983V10.0926C18.3336 9.99657 18.3336 9.832 18.361 9.76343C18.0867 9.84571 17.8124 9.88686 17.4421 9.96914L16.7976 10.12C16.1119 10.2709 15.8239 10.4217 15.8239 10.9017C15.8239 11.4366 16.2216 11.6971 16.8799 11.6971ZM24.4381 13.1646C22.4359 13.1646 21.1056 11.656 21.1056 9.39314C21.1056 7.15771 22.4359 5.58057 24.3833 5.58057C25.4393 5.58057 26.125 6.04686 26.5501 6.54057C26.5364 5.96457 26.5364 5.48457 26.5364 4.96343V2.98857H28.7856V11.9714C28.7856 12.328 28.7856 12.6983 28.7993 13H26.605V12.7943C26.605 12.5749 26.605 12.3691 26.6187 12.1771H26.5913C26.1524 12.7531 25.4941 13.1646 24.4381 13.1646ZM24.9456 11.4091C25.9741 11.4091 26.5913 10.5863 26.5913 9.39314C26.5913 8.2 25.9604 7.39086 24.9456 7.39086C23.9444 7.39086 23.341 8.2 23.341 9.39314C23.341 10.6 23.9444 11.4091 24.9456 11.4091ZM33.3699 13.1783C31.0522 13.1783 29.5299 11.7246 29.5299 9.39314C29.5299 7.15771 31.0385 5.58057 33.3562 5.58057C35.7973 5.58057 37.0042 7.26743 37.0042 9.74971C37.0042 9.81829 37.0042 9.88686 37.0042 9.95543H31.683C31.7653 10.9154 32.4373 11.5189 33.411 11.5189C34.3436 11.5189 34.8647 11.0251 35.1665 10.5863L36.9905 11.2309C36.4007 12.3143 35.1939 13.1783 33.3699 13.1783ZM31.6967 8.55657H34.8099C34.7825 7.70629 34.2476 7.11657 33.315 7.11657C32.3825 7.11657 31.8065 7.70629 31.6967 8.55657ZM40.1777 13V2.98857H42.6326V13H40.1777ZM43.9251 13V7.07543C43.9251 6.70514 43.9251 6.184 43.9114 5.78629H46.0919V6.06057C46.0919 6.25257 46.0919 6.40343 46.0782 6.60914H46.0919C46.4896 6.01943 47.2988 5.59429 48.3822 5.59429C50.0965 5.59429 50.9879 6.59543 50.9879 8.63886V13H48.7388V9.46171C48.7388 7.96686 48.3959 7.41829 47.5045 7.41829C46.6131 7.41829 46.1879 8.04914 46.1879 9.31086V13H43.9251Z"
								fill="#657D8B"
							/>
							<path
								d="M55.8574 8.16061C55.9263 10.9819 58.1916 13.2513 61.0078 13.3272C61.0009 10.4852 58.6942 8.17441 55.8574 8.16061Z"
								fill="#657D8B"
							/>
							<path
								d="M66.5947 7.73806C66.5258 4.91681 64.2605 2.64738 61.4443 2.5784C61.4512 5.42035 63.7579 7.73116 66.5947 7.73806Z"
								fill="#657D8B"
							/>
							<path
								d="M61.0136 2.57144C58.1975 2.64042 55.9321 4.90985 55.8633 7.7311C58.7001 7.72421 61.0067 5.41339 61.0136 2.57144Z"
								fill="#657D8B"
							/>
							<path
								d="M61.4433 13.3409H61.3125H66.6143V8.16061C63.7637 8.16061 61.4433 10.4852 61.4433 13.3409Z"
								fill="#657D8B"
							/>
							<path
								d="M127.603 6.17667H129.706L126.886 13.5197C126.156 15.4433 125.092 16.2857 123.546 16.2857C122.903 16.2857 122.358 16.2014 121.827 16.061L122.024 14.2077C122.47 14.3481 122.952 14.4183 123.348 14.4183C124.078 14.4183 124.659 14.0673 124.931 13.3513L125.03 13.0845H124.548L121.356 6.17667H123.769L125.822 10.9644L127.603 6.17667Z"
								fill="#657D8B"
							/>
							<path
								d="M118.642 3.4595H120.942V13.3088H118.642V3.4595Z"
								fill="#657D8B"
							/>
							<path
								d="M113.123 13.3092V6.17674H115.424L115.3 7.80542H115.374C115.535 6.85068 116.203 6.0925 117.279 6.0925C117.465 6.0925 117.663 6.10654 117.898 6.1627V8.36703C117.514 8.26875 117.156 8.24067 116.982 8.24067C115.956 8.24067 115.424 9.02692 115.424 10.4169V13.3092H113.123Z"
								fill="#657D8B"
							/>
							<path
								d="M108.146 13.5898C105.734 13.5898 104.002 12.0173 104.002 9.7428C104.002 7.49635 105.721 5.89575 108.146 5.89575C110.558 5.89575 112.29 7.48231 112.29 9.7428C112.29 11.9892 110.583 13.5898 108.146 13.5898ZM108.158 11.9612C109.197 11.9612 109.927 11.0345 109.927 9.7428C109.927 8.40897 109.173 7.48231 108.133 7.48231C107.107 7.48231 106.365 8.40897 106.365 9.72876C106.365 11.0345 107.119 11.9612 108.158 11.9612Z"
								fill="#657D8B"
							/>
							<path
								d="M100.529 6.03628C102.236 6.03628 103.275 7.27184 103.275 9.30768V13.3092H100.974V9.58849C100.974 8.42314 100.479 7.73516 99.626 7.73516C98.7601 7.73516 98.2529 8.39506 98.2529 9.51829V13.3092H95.9521V3.45987H98.2529L98.2529 7.679H98.2653C98.5993 6.6681 99.4404 6.03628 100.529 6.03628Z"
								fill="#657D8B"
							/>
							<path
								d="M93.7396 13.4075C92.2428 13.4075 91.1667 12.4949 91.1667 10.4029V7.77737H90.0039V6.17678H90.6471C91.1048 6.17678 91.3522 5.85385 91.3522 5.2782V4.32346H93.6777V4.52002C93.6777 5.40456 93.4427 5.95213 92.9974 6.12062V6.17678H95.1497V7.77737H93.4427V10.0659C93.4427 10.9786 93.8262 11.4981 94.5189 11.4981C94.6673 11.4981 94.9518 11.4981 95.1497 11.4559V13.2952C94.7292 13.3654 94.2467 13.4075 93.7396 13.4075Z"
								fill="#657D8B"
							/>
							<path
								d="M89.2301 10.9644L89.2673 13.3091H87.0036L86.9912 11.7507H86.874L86.9294 11.6805C86.6325 12.7897 85.8285 13.4495 84.6657 13.4495C82.9958 13.4495 81.9072 12.1719 81.9072 10.1501V6.17667H84.208V9.82715C84.208 11.0487 84.6904 11.7507 85.5687 11.7507C86.4098 11.7507 86.9294 11.1189 86.9294 9.93947V6.17667H89.2301V10.9644Z"
								fill="#657D8B"
							/>
							<path
								d="M79.3138 13.3093L78.4232 10.8663H74.4154L73.5247 13.3093H71.0508L74.8359 3.48105H78.0273L81.8125 13.3093H79.3138ZM75.0215 9.22354H77.8171L76.4193 5.41861L75.0215 9.22354Z"
								fill="#657D8B"
							/>
						</svg>
					</div>
					{!env.NEXT_PUBLIC_DISABLE_UNIMPLEMENTED_FEATURES && (
						<Button
							className={`p-2 shadow-sm bg-gradient-to-r from-button-start to-button-end`}
							variant="outline"
						>
							<Share2 className="mr-2 h-4 w-4" /> Share this video
						</Button>
					)}
				</div>
			</div>
			<div className={`flex bg-reverse min-h-[calc(100vh-66px)] p-2 gap-x-1.5`}>
				<div className="relative w-full lg:px-20 pb-10 items-center">
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
							<div className="relative w-full rounded-tl-lg rounded-bl-lg">
								<StoryScreen />
							</div>
							{/* </Loading> */}
							<div
								className={`p-6 flex flex-col-reverse justify-between md:flex-col lg:max-w-sm bg-description rounded-bl-lg lg:rounded-bl-none lg:rounded-tr-lg rounded-br-lg`}
							>
								<div className="relative space-y-2">
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
									<div className="block space-x-2">
										<Button
											className={`p-2 shadow-sm bg-gradient-to-r from-button-start to-button-end hover:shadow-md `}
											variant="outline"
											onClick={() => handleLikeVideo(!Interactions.data?.liked)}
										>
											<Heart
												className={cn(
													"mr-2 h-4 w-",
													Interactions.data?.liked && "fill-pink-500"
												)}
											/>{" "}
											Like video
										</Button>
										{Webstory.data.renderedVideoKey && (
											<a
												href={Format.GetPublicBucketObjectUrl(
													Webstory.data.renderedVideoKey as string
												)}
												download={`${Webstory.data.storyTitle?.replaceAll(" ", "_")}.mp4`}
											>
												<Button
													className={`p-2 shadow-sm bg-gradient-to-r from-button-start to-button-end hover:shadow-md`}
													variant="outline"
												>
													<DownloadIcon className="mr-2 h-4 w-4" /> Download
												</Button>
											</a>
										)}
									</div>
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
												{Format.AvatarName(Webstory.data.user?.profileName)}
											</AvatarFallback>
										</Avatar>
									)}
									{isLoading ? (
										<Skeleton className="w-[168px] h-[44px] rounded-lg" />
									) : (
										<span className="flex flex-col">
											<span>{"Storybird"} </span>
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
					<div className="absolute bottom-4 left-4 items-center flex flex-row gap-x-1">
						<span
							className="rounded-full text-xs text-purple-100 bg-purple-500 p-1.5 hover:cursor-pointer hover:bg-purple-400 transition-colors duration-200  ease-in-out"
							style={{ boxShadow: "0px 3px 6px 0px rgba(0, 0, 0, 0.13)" }}
							onClick={() => router.push(Routes.Landing())}
						>
							<div className={`flex gap-x-2.5 px-3 items-center`}>
								<Video className="mr-1 h-3 w-3" /> Make a video like this
							</div>
						</span>
						<span className="rounded-full text-xs text-muted-foreground">
							<div
								className={`flex text-sm gap-x-2.5 px-3 items-center hover:cursor-pointer hover:text-gray-600 transition-colors duration-200  ease-in-out`}
								onClick={() => router.push(Routes.Landing())}
							>
								Try It Free
							</div>
						</span>
					</div>
					<div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex flex-row gap-x-3 text-sm text-muted-foreground">
						© 2024 Authorly.ai - All rights reserved
					</div>
					<div className="absolute bottom-4 right-4 flex flex-col gap-y-3">
						<span
							className="rounded-full w-8 h-8 bg-popover p-1.5 flex items-center justify-center"
							style={{ boxShadow: "0px 3px 6px 0px rgba(0, 0, 0, 0.13)" }}
						>
							<ModeToggle />
						</span>
						{!env.NEXT_PUBLIC_DISABLE_UNIMPLEMENTED_FEATURES && (
							<span
								className="rounded-full w-8 h-8 bg-popover p-1.5"
								style={{ boxShadow: "0px 3px 6px 0px rgba(0, 0, 0, 0.13)" }}
							>
								<HelpCircle className="h-[18.286px] w-[18.286px] flex-shrink-0 stroke-slate-400" />
							</span>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
