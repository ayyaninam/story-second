import { Button } from "@/components/ui/button";
import Format from "@/utils/format";
import { mainSchema } from "@/api/schema";
import { Plus, Heart } from "lucide-react";
import React, { useState } from "react";

import GenerateIcon from "@/components/icons/dashboard/generate-icon";
import Router, { useRouter } from "next/router";
import Routes from "@/routes";
import useEventLogger from "@/utils/analytics";
import DeleteStorybookButton from "@/features/story/components/delete-storybook-button";
import isBrowser from "@/utils/isBrowser";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/api";
import { QueryKeys } from "@/lib/queryKeys";
import { SessionType } from "@/hooks/useSaveSessionToken";

export default function Navbar({
	WebstoryData,
	session,
}: {
	WebstoryData?: mainSchema["ReturnWebStoryDTO"] | null;
	session: SessionType;
}) {
	const router = useRouter();
	const eventLogger = useEventLogger();
	const queryClient = useQueryClient();

	const { genre, id } = router.query;

	const Interactions = useQuery<mainSchema["ReturnStoryInteractionDTO"]>({
		queryFn: () => api.webstory.interactions(WebstoryData?.id as string),
		staleTime: 3000,
		// eslint-disable-next-line @tanstack/query/exhaustive-deps -- pathname includes everything we need
		queryKey: [QueryKeys.INTERACTIONS, router.asPath],
	});

	const LikeVideo = useMutation({ mutationFn: api.library.likeVideo });

	const [storyLikesUpdate, setStoryLikesUpdate] = useState(0);

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

	const storyLikes = (WebstoryData?.storyLikes ?? 0) + storyLikesUpdate;

	return (
		<div className="flex flex-row justify-between items-center bg-background rounded-tl-lg rounded-tr-lg border-b-[0.5px] border-border p-4">
			<div className="flex gap-x-2.5 items-center">
				<GenerateIcon />
				<div className="items-center">
					<div className="flex items-center gap-x-2">
						<p className="text-sm rounded-sm font-bold text-muted-foreground">
							{Format.Title(WebstoryData?.storyTitle)}
						</p>
					</div>
					<div className="flex items-center gap-x-2 text-slate-500">
						<span className="flex gap-x-1.5 rounded-sm bg-muted p-1 items-center">
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
						</span>
						<p className="text-xs text-muted-foreground rounded-sm bg-muted p-1">
							{Format.Title(WebstoryData?.topLevelCategory)}
						</p>
					</div>
				</div>
			</div>
			<div className="text-muted-foreground space-x-2 flex flex-row">
				<Button
					className="px-4 py-1.5 text-sm font-medium flex gap-2 items-center h-fit"
					variant="outline"
					onClick={() => handleLikeVideo(!Interactions.data?.liked)}
				>
					<Heart
						className="mr-1 h-4 w-4"
						style={{
							fill:
								isBrowser && Interactions.data?.liked ? "#EC4899" : undefined,
							color:
								isBrowser && Interactions.data?.liked ? "#EC4899" : undefined,
						}}
					/>
					<span className="min-w-3">{storyLikes}</span>
				</Button>

				<DeleteStorybookButton storyId={WebstoryData?.id!} />
				<Button
					className={`px-4 py-1.5 bg-accent-600 hover:bg-accent-700 border border-accent-700 text-background text-white text-sm font-medium flex gap-2 items-center h-fit`}
					variant="default"
					onClick={() => {
						eventLogger("create_new_clicked", {
							sourceUrl: router.asPath,
						});
						Router.push(Routes.Generate());
					}}
				>
					<Plus className="mr-2 h-4 w-4" /> Create New
				</Button>
			</div>
		</div>
	);
}
