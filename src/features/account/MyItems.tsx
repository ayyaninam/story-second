import React, { useState } from "react";
import GenericPagination from "@/components/ui/generic-pagination";
import UserItemCard from "@/features/account/components/user-item-card";
import Link from "next/link";
import {
	keepPreviousData,
	useQuery,
	useQueryClient,
} from "@tanstack/react-query";
import api from "@/api";
import { mainSchema } from "@/api/schema";
import { QueryKeys } from "@/lib/queryKeys";
import { useRouter } from "next/router";

const MyItems = ({ legacy }: { legacy?: boolean }) => {
	const router = useRouter();
	const currentPage = parseInt((router.query.page as string) || "1");
	const queryClient = useQueryClient();

	const queryKey = legacy ? QueryKeys.USER_VIDEOS : QueryKeys.USER_PDFS;
	const { data: userItemsList, isLoading } = useQuery<
		mainSchema["ReturnUserStoryItemsDTOPagedList"]
	>({
		queryFn: () => {
			const params = {
				CurrentPage: currentPage,
				PageSize: 5,
			};
			if (legacy) return api.user.legacyGetAllUserVideos(params);
			return api.user.getAllUserItems(params);
		},
		staleTime: 3000,
		queryKey: [queryKey, currentPage, legacy],
		initialData: queryClient.getQueryData([queryKey]),
	});
	console.log(userItemsList);

	if (isLoading) return <div>Loading...</div>;
	return (
		<div className="w-full flex-1 flex flex-col p-4">
			<h3 className="font-aleo text-3xl font-semibold mb-4">My Items</h3>
			{userItemsList && userItemsList.items?.length > 0 ? (
				<div className="flex flex-col gap-5">
					{userItemsList.items.map((item) => (
						<UserItemCard
							data={item}
							key={`${item.webStoryId}-${item.creditSpendType}`}
						/>
					))}
					<GenericPagination
						currentPage={currentPage}
						totalPages={userItemsList.totalPages}
					/>
				</div>
			) : (
				<div className="text-center py-10">
					<p className="text-xl font-semibold mb-4">
						You haven&apos;t purchased any items yet.
					</p>
					<Link href="/feed/all" className="text-blue-600 hover:underline">
						Explore stories
					</Link>
				</div>
			)}
		</div>
	);
};

export default MyItems;
