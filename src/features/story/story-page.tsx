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
import Link from "next/link";
import SuggestedStories from "@/components/suggested-stories/suggested-stories";
import { debounce } from "lodash";

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

	const [suggestedOpen, setSuggestedOpen] = useState(true);
	const [isHovering, setIsHovering] = useState(false);
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
	const toggleHovering = debounce((value: boolean) => {
		setIsHovering(value);
	}, 100);
	return (
		<div className="flex bg-reverse w-full">
			<div
				className={cn(
					" min-h-[calc(100vh-75px)] xl:h-[calc(100vh-20px)] w-full",
					suggestedOpen ? "lg:w-[calc(100%-306px)]" : "lg:w-full"
				)}
			>
				{" "}
				<Navbar
					WebstoryData={story}
					suggestedOpen={suggestedOpen}
					setSuggestedOpen={setSuggestedOpen}
					toggleHovering={toggleHovering}
					suggestedMenuButton
				/>
				<div className="flex bg-reverse flex-col justify-start xl:justify-center items-center h-[calc(100%-175px)] px-4 py-6 overflow-y-auto">
					<div className="w-full max-w-[1600px] h-full  flex flex-col justify-center">
						<div className="flex bg-reverse p-2 gap-x-1.5">
							<div className="relative w-full h-full xl:px-20 pb-10 items-center min-w-fit">
								<div className="flex flex-col md:flex-row items-center justify-center h-full">
									<div className="w-full h-full border-[1px] rounded-tl-lg rounded-tr-lg xl:rounded-br-lg xl:rounded-tr-lg xl:rounded-tl-sm xl:rounded-bl-sm flex flex-col-reverse xl:flex-row justify-stretch">
										<div className="relative w-full rounded-tl-lg rounded-bl-lg">
											<div
												className={cn(
													isMobile
														? "relative w-full xl:max-w-[100%] rounded-tl-lg rounded-bl-lg"
														: undefined
												)}
											>
												<Book story={story} />
											</div>
										</div>

										<div className="p-6 min-w-[325px] flex flex-col justify-between xl:max-w-sm bg-description rounded-tl-lg xl:rounded-bl-none xl:rounded-tr-lg rounded-tr-lg">
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

												<p className="text-sm text-muted-foreground text-wrap text-ellipsis whitespace-nowrap self-stretch">
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
											<div className="xl:hidden my-2.5 bg-slate-200 self-stretch h-px" />
											<Link
												href={`/${Webstory.data?.user?.profileName}`}
												className="flex gap-x-2.5"
											>
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
																{story.user.name} {story.user?.lastName || ""}
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
											</Link>
										</div>
									</div>
								</div>
							</div>
						</div>
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
					story
					visible={suggestedOpen}
					setVisible={setSuggestedOpen}
					hovering={isHovering}
				/>
			</div>
		</div>
	);
};

export default StoryBookPage;
