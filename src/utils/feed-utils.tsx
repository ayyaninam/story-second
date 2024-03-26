import { mainSchema } from "@/api/schema";
import Format from "@/utils/format";
import { VideoThumbnail } from "@/types";

export const getGenreNameFromSlug = (genreSlug?: string | null) => {
	return (
		genreSlug
			?.split("-")
			.filter(Boolean)
			.map((word) => word?.[0]?.toUpperCase() + word.slice(1))
			.join(" ") || ""
	);
};

export const getGalleryThumbnails = (
	stories: mainSchema["ReturnWebStoryDTO"][],
	expandable?: boolean
): VideoThumbnail[] => {
	let lastExpandedIndex = -7;
	return stories.map((story, index) => {
		const shouldExpand =
			expandable &&
			index - lastExpandedIndex > 6 &&
			(stories.length < 10 ? index === 0 : Math.random() < 0.5);
		if (shouldExpand) {
			lastExpandedIndex = index;
		}
		return {
			id: story.id,
			title: story.storyTitle,
			thumbnail: story.coverImage ? Format.GetImageUrl(story.coverImage) : null,
			description: story.summary,
			storyType: story.storyType,
			topLevelCategory: getGenreNameFromSlug(story.topLevelCategory),
			slug: story.slug,
			expand: shouldExpand,
			storyLikes: story.storyLikes,
		};
	});
};
