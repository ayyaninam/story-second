import React, { FC } from "react";
import Format from "@/utils/format";
import Image from "next/image";

import { ImagePage } from "../constants";

interface ImageViewProps {
	page: ImagePage;
}

const ImageView = ({ page }: ImageViewProps) => (
	<div className="flex flex-col flex-1 w-full gap-2 min-w-[250px] max-w-[512px]">
		<div className="relative aspect-square w-full my-auto">
			<Image
				alt="Placeholder image"
				className="aspect-square rounded-lg"
				src={Format.GetImageUrl(page.imageKey)}
				sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
				width={512}
				height={512}
			/>
		</div>
	</div>
);

export default ImageView;
