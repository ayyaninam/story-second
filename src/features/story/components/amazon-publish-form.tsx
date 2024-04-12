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
import {
	AmazonMarketplace,
	AmazonPublishLifecycle,
} from "@/constants/amazon-constants";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import Error from "@/components/FormError";
import { createCategoryString } from "@/utils/categoryUtils";

const ages = Array.from({ length: 17 }, (_, i) => (i + 1).toString());
ages.push("18+");
const agesTuple: [string, ...string[]] = ["1", ...ages.slice(1)] as [
	string,
	...string[],
];

const categorySchema: z.ZodSchema<any> = z.lazy(() =>
	z.array(z.record(z.union([z.object({}), categorySchema])))
);

const publishingSchema = z
	.object({
		title: z.string().min(1, "Title is required"),
		subtitle: z.string().optional(),
		firstName: z.string().min(1, "First name is required"),
		middleName: z.string().optional(),
		lastName: z.string().min(1, "Last name is required"),
		prefixName: z.string().optional(),
		suffixName: z.string().optional(),
		categories: categorySchema,
		summary: z
			.string()
			.min(20, "Summary must be at least 20 characters")
			.max(4000, "Summary must be less than 4000 characters"),
		ageGroupMin: z.union([z.literal("18+"), z.enum(agesTuple)]),
		ageGroupMax: z.union([z.literal("18+"), z.enum(agesTuple)]),
		amazonMarketplace: z.enum([
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
		seoKeywords: z.array(z.string()).min(1, "At least one keyword is required"),
	})
	.refine(
		(data) => {
			// Convert ageGroupMin and ageGroupMax from string to numbers for comparison, treating "18+" as 19 for logic purposes
			const minAge =
				data.ageGroupMin === "18+" ? 19 : parseInt(data.ageGroupMin, 10);
			const maxAge =
				data.ageGroupMax === "18+" ? 19 : parseInt(data.ageGroupMax, 10);
			return minAge <= maxAge;
		},
		{
			message: "Minimum age must be less than or equal to maximum age",
		}
	);

const MAX_SUMMARY_LENGTH = 250;

const PublishBookPage = ({ storyData }: { storyData: WebStory }) => {
	const router = useRouter();
	const { genre, id } = router.query as { genre: string; id: string };
	const [showFullDescription, setShowFullDescription] = useState(false);

	const formMethods = useForm({
		resolver: zodResolver(publishingSchema),
		mode: "onBlur",
	});

	const { register, handleSubmit, watch, setValue, control, formState } =
		formMethods;

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
		queryKey: [QueryKeys.AMAZON_METADATA, storyData.id],
		queryFn: () => api.amazon.getMetadata({ id: storyData.id as string }),
		enabled: !!storyData.id,
	});

	const { data: categoryMetadata } = useQuery({
		queryFn: () =>
			api.amazon.getAmazonCategories({
				id: storyData.id as string,
				amazonMarketplace: {
					amazonMarketplace:
						metadata?.data?.amazonMarketplace || AmazonMarketplace.US,
				},
			}),
		queryKey: [
			QueryKeys.AMAZON_CATEGORIES,
			storyData.id,
			metadata?.data?.amazonMarketplace,
		],
		enabled: !!storyData.id,
	});

	const selectedAgeGroupMin = watch("ageGroupMin", ages[0]);
	const selectedAgeGroupMax = watch("ageGroupMax", ages[ages.length - 1]);

	const handleageGroupMinSelect = (age: number | string) =>
		setValue("ageGroupMin", age);
	const handleageGroupMaxSelect = (age: number | string) =>
		setValue("ageGroupMax", age);

	useEffect(() => {
		if (storyData.amazonBook) {
			toast.dismiss();
			toast.success("Book already published");
			router.push(`/story/${genre}/${id}/publish-book/download`);
		}
	}, []);

	useEffect(() => {
		if (categoryMetadata?.data) {
			setValue("categories", categoryMetadata.data);
		}
		console.log(formMethods.getValues());
	}, [categoryMetadata]);

	useEffect(() => {
		if (metadata?.data) {
			if (metadata.data.ageGroupMin === "0") {
				metadata.data.ageGroupMin = "1";
			}
			const formValues = {
				...formMethods.getValues(),
				title: metadata.data.title || "",
				subtitle: metadata.data.subtitle || "",
				firstName: metadata.data.firstName || "",
				middleName: metadata.data.middleName || "",
				lastName: metadata.data.lastName || "",
				summary: metadata.data.summary || "",
				ageGroupMin: metadata.data.ageGroupMin?.toString() || "1",
				ageGroupMax: metadata.data.ageGroupMax?.toString() || "18+",
				amazonMarketplace:
					metadata?.data?.amazonMarketplace || AmazonMarketplace.US,
				seoKeywords: metadata?.data?.seoKeywords
					? metadata.data.seoKeywords.split(", ")
					: [""],
			};
			formMethods.reset(formValues);
		}
		console.log(formMethods.getValues());
	}, [metadata]);

	if (isLoading) {
		return <div>Loading story details...</div>; // Use your LoadingIndicator component or any loading UI
	}

	if (!story) {
		toast.error("Story not found");
		router.push(Routes.defaultRedirect);
		return null;
	}

	const onSubmit = async (data: any) => {
		console.log(data);
		try {
			const request = { ...data };
			request.categories = formMethods.getValues().categories;
			request.seoKeywords = data.seoKeywords.join(", ");
			request.AmazonPublishLifecycle = AmazonPublishLifecycle.SelfPublished;

			await api.amazon.validateMetadata({
				id: story.id as string,
				metadata: request,
			});
			toast.success("Publishing in progress...");
			localStorage.setItem(id, JSON.stringify(request));
			console.log(request);
			await router.push(`/story/${genre}/${id}/publish-book/confirm`);
		} catch (error) {
			console.error(error);
			toast.error("Failed to publish book");
		}
	};

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
														<Error control={control} name="firstName" />
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
														<Error control={control} name="lastName" />
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
														className="w-full mt-2 border-2 rounded-sm p-2"
													/>
													<Error control={control} name="summary" />
												</div>
												<div className="flex space-x-4">
													<div className="w-1/2">
														<Label htmlFor="ageGroupMin">Min Age</Label>
														<DropdownMenu>
															<DropdownMenuTrigger asChild>
																<Button
																	className="p-2 shadow-sm bg-gradient-to-r from-button-start to-button-end hover:shadow-md md:p-3 w-full justify-between"
																	variant="outline"
																>
																	{selectedAgeGroupMin}
																	<ChevronDown className="ml-2 h-4 w-4 md:h-5 md:w-5" />
																</Button>
															</DropdownMenuTrigger>
															<DropdownMenuContent>
																{ages.map((age) => (
																	<DropdownMenuItem
																		key={age}
																		className="cursor-pointer"
																		onSelect={() =>
																			handleageGroupMinSelect(age)
																		}
																	>
																		<span>{age}</span>
																	</DropdownMenuItem>
																))}
															</DropdownMenuContent>
														</DropdownMenu>
													</div>
													<div className="w-1/2">
														<Label htmlFor="ageGroupMax">Max Age</Label>
														<DropdownMenu>
															<DropdownMenuTrigger asChild>
																<Button
																	className="p-2 shadow-sm bg-gradient-to-r from-button-start to-button-end hover:shadow-md md:p-3 w-full justify-between"
																	variant="outline"
																>
																	{selectedAgeGroupMax}
																	<ChevronDown className="ml-2 h-4 w-4 md:h-5 md:w-5" />
																</Button>
															</DropdownMenuTrigger>
															<DropdownMenuContent>
																{ages.map((age) => (
																	<DropdownMenuItem
																		key={age}
																		className="cursor-pointer"
																		onSelect={() =>
																			handleageGroupMaxSelect(age)
																		}
																	>
																		<span>{age}</span>
																	</DropdownMenuItem>
																))}
															</DropdownMenuContent>
														</DropdownMenu>
													</div>
													{/*<div className="w-full">*/}
													{/*	<Label htmlFor="amazonMarketplace">*/}
													{/*		Marketplace*/}
													{/*	</Label>*/}
													{/*	<DropdownMenu>*/}
													{/*		<DropdownMenuTrigger asChild>*/}
													{/*			<Button*/}
													{/*				className="p-2 shadow-sm bg-gradient-to-r from-button-start to-button-end hover:shadow-md md:p-3 w-full justify-between"*/}
													{/*				variant="outline"*/}
													{/*			>*/}
													{/*				{selectedMarketplace}*/}
													{/*				<ChevronDown className="ml-2 h-4 w-4 md:h-5 md:w-5" />*/}
													{/*			</Button>*/}
													{/*		</DropdownMenuTrigger>*/}
													{/*		<DropdownMenuContent>*/}
													{/*			{MARKET_PLACES.map((market) => (*/}
													{/*				<DropdownMenuItem*/}
													{/*					key={market.value}*/}
													{/*					className="cursor-pointer"*/}
													{/*					onSelect={() =>*/}
													{/*						handleMarketplaceSelect(market.value)*/}
													{/*					}*/}
													{/*				>*/}
													{/*					<span>{market.value}</span>*/}
													{/*				</DropdownMenuItem>*/}
													{/*			))}*/}
													{/*		</DropdownMenuContent>*/}
													{/*	</DropdownMenu>*/}
													{/*</div>*/}
												</div>
												<div className="w-full">
													<Label htmlFor="categories">Categories</Label>
													<div className="mt-2 bg-gray-100 p-2 rounded-md">
														{categoryMetadata?.data ? (
															categoryMetadata.data.map((category, index) => (
																<div key={index} className="text-sm py-1">
																	{createCategoryString(category)}
																</div>
															))
														) : (
															<p>Loading categories, please wait...</p>
														)}
													</div>
												</div>

												<div className="w-full">
													<Label htmlFor="seoKeywords">SEO Keywords</Label>
													<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-2">
														{[...Array(7)].map((_, index) => (
															<Input
																disabled
																key={`keyword-${index}`}
																type="text"
																{...register(`seoKeywords[${index}]`)}
																placeholder={`Keyword ${index + 1}`}
																className="mt-2"
															/>
														))}
													</div>
												</div>

												{/*show all errors*/}
												{Object.keys(formState.errors).map((key) => (
													<Error key={key} control={control} name={key} />
												))}
												<Error control={control} name="categories" />

												<div className="flex justify-end mt-4">
													<Button
														type="submit"
														variant="accent"
														className="btn-primary w-full sm:w-max"
														isLoading={formState.isSubmitting}
													>
														Continue
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
