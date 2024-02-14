import api from "@/api";
import { mainSchema } from "@/api/schema";
import { env } from "@/env.mjs";
import EditStory from "@/features/edit-story";
import { WebStoryProvider } from "@/features/edit-story/providers/WebstoryContext";
import { StoryOutputTypes } from "@/utils/enums";
import { getAccessToken, withPageAuthRequired } from "@auth0/nextjs-auth0";
import { InferGetServerSidePropsType } from "next";

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

export const getServerSideProps = withPageAuthRequired({
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
			StoryOutputTypes.SplitScreen,
			accessToken
		);

		return { props: { accessToken, storyData } };
	},
});

export default StoryPage;
