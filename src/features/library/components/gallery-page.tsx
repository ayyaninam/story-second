import React, { useEffect } from "react";
import LibraryGalleryComponent from "./gallery-component";
import { VideoOrientation, VideoThumbnail } from "@/types";
import { LIBRARY_HOME_GALLERY_DATA, VIDEO_ORIENTATIONS } from "../constants";
import { DisplayAspectRatios } from "@/utils/enums";
import { useQuery } from "@tanstack/react-query";
import { mainSchema } from "@/api/schema";
import api from "@/api";
import { QueryKeys } from "@/lib/queryKeys";
import { useRouter } from "next/router";
import Format from "@/utils/format";

function LibraryGalleryPage({
	orientation = "wide",
}: {
	orientation: VideoOrientation;
}) {
	const router = useRouter();
	const galleryDetails = LIBRARY_HOME_GALLERY_DATA[orientation] || {};
	const StoriesList = useQuery<mainSchema["ReturnWebStoryDTOPagedList"]>({
		queryFn: () =>
			api.library.getStories({
				params: {
					currentPage: 1,
					pageSize: 50,
					liked: false,
					sortType: "latest",
				},
			}),
		staleTime: 3000,
		// eslint-disable-next-line @tanstack/query/exhaustive-deps -- pathname includes everything we need
		queryKey: [QueryKeys.LIBRARY_STORIES, router.asPath],
	});
	const [segregatedStories, setSegregatedStories] = React.useState<{
		[key: string]: VideoThumbnail[];
	}>({});
	useEffect(() => {
		if (StoriesList.data) {
			const segregatedStories = StoriesList.data.items.reduce(
				(acc, story, index) => {
					const isWideOrientation =
						story.resolution === DisplayAspectRatios["1024x576"];
					const thumbnailInfo = {
						id: story.id,
						title: story.storyTitle,
						thumbnail: story.coverImage
							? Format.GetImageUrl(story.coverImage)
							: null,
						description: story.summary,
						topLevelCategory: story.topLevelCategory,
						slug: story.slug,
						storyType: story.storyType,
					};
					if (isWideOrientation) {
						acc[VIDEO_ORIENTATIONS.WIDE.id] = [
							...(acc[VIDEO_ORIENTATIONS.WIDE.id] || []),
							{
								...thumbnailInfo,
								expand: Math.random() > 0.95,
							},
						];
					} else {
						acc[VIDEO_ORIENTATIONS.VERTICAL.id] = [
							...(acc[VIDEO_ORIENTATIONS.VERTICAL.id] || []),
							thumbnailInfo,
						];
						acc[VIDEO_ORIENTATIONS.BOOK.id] = [
							...(acc[VIDEO_ORIENTATIONS.BOOK.id] || []),
							thumbnailInfo,
						];
					}
					return acc;
				},
				{} as { [key: string]: VideoThumbnail[] }
			);
			setSegregatedStories(segregatedStories);
		}
	}, [StoriesList.data]);
	return (
		<div className="flex flex-col gap-4 max-w-[1440px] mx-auto px-6 pt-10">
			<LibraryGalleryComponent
				galleryDetails={galleryDetails}
				isIndependentGalleryPage
				thumbnails={segregatedStories[orientation] || []}
			/>
		</div>
	);
}

export default LibraryGalleryPage;
