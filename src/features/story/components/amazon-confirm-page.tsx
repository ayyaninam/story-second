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
import { CreditSpendType } from "@/utils/enums";
import toast from "react-hot-toast";
import { AmazonPublishLifecycle } from "@/constants/amazon-constants";
const MAX_SUMMARY_LENGTH = 250;

const AmazonConfirmPage = ({ storyData }: { storyData: WebStory }) => {
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
	const User = useQuery<mainSchema["UserInfoDTOApiResponse"]>({
		queryFn: () => api.user.get(),
		staleTime: 3000,
		// eslint-disable-next-line @tanstack/query/exhaustive-deps -- pathname includes everything we need
		queryKey: [QueryKeys.USER],
	});
	const options = {
		publish: CreditSpendType.AmazonPublishing,
		publishPDF: CreditSpendType.AmazonPublishingPDFOnly,
	};
	const UserPurchase = useQuery<
		mainSchema["Int32BooleanDictionaryApiResponse"]
	>({
		queryFn: () =>
			api.user.getUserPurchase({
				id: story?.id!,
				creditSpendType: Object.values(options),
			}),
		// eslint-disable-next-line @tanstack/query/exhaustive-deps -- pathname includes everything we need
		queryKey: [QueryKeys.USER_PAYMENT, router.asPath],
	});

	const onSubmit = async () => {
		try {
			const data = localStorage.getItem(id as string);
			if (!data) {
				await router.push(Routes.ViewStory(story?.storyType, genre, id));
				return;
			}
			const formData = JSON.parse(data);
			if (UserPurchase.data?.data?.[options["publish"]])
				formData.AmazonPublishLifecycle = AmazonPublishLifecycle.Requested;

			await api.amazon.saveBookMetadata({
				id: story?.id!,
				metadata: formData,
			});
			toast.success(
				"Publish Request Successful. We'll reach out to you over email."
			);
			await router.push(Routes.ViewStory(story?.storyType, genre, id));
		} catch (error) {
			toast.error(
				"An error occurred while saving the metadata. Please try again later."
			);
		}
	};

	if (!story || isLoading) {
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

									<div className="relative w-full bg-white p-6 border-t-2 lg:border-t-0 lg:border-l-2">
										{UserPurchase.data?.data?.[options["publishPDF"]] ? (
											<div className="flex flex-col gap-2">
												<div className="flex flex-col gap-1">
													<h3 className="font-semibold text-lg">
														Congratulations on Choosing the Standard Edition:
														Self-Publish Kit!
													</h3>
													<p className="tracking-wide leading-loose">
														You&apos;ve successfully completed the purchase and
														are just one step away from publishing your book!
													</p>
												</div>

												<div className="border-gold border-b-2 border-t-2 rounded-2xl p-2">
													<ul className="list-disc pl-5">
														<li className="tracking-wide leading-loose">
															Receive meticulously crafted, Amazon-formatted
															book and cover PDFs.
														</li>
														<li className="tracking-wide leading-loose">
															Get precise listing details, including categories,
															keywords, and more.
														</li>
														<li className="tracking-wide leading-loose">
															You will own the copyrights and receive 100% of
															the royalties.
														</li>
														<li className="tracking-wide leading-loose">
															Your book can be live on Amazon within 48 hours
															after submission.
														</li>
													</ul>
												</div>
												<p className="tracking-wide leading-loose">
													<span className="font-semibold">Note: </span>Ensure
													your story is in the final version for texts and
													images before submitting this form.
												</p>
												<p className="tracking-wide leading-loose">
													Click &apos;Submit&apos; to confirm the details and
													proceed with the publication. We&apos;ll send you the
													PDFs and all the details you need, along with a guide
													to follow for publication!
												</p>
											</div>
										) : UserPurchase.data?.data?.[options["publish"]] ? (
											<div className="flex flex-col gap-2">
												<div className="flex flex-col gap-1">
													<h3 className="font-semibold text-lg">
														Congratulations on Choosing the Premium Edition:
														Fully Managed Publish Package!
													</h3>
													<p className="tracking-wide leading-loose">
														You&apos;ve opted for a seamless and hassle-free
														experience, and we&apos;re thrilled to manage the
														entire publication and sales process for you!
													</p>
												</div>

												<div className="border-gold border-b-2 border-t-2 rounded-2xl p-2">
													<ul className="list-disc pl-5">
														<li className="tracking-wide leading-loose">
															We manage the entire publication and sales
															process, ensuring your story reaches a wider
															audience without any hassle.
														</li>
														<li className="tracking-wide leading-loose">
															Your story is in experienced hands, allowing you
															to focus on your next creative endeavor.
														</li>
														<li className="tracking-wide leading-loose">
															Your book can be live on Amazon, reaching a broad
															audience, within 72 hours after submission.
														</li>
													</ul>
												</div>
												<p className="tracking-wide leading-loose">
													<span className="font-semibold">Note: </span>Ensure
													your story is in the final version for texts and
													images before submitting this form.
												</p>
												<p className="tracking-wide leading-loose">
													Click &apos;Submit&apos; to confirm the details and
													let us start managing the publication of your book.
													We&apos;ll keep you updated on every step, ensuring a
													smooth and rewarding publication experience!
												</p>
											</div>
										) : null}
										<div className="flex justify-end mt-4">
											<Button
												type="submit"
												variant="accent"
												className="btn-primary w-full sm:w-max"
												onClick={onSubmit}
											>
												Submit
											</Button>
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

export default AmazonConfirmPage;
