import {
	authFetcher,
	mlFetcher,
	publicFetcher,
	publicProxyApiFetcher,
} from "@/lib/fetcher";
import { mainSchema, mlSchema } from "../schema";
import { getJwt } from "@/utils/jwt";
import { StoryOutputTypes } from "@/utils/enums";
import { PaginationParams, RegenerateVideoSegments } from "@/types";

const video = {
	getUploadUrl: async (params: {
		fileName: string;
		contentType: string;
	}): Promise<mainSchema["UploadToS3DTOApiResponse"]> => {
		return await publicProxyApiFetcher
			.get(`proxyApi/Video/PreSignedUrl`, { searchParams: params })
			.json();
	},
	get: async (
		topLevelCategory: string,
		slug: string,
		storyType: StoryOutputTypes,
		requireAuth?: boolean
	): Promise<mainSchema["ReturnVideoStoryDTO"]> => {
		let fetcher = publicFetcher;
		let endpoint =
			storyType === StoryOutputTypes.Story
				? `api/StoryBook/${topLevelCategory}/${slug}`
				: `api/Video/${topLevelCategory}/${slug}`;
		if (requireAuth) {
			fetcher = publicProxyApiFetcher;
			endpoint = endpoint.replace("api/", "proxyApi/");
		}
		console.log(endpoint);
		const data:
			| mainSchema["ReturnVideoStoryDTOApiResponse"]
			| mainSchema["ReturnWebStoryDTOApiResponse"] = await fetcher
			.get(endpoint, {
				searchParams: { storyType },
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
	getStoryServer: async (
		topLevelCategory: string,
		slug: string,
		storyType: StoryOutputTypes,
		accessToken?: string | null
	): Promise<mainSchema["ReturnVideoStoryDTO"]> => {
		let fetcher = publicFetcher;
		if (accessToken) fetcher = authFetcher(accessToken);
		const endpoint =
			storyType === StoryOutputTypes.Story
				? `api/StoryBook/${topLevelCategory}/${slug}`
				: `api/Video/${topLevelCategory}/${slug}`;

		console.log("endpoint", endpoint);
		const data:
			| mainSchema["ReturnWebStoryDTOApiResponse"]
			| mainSchema["ReturnVideoStoryDTOApiResponse"] = await fetcher
			.get(endpoint, {
				searchParams: { storyType },
			})
			.json();
		console.log("Response from getStoryServer", data);

		if (!data.succeeded) {
			console.log(data);
			throw new Error("Story not found");
		}
		if (!data.data) {
			throw new Error("No data returned");
		}

		return data.data;
	},
	editSegment: async (
		params: mlSchema["EditSegmentRequest"],
		accessToken?: string
	) => {
		const data: string = await mlFetcher(accessToken ?? getJwt())
			.put(`edit-segments`, {
				body: JSON.stringify(params),
			})
			.json();

		return data;
	},
	editScenes: async (
		params: mlSchema["EditSceneRequest"],
		accessToken?: string
	) => {
		const data: string = await mlFetcher(accessToken ?? getJwt())
			.put(`edit-scenes`, {
				body: JSON.stringify(params),
			})
			.json();

		return data;
	},
	regenerateAllAudio: async (
		params: mlSchema["RegenerateAudioRequest"],
		accessToken?: string
	): Promise<unknown> => {
		const data = await mlFetcher(accessToken ?? getJwt())
			.post(`regenerate-audio`, {
				body: JSON.stringify(params),
			})
			.json();

		return data;
	},
	uploadSegmentImage: async (params: {
		id: string;
		image: File;
		index: number;
		accessToken?: string;
	}) => {
		const body = new FormData();
		body.append("image", params.image);
		body.append("index", params.index.toString());
		const data: string = await publicProxyApiFetcher
			.post(`proxyApi/WebStory/SaveStorySegmentImage/${params.id}`, {
				body: body,
			})
			.json();

		return data;
	},
	regenerateImage: async (
		params: mlSchema["RegenerateImageRequest"],
		accessToken?: string
	): Promise<RegenerateVideoSegments> => {
		const data = await mlFetcher(accessToken ?? getJwt())
			.post(`regenerate-image`, {
				body: JSON.stringify(params),
			})
			.json();

		return data as RegenerateVideoSegments;
	},
	saveImage: async (
		params: mlSchema["SaveImageRequest"],
		accessToken?: string
	): Promise<unknown> => {
		const data = await mlFetcher(accessToken ?? getJwt())
			.put(`save-image`, {
				body: JSON.stringify(params),
			})
			.json();

		return data;
	},
	regenerateVideo: async (
		params: mlSchema["RegenerateVideoRequest"],
		accessToken?: string
	): Promise<unknown> => {
		const data = await mlFetcher(accessToken ?? getJwt())
			.post(`regenerate-video`, {
				body: JSON.stringify(params),
			})
			.json();

		return data;
	},
	regenerateAllImages: async (
		params: mlSchema["RegenerateAllImagesRequest"],
		accessToken?: string
	): Promise<unknown> => {
		const data = await mlFetcher(accessToken ?? getJwt())
			.post(`regenerate-all-images`, {
				body: JSON.stringify(params),
			})
			.json();

		return data;
	},
	regenerateAllVideos: async (
		params: mlSchema["RegenerateAllVideosRequest"],
		accessToken?: string
	): Promise<unknown> => {
		const data = await mlFetcher(accessToken ?? getJwt())
			.post(`regenerate-all-videos`, {
				body: JSON.stringify(params),
			})
			.json();

		return data;
	},
	render: async ({
		id,
	}: {
		id: string;
	}): Promise<string | undefined | null> => {
		const data: mainSchema["StringApiResponse"] = await publicProxyApiFetcher
			.put(`proxyApi/Video/${id}/RenderVideo`, {
				searchParams: { storyItemSubType: 2 },
			})
			.json();
		const status = data.status;
		if (status === 204) return null;
		if (!data.data) {
			throw new Error(data.message || "Internal Server Error");
		}
		return data?.data;
	},
	copyVideo: async ({
		id,
	}: {
		id: string;
		accessToken?: string;
	}): Promise<mainSchema["ReturnVideoStoryDTO"] | null> => {
		const data: mainSchema["ReturnVideoStoryDTOApiResponse"] =
			await publicProxyApiFetcher.post(`proxyApi/Video/CopyVideo/${id}`).json();
		if (!data.data) return null;
		return data?.data;
	},
	copyStory: async ({
		id,
	}: {
		id: string;
		accessToken?: string;
	}): Promise<mainSchema["ReturnWebStoryDTO"] | null> => {
		const data: mainSchema["ReturnWebStoryDTOApiResponse"] =
			await publicProxyApiFetcher
				.post(`proxyApi/StoryBook/CopyStoryBook/${id}`)
				.json();
		if (!data.data) return null;
		return data?.data;
	},
	getSuggestedVideos: async ({
		id,
		storyType,
		DisplayResolution,
		searchParams,
	}: {
		id: string;
		storyType: StoryOutputTypes;
		searchParams: PaginationParams;
		DisplayResolution: number;
	}): Promise<mainSchema["ReturnVideoStoryDTOListApiResponse"]> => {
		const data: mainSchema["ReturnVideoStoryDTOListApiResponse"] =
			await publicFetcher
				.get(`api/Video/${id}/Suggested`, {
					searchParams: {
						...searchParams,
						storyType: storyType,
						DisplayResolution,
					},
				})
				.json();

		if (!data.succeeded) {
		}

		if (!data.data) {
			throw new Error("No data returned");
		}

		return data;
	},
};

export default video;
