import React from "react";
import Image from "next/image";

import Format from "@/utils/format";
import { Skeleton } from "@/components/ui/skeleton";
import { ImagePage } from "../../constants";

interface ImageViewProps {
	page: ImagePage;
}

const ImageView = ({ page }: ImageViewProps) => {
	const isLoading = !page.imageKey;

	if (isLoading) {
		return (
			<div className="flex justify-center items-center">
				<Skeleton className="w-full aspect-square rounded-xl" />
			</div>
		);
	}

	return (
		<div className="flex flex-col flex-1 w-full gap-2 min-w-[250px] max-w-[512px]">
			<div className="relative aspect-square w-full my-auto">
				<Image
					alt="Placeholder image"
					className="aspect-square rounded-lg"
					src={Format.GetImageUrl(page.imageKey!)}
					sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
					width={512}
					height={512}
				/>
			</div>
		</div>
	);
};

export default ImageView;
