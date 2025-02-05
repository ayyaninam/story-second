import { Button } from "@/components/ui/button";
import React, { CSSProperties } from "react";
import { HeaderTabSwitcher } from "@/components/gallery-components/orientation-tab-switcher";
import { GenreTabSwitcher } from "@/components/gallery-components/genre-tab-switcher";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useTheme } from "next-themes";
import { useRouter } from "next/router";
import {
	genreOptions,
	SORTING_OPTIONS,
	VIDEO_ORIENTATIONS,
} from "@/constants/feed-constants";
import { MobileSelector } from "@/components/ui/mobile-selector";
import { Plus, Search } from "lucide-react";
import Routes from "@/routes";
import { useMediaQuery } from "usehooks-ts";
import FeedIcon from "@/components/icons/side-nav/FeedIcon";
import useEventLogger from "@/utils/analytics";
import { Input } from "@/components/ui/input";
import { usePathname, useSearchParams } from "next/navigation";
import debounce from "@/utils/debounce";

const mainHeaderContainer: {
	[key: string]: CSSProperties;
} = {
	light: {
		background:
			"radial-gradient(10.83% 5455.25% at 0% 50%, rgba(200, 211, 254, 0.5) 0%, rgba(200, 211, 254, 0) 100%),linear-gradient(0deg, #FFFFFF, #FFFFFF)",
		boxShadow: "0px 1px 2px 0px rgba(0, 0, 0, 0.05)",
	},
	dark: {
		background:
			"radial-gradient(10.83% 5455.25% at 0% 50%, rgba(40, 90, 85, 0.5) 0%, rgba(40, 90, 85, 0) 100%), linear-gradient(0deg, #2E2E2E, #2E2E2E)",
		boxShadow: "0px 1px 2px 0px rgba(0, 0, 0, 0.05)",
	},
};

const subHeaderContainer: CSSProperties = {
	borderTop: "0.5px solid var(--Colors-Slate-400, #94ABB8)",
	borderBottom: "0.5px solid var(--Colors-Slate-400, #94ABB8)",
	background: "var(--base-white, #FFF)",
};

export const FeedHeader = ({
	selectedOrientationTab,
	setSelectedOrientationTab,
	selectedGenre,
	setSelectedGenre,
	selectedSort,
	setSelectedSort,
}: {
	selectedOrientationTab: string;
	setSelectedOrientationTab: (orientation: string) => void;
	selectedGenre: string;
	setSelectedGenre: (genre: string) => void;
	selectedSort: string;
	setSelectedSort: (sort: string) => void;
}) => {
	const { theme } = useTheme();
	const router = useRouter();
	const searchParams = useSearchParams();
	const pathname = usePathname();
	const searchTerm = searchParams?.get("searchTerm") ?? "";

	const handleFilter = (value: string) => {
		const params = new URLSearchParams(searchParams ?? {});
		params.set("searchTerm", value);
		router.push(`${pathname}?${params.toString()}`);
	};
	const handleFilterDebounce = debounce(handleFilter, 2000);

	const eventLogger = useEventLogger();

	const sortOptions = Object.values(SORTING_OPTIONS);
	const isMobile = useMediaQuery("(max-width: 768px)");

	return (
		<div
			style={{
				position: "sticky",
				top: "0",
			}}
			className="flex flex-col items-start pb-[1px] z-50 bg-background"
		>
			<div
				className="flex justify-between items-center px-[20px] py-[14px] w-full"
				style={theme ? mainHeaderContainer[theme] : mainHeaderContainer.light}
			>
				<div className="flex items-start w-[250px]">
					<div
						style={{
							width: 32,
							height: 32,
							position: "relative",
							boxShadow:
								"0px 2.999999761581421px 10.999999046325684px rgba(54.89, 55.76, 117.32, 0.12)",
						}}
					>
						<div
							style={{
								width: 32,
								height: 32,
								left: 0,
								top: 0,
								position: "absolute",
								background:
									"linear-gradient(0deg, #3A54CB 0%, #3A54CB 100%), linear-gradient(180deg, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0) 100%)",
								boxShadow:
									"0px -0.800000011920929px 9.600000381469727px rgba(255, 255, 255, 0.12) inset",
								borderRadius: 8,
							}}
						/>
						<div
							style={{
								width: 28,
								height: 28,
								left: 2,
								top: 2,
								position: "absolute",
								background: "linear-gradient(192deg, #6060A6 0%, #F0D2FC 100%)",
								boxShadow:
									"0px 0.3720930516719818px 1.4883722066879272px rgba(0, 0, 0, 0.25) inset",
								borderRadius: 9999,
							}}
						/>
						<div
							style={{
								width: 28,
								height: 28,
								left: 2,
								top: 2,
								position: "absolute",
								background: "linear-gradient(180deg, #001824 0%, #4941C5 100%)",
								boxShadow:
									"0px 0.2499999850988388px 0.9999999403953552px rgba(0, 0, 0, 0.25) inset",
								borderRadius: 9999,
								border: "0.40px #1B244B solid",
							}}
						/>
						<div
							style={{
								width: 19,
								height: 19,
								left: 6,
								top: 6,
								position: "absolute",
							}}
						>
							<FeedIcon />
						</div>
					</div>
					<div className="pl-[12px] flex flex-col items-start">
						<span className="text-slate-950 text-base font-bold">Feed</span>
						<span className="text-accent-700 text-sm font-normal">
							Inspiration Board
						</span>
					</div>
				</div>
				{isMobile ? (
					<MobileSelector
						selectedTab={selectedOrientationTab}
						setSelectedTab={setSelectedOrientationTab}
						tabs={Object.values(VIDEO_ORIENTATIONS)}
					/>
				) : (
					<HeaderTabSwitcher
						selectedTab={selectedOrientationTab}
						setSelectedTab={setSelectedOrientationTab}
					/>
				)}
				<div className="flex items-center gap-4">
					{/*<Button*/}
					{/*	className={`px-4 py-1.5 text-sm font-medium flex gap-2 items-center h-fit`}*/}
					{/*	variant="ghost"*/}
					{/*	onClick={() => {*/}
					{/*		// TODO: Implement*/}
					{/*			toast.success("Coming soon!")*/}
					{/*	}}*/}
					{/*	style={tutorialButton}*/}
					{/*>*/}
					{/*	<svg*/}
					{/*		xmlns="http://www.w3.org/2000/svg"*/}
					{/*		width="17"*/}
					{/*		height="16"*/}
					{/*		viewBox="0 0 17 16"*/}
					{/*		fill="none"*/}
					{/*	>*/}
					{/*		<path*/}
					{/*			d="M8.69889 14.6666C12.3808 14.6666 15.3656 11.6819 15.3656 7.99998C15.3656 4.31808 12.3808 1.33331 8.69889 1.33331C5.01699 1.33331 2.03223 4.31808 2.03223 7.99998C2.03223 11.6819 5.01699 14.6666 8.69889 14.6666Z"*/}
					{/*			stroke="#3A54CB"*/}
					{/*			strokeLinecap="round"*/}
					{/*			strokeLinejoin="round"*/}
					{/*		/>*/}
					{/*		<path*/}
					{/*			d="M7.36556 5.33331L11.3656 7.99998L7.36556 10.6666V5.33331Z"*/}
					{/*			stroke="#3A54CB"*/}
					{/*			strokeLinecap="round"*/}
					{/*			strokeLinejoin="round"*/}
					{/*		/>*/}
					{/*	</svg>*/}
					{/*	Tutorial*/}
					{/*</Button>*/}
					{!isMobile && (
						<Button
							className={`px-4 py-1.5 bg-accent-600 hover:bg-accent-700 border border-accent-700 text-background text-white text-sm font-medium flex gap-2 items-center h-fit`}
							variant="default"
							onClick={() => {
								eventLogger("create_new_clicked", {
									sourceUrl: router.asPath,
								});
								router.push(Routes.Generate());
							}}
						>
							<Plus className="h-4 w-4" /> Create New
						</Button>
					)}
				</div>
			</div>
			<div
				className="px-8 w-full flex justify-between items-center relative transition-all ease-in-out duration-300"
				style={subHeaderContainer}
			>
				<div className="flex h-[40px] gap-2 items-center">
					{/* FeatureDisabled: search bar - remove div if causes issue in responsiveness */}
					{/*<svg*/}
					{/*	xmlns="http://www.w3.org/2000/svg"*/}
					{/*	width="20"*/}
					{/*	height="20"*/}
					{/*	viewBox="0 0 20 20"*/}
					{/*	fill="none"*/}
					{/*>*/}
					{/*	<path*/}
					{/*		fillRule="evenodd"*/}
					{/*		clipRule="evenodd"*/}
					{/*		d="M9.16699 3.33332C5.94533 3.33332 3.33366 5.945 3.33366 9.16666C3.33366 12.3883 5.94533 15 9.16699 15C10.7386 15 12.1651 14.3785 13.214 13.3678C13.2359 13.3393 13.2599 13.3119 13.2861 13.2857C13.3122 13.2596 13.3396 13.2356 13.3681 13.2136C14.3788 12.1647 15.0003 10.7383 15.0003 9.16666C15.0003 5.945 12.3887 3.33332 9.16699 3.33332ZM15.0269 13.8481C16.0533 12.565 16.667 10.9375 16.667 9.16666C16.667 5.02452 13.3091 1.66666 9.16699 1.66666C5.02486 1.66666 1.66699 5.02452 1.66699 9.16666C1.66699 13.3088 5.02486 16.6667 9.16699 16.6667C10.9378 16.6667 12.5653 16.0529 13.8484 15.0266L16.9111 18.0892C17.2365 18.4147 17.7641 18.4147 18.0896 18.0892C18.415 17.7638 18.415 17.2362 18.0896 16.9107L15.0269 13.8481Z"*/}
					{/*		fill="#64748B"*/}
					{/*	/>*/}
					{/*</svg>*/}
					{/*<Input*/}
					{/*	type="text"*/}
					{/*	onChange={(e) => {*/}
					{/*		setSearchTerm(e.target.value);*/}
					{/*	}}*/}
					{/*	value={searchTerm}*/}
					{/*	placeholder="Search your library..."*/}
					{/*	className="w-full bg-white border-none p-0 focus-visible:outline-none focus-visible:border-none focus-visible:ring-offset-none focus-visible:ring-0 focus-visible:ring-none text-slate-950"*/}
					{/*/>*/}
				</div>
				{isMobile ? (
					<div className="w-full pb-2">
						<div className=" flex items-center left-10 w-full">
							<Search size={20} className="text-muted-foreground" />
							<Input
								placeholder="Search your library..."
								className="text-muted-foreground border-0  focus-visible:ring-0 focus-visible:ring-offset-0 "
								name="searchTerm"
								defaultValue={searchTerm}
								onChange={(e) => {
									handleFilterDebounce(e.target.value);
								}}
								onKeyDown={(e) => {
									if (e.key === "Enter") {
										handleFilter(e.currentTarget.value);
									}
								}}
							/>
						</div>
						<div className="flex flex-col sm:flex-row w-full gap-4">
							<MobileSelector
								selectedTab={selectedGenre}
								setSelectedTab={setSelectedGenre}
								tabs={genreOptions}
							/>
							<MobileSelector
								selectedTab={selectedSort}
								setSelectedTab={setSelectedSort}
								tabs={sortOptions}
							/>
						</div>
					</div>
				) : (
					<>
						<div className="absolute flex items-center left-10">
							<Search size={20} className="text-muted-foreground" />
							<Input
								placeholder="Search your library..."
								className="text-muted-foreground border-0  focus-visible:ring-0 focus-visible:ring-offset-0 "
								name="searchTerm"
								defaultValue={searchTerm}
								onChange={(e) => {
									handleFilterDebounce(e.target.value);
								}}
								onKeyDown={(e) => {
									if (e.key === "Enter") {
										handleFilter(e.currentTarget.value);
									}
								}}
							/>
						</div>
						<GenreTabSwitcher
							selectedGenre={selectedGenre}
							setSelectedGenre={setSelectedGenre}
							genreOptions={genreOptions}
						/>
						<div className="flex h-[40px] w-[180px] gap-2 items-center">
							<Select
								onValueChange={setSelectedSort}
								defaultValue={selectedSort}
							>
								<SelectTrigger className="max-w-48 border-0 focus:ring-0 focus:ring-offset-0 bg-white text-[#000000]">
									<div className="text-accent-600">
										<SelectValue placeholder="Sort by" />
									</div>
								</SelectTrigger>
								<SelectContent className="bg-white text-[#000000] border-muted">
									{sortOptions.map((option) => (
										<SelectItem value={option.id} key={option.id}>
											{option.value}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
					</>
				)}
			</div>
		</div>
	);
};
