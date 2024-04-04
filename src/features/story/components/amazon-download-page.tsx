import { WebStory } from "@/components/ui/story-book/constants";
import Navbar from "@/features/story/components/Navbar";
import { Button } from "@/components/ui/button";
import Routes from "@/routes";
import { ChevronLeft } from "lucide-react";
import Image from "next/image";
import Format from "@/utils/format";
import React, { useState } from "react";
import { useRouter } from "next/router";
import { useQuery } from "@tanstack/react-query";
import api from "@/api";
import { QueryKeys } from "@/lib/queryKeys";
import { mainSchema } from "@/api/schema";
import { CreditSpendType, PdfType } from "@/utils/enums";
import toast from "react-hot-toast";
import { AmazonPublishLifecycle } from "@/constants/amazon-constants";
import AmazonStatusCard, {
	displayStatus,
} from "@/features/account/components/amazon-status-card";
import Link from "next/link";
import { createCategoryString } from "@/utils/categoryUtils";
import DownloadPDFButton from "@/features/story/components/download-pdf-button";
const MAX_SUMMARY_LENGTH = 250;

const AmazonDownloadPage = ({ storyData }: { storyData: WebStory }) => {
	const router = useRouter();
	const { genre, id } = router.query as { genre: string; id: string };
	const [showFullDescription, setShowFullDescription] = useState(false);
	const { data: story, isLoading } = useQuery({
		queryFn: () =>
			api.storybook.getStory({
				topLevelCategory: genre as string,
				slug: id as string,
			}),
		queryKey: [QueryKeys.STORY, genre, id],
		initialData: storyData,
		enabled: !!genre && !!id,
	});
	const { data: amazonData } = useQuery({
		queryFn: () => api.user.getSingleUserAmazonItem(story?.id!),
		queryKey: [QueryKeys.USER_AMAZON_ITEM, story?.id],
		enabled: !!story?.id,
	});

	console.log(amazonData);

	if (!story || isLoading || !amazonData) {
		return null;
	}

	return (
		<div className="bg-reverse flex flex-col min-h-[calc(100vh-75px)] lg:h-[calc(100vh-20px)] overflow-auto">
			<Navbar WebstoryData={story} />
			<div className="flex flex-col justify-start lg:justify-center items-center px-4 py-6">
				<div className="w-full max-w-[1600px] h-full flex flex-col justify-center">
					<div className="flex bg-reverse p-2 gap-x-1.5">
						<div className="relative w-full h-full lg:px-20 pb-10 items-center min-w-fit">
							<div className="flex flex-col md:flex-row items-center justify-center h-full border-2">
								<div className="w-full h-full border-[1px] flex flex-col lg:flex-row justify-stretch">
									<div className="p-6 flex flex-col justify-between lg:max-w-sm bg-white">
										<div className="space-y-2 flex flex-col items-start">
											<Button
												variant="link"
												className="flex gap-x-1 text-muted-foreground items-center text-sm pl-0"
												onClick={() =>
													router.push(
														Routes.ViewStory(story?.storyType, genre, id)
													)
												}
											>
												<ChevronLeft className="w-4 h-4" />
												<span>Return to story</span>
											</Button>

											{story.coverImage && (
												<Image
													src={Format.GetImageUrl(story.coverImage)}
													alt="Story Cover"
													width={0}
													height={0}
													sizes="100vw"
													style={{ width: "100%", height: "auto" }}
												/>
											)}

											<div className="flex flex-row items-baseline">
												<p className="text-2xl font-bold max-w-sm -tracking-[-0.6px]">
													{Format.Title(story.storyTitle)}
												</p>
											</div>

											<p className="text-sm text-muted-foreground text-wrap text-ellipsis whitespace-nowrap overflow-hidden self-stretch">
												{showFullDescription
													? story.summary
													: Format.TruncateTextWithEllipses(
															story.summary,
															MAX_SUMMARY_LENGTH
														)}
											</p>

											{!!(!showFullDescription && story?.summary?.length) ||
												(0 > MAX_SUMMARY_LENGTH && (
													<Button
														variant="link"
														className="text-indigo-500 text-sm font-normal m-0 p-0"
														onClick={() => setShowFullDescription(true)}
													>
														See full description
													</Button>
												))}
										</div>
									</div>

									<div className="relative w-full bg-white p-6 border-t border-gray-200 lg:border-t-0 lg:border-l">
										<div className="space-y-6">
											<div>
												<h4 className="text-xl font-semibold mb-2">
													{amazonData.title}
												</h4>
												<p className="text-sm text-gray-500 mb-1">
													Status:{" "}
													{displayStatus(amazonData.amazonPublishLifecycle)}
												</p>
												<p className="text-sm text-gray-500">
													Submitted Date:{" "}
													{Format.DateDisplay(amazonData.created!)}
												</p>
												{amazonData.amazonURL && (
													<Link
														href={amazonData.amazonURL}
														className="text-blue-600 hover:underline inline-block mt-2"
													>
														View on Amazon
													</Link>
												)}
											</div>
											<div className="space-y-4">
												{amazonData.subtitle && (
													<div>
														<p className="font-semibold">Book Subtitle</p>
														<p className="mt-1 text-gray-600 text-sm">
															{amazonData.subtitle}
														</p>
													</div>
												)}

												<div>
													<p className="font-semibold">Book Summary</p>
													<p className="mt-1 text-gray-600 text-sm">
														{amazonData.summary}
													</p>
												</div>

												{amazonData.categories &&
													amazonData.categories.length > 0 && (
														<div>
															<p className="font-semibold">
																Recommended Categories
															</p>
															<ul className="mt-1 list-disc list-inside text-gray-600">
																{amazonData.categories.map((category, i) => (
																	<li key={i}>
																		{createCategoryString(category)}
																	</li>
																))}
															</ul>
														</div>
													)}

												<div>
													<p className="font-semibold">
														Age Group:{" "}
														<span className="font-normal text-sm">
															{amazonData.ageGroupMin} -{" "}
															{amazonData.ageGroupMax}
														</span>
													</p>
												</div>

												{amazonData.seoKeywords && (
													<div>
														<p className="font-semibold">SEO Keywords</p>
														<div className="mt-1 flex gap-2 flex-wrap">
															{amazonData.seoKeywords
																.split(", ")
																.map((keyword, i) => (
																	<span
																		key={i}
																		className="bg-gray-200 rounded-full px-3 py-1 text-sm"
																	>
																		{keyword}
																	</span>
																))}
														</div>
													</div>
												)}
												<div>
													<p className="font-semibold mb-2">Downloads</p>
													<div className="mt-1">
														<table className="min-w-full">
															<tbody>
																<tr className="border-t border-gray-200">
																	<td className="py-2 text-sm text-gray-600 font-medium">
																		Cover PDF:
																	</td>
																	<td className="py-2">
																		<DownloadPDFButton
																			variant="cover-amazon"
																			storyData={storyData}
																			additionalClasses="text-xs py-1 px-2 text-white rounded-md"
																		/>
																	</td>
																</tr>
																<tr className="border-t border-gray-200">
																	<td className="py-2 text-sm text-gray-600 font-medium">
																		Manuscript:
																	</td>
																	<td className="py-2">
																		<DownloadPDFButton
																			variant="storybook-amazon"
																			storyData={storyData}
																			additionalClasses="text-xs py-1 px-2 text-white rounded-md"
																		/>
																	</td>
																</tr>
															</tbody>
														</table>
													</div>
												</div>
											</div>
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

export default AmazonDownloadPage;
