import { useMediaQuery } from "usehooks-ts";
import { Button } from "@/components/ui/button";
import Format from "@/utils/format";
import {
	ChevronRight,
	DownloadCloudIcon,
	DownloadIcon,
	Edit,
	HelpCircle,
	LogOutIcon,
	Share2,
	Video,
	Heart,
	Eye,
	EyeOff,
	Menu,
	ChevronsLeft,
} from "lucide-react";
import { useRouter } from "next/router";
import { ModeToggle } from "../edit-story/components/mode-toggle";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import React, { useEffect, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import api from "@/api";
import { QueryKeys } from "@/lib/queryKeys";
import StoryScreen from "../edit-story/story-screen";
import { GetDisplayImageRatio } from "@/utils/image-ratio";
import { cn } from "@/utils";
import { mainSchema } from "@/api/schema";
import { env } from "@/env.mjs";
import Routes from "@/routes";
import { SessionType } from "@/hooks/useSaveSessionToken";
import StoryScreenBgBlur from "@/components/ui/story-screen-bg-blur";
import useWebstoryContext from "../edit-story/providers/WebstoryContext";
import toast from "react-hot-toast";
import StoryLogo from "../../../public/auth-prompt/story-logo";
import Link from "next/link";
import GenericModal from "@/components/ui/generic-modal";
import useUpdateUser from "@/hooks/useUpdateUser";
import {
	DisplayAspectRatios,
	AllowanceType,
	SubscriptionPlan,
} from "@/utils/enums";
import useEventLogger, { AnalyticsEvent } from "@/utils/analytics";
import { HTTPError } from "ky";
import { useUserCanUseCredits } from "@/utils/payment";
import CheckoutDialog from "@/features/pricing/checkout-dialog";
import DeleteVideoButton from "@/features/publish-story/delete-video-button";
import UpgradeSubscriptionDialog from "@/features/pricing/upgrade-subscription-dialog";
import isBrowser from "@/utils/isBrowser";
import ShareStoryDialog from "@/components/share-story-dialog/share-story-dialog";
import SuggestedStories from "@/components/suggested-stories/suggested-stories";
import debounce from "@/utils/debounce";

const MAX_SUMMARY_LENGTH = 250;

export default function PublishedStory({
	storyData,
	session,
}: {
	storyData: mainSchema["ReturnVideoStoryDTO"];
	session: SessionType;
}) {
	const router = useRouter();
	const eventLogger = useEventLogger();
	const isMobile = useMediaQuery("(max-width: 1024px)");
	const [showFullDescription, setShowFullDescription] = useState(false);
	const [openShareVideoDialog, setOpenShareVideoModal] = useState(false);
	const [story, setStory] = useWebstoryContext();
	const [suggestedOpen, setSuggestedOpen] = useState(true);
	const [isHovering, setIsHovering] = useState(false);

	const [isPlaying, setIsPlaying] = useState<boolean | undefined>();
	const [seekedFrame, setSeekedFrame] = useState<number | undefined>();
	const [isVideoDownloading, setIsVideoDownloading] = useState(false);

	const { invalidateUser } = useUpdateUser();
	// Queries
	const Webstory = useQuery<mainSchema["ReturnVideoStoryDTO"]>({
		queryFn: () =>
			api.video.get(
				router.query.genre!.toString(),
				router.query.id!.toString(),
				storyData.storyType,
				true
			),
		// eslint-disable-next-line @tanstack/query/exhaustive-deps -- pathname includes everything we need
		queryKey: [QueryKeys.STORY, router.asPath],
		refetchInterval: (data) => {
			if (
				data?.state?.data?.storyDone &&
				data?.state?.data?.videosDone &&
				data?.state?.data?.imagesDone
			) {
				return false; // stop polling
			}
			return 1000; // continue polling
		},
		// Disable once all the videoKeys are obtained
		// enabled: enableQuery,
	});

	const Interactions = useQuery<mainSchema["ReturnStoryInteractionDTO"]>({
		queryFn: () => api.webstory.interactions(Webstory.data?.id as string),
		staleTime: 3000,
		// eslint-disable-next-line @tanstack/query/exhaustive-deps -- pathname includes everything we need
		queryKey: [QueryKeys.INTERACTIONS, router.asPath],
	});
	const User = useQuery<mainSchema["UserInfoDTOApiResponse"]>({
		queryFn: () => api.user.get(),
		staleTime: 3000,
		// eslint-disable-next-line @tanstack/query/exhaustive-deps -- pathname includes everything we need
		queryKey: [QueryKeys.USER],
	});

	const LikeVideo = useMutation({ mutationFn: api.library.likeVideo });

	const RenderVideo = useMutation({
		mutationFn: api.video.render,
	});

	const CopyVideo = useMutation({
		mutationFn: api.video.copyVideo,
	});

	const ImageRatio = GetDisplayImageRatio(Webstory.data?.resolution);
	const isLoading = Webstory.isLoading || !Webstory.data;

	useEffect(() => {
		if (router.query.liked) {
			handleLikeVideo(router.query.liked === "true");

			const path = router.asPath.split("?")[0] as string;
			router.replace(path, undefined, { shallow: true });
		}
	}, [router.query]);

	const [storyLikesUpdate, setStoryLikesUpdate] = useState(0);
	const storyLikes = (storyData.storyLikes ?? 0) + storyLikesUpdate;

	const handleLikeVideo = async (liked: boolean) => {
		if (!session.accessToken) {
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
		} else {
			await LikeVideo.mutateAsync({ id: storyData.id!, params: { liked } });
			await Interactions.refetch();
			setStoryLikesUpdate((prev) => prev + (liked ? 1 : -1));
		}
	};
	const handleRenderVideo = async () => {
		if (!session.accessToken) {
			router.push(
				Routes.ToAuthPage(
					Routes.ViewStory(
						storyData.storyType,
						router.query.genre!.toString(),
						router.query.id!.toString()
					)
				)
			);
		} else {
			if (story.isRendering) {
				toast(
					"Video is currently rendering. Please contact support if it has been over 5 minutes",
					{
						icon: "⚠️",
					}
				);
				return;
			}

			try {
				await RenderVideo.mutateAsync({
					id: storyData.id!,
				});
				toast.success(
					"Video is being rendered. Please check again in 2 minutes"
				);
			} catch (error: any) {
				if (error instanceof HTTPError) {
					const backendErrorMessage: string = (await error.response.json())
						?.message;
					toast.error(`Failed to render video: ${backendErrorMessage}`);
				}
			}

			// here is code to refetch the webstory data to get the new isRendering value(true) without reloading page
			// i tried to use it but it makes flicker the player when using it...
			// await Webstory.refetch();
		}
	};

	const { userCanUseCredits } = useUserCanUseCredits();
	const [openVideoCreditsDialog, setOpenVideoCreditsDialog] = useState(false);
	const [openSubscriptionDialog, setOpenSubscriptionDialog] = useState(false);
	const [dialogOpen, setDialogOpen] = useState(false);

	const handleCopyVideo = async () => {
		if (!User?.data?.data) {
			router.push(
				Routes.ToAuthPage(
					Routes.ViewStory(
						storyData.storyType,
						router.query.genre!.toString(),
						router.query.id!.toString()
					)
				)
			);
		}
		const { error } = await userCanUseCredits({
			variant: "video credits",
			videoCredits: 1,
		});

		if (error) {
			if (error === "not enough credits") {
				setOpenVideoCreditsDialog(true);
			} else if (
				error === "not paid subscription" ||
				error === "using custom plan"
			) {
				setOpenSubscriptionDialog(true);
			}

			return;
		}

		try {
			const newStory = await CopyVideo.mutateAsync({
				id: storyData.id as string,
			});

			if (newStory) {
				invalidateUser();
				router.push(
					Routes.ViewStory(
						newStory.storyType,
						newStory.topLevelCategory!,
						newStory.slug!
					)
				);
				toast.success("Video added to your library");
			} else {
				// Handle null newStory case if needed
				toast.error("Failed to add video to your library. Please try again.");
			}
		} catch (error) {
			if (error instanceof HTTPError) {
				switch (error.response.status) {
					case 401: {
						// Handle unauthorized error
						toast.error("You need to log in to perform this action.");
						router.push(
							Routes.ToAuthPage(
								Routes.ViewStory(
									storyData.storyType,
									router.query.genre!.toString(),
									router.query.id!.toString()
								)
							)
						);
						break;
					}
					case 402: {
						toast.error("Not enough balance to copy video.");
						break;
					}
					default: {
						toast.error("Unable to copy video. Please try again.");
						console.error(error.message, error.response.status);
					}
				}
			} else {
				// Handle non-HTTPError errors
				toast.error("An unexpected error occurred. Please try again.");
				console.error(error);
			}
		}
	};

	const [loggedEvents, setLoggedEvents] = useState<number[]>([]);

	const onTimeUpdate = ({
		frame,
		durationInFrames,
	}: {
		frame: number;
		durationInFrames: number;
	}) => {
		const progress = (frame / durationInFrames) * 100;

		const logEvent = (eventName: AnalyticsEvent, milestone: number) => {
			if (!loggedEvents.includes(milestone)) {
				eventLogger(eventName);

				setLoggedEvents((prevLoggedEvents) => [...prevLoggedEvents, milestone]);
			}
		};

		if (progress > 0 && progress < 25) logEvent("video_watched_0", 0);
		if (progress >= 25 && progress < 50) logEvent("video_watched_25", 25);
		if (progress >= 50 && progress < 75) logEvent("video_watched_50", 50);
		if (progress >= 75 && progress < 99) logEvent("video_watched_75", 75);
		if (progress >= 99) logEvent("video_watched_100", 100); // it's 99 instead of 100 because "progress" might reach until 99.90 but not exactly 100.0
	};

	const visibility = Webstory.data?.isPublic ? "public" : "private";

	const handleToggleVisibility = async () => {
		if (!Webstory?.data?.id) {
			return;
		}

		const newVisibility = visibility === "public" ? "private" : "public";

		try {
			await api.webstory.updateStoryPrivacy({
				id: Webstory.data.id,
				isPublic: newVisibility === "public",
			});

			if (newVisibility === "public") {
				toast.success("Your video is now public");
			} else {
				toast.success("Your video is now private");
			}

			await Webstory.refetch();
		} catch (error) {
			console.log(error);
			toast.error("Failed to update video privacy");
		}
	};

	const numVideoSegmentsReady = Webstory.data?.scenes
		?.flatMap((el) => el.videoSegments)
		.filter((el) => (el?.videoKey?.length ?? 0) > 0).length;
	const numTotalVideoSegments = Webstory.data?.scenes?.flatMap(
		(el) => el.videoSegments
	).length;

	const toggleHovering = debounce((value: boolean) => {
		setIsHovering(value);
	}, 100);

	return (
		<div className="flex bg-reverse w-full">
			<div
				className={cn(
					"w-full k xl:h-[calc(100vh-20px)] relative",
					suggestedOpen ? "lg:w-[calc(100%-306px)]" : "lg:w-full"
				)}
			>
				{" "}
				{/* Navbar */}
				<div className="flex justify-between p-4">
					<div
						className={`flex gap-x-2.5 px-3 items-center shadow-sm bg-gradient-to-r from-button-start to-button-end border-[1px] border-border rounded-bl-sm rounded-br-sm lg:rounded-br-sm lg:rounded-tr-sm lg:rounded-tl-sm lg:rounded-bl-sm`}
					>
						<div className="flex items-center gap-x-2 py-3">
							<Link href={Routes.Feed()}>
								<StoryLogo size={20} fill="#657D8B" />
							</Link>

							{/*<svg*/}
							{/*	width="16"*/}
							{/*	height="16"*/}
							{/*	viewBox="0 0 16 16"*/}
							{/*	fill="none"*/}
							{/*	xmlns="http://www.w3.org/2000/svg"*/}
							{/*>*/}
							{/*	<path*/}
							{/*		d="M0 8.30408C0.102418 12.5006 3.47197 15.8762 7.66086 15.9891C7.65062 11.7618 4.21961 8.3246 0 8.30408Z"*/}
							{/*		fill="#657D8B"*/}
							{/*	/>*/}
							{/*	<path*/}
							{/*		d="M15.9714 7.6756C15.869 3.47912 12.4994 0.103458 8.31055 0.000854492C8.32079 4.22811 11.7518 7.66533 15.9714 7.6756Z"*/}
							{/*		fill="#657D8B"*/}
							{/*	/>*/}
							{/*	<path*/}
							{/*		d="M7.66965 -0.00952148C3.48076 0.0930818 0.111207 3.46874 0.00878906 7.66522C4.2284 7.65496 7.65941 4.21774 7.66965 -0.00952148Z"*/}
							{/*		fill="#657D8B"*/}
							{/*	/>*/}
							{/*	<path*/}
							{/*		d="M8.30788 16.0096H8.11328H15.9995V8.30408C11.7594 8.30408 8.30788 11.7618 8.30788 16.0096Z"*/}
							{/*		fill="#657D8B"*/}
							{/*	/>*/}
							{/*</svg>*/}
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
						<p className="text-sm">{Format.Title(Webstory.data?.storyTitle)}</p>
					</div>
					<div className="hidden md:flex gap-2  space-x-2">
						{/*<Button*/}
						{/*	className={`p-2 shadow-sm bg-gradient-to-r from-button-start to-button-end hover:shadow-md`}*/}
						{/*	onClick={(e) => {*/}
						{/*		navigator.clipboard.writeText(window.location.href);*/}
						{/*		toast.success("Link copied to clipboard");*/}
						{/*	}}*/}
						{/*	variant="outline"*/}
						{/*>*/}
						{/*	<Share2 className="mr-2 h-4 w-4" /> Share this video*/}
						{/*</Button>*/}
						{session?.accessToken && (
							<Button
								className={`p-2 shadow-sm bg-gradient-to-r from-button-start to-button-end hover:shadow-md`}
								variant="outline"
								onClick={() => {
									router.push(Routes.Logout("/feed/all"));
								}}
							>
								<LogOutIcon className="mr-2 h-4 w-4" /> Log Out
							</Button>
						)}
						{!suggestedOpen && (
							<Button
								className={`hidden lg:flex h-9 w-10 p-0 rounded-md shadow bg-white hover:shadow-lg fade-in-5 group `}
								variant="outline"
								onClick={() => setSuggestedOpen(!suggestedOpen)}
								onMouseEnter={() => toggleHovering(true)}
								onMouseLeave={() => toggleHovering(false)}
							>
								<ChevronsLeft size={20} className="hidden group-hover:block" />
								<Menu size={20} className="block group-hover:hidden" />
							</Button>
						)}
					</div>
				</div>
				<div className={`flex h-[calc(100%-78.6px)] bg-reverse p-2 gap-x-1.5`}>
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
									ImageRatio.width === 16 && "md:max-w-[1620px]",
									ImageRatio.enumValue === DisplayAspectRatios["1024x576"] &&
										"lg:flex-col 2xl:flex-row"
								)}
							>
								<div className="relative w-full rounded-tl-lg rounded-bl-lg">
									{!isMobile && (
										<StoryScreenBgBlur
											blur="3xl"
											Webstory={Webstory.data}
											isError={Webstory.isError}
											isPlaying={isPlaying}
											seekedFrame={seekedFrame}
										/>
									)}
									{/* NOTE: Incase the above code doesn't work, try replacing it with the following:
								 <div
									className={`relative w-full lg:max-w-[100%] rounded-tl-lg rounded-bl-lg blur-3xl`}
								>
									<StoryScreen
										Webstory={Webstory.data}
										isError={Webstory.isError}
										isPlaying={isPlaying}
										seekedFrame={seekedFrame}
										isMuted={true}
									/>
								</div> */}
									<div
										className={cn(
											isMobile
												? "relative w-full lg:max-w-[100%] rounded-tl-lg rounded-bl-lg"
												: "absolute top-0 left-0 w-full lg:max-w-[100%] rounded-tl-lg rounded-bl-lg"
										)}
									>
										<StoryScreen
											playerClassName="rounded-tl-lg rounded-bl-lg"
											Webstory={Webstory.data}
											isError={Webstory.isError}
											onPlay={() => {
												setIsPlaying(true);
											}}
											onPause={() => {
												setIsPlaying(false);
											}}
											onSeeked={(e) => {
												setSeekedFrame(e.detail.frame);
											}}
											onEnded={() => {
												setIsPlaying(false);
												setSeekedFrame(0);
											}}
											onTimeUpdate={onTimeUpdate}
										/>
									</div>
								</div>

								{/* </Loading> */}
								<div
									className={cn(
										`p-6 flex flex-col-reverse justify-between md:flex-col lg:max-w-sm bg-description rounded-bl-lg lg:rounded-bl-none lg:rounded-tr-lg rounded-br-lg`,
										ImageRatio.enumValue === DisplayAspectRatios["1024x576"] &&
											"lg:max-w-[100%] 2xl:max-w-sm"
									)}
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
										<div className="flex flex-wrap gap-2">
											{!Webstory.data?.canEdit &&
												Webstory.data?.storyType === 1 &&
												Webstory.data?.videosDone && (
													<GenericModal
														title="Duplicate Video"
														description="We'll add a video to your library with the same plot that you can make your own and edit! This action will cost 1 video credit"
														buttonText={
															<span className="flex flex-row">
																<Video className="mr-1 h-4 w-4 md:h-5 md:w-5" />
																Make a video like this
															</span>
														}
														confirmAction={handleCopyVideo}
														dialogOpen={dialogOpen}
														setDialogOpen={setDialogOpen}
													/>
												)}
											{Webstory.data?.canEdit &&
												Webstory.data?.storyType !== 2 && (
													<Button
														className="p-2 shadow-sm bg-gradient-to-r from-button-start to-button-end hover:shadow-md md:p-3"
														variant="outline"
														onClick={() =>
															router.push(
																Routes.EditStoryboard(
																	storyData.storyType,
																	storyData.topLevelCategory!,
																	storyData.slug!
																)
															)
														}
													>
														<Edit className="mr-2 h-4 w-4 md:h-5 md:w-5" /> Edit
														Video
													</Button>
												)}

											<Button
												className="p-2 shadow-sm bg-gradient-to-r from-button-start to-button-end hover:shadow-md md:p-3"
												variant="outline"
												onClick={() =>
													handleLikeVideo(!Interactions.data?.liked)
												}
											>
												<Heart
													className="mr-2 h-4 w-4 md:h-5 md:w-5"
													style={{
														fill:
															isBrowser && Interactions.data?.liked
																? "#EC4899"
																: undefined,
														color:
															isBrowser && Interactions.data?.liked
																? "#EC4899"
																: undefined,
													}}
												/>
												{storyLikes}
											</Button>

											{Webstory.data?.canEdit &&
												Webstory.data?.storyType !== 2 && (
													<Button
														className="p-2 shadow-sm bg-gradient-to-r from-button-start to-button-end hover:shadow-md md:p-3"
														variant="outline"
														onClick={() => handleToggleVisibility()}
													>
														{visibility === "public" ? (
															<>
																<Eye className="mr-2 h-4 w-4 md:h-5 md:w-5" />
																Public
															</>
														) : (
															<>
																<EyeOff className="mr-2 h-4 w-4 md:h-5 md:w-5" />
																Private
															</>
														)}
													</Button>
												)}

											<Button
												onClick={() => setOpenShareVideoModal(true)}
												className="p-2 shadow-sm bg-gradient-to-r from-button-start to-button-end hover:shadow-md md:p-3"
												variant="outline"
											>
												<Share2 className="mr-2 h-4 w-4 md:h-5 md:w-5" /> Share
											</Button>

											{(numVideoSegmentsReady ?? 0) <
												(numTotalVideoSegments ?? 0) ||
											!Webstory.data?.storyDone ? null : Webstory.data
													?.renderedVideoKey &&
											  !Webstory.data?.invalidateRender ? (
												<Button
													onClick={async () => {
														eventLogger("download_video_clicked");

														const userHasPaidSubscription =
															User?.data?.data?.subscription
																?.subscriptionPlan !== SubscriptionPlan.Free &&
															User?.data?.data?.subscription
																?.subscriptionPlan !== undefined;

														if (
															!userHasPaidSubscription &&
															!User?.data?.data?.isSuperUser
														) {
															toast.error(
																"You need to upgrade to a paid plan to download the video."
															);
															setOpenSubscriptionDialog(true);

															return;
														}

														setIsVideoDownloading(true);

														let videoUrl;
														if (
															storyData.renderedVideoKey &&
															!storyData.invalidateRender
														) {
															videoUrl = Format.GetPublicBucketObjectUrl(
																storyData.renderedVideoKey
															);
														} else {
															videoUrl = await RenderVideo.mutateAsync({
																id: storyData.id!,
															});
														}
														if (videoUrl) {
															window.location.href = videoUrl;
														}
														setIsVideoDownloading(false);
													}}
													className="p-2 shadow-sm bg-gradient-to-r from-button-start to-button-end hover:shadow-md md:p-3"
													variant="outline"
													disabled={isVideoDownloading}
												>
													<DownloadIcon className="mr-2 h-4 w-4 md:h-5 md:w-5" />
													{isVideoDownloading ? "Loading" : "Download"}
												</Button>
											) : (
												<Button
													className="p-2 shadow-sm bg-gradient-to-r from-button-start to-button-end hover:shadow-md md:p-3"
													variant="outline"
													onClick={handleRenderVideo}
												>
													<DownloadCloudIcon className="mr-2 h-4 w-4 md:h-5 md:w-5" />
													{RenderVideo.isPending ? "Loading" : "Download"}
												</Button>
											)}

											{Webstory.data?.canEdit && Webstory.data?.id && (
												<DeleteVideoButton storyId={Webstory.data.id} />
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
										{(Webstory.data?.summary?.length ?? 0) >
											MAX_SUMMARY_LENGTH &&
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
									<div
										className={cn(
											"lg:hidden my-2.5 bg-slate-200 self-stretch h-px",
											ImageRatio.enumValue ===
												DisplayAspectRatios["1024x576"] && "lg:flex 2xl:hidden"
										)}
									/>
									<Link
										href={`/${Webstory.data?.user?.profileName}`}
										className="flex gap-x-2.5"
									>
										{isLoading ? (
											<Skeleton className="w-[44px] h-[44px] rounded-full" />
										) : (
											<Avatar className="h-11 w-11">
												<AvatarImage
													src={Webstory.data.user?.profilePicture ?? undefined}
												/>
												<AvatarFallback>
													{Format.AvatarName(
														Webstory.data.user?.name,
														Webstory.data.user?.lastName
													)}
												</AvatarFallback>
											</Avatar>
										)}
										{isLoading ? (
											<Skeleton className="w-[168px] h-[44px] rounded-lg" />
										) : (
											<span className="flex flex-col">
												{Webstory.data.user && (
													<>
														<span>
															{Webstory.data.user.name}{" "}
															{Webstory.data.user?.lastName || ""}
														</span>
														<span className="flex text-muted-foreground gap-x-1 items-center text-sm">
															<>
																{Webstory.data.user.videoCount! > 0 && (
																	<p>{Webstory.data.user?.videoCount} Videos</p>
																)}
																{Webstory.data.user.videoCount! > 0 &&
																	Webstory.data.user.storyCount! > 0 && (
																		<p className="text-slate-300"> • </p>
																	)}
																{Webstory.data.user.storyCount! > 0 && (
																	<p>{Webstory.data.user.storyCount} Stories</p>
																)}
															</>
														</span>
													</>
												)}
											</span>
										)}
									</Link>
								</div>
							</div>
						</div>
						<div className="absolute bottom-10 left-4 items-center hidden md:flex flex-row gap-x-1">
							<span
								className="rounded-full text-xs text-accent-100 bg-accent-600 p-1.5 hover:cursor-pointer hover:bg-accent-400 transition-colors duration-200  ease-in-out"
								style={{ boxShadow: "0px 3px 6px 0px rgba(0, 0, 0, 0.13)" }}
								onClick={() => router.push(Routes.Generate())}
							>
								<div
									className={`flex text-sm gap-x-2.5 px-3 items-center hover:cursor-pointer hover:text-gray-600 transition-colors duration-200  ease-in-out`}
									onClick={() => router.push(Routes.Generate())}
								>
									Try It Free
								</div>
							</span>
						</div>
						<Link
							href="/feed/[genre]"
							className="absolute bottom-2 left-1/2 transform -translate-x-1/2 hidden md:flex flex-row gap-x-3 text-sm text-muted-foreground"
						>
							© 2024 Story.com - All rights reserved
						</Link>
						{!env.NEXT_PUBLIC_DISABLE_UNIMPLEMENTED_FEATURES && (
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
						)}
					</div>
				</div>
			</div>
			<div
				className="hidden lg:block xl:h-[calc(100vh-20px)] overflow-y-auto relative"
				onMouseEnter={() => toggleHovering(true)}
				onMouseLeave={() => toggleHovering(false)}
			>
				<SuggestedStories
					id={story.id ?? ""}
					storyType={story.storyType}
					visible={suggestedOpen}
					setVisible={setSuggestedOpen}
					hovering={isHovering}
					resolution={story.resolution}
				/>
			</div>
			<ShareStoryDialog
				open={openShareVideoDialog}
				setOpen={setOpenShareVideoModal}
				storyTitle={story?.storyTitle ?? ""}
				summary={story?.summary ?? ""}
				storyTypeString="video"
			/>

			<CheckoutDialog
				variant="credits"
				allowanceType={AllowanceType.Videos}
				open={openVideoCreditsDialog}
				setOpen={setOpenVideoCreditsDialog}
			/>

			<UpgradeSubscriptionDialog
				open={openSubscriptionDialog}
				setOpen={setOpenSubscriptionDialog}
			/>
		</div>
	);
}
