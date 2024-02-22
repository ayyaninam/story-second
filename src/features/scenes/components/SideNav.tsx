import { Button } from "@/components/ui/button";
import AuthorlyLogo from "../../../../public/auth-prompt/authorly-logo";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { AvatarImage } from "@radix-ui/react-avatar";
import { mainSchema } from "@/api/schema";
import Format from "@/utils/format";
import ExploreIcon from "./icons/ExploreIcon";
import GenerateIcon from "./icons/GenerateIcon";
import LibraryIcon from "./icons/LibraryIcon";
import FreeCreditsIcon from "./icons/FreeCreditsIcon";
import ChallengesIcon from "./icons/ChallengesIcon";
import { Command } from "lucide-react";
import { Switch } from "@/components/ui/switch";

const menuItems = [
	{
		icon: <ExploreIcon />,
		text: "Explore",
		shortcut: "E",
	},
	{
		icon: <GenerateIcon />,
		text: "Generate",
		shortcut: "G",
	},
	{
		icon: <LibraryIcon />,
		text: "Library",
		shortcut: "L",
	},
	{
		icon: <ChallengesIcon />,
		text: "Challenges",
		shortcut: "C",
	},
	{
		icon: <FreeCreditsIcon />,
		text: "Free Credits",
		shortcut: "F",
	},
];
export default function SideNav() {
	return (
		<div className="w-[18rem] flex flex-col justify-between">
			<div>
				<div className="ml-3.5 flex mt-5 mb-4 items-center justify-between mr-4">
					<StoryLogo />

					<Avatar className="h-8 w-8 border-[1px] border-gray-200">
						<AvatarImage src="https://github.com/shadcn.png" />
						<AvatarFallback>
							CN
							{/* {Format.AvatarName(WebstoryData?.user?.name)} */}
						</AvatarFallback>
					</Avatar>
				</div>
				<div className="space-y-1">
					{menuItems.map((menuItem, index) => (
						<div
							key={index}
							aria-selected={index === 0}
							className="menuItem ml-1 pl-3.5 flex gap-2 py-2 pr-4 items-center text-white"
						>
							{menuItem.icon}
							{menuItem.text}
							<div className="flex gap-2 flex-grow justify-end items-center opacity-65">
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
						</div>
					))}
				</div>
			</div>
			<div className="w-full flex-col px-1.5 my-6 items-center text-white">
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

				<Button
					variant="outline"
					className="min-w-full rounded-lg bg-transparent py-1.5 font-normal shadow-[inset_0px_0px_12px_0px_rgba(255, 255, 255, 0.08)]"
					style={{ border: "1px solid rgba(255, 255, 255, 0.12)" }}
				>
					Upgrade Authorly
				</Button>
			</div>
		</div>
	);
}

// Move it to separate file if it is used else where
const StoryLogo = () => {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="136"
			height="44"
			viewBox="0 0 136 44"
			fill="none"
		>
			<path
				d="M-0.00195312 21.8609C0.119667 26.8383 4.12099 30.8421 9.09526 30.976C9.0831 25.9621 5.00881 21.8852 -0.00195312 21.8609Z"
				fill="#F1F6F9"
			/>
			<path
				d="M18.9625 21.1157C18.8408 16.1383 14.8395 12.1345 9.86523 12.0128C9.8774 17.0267 13.9517 21.1036 18.9625 21.1157Z"
				fill="#F1F6F9"
			/>
			<path
				d="M9.10698 12C4.13271 12.1217 0.131386 16.1256 0.00976562 21.103C5.02052 21.0908 9.09482 17.0139 9.10698 12Z"
				fill="#F1F6F9"
			/>
			<path
				d="M9.86389 31.0003H9.63281H18.9976V21.8609C13.9625 21.8609 9.86389 25.9621 9.86389 31.0003Z"
				fill="#F1F6F9"
			/>
			<path
				d="M96.4243 26.7705L100.071 18.134H104.377L98.6024 31.38C97.1081 34.8498 94.93 36.3695 91.7641 36.3695C90.4471 36.3695 89.3327 36.2175 88.2437 35.9642L88.6489 32.621C89.5607 32.8743 90.5484 33.001 91.3589 33.001C92.8532 33.001 94.0436 32.3678 94.6008 31.0761L94.8034 30.5949H93.8156L87.2812 18.134H92.22L96.4243 26.7705Z"
				fill="#F1F6F9"
			/>
			<path
				d="M81.3554 31.0002H76.6445V18.134H81.3554L81.1021 21.072H81.2541C81.5833 19.3497 82.951 17.9821 85.1544 17.9821C85.5343 17.9821 85.9396 18.0074 86.4208 18.1087L86.3195 22.085C85.5343 21.9077 84.9012 21.8571 84.5466 21.8571C82.4444 21.8571 81.3554 23.2754 81.3554 25.7828V31.0002Z"
				fill="#F1F6F9"
			/>
			<path
				d="M66.1994 31.5067C61.2606 31.5067 57.7148 28.67 57.7148 24.5671C57.7148 20.5147 61.2353 17.6274 66.1994 17.6274C71.1382 17.6274 74.684 20.4894 74.684 24.5671C74.684 28.6194 71.1888 31.5067 66.1994 31.5067ZM66.2247 28.5687C68.3522 28.5687 69.8465 26.8971 69.8465 24.5671C69.8465 22.161 68.3016 20.4894 66.1741 20.4894C64.0719 20.4894 62.5523 22.161 62.5523 24.5417C62.5523 26.8971 64.0973 28.5687 66.2247 28.5687Z"
				fill="#F1F6F9"
			/>
			<path
				d="M54.0785 31.1774C51.0139 31.1774 48.8104 29.5311 48.8104 25.7574V21.0212H46.4297V18.1339H47.7467C48.6838 18.1339 49.1903 17.5514 49.1903 16.513V14.7908H53.9518V15.1453C53.9518 16.741 53.4706 17.7287 52.5588 18.0326V18.1339H56.9657V21.0212H53.4706V25.1495C53.4706 26.7958 54.2557 27.7329 55.6741 27.7329C55.978 27.7329 56.4845 27.7329 56.8898 27.6569L56.8391 30.9748C55.978 31.1014 55.1169 31.1774 54.0785 31.1774Z"
				fill="#F1F6F9"
			/>
			<path
				d="M36.9533 31.5067C31.4067 31.5067 27.8609 29.0246 27.6836 25.0229L32.2678 24.871C32.3691 27.1757 34.218 28.5941 37.1306 28.5941C39.5113 28.5941 40.9296 27.8342 40.9296 26.5172C40.9296 25.4028 39.8912 24.6177 38.093 24.3898L34.2686 23.9086C30.8495 23.5033 28.2661 21.7558 28.2661 18.4126C28.2661 15.1454 31.2294 12.7646 36.5987 12.7646C41.7908 12.7646 45.1339 15.1201 45.2352 18.9698L40.7777 19.1217C40.651 16.9436 38.9795 15.6013 36.4468 15.6013C34.4206 15.6013 33.0023 16.4117 33.0023 17.7541C33.0023 18.7925 33.7874 19.527 35.2817 19.7043L39.1314 20.1855C43.7409 20.7427 45.7418 23.0728 45.7418 25.8587C45.7418 29.5565 41.9427 31.5067 36.9533 31.5067Z"
				fill="#F1F6F9"
			/>
		</svg>
	);
};
