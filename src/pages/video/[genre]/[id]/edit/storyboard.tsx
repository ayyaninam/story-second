import Storyboard from "@/features/edit-story/storyboard";
import useSaveSessionToken from "@/hooks/useSaveSessionToken";
import Routes from "@/routes";
import { AuthError, getServerSideSessionWithRedirect } from "@/utils/auth";
import { StoryOutputTypes } from "@/utils/enums";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";

function StoryPage({
	session,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
	useSaveSessionToken(session);

	return <Storyboard />;
}

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

		return { props: { session: { ...session } } };
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
