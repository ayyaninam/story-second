import {
	AppRouteHandlerFn,
	getAccessToken,
	withApiAuthRequired,
} from "@auth0/nextjs-auth0";
import { NextRequest, NextResponse } from "next/server";

import { StoryOutputTypes } from "@/utils/enums";
import api from "@/api";
import Routes from "@/routes";

export const dynamic = "force-dynamic";

const postHandler: AppRouteHandlerFn = async (request: NextRequest) => {
	const response = new NextResponse();

	const params = await request.json();

	const { accessToken } = await getAccessToken(request, response);
	if (accessToken == null) {
		return NextResponse.json({ message: "Access denied" }, { status: 401 });
	}

	const story = await api.webstory.create(params, accessToken);
	const { url, story_type } = story;

	const [genre, id] = url.split("/");

	// If the url is not in the expected format, respond with an error
	if (!genre || !id) {
		return NextResponse.json(
			{},
			{
				status: 500,
				statusText: "Invalid response from server, no genre or id provided",
			}
		);
	}

	const storyType = Number(story_type) as StoryOutputTypes;
	const storyPath = Routes.ViewStory(storyType, genre, id);
	return NextResponse.json({ storyPath });
};

export const POST = withApiAuthRequired(postHandler);
