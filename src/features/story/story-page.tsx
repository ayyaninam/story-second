import { useRouter } from "next/router";
import React, { useState } from "react";
import { WebStory } from "@/components/ui/story-book/constants";
import api from "@/api";
import Navbar from "@/features/story/components/Navbar";
import Book from "@/components/ui/story-book";
import { useQuery } from "@tanstack/react-query";
import { QueryKeys } from "@/lib/queryKeys";
import { SessionType } from "@/hooks/useSaveSessionToken";
import { cn } from "@/utils";
import { ChevronRight } from "lucide-react";
import Format from "@/utils/format";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useMediaQuery } from "usehooks-ts";
import StoryPageButtons from "@/features/story/components/story-page-buttons";

const MAX_SUMMARY_LENGTH = 250;

const StoryBookPage = ({
	storyData,
	session,
}: {
	storyData: WebStory | null;
	session: SessionType;
}) => {
	const router = useRouter();
	const isMobile = useMediaQuery("(max-width: 768px)");
	const { genre, id } = router.query;

	const [showFullDescription, setShowFullDescription] = useState(false);

	const Webstory = useQuery({
		queryFn: () =>
			api.storybook.getStory({
				topLevelCategory: genre as string,
				slug: id as string,
			}),
		queryKey: [QueryKeys.STORY, genre, id],
		initialData: storyData,
		refetchInterval: (data) => {
			if (data?.state?.data?.storyDone) {
				return false;
			}
			return 2000;
		},
		enabled: !!genre && !!id,
	});

	const story = Webstory.data;

	if (!story) {
		return null;
	}

	return (
		<div className="bg-reverse flex flex-col min-h-[calc(100vh-75px)] lg:h-[calc(100vh-20px)]">
			<Navbar WebstoryData={story} />

			<div className="flex flex-col justify-start lg:justify-center items-center min-h-[calc(100vh-175px)] px-4 py-6">
				<div className="w-full max-w-[1600px] h-full min-h-[750px] flex flex-col justify-center">
					<div className="flex bg-reverse p-2 gap-x-1.5">
						<div className="relative w-full h-full lg:px-20 pb-10 items-center min-w-fit">
							<div className="flex flex-col md:flex-row items-center justify-center h-full">
								<div className="w-full h-full border-[1px] rounded-tl-lg rounded-tr-lg lg:rounded-br-lg lg:rounded-tr-lg lg:rounded-tl-sm lg:rounded-bl-sm flex flex-col-reverse lg:flex-row justify-stretch">
									<div className="relative w-full rounded-tl-lg rounded-bl-lg">
										<div
											className={cn(
												isMobile
													? "relative w-full lg:max-w-[100%] rounded-tl-lg rounded-bl-lg"
													: undefined
											)}
										>
											<Book story={story} />
										</div>
									</div>

									<div className="p-6 min-w-[375px] flex flex-col justify-between lg:max-w-sm bg-description rounded-tl-lg lg:rounded-bl-none lg:rounded-tr-lg rounded-tr-lg">
										<div className="relative space-y-2">
											<div className="flex gap-x-1 text-muted-foreground items-center text-sm">
												<p className="text-purple-500">Storybook</p>
												<ChevronRight className="w-4 h-4" />
												<p>{Format.Title(story.topLevelCategory)}</p>
											</div>
											<p className="text-2xl font-bold max-w-sm -tracking-[-0.6px]">
												{Format.Title(story.storyTitle)}
											</p>

											<StoryPageButtons
												session={session}
												WebstoryData={story}
											/>

											<p className="text-sm text-muted-foreground text-wrap text-ellipsis whitespace-nowrap overflow-hidden self-stretch">
												{showFullDescription
													? story.summary
													: Format.TruncateTextWithEllipses(
															story.summary,
															MAX_SUMMARY_LENGTH
														)}
											</p>

											{(story?.summary?.length ?? 0) > MAX_SUMMARY_LENGTH &&
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
											<Avatar className="h-11 w-11">
												<AvatarImage
													src={story.user?.profilePicture ?? undefined}
												/>
												<AvatarFallback>
													{Format.AvatarName(
														story.user?.name,
														story.user?.lastName
													)}
												</AvatarFallback>
											</Avatar>

											<span className="flex flex-col">
												{story.user && (
													<>
														<span>
															{story.user.name} {story.user?.lastName}
														</span>
														<span className="flex text-muted-foreground gap-x-1 items-center text-sm">
															<>
																{story.user.videoCount! > 0 && (
																	<p>{story.user?.videoCount} Videos</p>
																)}
																{story.user.videoCount! > 0 &&
																	story.user.storyCount! > 0 && (
																		<p className="text-slate-300"> • </p>
																	)}
																{story.user.storyCount! > 0 && (
																	<p>{story.user.storyCount} Stories</p>
																)}
															</>
														</span>
													</>
												)}
											</span>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default StoryBookPage;
