import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { AvatarImage } from "@radix-ui/react-avatar";
import ExploreIcon from "@/components/icons/side-nav/ExploreIcon";
import GenerateIcon from "@/components/icons/side-nav/GenerateIcon";
import LibraryIcon from "@/components/icons/side-nav/LibraryIcon";
import FreeCreditsIcon from "@/components/icons/side-nav/FreeCreditsIcon";
import ChallengesIcon from "@/components/icons/side-nav/ChallengesIcon";
import {CircleUserRoundIcon, Command} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import Link from "next/link";
import { useUser } from "@auth0/nextjs-auth0/client";
import RightPlay from "@/components/icons/right-play";
import Format from "@/utils/format";
import {getSession} from "@auth0/nextjs-auth0";
import api from "@/api";
import StoryLogoFullWhite from "@/components/brand-logos/primary-white";
import UpgradeSubscriptionDialog from "@/features/pricing/upgrade-subscription-dialog";

// # TODO: dynamically use --color-accent-500 for hoverBackground
export const menuItems = [
	{
		icon: <ExploreIcon />,
		text: "Explore",
		shortcut: "E",
		redirectUrl: "/explore",
		cssVars: {
			"--hover-border-color": "rgba(122,255,180,0.1)",
			"--hover-background": "radial-gradient(70% 100% at 0% 50%, rgba(102, 129, 255, 0.50) 37.5%, rgba(102, 129, 255, 0.00) 100%)",
		},
	},
	{
		icon: <GenerateIcon />,
		text: "Generate",
		shortcut: "G",
		redirectUrl: "/generate",
		cssVars: {
			"--hover-border-color": "rgba(206, 122, 255, 0.2)",
			"--hover-background": "radial-gradient(70% 100% at 0% 50%, rgba(187, 85, 247, 0.5) 37.5%, rgba(102, 129, 255, 0.00) 100%)",
		}
	},
	{
		icon: <LibraryIcon />,
		text: "Library",
		shortcut: "L",
		redirectUrl: "/library",
		cssVars: {
			"--hover-border-color": "rgba(122, 255, 180, 0.2)",
			"--hover-background": "radial-gradient(70% 100% at 0% 50%, rgba(48, 149, 136, 0.50) 37.5%, rgba(102, 129, 255, 0.00) 100%)",
		}
	},
	{
		icon: <ChallengesIcon />,
		text: "Challenges",
		shortcut: "C",
		redirectUrl: "/challenges",
		cssVars: {
			"--hover-border-color": "rgba(152, 230, 55, 0.50)",
			"--hover-background": "radial-gradient(70% 100% at 0% 50%, rgba(119, 177, 46, 0.50) 37.5%, rgba(102, 129, 255, 0.00) 100%)",
		}
	},
	// {
	// 	icon: <FreeCreditsIcon />,
	// 	text: "Free Credits",
	// 	shortcut: "F",
	// 	redirectUrl: "/credits",
	// 	cssVars: {
	// 		"--hover-border-color": "rgba(148, 171, 184, 0.50)",
	// 		"--hover-background": "radial-gradient(70% 100% at 0% 50%, rgba(72, 94, 106, 0.50) 37.5%, rgba(102, 129, 255, 0.00) 100%)",
	// 	}
	// },
	{
		icon: <CircleUserRoundIcon />,
		text: "Account",
		shortcut: "S",
		redirectUrl: "/account",
		cssVars: {
			"--hover-border-color": "rgba(148, 171, 184, 0.50)",
			"--hover-background": "radial-gradient(70% 100% at 0% 50%, rgba(72, 94, 106, 0.50) 37.5%, rgba(102, 129, 255, 0.00) 100%)",
		}
	}
];

export default function SideNav({ pageIndex, userDetails }: { pageIndex: number; userDetails?: any }) {
	const selectedStyle = {
		border: "0.5px solid rgba(255, 255, 255, 0.08)",
		background: "linear-gradient(180deg, rgba(255, 255, 255, 0.22) 0%, rgba(255, 255, 255, 0.00) 100%)",
		boxShadow: "0px -0.8px 9.6px 0px rgba(255, 255, 255, 0.12) inset",
	};

	const userHandlerStyle = {
		borderRadius: "2px",
		border: "0.5px solid rgba(255, 255, 255, 0.12)",
		background: "linear-gradient(180deg, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0.00) 100%)",
		boxShadow: "0px -0.8px 9.6px 0px rgba(255, 255, 255, 0.12) inset"
	}

	const { user, isLoading } = useUser();

	return (
		<div className="hidden w-[18rem] lg:flex lg:flex-col lg:justify-between">
			<div>
				<div className="ml-3.5 flex mt-5 mb-6 items-center flex-row gap-4 mr-4">
					{!isLoading && (
						<>
							<Avatar className="h-8 w-8 border-[1px] border-gray-200">
								<AvatarImage src={user?.picture || ""} />
								<AvatarFallback>
									 {Format.AvatarName(user?.name?.split(" ")[0] || "S", user?.name?.split(" ")[1])}
								</AvatarFallback>
							</Avatar>
								{/*// # TODO: enable profile pages when ready*/}
								{/*// # TODO: replace with userDetails*/}
							<Link
								href={"#"}
								// href={"/" + user?.nickname || ""}
							>
								<span className="flex flex-col text-white gap-y-1">
									<span>{user?.name || "Story.com"}</span>
									<span
										className="flex gap-x-2 items-center text-sm text-white p-0.25 px-2"
										style={userHandlerStyle}
									>
										<RightPlay size={6} />
										<span>{(user?.nickname?.length || 0) > 7 ? "/"+user?.nickname : "story.com/"+user?.nickname}</span>
									</span>
								</span>
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
							className="ml-1 pl-3.5 flex gap-2 py-2 pr-4 items-center text-white cursor-pointer menuItem"
							style={{ ...menuItem.cssVars as React.CSSProperties}}
						>
							{menuItem.icon}
							{menuItem.text}
							<div
								className="flex gap-2 flex-grow justify-end items-center opacity-65">
								<Command
									className="h-5 w-5 p-0.5"
									style={{
										borderRadius: "4px",
										border: "1px solid rgba(255, 255, 255, 0.05)",
										background: "rgba(255, 255, 255, 0.05)",
									}}
								/>
								<span
									className="flex h-5 w-5 text-sm text-white items-center justify-center"
									style={{
										borderRadius: "4px",
										border: "1px solid rgba(255, 255, 255, 0.05)",
										background: "rgba(255, 255, 255, 0.05)",
									}}
								>
									{menuItem.shortcut}
								</span>
							</div>
						</Link>
					))}
				</div>
			</div>
			<div className="w-full flex-col px-1.5 my-6 items-center text-accent-600">
				<div className="mb-4 mx-3">
					<Link
						href={"/explore"}
					>
						<StoryLogoFullWhite />
					</Link>
				</div>
				<div className="my-2 mx-3 space-y-2">
					<p className="font-medium text-sm">Base Plan</p>

					<div className="grid grid-cols-2 gap-1 text-sm pr-4">
						<div className="flex gap-x-2 items-center">
							<span
								className="p-1.5 rounded-sm"
								style={{
									background: "rgba(255, 255, 255, 0.05)",
									boxShadow: "0px 0px 0px 1px rgba(255, 255, 255, 0.06) inset",
								}}
							>
								1/1
							</span>
							<span>Videos</span>
						</div>
						<div className="flex gap-x-2 items-center">
							<span
								className="p-1.5 rounded-sm"
								style={{
									background: "rgba(255, 255, 255, 0.05)",
									boxShadow: "0px 0px 0px 1px rgba(255, 255, 255, 0.06) inset",
								}}
							>
								0/5
							</span>
							<span>Storybooks</span>
						</div>
						<div className="flex gap-x-2 items-center">
							<span
								className="p-1.5 rounded-sm"
								style={{
									background: "rgba(255, 255, 255, 0.05)",
									boxShadow: "0px 0px 0px 1px rgba(255, 255, 255, 0.06) inset",
								}}
							>
								32
							</span>
							<span>Credits</span>
						</div>
						<div className="flex gap-x-2 items-center">
							<span
								className="p-1.5 rounded-sm"
								style={{
									background: "rgba(255, 255, 255, 0.05)",
									boxShadow: "0px 0px 0px 1px rgba(255, 255, 255, 0.06) inset",
								}}
							>
								17
							</span>
							<span>Days till Reset</span>
						</div>
					</div>

					<div className="flex gap-x-2.5 items-center">
						<Switch
							style={{
								border: "1px solid #50071D",
								color: "#FF3370",
								backgroundColor: "#50071D",
								boxShadow: "0px 0px 0px 1px rgba(255, 255, 255, 0.06) inset",
							}}
						/>
						<p className="text-xs">Generate In Turbo Mode</p>
					</div>
				</div>

				<UpgradeSubscriptionDialog>
					<Button
						variant="outline"
						className="min-w-full rounded-lg py-1.5 text-white font-normal hover:text-accent-600"
						style={selectedStyle}
					>
						Upgrade Subscription
					</Button>
				</UpgradeSubscriptionDialog>
			</div>
		</div>
	);
}

//getServerSideProps

export async function getServerSideProps() {
	const session = await getSession();
	if (!session) {
		return {
			props: {},
		};
	}
	const accessToken = session.accessToken || "";
	if (!accessToken) {
		return {
			props: {},
		};
	}
	const userDetail = api.user.get(accessToken);
	return {
		props: { userDetail },
	};
}