import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useQuery } from "@tanstack/react-query";
import { QueryKeys } from "@/lib/queryKeys";
import api from "@/api";
import Navbar from "@/features/story/components/Navbar";
import { ChevronDown, ChevronLeft } from "lucide-react";
import Format from "@/utils/format";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Routes from "@/routes";
import toast from "react-hot-toast";
import { WebStory } from "@/components/ui/story-book/constants";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import TextareaAutosize from "react-textarea-autosize";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AmazonMarketplace, MARKET_PLACES } from "@/constants/amazon-constants";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";

const publishingSchema = z
	.object({
		title: z.string().min(1, "Title is required"),
		subtitle: z.string().optional(),
		firstName: z.string().min(1, "First name is required"),
		middleName: z.string().optional(),
		lastName: z.string().min(1, "Last name is required"),
		prefixName: z.string().optional(),
		suffixName: z.string().optional(),
		summary: z
			.string()
			.min(20, "Summary must be at least 20 characters")
			.max(1000, "Summary must be less than 1000 characters"),
		minAge: z
			.number()
			.min(1, "Minimum age must be at least 1")
			.max(18, "Minimum age must be less than 19"),
		maxAge: z
			.number()
			.min(1, "Maximum age must be at least 1")
			.max(18, "Maximum age must be less than 19"),
		marketplace: z.enum([
			AmazonMarketplace.US,
			AmazonMarketplace.CA,
			AmazonMarketplace.MX,
			AmazonMarketplace.BR,
			AmazonMarketplace.DE,
			AmazonMarketplace.FR,
			AmazonMarketplace.IT,
			AmazonMarketplace.ES,
			AmazonMarketplace.AU,
			AmazonMarketplace.IN,
			AmazonMarketplace.JP,
			AmazonMarketplace.NL,
			AmazonMarketplace.UK,
		]),
		keywords: z.array(z.string()).min(1, "At least one keyword is required"),
	})
	.refine((schema) => schema.minAge <= schema.maxAge, {
		message: "Minimum age must be less than or equal to maximum age",
	});

const MAX_SUMMARY_LENGTH = 250;

const PublishBookPage = ({ storyData }: { storyData: WebStory }) => {
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

	const { data: metadata, isLoading: isLoadingMetadata } = useQuery({
		queryKey: ["AMAZON_METADATA", storyData.id],
		queryFn: () => api.amazon.getMetadata({ id: storyData.id as string }),
		enabled: !!storyData.id,
	});

	const ages = Array.from({ length: 18 }, (_, i) => i + 1);
	const [selectedMinAge, setSelectedMinAge] = useState<number>(ages[0] || 1);
	const [selectedMaxAge, setSelectedMaxAge] = useState<number>(ages[-1] || 18);
	const [selectedMarketplace, setSelectedMarketplace] =
		useState<AmazonMarketplace>(
			MARKET_PLACES[0]?.value || AmazonMarketplace.US
		);
	const [keywords, setKeywords] = useState([""]);

	const formMethods = useForm({
		resolver: zodResolver(publishingSchema),
		mode: "onBlur",
	});

	const { register, handleSubmit, control, formState } = formMethods;

	const onSubmit = async (data: any) => {
		// Process the form data here
		console.log(data);
		toast.success("Publishing in progress...");
		// Example redirection or API call
		// await router.push(Routes.StoryPublished(genre, id));
	};

	useEffect(() => {
		if (metadata?.data) {
			const formValues = {
				title: metadata.data.title || "",
				subtitle: metadata.data.subtitle || "",
				author: metadata.data.author || "",
				summary: metadata.data.summary || "",
				seoKeywords: metadata.data.seoKeywords
					? metadata.data.seoKeywords.split(", ")
					: [],
				ageGroupMin: metadata.data.ageGroupMin || "",
				ageGroupMax: metadata.data.ageGroupMax || "",
				amazonMarketplace: metadata.data.amazonMarketplace || "",
			};
			formMethods.reset(formValues);
		}
	}, [metadata, formMethods.reset]);

	if (isLoading) {
		return <div>Loading story details...</div>; // Use your LoadingIndicator component or any loading UI
	}

	if (!story) {
		toast.error("Story not found");
		router.push(Routes.defaultRedirect);
		return null;
	}

	const handlePublish = async () => {
		// Logic to handle direct publishing goes here
		toast.success("Publishing in progress...");
		// Example of navigation, adjust as needed
		// await router.push(Routes.StoryPublished(genre, id));
	};

	return (
		<div className="bg-reverse flex flex-col min-h-[calc(100vh-75px)] lg:h-[calc(100vh-20px)]">
			<Navbar WebstoryData={story} />
			<div className="flex flex-col justify-start lg:justify-center items-center min-h-[calc(100vh-175px)] px-4 py-6">
				<div className="w-full max-w-[1600px] h-full min-h-[750px] flex flex-col justify-center">
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

									<div className="relative w-full bg-white p-6 border-t-2 lg:border-t-0 lg:border-l-2">
										<FormProvider {...formMethods}>
											<form
												onSubmit={handleSubmit(onSubmit)}
												className="space-y-4"
											>
												<div>
													<Label htmlFor="title">Title</Label>
													<Input
														{...register("title")}
														className="w-full mt-2"
													/>
												</div>
												<div>
													<Label htmlFor="subtitle">Subtitle (optional)</Label>
													<Input
														{...register("subtitle")}
														className="w-full mt-2"
													/>
												</div>
												<div className="grid grid-cols-1 sm:grid-cols-6 gap-4 mt-2">
													{/* Allocating more space to first name, middle name, and last name fields */}
													<div className="col-span-1 sm:col-span-2">
														<Label htmlFor="firstName">First Name</Label>
														<Input
															{...register("firstName")}
															className="w-full mt-2"
														/>
													</div>

													<div className="col-span-1 sm:col-span-2">
														<Label htmlFor="middleName">Middle Name</Label>
														<Input
															{...register("middleName")}
															className="w-full mt-2"
														/>
													</div>

													<div className="col-span-1 sm:col-span-2">
														<Label htmlFor="lastName">Last Name</Label>
														<Input
															{...register("lastName")}
															className="w-full mt-2"
														/>
													</div>
												</div>

												<div>
													<Label htmlFor="summary">Summary</Label>
													<p>
														Summarize your book. This will be your product
														description on Amazon, so customers can learn more
														about your book.
													</p>
													<TextareaAutosize
														{...register("summary")}
														minRows={5}
														className="w-full mt-2 border-2 rounded-sm"
													/>
												</div>
												<div className="flex space-x-4">
													<div className="w-1/2">
														<Label htmlFor="minAge">Min Age</Label>
														<DropdownMenu>
															<DropdownMenuTrigger asChild>
																<Button
																	className="p-2 shadow-sm bg-gradient-to-r from-button-start to-button-end hover:shadow-md md:p-3 w-full justify-between"
																	variant="outline"
																>
																	{selectedMinAge}
																	<ChevronDown className="ml-2 h-4 w-4 md:h-5 md:w-5" />
																</Button>
															</DropdownMenuTrigger>
															<DropdownMenuContent>
																{ages.map((age) => (
																	<DropdownMenuItem
																		key={age}
																		className="cursor-pointer"
																		onSelect={() => setSelectedMinAge(age)}
																	>
																		<span>{age}</span>
																	</DropdownMenuItem>
																))}
															</DropdownMenuContent>
														</DropdownMenu>
													</div>
													<div className="w-1/2">
														<Label htmlFor="maxAge">Max Age</Label>
														<DropdownMenu>
															<DropdownMenuTrigger asChild>
																<Button
																	className="p-2 shadow-sm bg-gradient-to-r from-button-start to-button-end hover:shadow-md md:p-3 w-full justify-between"
																	variant="outline"
																>
																	{selectedMaxAge === 18
																		? "18+"
																		: selectedMaxAge}
																	<ChevronDown className="ml-2 h-4 w-4 md:h-5 md:w-5" />
																</Button>
															</DropdownMenuTrigger>
															<DropdownMenuContent>
																{ages.map((age) => (
																	<DropdownMenuItem
																		key={age}
																		className="cursor-pointer"
																		onSelect={() => setSelectedMaxAge(age)}
																	>
																		<span>{age === 18 ? "18+" : age}</span>
																	</DropdownMenuItem>
																))}
															</DropdownMenuContent>
														</DropdownMenu>
													</div>
													<div className="w-full">
														<Label htmlFor="marketplace">Marketplace</Label>
														<DropdownMenu>
															<DropdownMenuTrigger asChild>
																<Button
																	className="p-2 shadow-sm bg-gradient-to-r from-button-start to-button-end hover:shadow-md md:p-3 w-full justify-between"
																	variant="outline"
																>
																	{selectedMarketplace}
																	<ChevronDown className="ml-2 h-4 w-4 md:h-5 md:w-5" />
																</Button>
															</DropdownMenuTrigger>
															<DropdownMenuContent>
																{MARKET_PLACES.map(({ key, value }) => (
																	<DropdownMenuItem
																		key={value}
																		className="cursor-pointer w-full"
																		onSelect={() =>
																			setSelectedMarketplace(value)
																		}
																	>
																		<span>{value}</span>
																	</DropdownMenuItem>
																))}
															</DropdownMenuContent>
														</DropdownMenu>
													</div>
												</div>
												<div className="w-full">
													<Label htmlFor="keywords">Keywords</Label>
													<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-2">
														{[...Array(7)].map((_, index) => (
															<Input
																key={index}
																type="text"
																{...register(`keywords[${index}]`)}
																placeholder={`Keyword ${index + 1}`}
																className="mt-2"
															/>
														))}
													</div>
												</div>

												<div className="flex justify-end mt-4">
													<Button
														type="submit"
														variant="accent"
														className="btn-primary w-full sm:w-max"
														// onClick={handlePublish}
														isLoading={formState.isSubmitting}
													>
														Publish Now
													</Button>
												</div>
											</form>
										</FormProvider>
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

export default PublishBookPage;
