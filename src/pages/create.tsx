import api from "@/api";
import Routes from "@/routes";
import { CreateInitialStoryQueryParams } from "@/types";
import { AuthError, getServerSideSessionWithRedirect } from "@/utils/auth";
import {
	DisplayAspectRatios,
	StoryOutputTypes,
} from "@/utils/enums";
import { GetServerSideProps } from "next";
import toast from "react-hot-toast";

const redirectToHomepage = {
	redirect: {
		destination: "/generate",
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

		// Redirect to home if any of the required query params are missing
		if (
			!language ||
			!length ||
			!(prompt || video_key) ||
			!output_type ||
			!input_type ||
			!image_resolution
		) {
			throw new Error("Missing required params");
		}

		const session = await getServerSideSessionWithRedirect(
			ctx.req,
			ctx.res,
			Routes.CreateStoryFromRoute({
				...queryParams,
			})
		);

		if (!session) {
			return redirectToHomepage;
		}

		const story = await api.webstory
			.create(
				{
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
				session.accessToken as string
			)
			.catch((e) => {
				// Error if not enough balance
				if (e.response?.status === 402) {
					throw new AuthError(
						Routes.defaultRedirect,
						Routes.Landing("Not enough balance to create story")
					);
				}
				console.log("There was an error generating the story: ", e);
				throw new AuthError(
					Routes.defaultRedirect,
					Routes.Landing("There was an error creating the story")
				);
			});
    if ("error" in story) {111
      toast.error(story?.error as string);
      return {
        redirect: {
          destination: Routes.ToSubscriptionPage(),
          permanent: false,
        },
      };
    }
		console.log("Story created: ", story)
		const { url } = story;

		const [genre, id] = url.split("/");

		// If the url is not in the expected format, redirect to home
		if (!genre || !id)
			throw new Error("Invalid response from server, no genre or id provided");


    // get storyType using output_type and StoryOutputTypes
    const storyType = video_key ? StoryOutputTypes.SplitScreen : StoryOutputTypes.Video;

		console.log("Redirecting to", Routes.ViewStory(storyType, genre, id));
		return {
			redirect: {
				destination: Routes.ViewStory(storyType, genre, id),
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
