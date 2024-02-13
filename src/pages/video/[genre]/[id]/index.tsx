import PublishedStory from "@/features/publish-story";
import api from "@/api";
import { mainSchema } from "@/api/schema";
import EditStory from "@/features/edit-story";
import { getAccessToken, withPageAuthRequired } from "@auth0/nextjs-auth0";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";

export default function PublishPage({
	storyData,
}: {
	storyData: mainSchema["ReturnWebStoryDTO"];
}) {
	return <PublishedStory storyData={storyData} />;
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
	// @ts-expect-error Not typing correctly
	const { genre, id } = ctx.params;
	if (!genre || !id) {
		return {
			notFound: true,
		};
	}
	const storyData = await api.library.get(genre, id);

	return { props: { storyData } };
};
