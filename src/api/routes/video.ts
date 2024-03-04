import { authFetcher, mlFetcher, publicFetcher } from "@/lib/fetcher";
import { mainSchema, mlSchema } from "../schema";
import { getJwt } from "@/utils/jwt";
import { StoryOutputTypes } from "@/utils/enums";
import { RegenerateVideoSegments } from "@/types";

const video = {
	getUploadUrl: async (
		params: { fileName: string; contentType: string },
		accessToken?: string
	): Promise<mainSchema["UploadToS3DTOApiResponse"]> => {
		return await authFetcher(accessToken || getJwt())
			.get(`api/Video/PreSignedUrl`, { searchParams: params })
			.json();
	},
	get: async (
		topLevelCategory: string,
		slug: string,
		storyType: StoryOutputTypes,
		accessToken?: string
	): Promise<mainSchema["ReturnVideoStoryDTO"]> => {
		const data: mainSchema["ReturnVideoStoryDTOApiResponse"] =
			await publicFetcher
				.get(`api/Video/${topLevelCategory}/${slug}`, {
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
		const data: string = await authFetcher(params.accessToken ?? getJwt())
			.post(`api/WebStory/SaveStorySegmentImage/${params.id}`, {
				body: body,
				headers: {
					Authorization: "Bearer " + (params.accessToken ?? getJwt()),
				},
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
		accessToken,
	}: {
		id: string;
		accessToken?: string;
	}): Promise<string | undefined | null> => {
		const data: mainSchema["StringApiResponse"] = await authFetcher(
			accessToken ?? getJwt()
		)
			.put(`api/Video/${id}/RenderVideo`, {
				searchParams: { storyItemSubType: 2 },
			})
			.json();
		const status = data.status;
		if (status === 204) return null;
		// console.log(response.data);
		if (!data.data) return null;
		return data?.data;
	},
};

export default video;
