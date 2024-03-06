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

const _POST: AppRouteHandlerFn = async (request: NextRequest) => {
	const response = new NextResponse();

	return NextResponse.json(
		{
			storyPath: "http://localhost:3000/trends/fantasy/the-enchanted-forest-56",
		},
		{ status: 500, statusText: "Internal Server Error" }
	);
};

export const POST = withApiAuthRequired(_POST);
