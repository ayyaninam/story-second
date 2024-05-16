import React from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/api";
import GenericPagination from "@/components/ui/generic-pagination";
import AmazonStatusCard from "@/features/account/components/amazon-status-card";
import { mainSchema } from "@/api/schema";
import { QueryKeys } from "@/lib/queryKeys";
import { useRouter } from "next/router";

const AmazonStatus = () => {
	const router = useRouter();
	const currentPage = parseInt((router.query.page as string) || "1");
	const queryClient = useQueryClient();
	const { data: amazonItems, isLoading } = useQuery<
		mainSchema["ReturnUserAmazonBookDTOPagedList"]
	>({
		queryFn: () => {
			const params = {
				CurrentPage: currentPage,
				PageSize: 5,
			};
			return api.user.getAllUserAmazonItems(params);
		},
		staleTime: 3000,
		queryKey: [QueryKeys.USER_AMAZON_STATUS, currentPage],
		initialData: queryClient.getQueryData([QueryKeys.USER_AMAZON_STATUS]),
	});

	return (
		<div className="w-full flex flex-col p-4">
			<h3 className="text-3xl font-semibold mb-4">Amazon Publish Status</h3>
			{isLoading ? (
				<div>Loading...</div>
			) : amazonItems && amazonItems.items.length > 0 ? (
				<div className="space-y-5">
					{amazonItems.items.map((item) => (
						<AmazonStatusCard
							key={`${item.webStoryId}-${item.amazonPublishLifecycle}`}
							data={item}
						/>
					))}
					<GenericPagination
						currentPage={currentPage}
						totalPages={amazonItems.totalPages}
					/>
				</div>
			) : (
				<p>No items found.</p>
			)}
		</div>
	);
};

export default AmazonStatus;
