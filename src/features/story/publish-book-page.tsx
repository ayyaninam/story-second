import { useRouter } from "next/router";
import React, { useState, useMemo, useEffect } from "react";
import { WebStory } from "@/components/ui/story-book/constants";
import api from "@/api";
import Navbar from "@/features/story/components/Navbar";
import { useQuery } from "@tanstack/react-query";
import { QueryKeys } from "@/lib/queryKeys";
import { ChevronLeft } from "lucide-react";
import Format from "@/utils/format";
import { Button } from "@/components/ui/button";
import { PdfType, CreditSpendType, AllowanceType } from "@/utils/enums";
import Image from "next/image";
import { mainSchema } from "@/api/schema";
import CheckoutDialog from "@/features/pricing/checkout-dialog";
import toast from "react-hot-toast";
import Routes from "@/routes";
import { useUserCanUseCredits } from "@/utils/payment";
import UpgradeSubscriptionDialog from "@/features/pricing/upgrade-subscription-dialog";

const MAX_SUMMARY_LENGTH = 250;

const PublishBookPage = ({ storyData }: { storyData: WebStory | null }) => {
	const router = useRouter();
	const { userCanUseCredits } = useUserCanUseCredits();
	const { genre, id } = router.query;

	const [openCreditsDialog, setOpenCreditsDialog] = useState(false);
	const [openSubscriptionDialog, setOpenSubscriptionDialog] = useState(false);
	const [showFullDescription, setShowFullDescription] = useState(false);

	const [saving, setSaving] = useState(false);

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

	const User = useQuery<mainSchema["UserInfoDTOApiResponse"]>({
		queryFn: () => api.user.get(),
		staleTime: 3000,
		// eslint-disable-next-line @tanstack/query/exhaustive-deps -- pathname includes everything we need
		queryKey: [QueryKeys.USER],
	});

	const story = Webstory.data;

	const options = {
		publish: CreditSpendType.AmazonPublishing,
		publishPDF: CreditSpendType.AmazonPublishingPDFOnly,
	};

	const [selectedOption, setSelectedOption] = useState<CreditSpendType>(
		options.publishPDF
	);

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

	useEffect(() => {
		if (
			UserPurchase.data?.data?.[options.publishPDF] ||
			UserPurchase.data?.data?.[options.publish]
		) {
			router.push({
				pathname: `/story/${genre}/${id}/publish-book/form`,
			});
		}
	}, [UserPurchase]);

	const creditsCost = {
		[options.publishPDF]: 5000,
		[options.publish]: 10000,
	}[selectedOption];

	const handlePublishBook = async () => {
		setSaving(true);
		if (
			story &&
			(story.scenes?.flatMap((item) => item.storySegments)?.length ?? 0) < 8
		) {
			toast.error(
				"Your story is too short to be published. We require stories to have at least 8 pages."
			);
			setSaving(false);
			return;
		}
		const { error } = await userCanUseCredits({
			variant: "credits",
			credits: creditsCost,
			skipSubscriptionCheck: true,
		});

		if (error) {
			if (error === "using custom plan" || error === "not paid subscription") {
				setOpenSubscriptionDialog(true);
			} else if (error === "not enough credits") {
				setOpenCreditsDialog(true);
			}
			setSaving(false);
			return;
		}

		await api.user.amazonPayment({
			id: story?.id!,
			creditSpendType: selectedOption,
		});

		await router.push({
			pathname: `/story/${genre}/${id}/publish-book/form`,
		});
		await UserPurchase.refetch();
		await User.refetch();
		setSaving(false);
	};

	if (!story) {
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
														Routes.ViewStory(
															story?.storyType,
															router.query.genre!.toString(),
															router.query.id!.toString()
														)
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

												<p className="text-sm ml-1.5">
													{story.user && (
														<span>
															by {story.user.name} {story.user?.lastName || ""}
														</span>
													)}
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
									</div>

									<div className="relative w-full bg-white p-6 border-t-2 lg:border-t-0 lg:border-l-2">
										<div className="flex flex-col gap-2">
											<div
												key={options.publishPDF}
												className={`flex flex-col gap-2 p-4 rounded-md cursor-pointer
        ${
					selectedOption === options.publishPDF
						? "border-2 border-slate-600 bg-brand-light shadow-xl"
						: "border-2 border-light-gray opacity-80"
				}`}
												onClick={() => setSelectedOption(options.publishPDF)}
											>
												<div className="flex flex-col gap-1">
													<h3 className="font-semibold text-lg">
														Standard Edition: Self-Publish Kit
													</h3>
													<ul>
														<li className="tracking-wide leading-loose">
															<strong>Cost:</strong> $50 USD [5k credits]
														</li>
													</ul>
												</div>

												<ul className="flex flex-col gap-2">
													<div className="border-gold border-b-2 border-t-2 rounded-2xl p-2">
														<ul className="list-disc pl-5">
															<li className="tracking-wide leading-loose">
																Receive meticulously crafted,{" "}
																<strong>
																	Amazon-formatted book and cover PDFs
																</strong>
																of your book manuscript and cover page.
															</li>
															<li>
																Receive detailed{" "}
																<strong>steps for publishing your book</strong>{" "}
																on Amazon.
															</li>
															<li className="tracking-wide leading-loose">
																<strong>Ownership & Royalties:</strong> You will
																own the copyrights to your story and receive
																100% of the royalties from all sales.
															</li>
														</ul>
													</div>
												</ul>
											</div>

											<div
												key={options.publish}
												className={`flex flex-col gap-2 p-4 rounded-md cursor-pointer
        ${
					selectedOption === options.publish
						? "border-2 border-slate-600 bg-brand-light shadow-xl"
						: "border-2 border-light-gray opacity-80"
				}`}
												onClick={() => setSelectedOption(options.publish)}
											>
												<div className="flex flex-col gap-1">
													<h3 className="font-semibold text-lg">
														Premium Edition: Fully Managed Publish Package
													</h3>
													<ul>
														<li className="tracking-wide leading-loose">
															<strong>Cost:</strong> $100 USD [10k credits]
														</li>
													</ul>
												</div>

												<ul className="flex flex-col gap-2">
													<div className="border-gold border-b-2 border-t-2 rounded-2xl p-2">
														<ul className="list-disc pl-5">
															<li className="tracking-wide leading-loose">
																Includes everything from the{" "}
																<strong>
																	Standard Edition: Self-Publish Kit.
																</strong>
															</li>
															<li className="tracking-wide leading-loose">
																<strong>Hassle-Free Experience:</strong> We
																manage the entire publication and sales process
																for you, so you can get the royalties straight
																to your account.
															</li>
															<li className="tracking-wide leading-loose">
																<strong>Peace of Mind:</strong> Your story is in
																experienced hands, allowing you to focus on your
																next creative endeavor.
															</li>
														</ul>
													</div>
												</ul>
											</div>
											{/*<p className="tracking-wide leading-loose text-xs"><strong>Important Notice: </strong>U.S. Copyright law requires a human touch in AI-generated content for commercial use. After choosing your package, we ask users to edit personal their story, ensuring compliance and originality.</p>*/}
											<p className="tracking-wide leading-loose">
												Click &quot;Continue&quot; to proceed with your chosen
												package and share your story with the world!
											</p>
										</div>

										<div className="flex flex-row justify-end mt-4">
											<div className="flex flex-row-reverse items-center gap-5 flex-wrap max-sm:pb-10">
												{selectedOption === options.publishPDF &&
												UserPurchase.data?.data?.[options.publishPDF] ? (
													<Button
														variant="accent"
														onClick={handlePublishBook}
														className="w-full sm:w-max"
														disabled={saving}
													>
														{saving ? "Loading" : `Continue`}
													</Button>
												) : selectedOption === options.publish &&
												  UserPurchase.data?.data?.[options.publish] ? (
													<Button
														variant="accent"
														onClick={handlePublishBook}
														className="w-full sm:w-max"
														disabled={saving}
													>
														{saving ? "Loading" : `Continue`}
													</Button>
												) : (
													<Button
														variant="accent"
														onClick={handlePublishBook}
														className="w-full sm:w-max"
														disabled={saving}
													>
														{saving
															? "Loading"
															: `Continue ${creditsCost} credits`}
													</Button>
												)}

												{/*<Link*/}
												{/*	href={`/library/${category}/${slug}`}*/}
												{/*	className="btn-secondary mr-auto"*/}
												{/*>*/}
												{/*	Back*/}
												{/*</Link>*/}
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			<CheckoutDialog
				variant="credits"
				allowanceType={AllowanceType.Credits}
				defaultQuantity={creditsCost}
				open={openCreditsDialog}
				setOpen={setOpenCreditsDialog}
				skipSubscriptionCheck
			/>

			<UpgradeSubscriptionDialog
				open={openSubscriptionDialog}
				setOpen={setOpenSubscriptionDialog}
			/>
		</div>
	);
};

export default PublishBookPage;
