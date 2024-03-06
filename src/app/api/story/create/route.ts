import {
	AppRouteHandlerFn,
	getAccessToken,
	withApiAuthRequired,
} from "@auth0/nextjs-auth0";
import { NextRequest, NextResponse } from "next/server";

import { StoryOutputTypes } from "@/utils/enums";
import api from "@/api";
import Routes from "@/routes";
import { validateRequiredFormData } from "./utils";

export const dynamic = "force-dynamic";

const postHandler: AppRouteHandlerFn = async (request: NextRequest) => {
	const response = new NextResponse();

	const params = await request.formData();

	if (!validateRequiredFormData(params)) {
		return NextResponse.json(
			{ message: "Missing required params" },
			{ status: 400 }
		);
	}

	const { accessToken } = await getAccessToken(request, response);
	if (accessToken == null) {
		return NextResponse.json({ message: "Access denied" }, { status: 401 });
	}

	const story = await api.webstory.create(params, accessToken);

	console.log("Story created: ", story);
	const { url } = story;

	const [genre, id] = url.split("/");

	// If the url is not in the expected format, respond with an error
	if (!genre || !id) {
		return NextResponse.json(
			{ message: "Invalid response from server, no genre or id provided" },
			{ status: 500 }
		);
	}

	// If a video key has been passed in we know it's a split screen story
	const storyType =
		params.get("video_key") != null
			? StoryOutputTypes.SplitScreen
			: StoryOutputTypes.Video;

	const storyPath = Routes.ViewStory(storyType, genre, id);
	return NextResponse.json({ storyPath });
};

export const POST = withApiAuthRequired(postHandler);
