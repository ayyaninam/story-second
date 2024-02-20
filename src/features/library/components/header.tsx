import { Button } from "@/components/ui/button";
import Image from "next/image";
import React, { CSSProperties } from "react";
import { HeaderTabSwitcher } from "./orientation-tab-switcher";
import { Input } from "@/components/ui/input";
import { GenreTabSwitcher } from "./genre-tab-switcher";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

const mainHeaderContainer: CSSProperties = {
	background:
		"radial-gradient(10.83% 5455.25% at 0% 50%, rgba(159, 234, 225, 0.5) 0%, rgba(159, 234, 225, 0) 100%),linear-gradient(0deg, #FFFFFF, #FFFFFF)",
	boxShadow: "0px 1px 2px 0px rgba(0, 0, 0, 0.05)",
};
const createNewButton: CSSProperties = {
	background:
		"linear-gradient(180deg, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0.00) 100%), var(--Colors-Purple-700, #8F22CE)",
	boxShadow:
		" 0px -1px 12px 0px rgba(255, 255, 255, 0.12) inset, 0px 0px 0px 1px #8F22CE",
	borderRadius: "6px",
};
const tutorialButton: CSSProperties = {
	background: "transparent",
	color: "#303546",
};

const subHeaderContainer: CSSProperties = {
	border: "0.5px solid var(--Colors-Slate-400, #94ABB8)",
	background: "var(--base-white, #FFF)",
};

export const LibraryHeader = ({
	selectedOrientationTab,
	setSelectedOrientationTab,
}: {
	selectedOrientationTab: string;
	setSelectedOrientationTab: React.Dispatch<React.SetStateAction<string>>;
}) => {
	return (
		<div
			style={{
				position: "sticky",
				top: "0",
			}}
			className="flex flex-col items-start pb-[1px] z-50 bg-primary"
		>
			<div
				className="flex justify-between items-center px-[20px] py-[14px] w-full"
				style={mainHeaderContainer}
			>
				<div className="flex items-start w-[250px]">
					<Image
						src="/images/library/header-icon.png"
						alt="Library"
						width={40}
						height={40}
					/>
					<div className="pl-[12px] flex flex-col items-start">
						<span className="text-slate-950 text-base font-bold">Library</span>
						<span className="text-teal-700 text-sm font-normal">17 Videos</span>
					</div>
				</div>
				<HeaderTabSwitcher
					selectedTab={selectedOrientationTab}
					setSelectedTab={setSelectedOrientationTab}
				/>
				<div className="flex items-center gap-4">
					<Button
						className={`px-4 py-1.5 text-sm font-medium flex gap-2 items-center h-fit`}
						variant="ghost"
						onClick={() => {
							// TODO: Implement
						}}
						style={tutorialButton}
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="17"
							height="16"
							viewBox="0 0 17 16"
							fill="none"
						>
							<path
								d="M8.69889 14.6666C12.3808 14.6666 15.3656 11.6819 15.3656 7.99998C15.3656 4.31808 12.3808 1.33331 8.69889 1.33331C5.01699 1.33331 2.03223 4.31808 2.03223 7.99998C2.03223 11.6819 5.01699 14.6666 8.69889 14.6666Z"
								stroke="#A734EA"
								stroke-linecap="round"
								stroke-linejoin="round"
							/>
							<path
								d="M7.36556 5.33331L11.3656 7.99998L7.36556 10.6666V5.33331Z"
								stroke="#A734EA"
								stroke-linecap="round"
								stroke-linejoin="round"
							/>
						</svg>
						Tutorial
					</Button>
					<Button
						className={`px-4 py-1.5 text-white text-sm font-medium flex gap-2 items-center h-fit`}
						variant="default"
						onClick={() => {
							// TODO: Implement
						}}
						style={createNewButton}
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="17"
							height="16"
							viewBox="0 0 17 16"
							fill="none"
						>
							<path
								d="M8.16725 7.96669H8.66725V7.46669V2.93336C8.66725 2.91495 8.68218 2.90002 8.70059 2.90002C8.71899 2.90002 8.73392 2.91495 8.73392 2.93336V7.46669V7.96669H9.23392H13.7673C13.7856 7.96669 13.8006 7.98164 13.8006 8.00002C13.8006 8.01841 13.7856 8.03336 13.7673 8.03336H9.23392H8.73392V8.53336V13.0667C8.73392 13.0851 8.71897 13.1 8.70059 13.1C8.6822 13.1 8.66725 13.0851 8.66725 13.0667V8.53336V8.03336H8.16725H3.63392C3.61551 8.03336 3.60059 8.01843 3.60059 8.00002C3.60059 7.98162 3.61551 7.96669 3.63392 7.96669H8.16725Z"
								stroke="white"
							/>
						</svg>
						Create New
					</Button>
				</div>
			</div>
			<div
				className="px-8 w-full flex justify-between items-center"
				style={subHeaderContainer}
			>
				<div className="w-1/4 max-w-[400px] flex h-[40px] gap-2 items-center">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="20"
						height="20"
						viewBox="0 0 20 20"
						fill="none"
					>
						<path
							fill-rule="evenodd"
							clip-rule="evenodd"
							d="M9.16699 3.33332C5.94533 3.33332 3.33366 5.945 3.33366 9.16666C3.33366 12.3883 5.94533 15 9.16699 15C10.7386 15 12.1651 14.3785 13.214 13.3678C13.2359 13.3393 13.2599 13.3119 13.2861 13.2857C13.3122 13.2596 13.3396 13.2356 13.3681 13.2136C14.3788 12.1647 15.0003 10.7383 15.0003 9.16666C15.0003 5.945 12.3887 3.33332 9.16699 3.33332ZM15.0269 13.8481C16.0533 12.565 16.667 10.9375 16.667 9.16666C16.667 5.02452 13.3091 1.66666 9.16699 1.66666C5.02486 1.66666 1.66699 5.02452 1.66699 9.16666C1.66699 13.3088 5.02486 16.6667 9.16699 16.6667C10.9378 16.6667 12.5653 16.0529 13.8484 15.0266L16.9111 18.0892C17.2365 18.4147 17.7641 18.4147 18.0896 18.0892C18.415 17.7638 18.415 17.2362 18.0896 16.9107L15.0269 13.8481Z"
							fill="#64748B"
						/>
					</svg>
					<Input
						type="text"
						placeholder="Search your library..."
						className="w-full bg-white border-none p-0 focus-visible:outline-none focus-visible:border-none focus-visible:ring-offset-none focus-visible:ring-0 focus-visible:ring-none text-slate-950"
					/>
				</div>
				<GenreTabSwitcher />
				<div className="w-1/4 max-w-[400px] flex h-[40px] gap-2 items-center">
					<Select>
						<SelectTrigger className="ml-auto max-w-48 border-0 focus:ring-0 focus:ring-offset-0 bg-white text-[#000000]">
							<SelectValue placeholder="Sort by" />
						</SelectTrigger>
						<SelectContent className="bg-white text-[#000000] border-muted-foreground">
							<SelectItem value="recent">Most Recent</SelectItem>
							<SelectItem value="asc">Ascending</SelectItem>
							<SelectItem value="dsc">Descending</SelectItem>
						</SelectContent>
					</Select>
				</div>
			</div>
		</div>
	);
};
