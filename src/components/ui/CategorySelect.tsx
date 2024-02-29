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

export default function CategorySelect() {
	const categoriesList = useQuery<string[]>({
		queryFn: () => api.library.getCategories(),
		queryKey: [QueryKeys.CATEGORIES],
	});

	const genreOptions = useMemo(() => {
		if (categoriesList.data) {
			return getGenreOptions(categoriesList.data);
		}
		return [];
	}, [categoriesList.data]);

	return (
		<div className="flex">
			<Select>
				<SelectTrigger className="!h-4 border-none outline-none p-0 mx-1">
					<u>
						<SelectValue placeholder="All" />
					</u>
				</SelectTrigger>
				<SelectContent>
					{genreOptions.map((option, index) => {
						return (
							<SelectItem key={index} value={option.id}>
								{option.name}
							</SelectItem>
						);
					})}
				</SelectContent>
			</Select>
		</div>
	);
}
