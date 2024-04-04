import React from "react";
import Image from "next/image";
import Link from "next/link";
import Format from "@/utils/format";
import { AmazonPublishLifecycle } from "@/constants/amazon-constants";
import { mainSchema } from "@/api/schema";
import { CheckIcon } from "lucide-react";
import { XIcon } from "react-share";

export const displayStatus = (lifecycle: AmazonPublishLifecycle) => {
	switch (lifecycle) {
		case AmazonPublishLifecycle.Requested:
			return "Requested";
		case AmazonPublishLifecycle.Processing:
			return "Submitted";
		case AmazonPublishLifecycle.Published:
			return "Accepted";
		case AmazonPublishLifecycle.Rejected:
			return "Rejected";
		case AmazonPublishLifecycle.SelfPublished:
			return "Self Published";
		default:
			return "Unknown Status";
	}
};

const AmazonStatusCard = ({
	data,
}: {
	data: mainSchema["ReturnUserAmazonBookDTO"];
}) => {
	return (
		<div className="border-2 border-gray-300 rounded-lg p-4 shadow-md">
			<div className="flex flex-col md:flex-row gap-4 items-center">
				{/* Image or cover of the item, with a fixed width but responsive height */}
				<div
					className="w-40 md:w-32 lg:w-36 xl:w-40 flex-shrink-0 relative"
					style={{ height: "auto" }}
				>
					<Image
						src={Format.GetImageUrl(data.coverImage!)}
						alt="Story Cover"
						width={160} // Set to the width of the container for large screens
						height={160} // Adjust the height based on the desired aspect ratio, for example, 4:3
						layout="responsive"
						className="rounded-md"
					/>
				</div>
				<div className="flex-grow text-sm w-full text-center">
					<h4 className="text-lg font-semibold">{data.title}</h4>
					<p>Status: {displayStatus(data.amazonPublishLifecycle)}</p>
					<p>Submitted Date: {Format.DateDisplay(data.created!)}</p>
					{data.amazonURL && (
						<Link
							href={data.amazonURL}
							className="text-blue-600 hover:underline"
						>
							View on Amazon
						</Link>
					)}
					<div
						className={`${data.amazonPublishLifecycle === AmazonPublishLifecycle.SelfPublished ? "hidden" : ""}`}
					>
						<ProgressBar lifecycle={data.amazonPublishLifecycle} />
					</div>
					<div
						className={`${data.amazonPublishLifecycle === AmazonPublishLifecycle.SelfPublished ? "" : "hidden"}`}
					>
						<Link
							href={`/story/${data.topLevelCategory}/${data.slug}/publish-book/download`}
							className="text-blue-600 hover:underline"
							rel="noopener noreferrer"
						>
							Download Page
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
};

export default AmazonStatusCard;

const ProgressBar = ({ lifecycle }: { lifecycle: AmazonPublishLifecycle }) => {
	const lifecycleToStep: Record<AmazonPublishLifecycle, number> = {
		[AmazonPublishLifecycle.None]: -1,
		[AmazonPublishLifecycle.Requested]: 0,
		[AmazonPublishLifecycle.Processing]: 1,
		[AmazonPublishLifecycle.Published]: 2,
		[AmazonPublishLifecycle.Rejected]: -1, // Assuming Rejected is not part of the linear steps
		[AmazonPublishLifecycle.SelfPublished]: -1, // Assuming SelfPublished is not part of the linear steps
	};

	const stepStatus = (step: number) => {
		if (lifecycle === AmazonPublishLifecycle.Rejected) return "rejected";
		const currentStep =
			lifecycleToStep[lifecycle] !== undefined
				? lifecycleToStep[lifecycle]
				: -1;
		return step <= currentStep ? "completed" : "pending";
	};

	return (
		<div className="mt-4">
			<div className="flex items-center justify-between">
				{["Requested", "Processing", "Published"].map((label, index) => (
					<div key={index} className="flex flex-col items-center">
						<div
							className={`h-6 w-6 rounded-full flex items-center justify-center ${
								stepStatus(index) === "completed"
									? "bg-accent-500"
									: stepStatus(index) === "rejected"
										? "bg-red-500"
										: "bg-gray-200"
							}`}
						>
							{stepStatus(index) === "completed" && (
								<CheckIcon className="text-white" size={16} />
							)}
							{stepStatus(index) === "rejected" && (
								<XIcon className="text-white" size={16} />
							)}
						</div>
						<span className="text-xs mt-2">{label}</span>
					</div>
				))}
			</div>
		</div>
	);
};
