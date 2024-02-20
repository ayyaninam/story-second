import React, { useEffect } from "react";
import LibraryHeroSection from "./hero-section";
import LibraryGalleryComponent from "./gallery-component";
import { VideoOrientation, VideoThumbnail } from "@/types";
import { LIBRARY_HOME_GALLERY_DATA, VIDEO_ORIENTATIONS } from "../constants";
import { useQuery } from "@tanstack/react-query";
import { mainSchema } from "@/api/schema";
import api from "@/api";
import { QueryKeys } from "@/lib/queryKeys";
import { useRouter } from "next/router";
import { DisplayAspectRatios } from "@/utils/enums";
import Format from "@/utils/format";

function LibraryHomePage({
	setSelectedOrientationTab,
}: {
	setSelectedOrientationTab: React.Dispatch<React.SetStateAction<string>>;
}) {
	const router = useRouter();
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
					};
					if (isWideOrientation) {
						acc[VIDEO_ORIENTATIONS.WIDE.id] = [
							...(acc[VIDEO_ORIENTATIONS.WIDE.id] || []),
							{
								...thumbnailInfo,
								expand:
									!acc[VIDEO_ORIENTATIONS.WIDE.id]?.length ||
									acc[VIDEO_ORIENTATIONS.WIDE.id]?.length === 0,
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
			segregatedStories[VIDEO_ORIENTATIONS.WIDE.id] =
				segregatedStories[VIDEO_ORIENTATIONS.WIDE.id]?.slice(0, 7) || [];
			segregatedStories[VIDEO_ORIENTATIONS.VERTICAL.id] =
				segregatedStories[VIDEO_ORIENTATIONS.VERTICAL.id]?.slice(0, 5) || [];
			segregatedStories[VIDEO_ORIENTATIONS.BOOK.id] =
				segregatedStories[VIDEO_ORIENTATIONS.BOOK.id]?.slice(0, 5) || [];

			setSegregatedStories(segregatedStories);
		}
	}, [StoriesList.data]);
	return (
		<div className="flex p-4 flex-col gap-2 grow items-center justify-center">
			<LibraryHeroSection />
			<div className="flex max-w-[1440px] w-full flex-col gap-4">
				{Object.values(VIDEO_ORIENTATIONS).map((orientation) =>
					orientation.id === VIDEO_ORIENTATIONS.ALL.id ? null : (
						<LibraryGalleryComponent
							setSelectedOrientationTab={setSelectedOrientationTab}
							key={orientation.id}
							galleryDetails={
								LIBRARY_HOME_GALLERY_DATA[orientation.id as VideoOrientation]
							}
							thumbnails={segregatedStories[orientation.id] || []}
						/>
					)
				)}
			</div>
		</div>
	);
}

export default LibraryHomePage;
