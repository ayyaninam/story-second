import api from "@/api";
import Routes from "@/routes";
import { AuthError, getServerSideSessionWithRedirect } from "@/utils/auth";
import { StoryOutputTypes } from "@/utils/enums";
import {
	GetServerSideProps,
	GetServerSidePropsContext,
	InferGetServerSidePropsType,
} from "next";

function DevToken({
	session,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
	return <div>{JSON.stringify(session)} </div>;
}

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
	try {
		const session = await getServerSideSessionWithRedirect(ctx.req, ctx.res);

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

export default DevToken;
