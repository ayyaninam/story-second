import api from "@/api";
import { env } from "@/env.mjs";
import EditStory from "@/features/edit-story";
import Routes from "@/routes";
import { getAccessToken, withPageAuthRequired } from "@auth0/nextjs-auth0";
import { access } from "fs";
import { InferGetServerSidePropsType } from "next";

const redirectHomepage = {
	redirect: {
		destination: "/",
		permanent: false,
	},
};

function StoryPage() {
	// props: InferGetServerSidePropsType<typeof getServerSideProps>
	// const { image_style, language, length, prompt } = props;
	// api.webstory.create({ image_style, language, length, prompt });
	return <div>If you are here, there has been an error</div>;
}
export const getServerSideProps = withPageAuthRequired({
	getServerSideProps: async (ctx) => {
		const { accessToken } = await getAccessToken(ctx.req, ctx.res, {
			authorizationParams: {
				audience: env.NEXT_PUBLIC_AUTH0_AUDIENCE,
			},
		});
		const queryParams = ctx.query;
		try {
			// Access the query params
			const { image_style, language, length, prompt } = queryParams;

			// Redirect to home if any of the required query params are missing
			if (!image_style || !language || !length || !prompt || !accessToken)
				throw new Error("Missing required params");

			const { url } = await api.webstory.create(
				{
					image_style: Number(image_style),
					language: Number(language),
					length: Number(length),
					prompt: prompt as string,
					image_resolution: 3,
				},
				accessToken as string
			);
			const [genre, id] = url.split("/");
			// If the url is not in the expected format, redirect to home
			if (!genre || !id)
				throw new Error(
					"Invalid response from server, no genre or id provided"
				);

			return {
				redirect: {
					destination: Routes.EditStory(genre, id),
					permanent: false,
				},
			};
		} catch (error) {
			console.error(error);
			return redirectHomepage;
		}
	},
});

export default StoryPage;
