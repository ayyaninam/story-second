import api from "@/api";
import { mainSchema } from "@/api/schema";
import EditStory from "@/features/edit-story";
import { getAccessToken, withPageAuthRequired } from "@auth0/nextjs-auth0";
import { InferGetServerSidePropsType } from "next";

function StoryPage({
	accessToken,
	storyData,
}: {
	accessToken: string;
	storyData: mainSchema["ReturnWebStoryDTO"];
}) {
	// console.log(accessToken);
	return <EditStory storyData={storyData} />;
}

export const getServerSideProps = withPageAuthRequired({
	getServerSideProps: async (ctx) => {
		const { accessToken } = await getAccessToken(ctx.req, ctx.res);
		// @ts-expect-error Not typing correctly
		const { genre, id } = ctx.params;
		if (!genre || !id) {
			return {
				notFound: true,
			};
		}
		const storyData = await api.library.get(genre, id, accessToken);

		return { props: { accessToken, storyData } };
	},
});

export default StoryPage;
