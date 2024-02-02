import api from "@/api";
import { QueryKeys } from "@/lib/queryKeys";
import Format from "@/utils/format";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { useRouter } from "next/router";
import { ReactNode, useEffect, useState } from "react";
import { useInterval } from "usehooks-ts";
import CustomImageSuspense from "./custom-image-suspense";

// accepts a list of image keys and returns loops them with the suspense component
export default function Loading({
	generatedImages,
	children,
	isLoaded = true,
}: {
	generatedImages: string[];
	children?: ReactNode;
	isLoaded?: boolean;
}) {
	const [index, setIndex] = useState(-1);

	useEffect(() => {
		setIndex(Math.floor(Math.random() * generatedImages.length));
	}, [generatedImages]);

	useInterval(() => {
		setIndex(Math.floor(Math.random() * generatedImages.length));
	}, 5000);

	if (!generatedImages)
		return <p> Working on your story - no images available yet </p>;

	const selectedImage =
		index > generatedImages.length || -1 ? generatedImages[index] : undefined;

	return (
		<div className="relative m-auto">
			{selectedImage && (
				<CustomImageSuspense
					isLoaded={isLoaded}
					pixelSize={40}
					height={11.25}
					width={20}
					loadingDuration={2200}
					imageSrc={Format.GetImageUrl(selectedImage)}
				/>
			)}
			{children}
		</div>
	);
}
