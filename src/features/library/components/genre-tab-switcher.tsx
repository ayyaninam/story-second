import { useCallback, useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import api from "@/api";
import { QueryKeys } from "@/lib/queryKeys";
import { useRouter } from "next/router";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
} from "@/components/ui/select";
import { getGenreNameFromSlug } from "../utils";

const getGenreOptions = (categories: string[]) => {
	return [
		{
			id: "all",
			name: "All",
		},
		...categories
			.filter((category) => category !== "all" && category !== "other")
			.map((category) => ({
				id: category,
				name: getGenreNameFromSlug(category),
			})),
		{
			id: "other",
			name: "Other",
		},
	];
};

export const GenreTabSwitcher = () => {
	const router = useRouter();
	const CategoriesList = useQuery<string[]>({
		queryFn: () => api.library.getCategories(),
		queryKey: [QueryKeys.CATEGORIES],
	});
	const selectedGenre = router.query.genre as string;
	const setSelectedGenre = useCallback(
		(genre: string) => {
			router.push(
				{
					pathname: "/library",
					query: { ...router.query, genre },
				},
				undefined,
				{ shallow: true }
			);
		},
		[router]
	);

	const genreOptions = useMemo(() => {
		if (CategoriesList.data) {
			return getGenreOptions(CategoriesList.data);
		}
		return [];
	}, [CategoriesList.data]);

	const showExtraSelectedTab = useMemo(
		() =>
			!genreOptions
				.slice(0, 4)
				.some((category) => category.id === selectedGenre),
		[genreOptions, selectedGenre]
	);

	useEffect(() => {
		if (!CategoriesList.isLoading) {
			if (!CategoriesList.data?.includes(selectedGenre)) {
				setSelectedGenre("all");
			}
		}
	}, [
		CategoriesList.data,
		CategoriesList.isLoading,
		selectedGenre,
		setSelectedGenre,
	]);

	return (
		<div className="flex gap-1.5 items-center bg-none overflow-x-scroll absolute right-1/2 translate-x-1/2">
			{genreOptions?.slice(0, 4).map((category) => (
				<Button
					key={category.id}
					className={`h-7 py-0.5 bg-background px-4 justify-center rounded-[10000px] text-sm font-normal ease-linear duration-300 transition-all flex items-center border border-solid ${
						selectedGenre === category.id
							? "bg-teal-600 text-teal-50 border-teal-700 hover:bg-teal-700"
							: "text-muted-foreground border-border hover:bg-gray-200 hover:text-slate-600"
					}`}
					onClick={() => setSelectedGenre(category.id)}
				>
					{category.name}
				</Button>
			))}
			{showExtraSelectedTab && (
				<Button
					className={`h-7 py-0.5 bg-background px-4 justify-center rounded-[10000px] text-sm font-normal ease-linear duration-300 transition-all flex items-center border border-solid bg-teal-600 text-teal-50 border-teal-700 hover:bg-teal-700`}
					onClick={() => setSelectedGenre("all")}
				>
					{getGenreNameFromSlug(selectedGenre)}
				</Button>
			)}
			{genreOptions.length > 4 && (
				<Select
					onValueChange={(value) => {
						setSelectedGenre(value);
					}}
				>
					<SelectTrigger
						className="h-7 py-0.5 bg-background px-4 justify-center rounded-[10000px] text-sm font-normal ease-linear duration-300 transition-all flex items-center border border-solid gap-1
						text-muted-foreground border-border hover:bg-gray-200 hover:text-slate-600 focus:ring-0 focus:ring-offset-0"
					>
						More
					</SelectTrigger>
					<SelectContent className="bg-white text-[#000000] border-muted">
						{genreOptions.slice(4).map((category) => (
							<SelectItem
								value={category.id}
								key={category.id}
								onClick={() => setSelectedGenre(category.id)}
								highlightSelection={false}
							>
								{category.name}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			)}
		</div>
	);
};
