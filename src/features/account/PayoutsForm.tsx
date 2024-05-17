import RoyaltiesPayoutModal from "@/features/account/components/royalties-payout-modal";
import RoyaltiesPerBookTable from "@/features/account/components/royalties-per-book-table";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Link from "next/link";
import { useMutation, useQuery } from "@tanstack/react-query";
import { QueryKeys } from "@/lib/queryKeys";
import api from "@/api";
import CreatePayoutsAccountModal from "@/features/account/components/create-payouts-account-modal";
import { useAuth } from "../auth-prompt/providers/AuthContext";

export enum checkStripeAccountEnum {
	DoesNotExist,
	OnboardingIncomplete,
	Onboarded,
}

export enum kycStatus {
	PendingVerification,
	Rejected,
	Completed,
}

const Payouts = () => {
	const [qParams, setQParams] = useState({
		CurrentPage: 1,
		PageSize: 10,
	});
	const router = useRouter();
	const { success } = router.query;

	const { data: user } = useAuth();
	const { data: bookRevenues, isLoading } = useQuery({
		queryKey: [QueryKeys.BOOK_REVENUE, qParams],
		queryFn: () => {
			return api.user.getAllAmazonBooksRevenue(qParams);
		},
	});

	const { data: stripeSetupLink } = useQuery<any>({
		queryKey: [QueryKeys.STRIPE_ACCOUNT_SETUP_LINK],
		queryFn: () => {
			return api.user.stripeAccountSetupLink();
		},
		retry: false,
	});
	const { data: stripeAccountStatus } = useQuery({
		queryKey: [QueryKeys.STRIPE_CONNECT_ACCOUNT],
		queryFn: () => api.user.checkStripeConnectAccount(),
		retry: false,
	});
	const { data: stripeAccountLink } = useQuery<any>({
		queryKey: [QueryKeys.STRIPE_ACCOUNT_LINK],
		queryFn: () => api.user.getStripeAccountLink(),
		retry: false,
	});
	const withdrawFunds = useMutation({
		mutationFn: api.user.withdrawFunds,
		retry: false,
	});

	const revenueExists =
		(bookRevenues?.items && bookRevenues.items.length > 0) || false;

	const canWithdraw =
		user?.data?.kycVerified === kycStatus.Completed &&
		stripeAccountStatus?.stripeConnectAccountStatus ===
			checkStripeAccountEnum.Onboarded &&
		user?.data?.totalUnclaimedRoyalties! > 0;

	function renderActionButton() {
		switch (stripeAccountStatus?.stripeConnectAccountStatus) {
			case checkStripeAccountEnum.DoesNotExist:
				return <CreatePayoutsAccountModal />;
			case checkStripeAccountEnum.OnboardingIncomplete:
				return (
					<a href={stripeSetupLink?.url} className="btn btn-primary">
						Continue Setup
					</a>
				);
			case checkStripeAccountEnum.Onboarded:
				return (
					<Link
						target="_blank"
						href={stripeAccountLink.url || "#"}
						className="text-blue-600 hover:text-blue-800 underline transition duration-300"
					>
						Stripe Dashboard
					</Link>
				);
			default:
				return null;
		}
	}

	useEffect(() => {
		if (success) {
			toast.dismiss();
			toast.success(
				"Thank you for completing all the steps! We will verify your details shortly and then you can start receiving payments.",
				{ duration: 12000 }
			);
			router.replace(router.pathname).then();
		}
	}, [success, router]);

	const totalRoyaltyAvailable = user?.data?.totalUnclaimedRoyalties!.toFixed(2);

	return (
		<>
			<div className="sm:container mx-auto">
				<header className="flex flex-col lg:items-end lg:flex-row sm:gap-4">
					<h1 className="text-xl sm:text-3xl font-aleo font-semibold self-center">
						Payouts
					</h1>
					<div className="flex flex-col items-start lg:items-center gap-2 lg:gap-6 lg:flex-row lg:ml-auto border-gold border-5 py-4 px-16 rounded-lg">
						<div className="text-center w-full">
							<span className="block text-sm font-medium tracking-wide text-center">
								Total Royalty Available
							</span>
							<span className="block text-3xl sm:text-5xl font-semibold">
								{totalRoyaltyAvailable ? `$${totalRoyaltyAvailable}` : ""}
							</span>
						</div>
						{canWithdraw ? (
							<div className="w-full flex justify-center">
								<RoyaltiesPayoutModal
									canWithdraw={canWithdraw}
									withdrawFunds={withdrawFunds}
								/>
							</div>
						) : null}
					</div>
				</header>

				<div
					className="w-full h-1 bg-primary-500 sm:my-4 rounded"
					role="separator"
				/>

				<div className="sm:container mx-auto  border-5 border-gold rounded-2xl sm:p-4">
					{user?.data?.totalProcessingRoyalties! > 0 && (
						<div className="flex flex-col gap-4 sm:p-4">
							<h1 className="text-xl font-semibold">Processing Royalties</h1>
							<p className="text-md text-success-500">
								Your royalties of ${user?.data?.totalProcessingRoyalties} are
								currently being processed. Please allow 5-7 business days for
								the funds to be deposited into your bank account.
							</p>
						</div>
					)}
					{!isLoading &&
						(revenueExists ? (
							<>
								{(stripeAccountStatus?.stripeConnectAccountStatus ===
									checkStripeAccountEnum.DoesNotExist ||
									stripeAccountStatus?.stripeConnectAccountStatus ===
										checkStripeAccountEnum.OnboardingIncomplete) && (
									<div className="flex flex-col gap-4 sm:p-4">
										<h1 className="text-xl font-semibold">
											StoryBird.ai Payout Account Onboarding
										</h1>

										<p className="text-md">
											Congratulations! 🎉 You&apos;ve successfully made sales
											from your books on Amazon! This is a fantastic
											achievement, and it&apos;s just the beginning of your
											journey as an author. To access and withdraw your
											hard-earned funds, please follow the steps outlined below.
										</p>

										<div>
											<h2 className="text-lg font-medium">
												Step 1: Create Stripe Account
											</h2>
											<p className="text-md">
												Start by creating and linking your Stripe account to
												StoryBird. This is essential for receiving payouts from
												your Amazon book sales.
											</p>
										</div>

										<div>
											<h2 className="text-lg font-medium">
												Step 2: KYC Verification
											</h2>
											<p className="text-md">
												Next, complete the Know Your Customer (KYC) verification
												process. This step is crucial for security and may take
												5-7 business days for verification.
											</p>
										</div>

										<div>
											<h2 className="text-lg font-medium">
												Step 3: Withdraw Earnings
											</h2>
											<p className="text-md">
												After KYC approval, you can easily withdraw your
												earnings. These funds will be transferred to the bank
												account you&apos;ve registered with Stripe.
											</p>
										</div>
									</div>
								)}

								{stripeAccountStatus?.stripeConnectAccountStatus ===
									checkStripeAccountEnum.Onboarded && (
									<>
										{user?.data?.kycVerified === null ? (
											<div className="flex flex-col gap-4 sm:p-4 text-warning-500">
												<p className="text-md">
													You have not completed the KYC verification process
													yet. Please complete the{" "}
													<Link
														href="/account?step=updateKYC"
														className="text-blue-600 hover:text-blue-800 underline transition duration-300"
													>
														KYC verification form
													</Link>{" "}
													to start receiving your payments.
												</p>
											</div>
										) : user?.data?.kycVerified ===
										  kycStatus.PendingVerification ? (
											<div className="flex flex-col gap-4 sm:p-4 text-success-700">
												<p className="text-md">
													Great job on completing the setup! Your details are
													now being reviewed for verification. Once verified,
													you&apos;ll be all set to receive your payments!
												</p>
											</div>
										) : user?.data?.kycVerified === kycStatus.Rejected ? (
											<div className="flex flex-col gap-4 sm:p-4 text-error-400">
												<p className="text-md">
													We were unable to verify your KYC. Please re-submit
													your details for verification by submitting the form{" "}
													<Link
														href="/account?step=updateKYC"
														className="text-blue-600 hover:text-blue-800 underline transition duration-300"
													>
														here
													</Link>
													.
												</p>
											</div>
										) : null}
										<div className="flex flex-col gap-4 sm:p-4">
											<p className="text-md">
												Need to update your payout account details? Visit your
												Stripe Dashboard to make changes to your Stripe or bank
												account information.
											</p>
										</div>
									</>
								)}
								{stripeAccountStatus?.stripeConnectAccountStatus ===
									checkStripeAccountEnum.OnboardingIncomplete && (
									<div className="flex flex-col gap-4 sm:p-4">
										<p className="text-md font-semibold">
											You&apos;re almost there! To complete your onboarding and
											start receiving your payouts, just a few more steps are
											needed. Click the button below to seamlessly continue the
											process on Stripe and unlock your earnings.
										</p>
									</div>
								)}

								<div className="flex justify-center mt-4">
									{renderActionButton()}
								</div>

								<hr className="my-8 border-gray-300" />

								<RoyaltiesPerBookTable data={bookRevenues} />

								<hr className="my-8 border-gray-300" />

								<div className="flex justify-between items-center sm:p-4 bg-gray-100 mt-4">
									<h2 className="text-lg font-medium">
										Total Royalties Earned Till Date
									</h2>
									<span className="text-lg font-semibold">
										$
										{bookRevenues?.items
											.reduce((sum, payout) => sum + payout.lifetimeRoyalty!, 0)
											.toFixed(2)}
									</span>
								</div>
							</>
						) : (
							<div className="flex flex-col gap-4 sm:p-4">
								<h1 className="text-xl font-semibold">Amazon Sales Revenue</h1>
								<p className="text-md">
									It looks like you don&apos;t have any recorded revenue from
									book sales yet. Don&apos;t worry, this is normal for new or
									recent publications. Our sales records are updated monthly. If
									you&apos;ve made sales in the past month, you can expect to
									see your earnings reflected here in the following month.
								</p>
								<p className="text-md">
									If you&apos;ve recently published or sold books, please check
									back after our next monthly update for your revenue details.
									We&apos;re excited to see your work succeed!
								</p>
								<p className="text-md mt-4">
									Haven&apos;t published your stories yet? Ready to share your
									unique AI-assisted tales with the world? 🌟 Take the first
									step towards becoming an author by{" "}
									<Link
										href="/account"
										className="text-blue-600 hover:text-blue-800 underline transition duration-300"
									>
										visiting your dashboard
									</Link>
									. Start your hassle-free publishing journey today and unlock
									the potential of your creative work!
								</p>
							</div>
						))}
				</div>
			</div>
		</>
	);
};

export default Payouts;
