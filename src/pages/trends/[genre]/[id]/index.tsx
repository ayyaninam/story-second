import PublishedStory from "@/features/publish-story";
import api from "@/api";
import { mainSchema } from "@/api/schema";
import {
	GetServerSideProps,
	GetServerSidePropsContext,
	InferGetServerSidePropsType,
} from "next";
import { StoryOutputTypes } from "@/utils/enums";
import { WebStoryProvider } from "@/features/edit-story/providers/WebstoryContext";
import { getAccessToken, getSession } from "@auth0/nextjs-auth0";
import { useEffect } from "react";
import { setJwt } from "@/utils/jwt";
import useSaveSessionToken from "@/hooks/useSaveSessionToken";

export default function PublishPage({
	storyData,
	session,
	interactionData,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
	useSaveSessionToken(session);
	return (
		<WebStoryProvider initialValue={storyData}>
			<PublishedStory storyData={storyData} interactionData={interactionData} />
		</WebStoryProvider>
	);
}

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
	const session = await getSession(ctx.req, ctx.res);
	// @ts-expect-error Not typing correctly
	const { genre, id } = ctx.params;
	if (!genre || !id) {
		return {
			notFound: true,
		};
	}
	const storyData = await api.video.get(
		genre,
		id,
		StoryOutputTypes.SplitScreen
	);
	const interactionData = await api.webstory.interactions(id, session?.token);

	return { props: { session: { ...session }, storyData, interactionData } };
};
