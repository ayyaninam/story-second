import PixelImageLoader from "@/features/story/components/pixelImageLoader";

export default function Page() {
	return (
		<PixelImageLoader
			duration={10000}
			height={20}
			width={20}
			pixelSize={10}
			imageSrc=""
		/>
	);
}
