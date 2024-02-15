import api from "@/api";
import { mainSchema } from "@/api/schema";
import { env } from "@/env.mjs";
import EditStory from "@/features/edit-story";
import { WebStoryProvider } from "@/features/edit-story/providers/WebstoryContext";
import Routes from "@/routes";
import { AuthError, getServerSideSessionWithRedirect } from "@/utils/auth";
import { StoryOutputTypes } from "@/utils/enums";
import { getAccessToken, withPageAuthRequired } from "@auth0/nextjs-auth0";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";

function StoryPage({
	accessToken,
	storyData,
}: {
	accessToken: string;
	storyData: mainSchema["ReturnVideoStoryDTO"];
}) {
	// console.log(accessToken);
	return (
		<WebStoryProvider initialValue={storyData}>
			<EditStory />
		</WebStoryProvider>
	);
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
	try {
		// @ts-expect-error Not typing correctly
		const { genre, id } = ctx.params;
		if (!genre || !id) {
			return {
				notFound: true,
			};
		}
		const accessToken = await getServerSideSessionWithRedirect(
			ctx.req,
			ctx.res,
			Routes.EditStory(StoryOutputTypes.SplitScreen, genre, id)
		);

		const storyData = await api.video.get(
			genre,
			id,
			StoryOutputTypes.SplitScreen
		);

		return { props: { accessToken, storyData } };
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
