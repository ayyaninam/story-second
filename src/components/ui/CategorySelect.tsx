import api from "@/api";
import { getGenreOptions } from "@/features/library/components/genre-tab-switcher";
import { QueryKeys } from "@/lib/queryKeys";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "./select";
import { genreOptions } from "@/constants/feed-constants";

export default function CategorySelect({
	value,
	onChange,
}: {
	value: string;
	onChange: (value: string) => void;
}) {
	return (
		<div className="flex">
			<Select value={value} onValueChange={onChange}>
				<SelectTrigger className="!h-4 border-none outline-none p-0 mx-1">
					<u>
						<SelectValue
							placeholder="All Categories"
							defaultValue={genreOptions[0]?.id}
						/>
					</u>
				</SelectTrigger>
				<SelectContent>
					{genreOptions.map((option, index) => {
						return (
							<SelectItem key={index} value={option.id}>
								{option.value}
							</SelectItem>
						);
					})}
				</SelectContent>
			</Select>
		</div>
	);
}
