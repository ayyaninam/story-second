import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { AvatarImage } from "@radix-ui/react-avatar";
import FeedIcon from "@/components/icons/side-nav/FeedIcon";
import GenerateIcon from "@/components/icons/side-nav/GenerateIcon";
import LibraryIcon from "@/components/icons/side-nav/LibraryIcon";
import { CircleUserRoundIcon, Command } from "lucide-react";
import Link from "next/link";
import RightPlay from "@/components/icons/right-play";
import Format from "@/utils/format";
import StoryLogoFullWhite from "@/components/brand-logos/primary-white";
import UpgradeSubscriptionDialog from "@/features/pricing/upgrade-subscription-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useState } from "react";
import { SubscriptionConstants } from "@/constants/subscription-constants";
import { mainSchema } from "@/api/schema";
import { calculateDaysBetweenDates } from "@/utils/daytime";
import useEventLogger from "@/utils/analytics";
import { useRouter } from "next/router";
import { useAuth } from "@/features/auth-prompt/providers/AuthContext";
import { useSearchParams } from "next/navigation";

// # TODO: dynamically use --color-accent-500 for hoverBackground
export const menuItems = [
	{
		icon: <FeedIcon size={24} />,
		text: "Feed",
		shortcut: "E",
		redirectUrl: "/feed/all",
		cssVars: {
			"--hover-border-color": "rgba(122,255,180,0.1)",
			"--hover-background":
				"radial-gradient(70% 100% at 0% 50%, rgba(102, 129, 255, 0.50) 37.5%, rgba(102, 129, 255, 0.00) 100%)",
		},
	},
	{
		icon: <GenerateIcon />,
		text: "Generate",
		shortcut: "G",
		redirectUrl: "/generate",
		cssVars: {
			"--hover-border-color": "rgba(206, 122, 255, 0.2)",
			"--hover-background":
				"radial-gradient(70% 100% at 0% 50%, rgba(187, 85, 247, 0.5) 37.5%, rgba(102, 129, 255, 0.00) 100%)",
		},
	},
	{
		icon: <LibraryIcon size={24} />,
		text: "My Library",
		shortcut: "L",
		redirectUrl: "/library/all",
		cssVars: {
			"--hover-border-color": "rgba(122, 255, 180, 0.2)",
			"--hover-background":
				"radial-gradient(70% 100% at 0% 50%, rgba(48, 149, 136, 0.50) 37.5%, rgba(102, 129, 255, 0.00) 100%)",
		},
	},
	{
		icon: <CircleUserRoundIcon size={24} />,
		text: "Account",
		shortcut: "S",
		redirectUrl: "/account",
		cssVars: {
			"--hover-border-color": "rgba(148, 171, 184, 0.50)",
			"--hover-background":
				"radial-gradient(70% 100% at 0% 50%, rgba(72, 94, 106, 0.50) 37.5%, rgba(102, 129, 255, 0.00) 100%)",
		},
	},
];

export default function SideNav({ pageIndex }: { pageIndex: number }) {
	const selectedStyle = {
		border: "0.5px solid rgba(255, 255, 255, 0.08)",
		background:
			"linear-gradient(180deg, rgba(255, 255, 255, 0.22) 0%, rgba(255, 255, 255, 0.00) 100%)",
		boxShadow: "0px -0.8px 9.6px 0px rgba(255, 255, 255, 0.12) inset",
	};

	const loginStyle = {
		border: "0.5px solid rgba(255, 255, 255, 0.08)",
		background:
			"linear-gradient(0deg, rgba(0, 255, 0, 0.22) 0%, rgba(255, 255, 255, 0.00) 100%)",
		boxShadow: "0px -0.8px 9.6px 0px rgba(255, 255, 255, 0.12) inset",
	};

	const logoutStyle = {
		border: "0.5px solid rgba(255, 255, 255, 0.08)",
		background:
			"linear-gradient(0deg, rgba(255, 0, 0, 0.22) 0%, rgba(255, 255, 255, 0.00) 100%)",
		boxShadow: "0px -0.8px 9.6px 0px rgba(255, 255, 255, 0.12) inset",
	};

	const userHandlerStyle = {
		borderRadius: "2px",
		border: "0.5px solid rgba(255, 255, 255, 0.12)",
		background:
			"linear-gradient(180deg, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0.00) 100%)",
		boxShadow: "0px -0.8px 9.6px 0px rgba(255, 255, 255, 0.12) inset",
	};

	const router = useRouter();
	const searchParams = useSearchParams();
	const eventLogger = useEventLogger();
	const openUpgradeSubscriptionQueryParam = searchParams?.get(
		"openUpgradeSubscription"
	);

	const { data, isUserLoading } = useAuth();

	const [userName, setUserName] = useState("Story.com");
	const [subscriptionDetails, setSubscriptionDetails] = useState<
		mainSchema["UserSubscriptionDTO"] | null
	>(null);

	useEffect(() => {
		setUserName(
			data?.data?.name?.split(" ")[0] +
				" " +
				(data?.data?.lastName ? data?.data?.lastName : "") ||
				"" ||
				"Story.com"
		);
		setSubscriptionDetails(data?.data?.subscription || null);
	}, [data]);

	const [openUpgradeSubscription, setOpenUpgradeSubscription] = useState(false);

	useEffect(() => {
		if (openUpgradeSubscriptionQueryParam) {
			setTimeout(() => {
				setOpenUpgradeSubscription(true);
			}, 2000);
		}
	}, [openUpgradeSubscriptionQueryParam]);

	return (
		<div className="hidden w-[18rem] lg:flex lg:flex-col lg:justify-between">
			<div>
				<div className="ml-3.5 flex mt-5 mb-6 items-center flex-row gap-4 mr-4">
					{!isUserLoading && data?.data ? (
						<>
							<Avatar className="h-8 w-8 border-[1px] border-gray-200">
								<AvatarImage
									src={
										data?.data?.profilePicture
											? Format.GetImageUrl(data?.data?.profilePicture)
											: ""
									}
								/>
								<AvatarFallback>
									{Format.AvatarName(
										data?.data?.name?.split(" ")[0] || "S",
										data?.data?.lastName || ""
									)}
								</AvatarFallback>
							</Avatar>
							{/*# TODO: enable profile pages when ready*/}
							<Link
								// href={"/account"}
								href={"/" + data?.data?.profileName!}
							>
								<span className="flex flex-col text-white gap-y-1">
									<span>{userName}</span>
									<span
										className="flex gap-x-2 items-center text-sm text-white p-0.25 px-2"
										style={userHandlerStyle}
									>
										<RightPlay size={6} />
										<span>
											{(data?.data?.profileName?.length || 0) > 7
												? "/" + data?.data?.profileName
												: "story.com/" + data?.data?.profileName}
										</span>
									</span>
								</span>
							</Link>
						</>
					) : (
						<>
							<Skeleton className="h-8 w-8 rounded-full" />
							<Link
								href={"/auth/login?returnTo=" + router.asPath}
								className={"flex flex-col gap-y-1"}
							>
								<Button
									variant="outline"
									className="text-white font-normal hover:text-accent-300"
									style={userHandlerStyle}
								>
									Get Started
								</Button>
							</Link>
						</>
					)}
				</div>
				<div className="space-y-1">
					{menuItems.map((menuItem, index) => (
						<Link
							href={menuItem.redirectUrl}
							as={menuItem.redirectUrl}
							key={index}
							aria-selected={index === pageIndex}
							className="ml-1 pl-3.5 flex gap-2 py-2 pr-4 items-center text-white cursor-pointer menuItem "
							style={{
								...(menuItem.cssVars as React.CSSProperties),
							}}
						>
							{menuItem.icon}
							{menuItem.text}
							{/*<div className="flex gap-2 flex-grow justify-end items-center opacity-65">*/}
							{/*	<Command*/}
							{/*		className="h-5 w-5 p-0.5"*/}
							{/*		style={{*/}
							{/*			borderRadius: "4px",*/}
							{/*			border: "1px solid rgba(255, 255, 255, 0.05)",*/}
							{/*			background: "rgba(255, 255, 255, 0.05)",*/}
							{/*		}}*/}
							{/*	/>*/}
							{/*	<span*/}
							{/*		className="flex h-5 w-5 text-sm text-white items-center justify-center"*/}
							{/*		style={{*/}
							{/*			borderRadius: "4px",*/}
							{/*			border: "1px solid rgba(255, 255, 255, 0.05)",*/}
							{/*			background: "rgba(255, 255, 255, 0.05)",*/}
							{/*		}}*/}
							{/*	>*/}
							{/*		{menuItem.shortcut}*/}
							{/*	</span>*/}
							{/*</div>*/}
						</Link>
					))}
				</div>
			</div>
			<div className="w-full flex-col px-1.5 my-6 items-center text-accent-100">
				<div className="mb-4 mx-3">
					<Link href={"/feed/all"}>
						<StoryLogoFullWhite />
					</Link>
				</div>
				<div className="my-2 mx-3 space-y-2">
					{subscriptionDetails !== null &&
						subscriptionDetails !== undefined && (
							<>
								{/*<p className="font-medium text-sm">{SubscriptionConstants[subscriptionDetails.subscriptionPlan as number].name} Plan</p>*/}
								<p className="font-medium text-sm">
									{SubscriptionConstants[subscriptionDetails.subscriptionPlan]
										?.name || "Custom"}{" "}
									Plan
								</p>

								<div className="grid grid-cols-2 gap-1 text-sm pr-4">
									<div className="flex gap-x-2 items-center">
										<span
											className="p-1.5 rounded-sm"
											style={{
												background: "rgba(255, 255, 255, 0.05)",
												boxShadow:
													"0px 0px 0px 1px rgba(255, 255, 255, 0.06) inset",
											}}
										>
											{`${subscriptionDetails.videoGenerations}/${SubscriptionConstants[subscriptionDetails.subscriptionPlan]?.videos || 0}`}
										</span>
										<span>Videos</span>
									</div>
									<div className="flex gap-x-2 items-center">
										<span
											className="p-1.5 rounded-sm"
											style={{
												background: "rgba(255, 255, 255, 0.05)",
												boxShadow:
													"0px 0px 0px 1px rgba(255, 255, 255, 0.06) inset",
											}}
										>
											{`${subscriptionDetails.storyGenerations}/${SubscriptionConstants[subscriptionDetails.subscriptionPlan]?.stories || 0}`}
										</span>
										<span>Storybooks</span>
									</div>
									<div className="flex gap-x-2 items-center">
										<span
											className="p-1.5 rounded-sm"
											style={{
												background: "rgba(255, 255, 255, 0.05)",
												boxShadow:
													"0px 0px 0px 1px rgba(255, 255, 255, 0.06) inset",
											}}
										>
											{subscriptionDetails.credits || 0}
										</span>
										<span>Credits</span>
									</div>
									<div className="flex gap-x-2 items-center text-nowrap">
										<span
											className="p-1.5 rounded-sm"
											style={{
												background: "rgba(255, 255, 255, 0.05)",
												boxShadow:
													"0px 0px 0px 1px rgba(255, 255, 255, 0.06) inset",
											}}
										>
											{/*convert subscriptionDetails.endDate to days left*/}
											{calculateDaysBetweenDates(
												new Date().toString(),
												new Date(
													subscriptionDetails.nextRefreshDate || Date()
												).toString()
											)}
											d
										</span>
										<span>Until Reset</span>
									</div>
								</div>
							</>
						)}

					<div className="flex gap-x-2.5 items-center">
						{/*# TODO: enable if plans have turbo mode*/}
						{/*<Switch*/}
						{/*	style={{*/}
						{/*		border: "1px solid #50071D",*/}
						{/*		color: "#FF3370",*/}
						{/*		backgroundColor: "#50071D",*/}
						{/*		boxShadow: "0px 0px 0px 1px rgba(255, 255, 255, 0.06) inset",*/}
						{/*	}}*/}
						{/*/>*/}
						{/*<p className="text-xs">Generate In Turbo Mode</p>*/}
					</div>
				</div>
				{/*<div className="flex flex-col items-center justify-center text-white text-center pb-8">*/}
				{/*	<Link*/}
				{/*		href="https://www.producthunt.com/posts/story-com?utm_source=badge-featured&utm_medium=badge&utm_souce=badge-story&#0045;com"*/}
				{/*		target="_blank"*/}
				{/*		className="w-full items-center"*/}
				{/*	>*/}
				{/*		<img*/}
				{/*			src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=444214&theme=neutral"*/}
				{/*			alt="Story&#0046;com - Storytelling&#0032;meets&#0032;AI | Product Hunt"*/}
				{/*			className="w-full items-center"*/}
				{/*		/>*/}
				{/*	</Link>*/}
				{/*</div>*/}
				<UpgradeSubscriptionDialog
					open={openUpgradeSubscription}
					setOpen={(open) => setOpenUpgradeSubscription(open)}
				>
					<Button
						variant="outline"
						className="min-w-full rounded-lg py-1.5 text-white font-normal hover:text-accent-300"
						style={selectedStyle}
						onClick={() =>
							eventLogger("upgrade_subscription_clicked", {
								sourceUrl: router.asPath,
							})
						}
					>
						Upgrade Subscription
					</Button>
				</UpgradeSubscriptionDialog>
				{data?.data ? (
					<Link href={"/auth/logout"}>
						<Button
							variant="outline"
							className="min-w-full mt-2 rounded-lg py-1.5 text-white font-normal hover:text-pink-700"
							style={logoutStyle}
							onClick={() => eventLogger("logout_clicked")}
						>
							Logout
						</Button>
					</Link>
				) : (
					<Link href={"/auth/login?returnTo=" + router.asPath}>
						<Button
							variant="outline"
							className="min-w-full mt-2 rounded-lg py-1.5 text-white font-normal hover:text-accent-300"
							style={loginStyle}
							onClick={() => eventLogger("login_clicked")}
						>
							Login
						</Button>
					</Link>
				)}
				<div className="flex items-center justify-between text-white text-center">
					<div></div>
					<Link
						href={"/faqs"}
						className="mt-2 text-white text-sm font-normal hover:text-accent-300 underline-offset-4 underline"
					>
						FAQs
					</Link>
					<div></div>
					<Button
						variant="link"
						onClick={() => {
							// @ts-ignore - Intercom is vanilla JS
							Intercom("show");
						}}
						className="mt-2 text-white text-sm font-normal hover:text-accent-300 underline"
					>
						Contact Us
					</Button>
					<div></div>
				</div>
			</div>
		</div>
	);
}
