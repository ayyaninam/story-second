import { CSSProperties, Dispatch, SetStateAction, useState } from "react";
import { VIDEO_ORIENTATIONS } from "../constants";
import { cn } from "@/utils";

const tabsContainerStyles: CSSProperties = {
	background: "rgba(94, 102, 120, 0.06)",
};

export const HeaderTabSwitcher = ({
	selectedTab,
	setSelectedTab,
}: {
	selectedTab: string;
	setSelectedTab: (orientation: string) => void;
}) => {
	return (
		<div
			className="flex items-start p-0.5 rounded-[10000px] "
			style={tabsContainerStyles}
		>
			{Object.values(VIDEO_ORIENTATIONS).map((orientation) => (
				<button
					key={orientation.id}
					className={`w-[120px] h-[28px] justify-center rounded-[10000px] text-sm font-normal ease-linear duration-300 transition-all flex gap-2 items-center ${
						selectedTab === orientation.id
							? "bg-white text-slate-950"
							: "text-[#5E6678] bg-transparent"
					}`}
					style={{
						boxShadow:
							selectedTab === orientation.id
								? "0px 1px 2px 0px rgba(9, 25, 72, 0.13), 0px 3px 8px 0px rgba(9, 25, 72, 0.05)"
								: "none",
					}}
					onClick={() => setSelectedTab(orientation.id)}
				>
					<div
						className={cn(
							"ease-linear duration-300 transition-all",
							orientation.id === selectedTab ? "text-accent-600" : "text-accent-600"
						)}
					>
						{orientation.icon}
					</div>
					{orientation.value}
				</button>
			))}
		</div>
	);
};
