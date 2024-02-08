import { authFetcher, mlFetcher, publicFetcher } from "@/lib/fetcher";
import schema from "../schema";
import { getJwt } from "@/utils/auth";

const video = {
	getUploadUrl: async (
		params: { fileName: string; conteentType: string },
		token?: string
	): Promise<schema["StringApiResponse"]> => {
		return await authFetcher(token || getJwt())
			.get(`api/Video/PreSignedUrl`, { searchParams: params })
			.json();
	},
	create: async (
		params: {
			prompt?: string;
			image_style?: schema["ImageStyles"];
			language?: schema["StoryLanguages"];
			length?: schema["StoryLength"];
		},
		token?: string
	): Promise<{
		title: string;
		englishTitle: string;
		blurb: string;
		category: string;
		cover_image: string;
		image_style: number;
		url: string;
	}> =>
		await mlFetcher(token || getJwt())
			.post(`create-story`, {
				body: JSON.stringify(params),
			})
			.json(),
};

export default video;
