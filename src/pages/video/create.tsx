import api from "@/api";
import { env } from "@/env.mjs";
import EditStory from "@/features/edit-story";
import Routes from "@/routes";
import { CreateInitialStoryQueryParams } from "@/types";
import { getAccessToken, withPageAuthRequired } from "@auth0/nextjs-auth0";
import { access } from "fs";
import { InferGetServerSidePropsType } from "next";

const redirectToHomepage = (options?: { errorMessage?: string }) => {
	if (options?.errorMessage) {
		return {
			redirect: {
				destination: "/?error=" + encodeURIComponent(options.errorMessage),
				permanent: false,
			},
		};
	} else {
		return {
			redirect: {
				destination: "/",
				permanent: false,
			},
		};
	}
};

function convertAndValidateStoryQueryParams<
	T extends keyof CreateInitialStoryQueryParams,
>(
	key: T,
	value: any // Use any here because we're accepting various types for conversion
): CreateInitialStoryQueryParams[T] {
	let convertedValue: any;

	switch (key) {
		// Add case for each type that needs specific handling
		case "image_style":
		case "language":
		case "length":
		case "input_type":
		case "output_type":
		case "image_resolution":
			convertedValue = Number(value);
			break;
		case "video_key":
		case "prompt":
			convertedValue = String(value);
			break;
		default:
			convertedValue = value;
	}

	return convertedValue;
}

function StoryPage() {
	// props: InferGetServerSidePropsType<typeof getServerSideProps>
	// const { image_style, language, length, prompt } = props;
	// api.webstory.create({ image_style, language, length, prompt });
	return <div>If you are here, there has been an error</div>;
}
export const getServerSideProps = withPageAuthRequired({
	getServerSideProps: async (ctx) => {
		try {
			const { accessToken } = await getAccessToken(ctx.req, ctx.res, {
				authorizationParams: {
					audience: env.NEXT_PUBLIC_AUTH0_AUDIENCE,
				},
			});
			const queryParams = ctx.query;
			// Access the query params
			const {
				image_style,
				language,
				length,
				prompt,
				image_resolution,
				input_type,
				output_type,
				video_key,
			} = queryParams as unknown as CreateInitialStoryQueryParams;

			// Redirect to home if any of the required query params are missing
			if (
				!image_style ||
				!language ||
				!length ||
				!prompt ||
				!accessToken ||
				!output_type ||
				!input_type ||
				!image_resolution
			)
				throw new Error("Missing required params");

			const { url } = await api.webstory.create(
				{
					image_style: convertAndValidateStoryQueryParams(
						"image_style",
						image_style
					),
					language: convertAndValidateStoryQueryParams("language", language),
					length: convertAndValidateStoryQueryParams("length", length),
					prompt: convertAndValidateStoryQueryParams("prompt", prompt),
					input_type: convertAndValidateStoryQueryParams(
						"input_type",
						input_type
					),
					output_type: convertAndValidateStoryQueryParams(
						"output_type",
						output_type
					),
					video_key: convertAndValidateStoryQueryParams("video_key", video_key),
					image_resolution: convertAndValidateStoryQueryParams(
						"image_resolution",
						image_resolution
					),
				},
				accessToken as string
			);
			const [genre, id] = url.split("/");
			// If the url is not in the expected format, redirect to home
			if (!genre || !id)
				throw new Error(
					"Invalid response from server, no genre or id provided"
				);

			return {
				redirect: {
					destination: Routes.EditStory(genre, id),
					permanent: false,
				},
			};
		} catch (error) {
			if (error instanceof Error) {
				console.error(error.message);
				return redirectToHomepage({ errorMessage: error.message });
			}
		} finally {
			// Not sure why we need a finally but TS stops complaining if it's there
			return redirectToHomepage();
		}
	},
});

export default StoryPage;
