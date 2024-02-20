import { useState } from "react";
import { GENRES } from "../constants";
import { Button } from "@/components/ui/button";

export const GenreTabSwitcher = () => {
	const [selectedTab, setSelectedTab] = useState(GENRES.ALL.id);

	return (
		<div className="flex gap-1.5 items-center bg-none overflow-x-scroll">
			{Object.values(GENRES).map((orientation) => (
				<Button
					key={orientation.id}
					className={`h-7 py-0.5 bg-background px-4 justify-center rounded-[10000px] text-sm font-normal ease-linear duration-300 transition-all flex items-center border border-solid ${
						selectedTab === orientation.id
							? "bg-teal-600 text-teal-50 border-teal-700 hover:bg-teal-700"
							: "text-muted-foreground border-border hover:bg-gray-200 hover:text-slate-600"
					}`}
					onClick={() => setSelectedTab(orientation.id)}
				>
					{orientation.value}
				</Button>
			))}
		</div>
	);
};
