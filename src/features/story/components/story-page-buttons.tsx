import toast from "react-hot-toast";
import React, { useState, useEffect } from "react";
import { Heart, Share2, FileText, Edit, BookOpen, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { mainSchema } from "@/api/schema";
import api from "@/api";
import { QueryKeys } from "@/lib/queryKeys";
import Routes from "@/routes";
import { useRouter } from "next/router";
import { SessionType } from "@/hooks/useSaveSessionToken";
import DeleteStorybookButton from "./delete-storybook-button";
import GenericModal from "@/components/ui/generic-modal";
import { HTTPError } from "ky";
import { useUserCanUseCredits } from "@/utils/payment";
import useUpdateUser from "@/hooks/useUpdateUser";
import CheckoutDialog from "@/features/pricing/checkout-dialog";
import { AllowanceType } from "@/utils/enums";
import UpgradeSubscriptionDialog from "@/features/pricing/upgrade-subscription-dialog";
import { AmazonPublishLifecycle } from "@/constants/amazon-constants";
import ShareStoryDialog from "@/components/share-story-dialog/share-story-dialog";
import { useAuth } from "@/features/auth-prompt/providers/AuthContext";

const StoryPageButtons = ({
	WebstoryData,
	session,
}: {
	WebstoryData: mainSchema["ReturnWebStoryDTO"];
	session: SessionType;
}) => {
	const router = useRouter();
	const queryClient = useQueryClient();

	const { genre, id } = router.query;

	const [dialogOpen, setDialogOpen] = useState(false);

	const User = useAuth();
	const Interactions = useQuery<mainSchema["ReturnStoryInteractionDTO"]>({
		queryFn: () => api.webstory.interactions(WebstoryData?.id as string),
		staleTime: 3000,
		// eslint-disable-next-line @tanstack/query/exhaustive-deps -- pathname includes everything we need
		queryKey: [QueryKeys.INTERACTIONS, router.asPath],
	});

	const LikeVideo = useMutation({ mutationFn: api.library.likeVideo });

	const handleLikeVideo = async (liked: boolean) => {
		if (!session.accessToken) {
			router.push(
				Routes.ToAuthPage(
					Routes.ViewStory(
						WebstoryData?.storyType,
						genre!.toString(),
						id!.toString()
					),
					{ liked }
				)
			);
		} else {
			await LikeVideo.mutateAsync({ id: WebstoryData?.id!, params: { liked } });
			await Interactions.refetch();
			await queryClient.invalidateQueries({
				queryKey: [QueryKeys.STORY, genre, id],
			});
		}
	};
	const { invalidateUser } = useUpdateUser();

	const storyLikes = WebstoryData?.storyLikes ?? 0;
	const CopyStory = useMutation({
		mutationFn: api.video.copyStory,
	});
	const [shareUrl, setShareUrl] = useState("");
	const { userCanUseCredits } = useUserCanUseCredits();
	const [openShareVideoDialog, setOpenShareVideoModal] = useState(false);
	const [openVideoCreditsDialog, setOpenVideoCreditsDialog] = useState(false);
	const [openSubscriptionDialog, setOpenSubscriptionDialog] = useState(false);

	const handleCopyStory = async () => {
		if (!User?.data?.data) {
			router.push(
				Routes.ToAuthPage(
					Routes.ViewStory(
						WebstoryData.storyType,
						genre!.toString(),
						id!.toString()
					)
				)
			);
		}
		const { error } = await userCanUseCredits({
			variant: "story book",
			storybookCredits: 1,
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
			const newStory = await CopyStory.mutateAsync({
				id: WebstoryData.id as string,
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
									WebstoryData.storyType,
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

	useEffect(() => {
		const url = window.location.href;
		setShareUrl(url);
	}, [router.asPath]);

	const handleClickDownloadPdf = () => {
		if (!User?.data) {
			router.push(
				Routes.ToAuthPage(
					Routes.ViewStory(
						WebstoryData.storyType,
						genre!.toString(),
						id!.toString()
					)
				)
			);
			return;
		}
		if (!WebstoryData.canEdit) {
			toast.dismiss();
			toast.error(
				"Please add this story to your library before downloading it's PDF."
			);
			setDialogOpen(true);
			return;
		}
		router.push(
			Routes.DownloadPdfStory(
				WebstoryData?.storyType,
				genre!.toString(),
				id!.toString()
			)
		);
	};

	const handleClickPublishBook = () => {
		router.push(
			Routes.PublishBook(
				WebstoryData?.storyType,
				genre!.toString(),
				id!.toString()
			)
		);
	};

	return (
		<>
			<div className="flex flex-wrap gap-2">
				{!WebstoryData.canEdit &&
					WebstoryData.storyType === 0 &&
					WebstoryData.imagesDone && (
						<GenericModal
							title="Duplicate Story"
							description="We'll add a story to your library with the same plot that you can make your own and edit! This action will cost 1 story credit"
							buttonText={
								<span className="flex flex-row">
									<Video className="mr-1 h-4 w-4 md:h-5 md:w-5" />
									Make a story like this
								</span>
							}
							confirmAction={handleCopyStory}
							dialogOpen={dialogOpen}
							setDialogOpen={setDialogOpen}
						/>
					)}
				{WebstoryData.canEdit && (
					<Button
						className="p-2 shadow-sm bg-gradient-to-r from-button-start to-button-end hover:shadow-md md:p-3"
						variant="outline"
						onClick={() =>
							router.push(
								Routes.EditStoryboard(
									WebstoryData.storyType,
									WebstoryData.topLevelCategory!,
									WebstoryData.slug!
								)
							)
						}
					>
						<Edit className="mr-2 h-4 w-4 md:h-5 md:w-5" /> Edit Story
					</Button>
				)}
				<Button
					className="p-2 shadow-sm bg-gradient-to-r from-button-start to-button-end hover:shadow-md md:p-3"
					variant="outline"
					onClick={() => handleLikeVideo(!Interactions.data?.liked)}
				>
					<Heart
						className="mr-2 h-4 w-4 md:h-5 md:w-5"
						style={{
							fill: Interactions.data?.liked ? "#EC4899" : undefined,
							color: Interactions.data?.liked ? "#EC4899" : undefined,
						}}
					/>
					{storyLikes}
				</Button>

				<Button
					onClick={() => setOpenShareVideoModal(true)}
					className="p-2 shadow-sm bg-gradient-to-r from-button-start to-button-end hover:shadow-md md:p-3"
					variant="outline"
				>
					<Share2 className="mr-2 h-4 w-4 md:h-5 md:w-5" /> Share
				</Button>

				<Button
					className="p-2 shadow-sm bg-gradient-to-r from-button-start to-button-end hover:shadow-md md:p-3"
					variant="outline"
					onClick={handleClickDownloadPdf}
				>
					<FileText className="mr-2 h-4 w-4 md:h-5 md:w-5" />
					Download PDF
				</Button>

				{WebstoryData.canEdit &&
					(!WebstoryData.amazonBook ? (
						<>
							<Button
								className="p-2 shadow-sm bg-gradient-to-r from-button-start to-button-end hover:shadow-md md:p-3"
								variant="outline"
								onClick={handleClickPublishBook}
							>
								<BookOpen className="mr-2 h-4 w-4 md:h-5 md:w-5" />
								Publish on Amazon
							</Button>

							<DeleteStorybookButton storyId={WebstoryData.id!} />
						</>
					) : (
						<>
							<Button
								className="p-2 shadow-sm bg-gradient-to-r from-button-start to-button-end hover:shadow-md md:p-3"
								variant="outline"
								onClick={() => {
									if (
										WebstoryData.amazonBook?.amazonPublishLifecycle ===
										AmazonPublishLifecycle.SelfPublished
									) {
										router.push(
											`/story/${WebstoryData.topLevelCategory}/${WebstoryData.slug}/publish-book/download`
										);
									} else {
										router.push(`/account?step=amazon-status`);
									}
								}}
							>
								<BookOpen className="mr-2 h-4 w-4 md:h-5 md:w-5" />
								Check Amazon Status
							</Button>
						</>
					))}
			</div>

			<ShareStoryDialog
				open={openShareVideoDialog}
				setOpen={setOpenShareVideoModal}
				storyTitle={WebstoryData?.storyTitle ?? ""}
				summary={WebstoryData?.summary ?? ""}
				storyTypeString="story book"
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
		</>
	);
};

export default StoryPageButtons;
