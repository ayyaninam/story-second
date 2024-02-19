import { useState } from "react";
import { GENRES } from "../constants";

export const GenreTabSwitcher = () => {
	const [selectedTab, setSelectedTab] = useState(GENRES.ALL.id);

	return (
		<div className="flex items-start gap-1.5 justify-center bg-none">
			{Object.values(GENRES).map((orientation) => (
				<button
					key={orientation.id}
					className={`py-0.5 px-4 justify-center rounded-[10000px] text-sm font-normal ease-linear duration-300 transition-all flex items-center border border-solid ${
						selectedTab === orientation.id
							? "bg-teal-600 text-teal-50 border-teal-700"
							: "text-muted-foreground border-muted-foreground"
					}`}
					onClick={() => setSelectedTab(orientation.id)}
				>
					{orientation.value}
				</button>
			))}
		</div>
	);
};
