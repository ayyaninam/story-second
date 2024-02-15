import api from "@/api";
import { env } from "@/env.mjs";
import Routes from "@/routes";
import { CreateInitialStoryQueryParams } from "@/types";
import { AuthError, getServerSideSessionWithRedirect } from "@/utils/auth";
import {
	AspectRatios,
	DisplayAspectRatios,
	StoryOutputTypes,
} from "@/utils/enums";
import {
	getAccessToken,
	getSession,
	withPageAuthRequired,
} from "@auth0/nextjs-auth0";
import { access } from "fs";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";

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
		case "display_resolution":
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

export const getServerSideProps: GetServerSideProps = async (ctx) => {
	try {
		const queryParams: CreateInitialStoryQueryParams = ctx.query;
		// Access the query params
		const {
			image_style,
			language,
			length,
			prompt,
			image_resolution,
			display_resolution,
			input_type,
			output_type,
			video_key,
		} = queryParams;

		const accessToken = await getServerSideSessionWithRedirect(
			ctx.req,
			ctx.res,
			Routes.CreateStoryFromRoute({
				...queryParams,
			})
		);

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
		) {
			throw new Error("Missing required params");
		}

		const session = await getSession(ctx.req, ctx.res);

		if (!session || !accessToken) return redirectToHomepage;

		// await api.user.get(accessToken).catch(async (e) => {
		// 	// TODO: modify to only run when there is a 400 error code
		// 	await api.user.register(
		// 		{
		// 			email: session.user.email,
		// 			name: session.user.nickname,
		// 			verificationRequired: session.user.email_verified,
		// 			profilePicture: session.user?.picture ?? null,
		// 		},
		// 		accessToken as string
		// 	);
		// });
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
					image_resolution
				),
				display_resolution: convertAndValidateStoryQueryParams(
					"display_resolution",
					display_resolution ?? DisplayAspectRatios["576x1024"] //9x16 by default
				),
			},
			accessToken as string
		);
		const { url } = story;

		const [genre, id] = url.split("/");

		// If the url is not in the expected format, redirect to home
		if (!genre || !id)
			throw new Error("Invalid response from server, no genre or id provided");

		// If a video key has been passed in we know it's a split screen story
		const storyType = video_key
			? StoryOutputTypes.SplitScreen
			: StoryOutputTypes.Video;

		console.log("Redirecting to", Routes.EditStory(storyType, genre, id));
		return {
			redirect: {
				destination: Routes.EditStory(storyType, genre, id),
				permanent: false,
			},
		};
	} catch (e) {
		if (e instanceof AuthError) {
			return {
				redirect: {
					destination: e.redirect,
					permanent: false,
				},
			};
		}
		return {
			redirect: {
				destination: Routes.defaultRedirect,
				permanent: false,
			},
		};
	}
};

export default StoryPage;
