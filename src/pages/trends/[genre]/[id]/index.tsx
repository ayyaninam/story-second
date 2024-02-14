import PublishedStory from "@/features/publish-story";
import api from "@/api";
import { mainSchema } from "@/api/schema";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { StoryOutputTypes } from "@/utils/enums";
import { WebStoryProvider } from "@/features/edit-story/providers/WebstoryContext";

export default function PublishPage({
	storyData,
}: {
	storyData: mainSchema["ReturnVideoStoryDTO"];
}) {
	return (
		<WebStoryProvider initialValue={storyData}>
			<PublishedStory storyData={storyData} />
		</WebStoryProvider>
	);
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
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
		StoryOutputTypes.SplitScreen
	);

	return { props: { storyData } };
};
