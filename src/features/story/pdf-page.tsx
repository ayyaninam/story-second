import { useRouter } from "next/router";
import React, { useState, useMemo } from "react";
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
import Link from "next/link";
import { mainSchema } from "@/api/schema";
import CheckoutDialog from "@/features/pricing/checkout-dialog";
import toast from "react-hot-toast";
import Routes from "@/routes";
import DownloadPDFButton from "@/features/story/components/download-pdf-button";
import { useUserCanUseCredits } from "@/utils/payment";
import UpgradeSubscriptionDialog from "@/features/pricing/upgrade-subscription-dialog";
import { useAuth } from "../auth-prompt/providers/AuthContext";

const MAX_SUMMARY_LENGTH = 250;

const StoryBookDownloadPdfPage = ({
	storyData,
}: {
	storyData: WebStory | null;
}) => {
	const router = useRouter();
	const { userCanUseCredits } = useUserCanUseCredits();
	const { genre, id } = router.query;

	const [openCreditsDialog, setOpenCreditsDialog] = useState(false);
	const [openSubscriptionDialog, setOpenSubscriptionDialog] = useState(false);
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

	const User = useAuth();
	const story = Webstory.data;
	const ownStory = story?.user?.id === User?.data?.data?.id;

	const [pdfType, setPdfType] = useState<PdfType>(PdfType.StoryBookPDF);

	const options = {
		downloadOriginalEBookPDF: CreditSpendType.OriginalEBookPDF,
		downloadOriginalStoryBookPDF: CreditSpendType.OriginalStoryBookPDF,
	};

	const legacyOptions = {
		downloadWatermarkedEBookPDF: CreditSpendType.WatermarkedEBookPDF,
		downloadWatermarkedStoryBookPDF: CreditSpendType.WatermarkedStoryBookPDF,
	};

	const itemType = useMemo(() => {
		if (pdfType === PdfType.EBookPDF) {
			return options.downloadOriginalEBookPDF;
		} else return options.downloadOriginalStoryBookPDF;
	}, [pdfType]);

	const legacyItemType = useMemo(() => {
		if (pdfType === PdfType.EBookPDF) {
			return legacyOptions.downloadWatermarkedEBookPDF;
		} else return legacyOptions.downloadWatermarkedStoryBookPDF;
	}, [pdfType]);

	const UserPurchase = useQuery<
		mainSchema["Int32BooleanDictionaryApiResponse"]
	>({
		queryFn: () =>
			api.user.getUserPurchase({
				id: story?.id!,
				creditSpendType: [
					...Object.values(options),
					...Object.values(legacyOptions),
				],
			}),
		staleTime: 0,
		// eslint-disable-next-line @tanstack/query/exhaustive-deps -- pathname includes everything we need
		queryKey: [QueryKeys.USER_PAYMENT, router.asPath],
		enabled: !!User?.data?.data?.id || !!story?.id,
	});

	const pdfCreditsCost = 2500;

	const handlePurchasePdf = async () => {
		const { error } = await userCanUseCredits({
			variant: "credits",
			credits: pdfCreditsCost,
			skipSubscriptionCheck: true,
		});

		if (error) {
			if (error === "using custom plan" || error === "not paid subscription") {
				setOpenSubscriptionDialog(true);
			}
			if (error === "not enough credits") {
				setOpenCreditsDialog(true);
			}

			return;
		}

		await api.user.pdfPayment({
			id: story?.id!,
			creditSpendType: itemType,
		});

		toast.success("Your purchase was successful!");
		await UserPurchase.refetch();
		await User.refetchUserData();
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
								<div className="w-full h-full border-[1px] flex flex-col lg:flex-row justify-stretch lg:min-w-[900px]">
									<div className="p-6 min-w-[300px] flex flex-col justify-between lg:max-w-sm bg-white">
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
										<div className={"mb-4"}>
											<h2 className="font-semibold text-lg mb-2">
												Select Book Format
											</h2>
											<div className="flex lg:flex-row flex-col sm:flex-col gap-2">
												<div
													key={PdfType.EBookPDF}
													className={`flex-1 flex flex-col gap-2 p-4 rounded-md cursor-pointer
                                ${
																	pdfType === PdfType.EBookPDF
																		? "border-2 border-slate-600 bg-brand-light shadow-xl"
																		: "border-2 border-light-gray opacity-80"
																}`}
													onClick={() => setPdfType(PdfType.EBookPDF)}
												>
													<div className={"flex flex-col align-top"}>
														<div className={"mb-2 text-center"}>
															<h3 className="font-semibold text-lg">
																EBook Format: Best for mobiles!
															</h3>
															<Button
																variant="link"
																className="text-sm text-accent-600 hover:text-accent-700 transition-none"
																asChild
															>
																<Link
																	href="https://storybird-public.s3.us-west-2.amazonaws.com/sample-pdfs/EBook-Sample.pdf"
																	target="_blank"
																>
																	View Sample
																</Link>
															</Button>
														</div>
														<div className="border-2 border-black">
															<Image
																alt="Story Cover"
																src="/pdfs/samples/EBook.webp"
																width={512}
																height={512}
															/>
														</div>
													</div>
												</div>

												<div
													key={PdfType.StoryBookPDF}
													className={`flex-1 flex flex-col gap-2 p-4 rounded-md cursor-pointer
                                ${
																	pdfType === PdfType.StoryBookPDF
																		? "border-2 border-slate-600 bg-brand-light shadow-xl"
																		: "border-2 border-light-gray opacity-80"
																}`}
													onClick={() => setPdfType(PdfType.StoryBookPDF)}
												>
													<div className={"flex flex-col align-top"}>
														<div className={"mb-2 text-center"}>
															<h3 className="font-semibold text-lg">
																Story Book: Best for printing!
															</h3>
															<Button
																variant="link"
																className="text-sm text-accent-600 hover:text-accent-700 transition-none"
																asChild
															>
																<Link
																	href="https://storybird-public.s3.us-west-2.amazonaws.com/sample-pdfs/StoryBook-Sample.pdf"
																	target="_blank"
																>
																	View Sample
																</Link>
															</Button>
														</div>
														<div className="border-2 border-black">
															<Image
																alt="Story Cover"
																src="/pdfs/samples/StoryBook.webp"
																width={512}
																height={512}
															/>
														</div>
													</div>
												</div>
											</div>
										</div>
										<div>
											<div className="flex lg:flex-row flex-col gap-2">
												<div
													className={`flex-1 flex flex-col gap-2 p-4 rounded-md`}
												>
													<div className="flex flex-col gap-1">
														<h3 className="font-semibold text-lg">
															Printable Edition: Grab Your Personal Copy!
														</h3>
														<ul>
															<li className="tracking-wide leading-loose">
																<strong>Cost:</strong> ${pdfCreditsCost / 100}{" "}
																USD [{pdfCreditsCost} Credits]
															</li>
														</ul>
													</div>

													<ul className="flex flex-col gap-2">
														<div className="border-gold border-b-2 border-t-2 rounded-2xl p-2">
															<ul className="list-disc pl-5 text-sm">
																<li className="tracking-wide leading-loose">
																	Receive a{" "}
																	<strong>high-quality, print-ready PDF</strong>{" "}
																	of your story, formatted for any device.
																</li>
																<li className="tracking-wide leading-loose">
																	<strong>You obtain the copyrights</strong> and
																	have the commercial rights to the story.
																</li>
																<li className="tracking-wide leading-loose">
																	Optimized for printing and publication.
																</li>
															</ul>
														</div>
													</ul>
												</div>
											</div>
										</div>
										<p className="tracking-wide leading-loose font-semibold text-sm">
											Note: This is NOT an accepted format for publishing on
											Amazon.
										</p>
										<p className="tracking-wide leading-loose">
											Click &quot;Continue&quot; to download your PDF. Enjoy{" "}
											{ownStory ? "your" : "this"} story anytime, anywhere!
										</p>

										<div className="flex flex-row justify-end mt-4">
											{(UserPurchase?.data?.data?.[itemType] ||
												UserPurchase?.data?.data?.[legacyItemType]) &&
											storyData ? (
												<DownloadPDFButton
													variant={
														pdfType === PdfType.EBookPDF
															? "ebook"
															: "storybook-rpi"
													}
													storyData={storyData}
												/>
											) : (
												<Button variant="accent" onClick={handlePurchasePdf}>
													Continue [{pdfCreditsCost} credits]
												</Button>
											)}
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
				defaultQuantity={pdfCreditsCost}
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

export default StoryBookDownloadPdfPage;
