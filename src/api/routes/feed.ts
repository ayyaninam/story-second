import {
	authFetcher,
	publicFetcher,
	publicProxyApiFetcher,
} from "@/lib/fetcher";
import { mainSchema } from "../schema";
import { FeedPageVideoQueryOptions } from "@/types";
import { StoryOutputTypes } from "@/utils/enums";

const feed = {
	getStories: async ({
		params,
		requireAuth = false,
	}: {
		params: FeedPageVideoQueryOptions;
		requireAuth?: boolean;
	}): Promise<
		| mainSchema["ReturnWebStoryDTOPagedList"]
		| mainSchema["ReturnVideoStoryDTOPagedList"]
	> => {
		const { topLevelCategory, storyType } = params;
		let endpoint =
			storyType === StoryOutputTypes.Story
				? `api/StoryBook/${topLevelCategory}`
				: `api/Video/${topLevelCategory}`;

		let fetcher = publicFetcher;
		if (requireAuth) {
			fetcher = publicProxyApiFetcher;
			endpoint = endpoint.replace("api", "proxyApi");
		}

		const searchParams = {
			...params,
		};

		const data:
			| mainSchema["ReturnWebStoryDTOPagedListApiResponse"]
			| mainSchema["ReturnVideoStoryDTOPagedListApiResponse"] = await fetcher
			.get(endpoint, {
				searchParams,
			})
			.json();

		if (!data.succeeded) {
			// TODO:figure out error boundaries
		}
		if (!data.data) {
			throw new Error("No data returned");
		}

		return data.data;
	},
	getStoriesServer: async ({
		params,
		accessToken,
	}: {
		params: FeedPageVideoQueryOptions;
		accessToken?: string | null;
	}) => {
		let fetcher = publicFetcher;
		if (accessToken) fetcher = authFetcher(accessToken);
		const { topLevelCategory, storyType } = params;
		// Determine the API endpoint based on the type of story
		const endpoint =
			storyType === StoryOutputTypes.Story
				? `api/StoryBook/${topLevelCategory}`
				: `api/Video/${topLevelCategory}`;
		const searchParams = {
			...params,
		};

		const data:
			| mainSchema["ReturnWebStoryDTOPagedListApiResponse"]
			| mainSchema["ReturnVideoStoryDTOPagedListApiResponse"] = await fetcher
			.get(endpoint, {
				searchParams,
			})
			.json();

		if (!data.succeeded) {
			// TODO:figure out error boundaries
		}
		if (!data.data) {
			throw new Error("No data returned");
		}

		return data.data;
	},
	getUserStories: async ({
		params,
		profileName,
		requireAuth = false,
	}: {
		params: FeedPageVideoQueryOptions;
		profileName: string;
		requireAuth?: boolean;
	}) => {
		let fetcher = publicFetcher;
		if (requireAuth) {
			fetcher = publicProxyApiFetcher;
		}

		const { topLevelCategory, storyType } = params;
		// Determine the API endpoint based on the type of story
		const endpoint =
			storyType === StoryOutputTypes.Story
				? `api/StoryBook/View/${profileName}/${topLevelCategory}`
				: `api/Video/View/${profileName}/${topLevelCategory}`;
		const searchParams = {
			...params,
		};

		const data:
			| mainSchema["ReturnWebStoryDTOPagedListApiResponse"]
			| mainSchema["ReturnVideoStoryDTOPagedListApiResponse"] = await fetcher
			.get(endpoint, {
				searchParams,
			})
			.json();

		if (!data.succeeded) {
		}
		if (!data.data) {
			throw new Error("No data returned");
		}

		return data.data;
	},
	getUserStoriesServer: async ({
		params,
		accessToken,
		profileName,
	}: {
		params: FeedPageVideoQueryOptions;
		accessToken?: string | null;
		profileName: string;
	}) => {
		let fetcher = publicFetcher;
		if (accessToken) fetcher = authFetcher(accessToken);
		// Determine the API endpoint based on the type of story
		const { topLevelCategory, storyType } = params;

		// Determine the API endpoint based on the type of story
		const endpoint =
			storyType === StoryOutputTypes.Story
				? `api/StoryBook/View/${profileName}/${topLevelCategory}`
				: `api/Video/View/${profileName}/${topLevelCategory}`;
		const searchParams = {
			...params,
		};

		const data:
			| mainSchema["ReturnWebStoryDTOPagedListApiResponse"]
			| mainSchema["ReturnVideoStoryDTOPagedListApiResponse"] = await fetcher
			.get(endpoint, {
				searchParams,
			})
			.json();

		if (!data.succeeded) {
		}
		if (!data.data) {
			throw new Error("No data returned");
		}

		return data.data;
	},
};

export default feed;
