import CustomImageSuspense from "@/features/story/components/custom-image-suspense";

export default function Random() {
	return (
		<CustomImageSuspense
			width={16}
			pixelSize={10}
			loadingDuration={10000}
			height={9}
			imageSrc="https://ik.imagekit.io/storybird/staging/images/f8aaf7a9-378e-4e31-9689-477ae6ab1b6b/2_286949388.webp"
		/>
	);
}
