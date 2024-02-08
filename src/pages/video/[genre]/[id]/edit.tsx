import EditStory from "@/features/edit-story";
import { getAccessToken, withPageAuthRequired } from "@auth0/nextjs-auth0";
import { InferGetServerSidePropsType } from "next";

function StoryPage({
	accessToken,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
	// console.log(accessToken);
	return <EditStory />;
}

export const getServerSideProps = withPageAuthRequired({
	getServerSideProps: async (ctx) => {
		const { accessToken } = await getAccessToken(ctx.req, ctx.res);
		// console.log(accessToken);

		return { props: { accessToken } };
	},
});

export default StoryPage;
