import { Image, Page, StyleSheet, Text } from "@react-pdf/renderer";
import Format from "@/utils/format";
import { WebStory } from "@/components/ui/story-book/constants";

import { pageSize, globalStyles } from "../index";

const styles = StyleSheet.create({
	text: {
		fontSize: 16,
		maxWidth: 400,
		textAlign: "center",
		lineHeight: 1.6,
		letterSpacing: "1px",
	},
	image: {
		width: "100%",
		height: "100%",
	},
	pageNumber: {
		position: "absolute",
		bottom: 0,
		right: 0,
		marginBottom: 20,
		marginRight: 20,
		fontSize: 12,
	},
});

interface StorybookPDFProps {
	storyData: WebStory | null;
}

const ArrayOfPagesPDF = ({ storyData }: StorybookPDFProps) => {
	const storyPages = storyData?.scenes
		?.flatMap((el) => el.storySegments)
		.map((segment) => ({
			imageURL: segment?.imageKey ? Format.GetImageUrl(segment.imageKey) : null,
			text: segment?.textContent,
		}));

	return (
		storyPages?.map((page, index) => (
			<>
				<Page size={pageSize} style={globalStyles.page}>
					<Image style={styles.image} src={page.imageURL ?? ""} />
				</Page>
				<Page size={pageSize} style={globalStyles.page}>
					<Text style={styles.text}>{page.text}</Text>
					<Text style={styles.pageNumber}>{index + 1}</Text>
				</Page>
			</>
		)) ?? null
	);
};

export default ArrayOfPagesPDF;
