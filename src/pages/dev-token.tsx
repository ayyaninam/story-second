import api from "@/api";
import Routes from "@/routes";
import { AuthError, getServerSideSessionWithRedirect } from "@/utils/auth";
import { StoryOutputTypes } from "@/utils/enums";
import { GetServerSideProps } from "next";

function StoryPage({ accessToken }: { accessToken: string }) {
	return accessToken;
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
	try {
		const accessToken = await getServerSideSessionWithRedirect(
			ctx.req,
			ctx.res
		);

		return { props: { accessToken } };
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
