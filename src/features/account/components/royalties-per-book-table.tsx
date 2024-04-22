import { useEffect, useState } from "react";
import Link from "next/link";
import GenericPagination from "@/components/ui/generic-pagination";

export interface BookRoyalty {
	id: string;
	webStoryId: string;
	storyTitle: string;
	topLevelCategory: string;
	slug: string;
	totalSales: number;
	lifetimeRoyalty: number;
	unclaimedRoyalty: number;
	amazonUrl: string;
}

export default function RoyaltiesPerBookTable({ data }: { data: any }) {
	const [loadingMore, setLoadingMore] = useState(false);
	const [pageData, setPageData] = useState(data);

	useEffect(() => {
		if (!data || data.currentPage === pageData.currentPage) return;

		if (loadingMore) {
			setPageData(data);
		} else {
			setPageData({
				...data,
				items: [...(pageData?.items || []), ...data.items],
			});
		}
		setLoadingMore(false);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [data, loadingMore]);

	return (
		<div className="space-y-4">
			<table className="table-auto w-full mt-12">
				<thead className="border-b">
					<tr>
						<td className="py-2">
							<span className="font-semibold text-xl">
								Royalties Earned History
							</span>
						</td>
						<td className="py-2">
							<span className="font-semibold block text-center">
								Copies Sold
							</span>
						</td>
						<td className="py-2">
							<span className="font-semibold block text-center">
								Total Earnings
							</span>
						</td>
					</tr>
				</thead>
				<tbody className="divide-y divide-neutral-700">
					{pageData.items?.length > 0 ? (
						<>
							{pageData.items.map((item: BookRoyalty) => (
								<tr className="text-base" key={item.webStoryId}>
									<td>
										<div className="py-2 flex flex-col gap-4">
											<div className="py-2 flex flex-col gap-4">
												<Link
													href={`/library/${item.topLevelCategory}/${item.slug}`}
													target="_blank"
													rel="noopener noreferrer"
													className="text-lg text-primary-500 hover:text-primary-600 transition duration-300"
												>
													{item.storyTitle}
												</Link>
												<a
													href={item.amazonUrl}
													target="_blank"
													rel="noopener noreferrer"
													className="underline"
												>
													Find it on Amazon
												</a>
											</div>
										</div>
									</td>
									<td>
										<div className="py-2 text-center">
											<p>{item.totalSales}</p>
										</div>
									</td>
									<td>
										<div className="py-2 text-center">
											<p>$ {item.lifetimeRoyalty}</p>
										</div>
									</td>
								</tr>
							))}
						</>
					) : null}
				</tbody>
			</table>
			{data.totalPages > 1 && (
				<GenericPagination
					currentPage={data.currentPage}
					totalPages={data.totalPages}
				/>
			)}
		</div>
	);
}
