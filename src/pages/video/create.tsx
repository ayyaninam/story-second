import api from "@/api";
import { env } from "@/env.mjs";
import EditStory from "@/features/edit-story";
import Routes from "@/routes";
import { CreateInitialStoryQueryParams } from "@/types";
import { AspectRatios } from "@/utils/enums";
import {
	getAccessToken,
	getSession,
	withPageAuthRequired,
} from "@auth0/nextjs-auth0";
import { access } from "fs";
import { InferGetServerSidePropsType } from "next";

const redirectToHomepage = {
	redirect: {
		destination: "/",
		permanent: false,
	},
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
	return <div>If you are here, there has been an error</div>;
}
export const getServerSideProps = withPageAuthRequired({
	// @ts-expect-error Some weird type error here
	getServerSideProps: async (ctx) => {
		let accessToken: string | undefined = undefined;
		try {
			const Token = await getAccessToken(ctx.req, ctx.res, {
				authorizationParams: {
					audience: env.NEXT_PUBLIC_AUTH0_AUDIENCE,
				},
			});
			accessToken = Token.accessToken;
		} catch (e) {
			return {
				redirect: {
					destination: "/api/auth/login",
					permanent: false,
				},
			};
		}
		try {
			const session = await getSession(ctx.req, ctx.res);

			if (!session || !accessToken) return redirectToHomepage;
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
				!(prompt || video_key) ||
				!accessToken ||
				!output_type ||
				!input_type ||
				!image_resolution
			)
				throw new Error("Missing required params");

			await api.user.get(accessToken).catch(async (e) => {
				// TODO: modify to only run when there is a 400 error code
				await api.user.register(
					{
						email: session.user.email,
						name: session.user.nickname,
						verificationRequired: session.user.email_verified,
						profilePicture: session.user?.picture ?? null,
					},
					accessToken as string
				);
			});
			const story = await api.webstory.create(
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
						AspectRatios["1152x1024"]
					),
				},
				accessToken as string
			);
			const { url } = story;

			const [genre, id] = url.split("/");

			// If the url is not in the expected format, redirect to home
			if (!genre || !id)
				throw new Error(
					"Invalid response from server, no genre or id provided"
				);
			console.log("Redirecting to", Routes.EditStory(genre, id));
			return {
				redirect: {
					destination: Routes.EditStory(genre, id),
					permanent: false,
				},
			};
		} catch (error) {
			if (error instanceof Error) {
				console.error(error.message);
				return redirectToHomepage;
			}
		}
	},
});

export default StoryPage;
