import { Button } from "@/components/ui/button";
import Format from "@/utils/format";
import {
	ChevronRight,
	Edit2,
	Heart,
	HelpCircle,
	Share2,
	Star,
} from "lucide-react";
import { useRouter } from "next/router";
import MadeInAuthorly from "../../../public/publish/made-in-authorly";
import MadeInAuthorlyDark from "../../../public/publish/made-in-authorly-dark";

import { ModeToggle } from "../story/components/mode-toggle";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useTheme } from "next-themes";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import api from "@/api";
import { QueryKeys } from "@/lib/queryKeys";
import StoryScreen from "../story/story-screen";
const MAX_SUMMARY_LENGTH = 250;

export default function PublishedStory() {
	const router = useRouter();
	const { theme } = useTheme();
	const [showFullDescription, setShowFullDescription] = useState(false);

	// Queries
	const Webstory = useQuery({
		queryFn: () =>
			api.library.get(
				router.query.genre!.toString(),
				router.query.id!.toString()
			),
		queryKey: [QueryKeys.STORY, router.query.genre, router.query.id],
		refetchInterval: 1000,
	});
	const isLoading = Webstory.isLoading || !Webstory.data;

	return (
		<div
			className={`max-w-full min-h-screen ${theme === "light" ? "bg-slate-100" : "bg-slate-950"} items-center`}
		>
			{/* Navbar */}
			<div className="flex justify-between p-4">
				<div
					className={`flex gap-x-2.5 px-3 items-center ${theme === "light" ? "bg-white" : "bg-slate-600"} border-[1px] ${theme === "light" ? "border-white" : "border-slate-500"} rounded-bl-sm rounded-br-sm lg:rounded-br-sm lg:rounded-tr-sm lg:rounded-tl-sm lg:rounded-bl-sm`}
				>
					<div className="flex items-center gap-x-2">
						{theme === "light" ? (
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
						) : (
							<svg
								width="16"
								height="17"
								viewBox="0 0 16 17"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									d="M0 8.31363C0.102418 12.5101 3.47197 15.8857 7.66086 15.9986C7.65062 11.7714 4.21961 8.33415 0 8.31363Z"
									fill="#F8FAFC"
								/>
								<path
									d="M15.9714 7.68509C15.869 3.48861 12.4994 0.112949 8.31055 0.0103455C8.32079 4.2376 11.7518 7.67483 15.9714 7.68509Z"
									fill="#F8FAFC"
								/>
								<path
									d="M7.66965 0C3.48076 0.102603 0.111207 3.47826 0.00878906 7.67474C4.2284 7.66448 7.65941 4.22726 7.66965 0Z"
									fill="#F8FAFC"
								/>
								<path
									d="M8.30788 16.0191H8.11328H15.9995V8.31363C11.7594 8.31363 8.30788 11.7713 8.30788 16.0191Z"
									fill="#F8FAFC"
								/>
							</svg>
						)}

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
					<p className="text-sm">{Format.Title("The Path Of Friendship")}</p>
				</div>
				<div className="hidden md:block text-muted-foreground space-x-2">
					<div className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium">
						{theme === "light" ? <MadeInAuthorlyDark /> : <MadeInAuthorly />}
					</div>
					<Button
						className={`p-2 ${theme === "light" ? "bg-white" : "bg-slate-600"}`}
						variant="outline"
					>
						<Share2 className="mr-2 h-4 w-4" /> Share this video
					</Button>
				</div>
			</div>
			<div
				className={`flex ${theme === "dark" ? "bg-slate-950" : "bg-slate-100"} min-h-[calc(100vh-196px)] p-2 gap-x-1.5`}
			>
				<div className="relative w-full lg:px-20 py-10 items-center">
					<div className="flex flex-col md:flex-row items-center justify-center h-full">
						<div className="w-full md:max-w-[1500px] border-[1px] rounded-bl-lg rounded-br-lg lg:rounded-br-lg lg:rounded-tr-lg lg:rounded-tl-sm lg:rounded-bl-sm flex flex-col lg:flex-row justify-stretch">
							<div
								className="relative w-full  lg:max-w-[80%]  rounded-tl-lg rounded-bl-lg"
								style={{ aspectRatio: 16 / 9 }}
							>
								<StoryScreen />
							</div>
							{/* </Loading> */}
							<div
								className={`p-6 flex flex-col-reverse justify-between md:flex-col lg:max-w-sm ${theme === "dark" ? "bg-slate-950" : "bg-white"} rounded-bl-lg lg:rounded-bl-none lg:rounded-tr-lg rounded-br-lg`}
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
									<div className="block text-muted-foreground space-x-2">
										<Button
											className={`p-2 ${theme === "light" ? "bg-white" : "bg-slate-600"}`}
											variant="outline"
										>
											<Heart className="mr-2 h-4 w-4" /> Like video
										</Button>
										<Button
											className={`p-2 ${theme === "light" ? "bg-white" : "bg-slate-600"}`}
											variant="outline"
										>
											<Star className="mr-2 h-4 w-4" /> Follow author
										</Button>
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
												src={Webstory.data.user?.profileName ?? undefined}
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
												<p>28 Videos</p>
												<p className="text-slate-300"> • </p>
												<a
													className="p-0 m-0 text-muted-foreground font-normal"
													href="#"
												>
													See all
												</a>
											</span>
										</span>
									)}
								</div>
							</div>
						</div>
					</div>
					<div className="absolute bottom-4 right-4 flex flex-col gap-y-3">
						<span
							className="rounded-full w-8 h-8 bg-popover p-1.5"
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
