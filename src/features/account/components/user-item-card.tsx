import React from "react";
import Link from "next/link";
import Image from "next/image";
import Format from "@/utils/format";
import { mainSchema } from "@/api/schema";
import { CreditSpendType } from "@/utils/enums";
import { Skeleton } from "@/components/ui/skeleton";

export const myItemTypes: Record<number, string> = {
	7: "Standard PDF",
	8: "Premium PDF",
	11: "Landscape Video",
	12: "Portrait Video",
	13: "Landscape Video with Subtitles",
	16: "Standard PDF",
	17: "Premium PDF",
};
export const myItemSubTypes: Record<number, string> = {
	5: "StoryBook",
	6: "E-Book",
};

type UserItemCardProps =
	| { variant?: "loading"; data?: never }
	| { variant?: "default"; data: mainSchema["ReturnUserStoryItemsDTO"] };

const UserItemCard: React.FC<UserItemCardProps> = ({
	variant = "default",
	data,
}) => {
	const isLoading = variant === "loading";

	return (
		<div className="border-2 border-gray-300 rounded-lg p-4 shadow-md">
			<div className="flex flex-col md:flex-row gap-4 items-center overflow-hidden">
				{/* Image or cover of the item, with a fixed width but responsive height */}
				<div
					className="w-48 md:w-32 lg:w-40 xl:w-48 flex-shrink-0 relative"
					style={{ height: "auto" }}
				>
					{isLoading ? (
						<Skeleton className="aspect-square rounded-md" />
					) : (
						data && (
							<Image
								src={Format.GetImageUrl(data.coverImage!)}
								alt="Story Cover"
								width={160} // Set to the width of the container for large screens
								height={213} // Adjust the height based on the desired aspect ratio, for example, 4:3
								layout="responsive"
								className="rounded-md"
							/>
						)
					)}
				</div>
				{/* Item details */}
				<div className="flex-grow">
					{isLoading ? (
						<>
							<Skeleton className="h-6 w-44 mb-2" />
							<Skeleton className="h-4 w-52 mb-2" />
							<Skeleton className="h-4 w-52" />
						</>
					) : (
						data && (
							<>
								<h4 className="text-xl font-semibold">{data.storyTitle}</h4>
								<p>
									Item Type: {myItemTypes[data.creditSpendType!]}{" "}
									{myItemSubTypes[data.storyItemSubType]
										? `(${myItemSubTypes[data.storyItemSubType]})`
										: ""}
								</p>
								<p>Purchased On: {Format.DateDisplay(data.created!)}</p>
							</>
						)
					)}
					{/* Conditional rendering for action buttons */}
					{!isLoading &&
					data &&
					[
						CreditSpendType.VideoLandscape,
						CreditSpendType.VideoPortrait,
						CreditSpendType.VideoLandscapeSubtitle,
					].includes(data.creditSpendType!)
						? data.itemUrl && (
								<Link
									href={data.itemUrl}
									download
									className="text-blue-600 hover:underline"
									target="_blank"
									rel="noopener noreferrer"
								>
									Download
								</Link>
							)
						: !isLoading &&
							data && (
								<Link
									href={`/story/${data.topLevelCategory}/${data.slug}/download-pdf`}
									className="text-blue-600 hover:underline"
									rel="noopener noreferrer"
								>
									Download Page
								</Link>
							)}
				</div>
			</div>
		</div>
	);
};

export default UserItemCard;
