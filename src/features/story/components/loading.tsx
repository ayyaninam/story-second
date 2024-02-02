import api from "@/api";
import { QueryKeys } from "@/lib/queryKeys";
import Format from "@/utils/format";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useInterval } from "usehooks-ts";
import CustomImageSuspense from "./custom-image-suspense";

// accepts a list of image keys and returns loops them with the suspense component
export default function Loading({
	generatedImages,
}: {
	generatedImages: string[];
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
		<div>
			<p>
				{selectedImage} {index}
			</p>
			{selectedImage && (
				// <div className="w-96 h-96">
				<CustomImageSuspense
					pixelSize={10}
					height={10}
					width={10}
					loadingDuration={4000}
					// imageSrc={
					// 	"https://ik.imagekit.io/storybird/staging/images/f8aaf7a9-378e-4e31-9689-477ae6ab1b6b/2_286949388.webp"
					// }
					imageSrc={Format.GetImageUrl(selectedImage)}
				/>
				// <Image
				// 	src={Format.GetImageUrl(selectedImage)}
				// 	alt="a loading image of a story segment"
				// 	width={100}
				// 	height={100}
				// />
			)}
		</div>
	);
}
