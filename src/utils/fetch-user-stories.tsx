import { genreOptions, VIDEO_ORIENTATIONS } from "@/constants/feed-constants";
import { DisplayAspectRatios, StoryOutputTypes } from "@/utils/enums";
import { QueryKeys } from "@/lib/queryKeys";
import api from "@/api";
import { QueryClient } from "@tanstack/react-query";

interface FetchUserStoriesParams {
	genre: string;
	page: string;
	orientation: string;
	sort: string;
	profileName: string;
}

export async function fetchUserFeedStories(
	{
		genre: queryGenre,
		orientation = VIDEO_ORIENTATIONS.ALL.id,
		page = "1",
		sort = "desc",
		profileName = "",
	}: FetchUserStoriesParams,
	queryClient: QueryClient,
	accessToken?: string
) {
	const genre = genreOptions.find((g) => g.id === queryGenre)?.id || "all";
	const isDescending = sort === "desc";
	const currentPage = parseInt(page, 10);
	const baseParams = {
		PageSize: 5,
		CurrentPage: currentPage,
		topLevelCategory: genre,
		isDescending,
	};

	const orientations = {
		[VIDEO_ORIENTATIONS.ALL.id]: [
			{
				...baseParams,
				PageSize: 7,
				resolution: DisplayAspectRatios["1024x576"],
				storyType: StoryOutputTypes.Video,
				queryKey: QueryKeys.USER_WIDE_VIDEOS,
			},
			{
				...baseParams,
				resolution: DisplayAspectRatios["576x1024"],
				storyType: StoryOutputTypes.Video,
				queryKey: QueryKeys.USER_VERTICAL_VIDEOS,
			},
			{ ...baseParams, queryKey: QueryKeys.USER_STORY_BOOKS },
			{
				...baseParams,
				resolution: DisplayAspectRatios["576x1024"],
				storyType: StoryOutputTypes.SplitScreen,
				queryKey: QueryKeys.USER_TIK_TOK,
			},
		],
		[VIDEO_ORIENTATIONS.BOOK.id]: [
			{ ...baseParams, PageSize: 20, queryKey: QueryKeys.USER_STORY_BOOKS },
		],
		[VIDEO_ORIENTATIONS.TIK_TOK.id]: [
			{
				...baseParams,
				PageSize: 20,
				resolution: DisplayAspectRatios["576x1024"],
				storyType: StoryOutputTypes.SplitScreen,
				queryKey: QueryKeys.USER_TIK_TOK,
			},
		],
		default: [
			{
				...baseParams,
				PageSize: 20,
				resolution:
					orientation === VIDEO_ORIENTATIONS.WIDE.id
						? DisplayAspectRatios["1024x576"]
						: DisplayAspectRatios["576x1024"],
				storyType: StoryOutputTypes.Video,
				queryKey: QueryKeys.USER_WIDE_VIDEOS,
			},
		],
	};

	const fetchQueries = orientations[orientation] || orientations.default;

	let fetchQueryFn = api.feed.getUserStoriesServer;
	if (profileName !== "") {
		fetchQueryFn = (params) =>
			api.feed.getUserStoriesServer({
				...params,
				profileName,
			});
	}
	if (accessToken) {
		fetchQueryFn = (params) =>
			fetchQueryFn({
				...params,
				accessToken,
			});
	}

	try {
		await Promise.all(
			fetchQueries.map(({ queryKey, ...queryParams }) =>
				queryClient.fetchQuery({
					queryFn: () =>
						fetchQueryFn({ params: queryParams, profileName: profileName }),
					queryKey: [queryKey, genre, isDescending, currentPage, profileName],
					staleTime: 3000,
				})
			)
		);
	} catch (error) {}
}
