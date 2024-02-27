import api from "@/api";
import { mainSchema } from "@/api/schema";
import { env } from "@/env.mjs";
import EditStory from "@/features/edit-story";
import { WebStoryProvider } from "@/features/edit-story/providers/WebstoryContext";
import PageLayout from "@/components/layouts/PageLayout";
import useSaveSessionToken from "@/hooks/useSaveSessionToken";
import Routes from "@/routes";
import { AuthError, getServerSideSessionWithRedirect } from "@/utils/auth";
import { StoryOutputTypes } from "@/utils/enums";
import { getAccessToken, withPageAuthRequired } from "@auth0/nextjs-auth0";
import {
	GetServerSideProps,
	GetServerSidePropsContext,
	InferGetServerSidePropsType,
} from "next";
import { ReactElement } from "react";
import EditAccentStyles from "@/features/scenes/edit-accent-style";

function StoryPage({
	session,
	storyData,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
	useSaveSessionToken(session);

	return (
		<WebStoryProvider initialValue={storyData}>
			<EditAccentStyles />
			<EditStory />
		</WebStoryProvider>
	);
}
StoryPage.getLayout = function getLayout(page: ReactElement) {
	return <PageLayout pageIndex={1}>{page}</PageLayout>;
};
export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
	try {
		// @ts-expect-error Not typing correctly
		const { genre, id } = ctx.params;
		if (!genre || !id) {
			return {
				notFound: true,
			};
		}
		const session = await getServerSideSessionWithRedirect(
			ctx.req,
			ctx.res,
			Routes.EditStory(StoryOutputTypes.Video, genre, id)
		);

		const storyData = await api.video.get(genre, id, StoryOutputTypes.Video);

		return { props: { session: { ...session }, storyData } };
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
