import toast from "react-hot-toast";
import React, { useState, useEffect } from "react";
import { Heart, Share2, Facebook, Twitter, Clipboard } from "lucide-react";
import {
	FacebookShareButton,
	TwitterShareButton,
	WhatsappShareButton,
} from "react-share";
import {
	DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuContent,
	DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import Whatsapp from "@/components/icons/whatsapp";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { mainSchema } from "@/api/schema";
import api from "@/api";
import { QueryKeys } from "@/lib/queryKeys";
import Routes from "@/routes";
import { useRouter } from "next/router";
import { SessionType } from "@/hooks/useSaveSessionToken";
import DeleteStorybookButton from "./delete-storybook-button";

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

	const User = useQuery<mainSchema["UserInfoDTOApiResponse"]>({
		queryFn: () => api.user.get(),
		staleTime: 3000,
		// eslint-disable-next-line @tanstack/query/exhaustive-deps -- pathname includes everything we need
		queryKey: [QueryKeys.USER],
	});

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

	const storyLikes = WebstoryData?.storyLikes ?? 0;

	const [shareUrl, setShareUrl] = useState("");

	useEffect(() => {
		const url = window.location.href;
		setShareUrl(url);
	}, [router.asPath]);

	return (
		<div className="flex flex-wrap gap-2">
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

			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button
						className="p-2 shadow-sm bg-gradient-to-r from-button-start to-button-end hover:shadow-md md:p-3"
						variant="outline"
					>
						<Share2 className="mr-2 h-4 w-4 md:h-5 md:w-5" /> Share
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent>
					<FacebookShareButton url={shareUrl} className="w-full">
						<DropdownMenuItem className="cursor-pointer">
							<Facebook className="h-5 w-5 mr-1.5" />
							<span>Facebook</span>
						</DropdownMenuItem>
					</FacebookShareButton>
					<TwitterShareButton
						title={`${WebstoryData.storyTitle}\n\n`}
						url={shareUrl}
						className="flex items-center w-full"
					>
						<DropdownMenuItem className="cursor-pointer w-full">
							<Twitter className="h-5 w-5 mr-1.5" />
							<span>Twitter</span>
						</DropdownMenuItem>
					</TwitterShareButton>
					<WhatsappShareButton
						aria-label="Share on Whatsapp"
						url={shareUrl}
						title={`Just stumbled upon "${WebstoryData.storyTitle}" on Story.com and couldn't resist sharing! 🌟 \n\n${WebstoryData.summary}\n\n`}
						className="flex items-center w-full"
					>
						<DropdownMenuItem className="cursor-pointer w-full">
							<span className="mr-1.5">
								<Whatsapp size={20} />
							</span>
							<span>Whatsapp</span>
						</DropdownMenuItem>
					</WhatsappShareButton>
					<DropdownMenuItem
						className="cursor-pointer"
						onClick={() => {
							navigator.clipboard.writeText(window.location.href);
							toast.success("Link copied to clipboard");
						}}
					>
						<Clipboard className="h-5 w-5 mr-1.5" /> Copy Link
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>

			{User?.data?.data?.id === WebstoryData?.user?.id && WebstoryData?.id && (
				<DeleteStorybookButton storyId={WebstoryData.id} />
			)}
		</div>
	);
};

export default StoryPageButtons;
