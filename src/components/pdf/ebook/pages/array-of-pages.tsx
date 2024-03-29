import { Image, Page, StyleSheet, Text } from "@react-pdf/renderer";
import { WebStory } from "@/components/ui/story-book/constants";

import { pageSize, globalStyles } from "../index";
import Format from "@/utils/format";

const styles = StyleSheet.create({
	text: {
		fontSize: 15,
		maxWidth: 280,
		textAlign: "center",
		lineHeight: 1.3,
		letterSpacing: "1px",
		marginRight: 30,
		marginBottom: 30,
	},
	imageContainer: {
		width: "70%",
	},
	image: {
		borderRadius: 20,
	},
	imageFogBorders: {
		position: "absolute",
		width: "104%",
		height: "104%",
		top: "-2%",
		left: "-2%",
	},
	pageNumberLeftSide: {
		position: "absolute",
		bottom: 0,
		left: 0,
		marginBottom: 20,
		marginLeft: 20,
		fontSize: 11,
	},
	pageNumberRightSide: {
		position: "absolute",
		bottom: 0,
		right: 0,
		marginBottom: 20,
		marginRight: 20,
		fontSize: 11,
	},
});

interface StorybookPDFProps {
	storyData: WebStory;
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
					<Text style={styles.text}>{page.text}</Text>
					<Text style={styles.pageNumberLeftSide}>{2 * index + 1}</Text>
				</Page>
				<Page size={pageSize} style={globalStyles.page}>
					<div style={styles.imageContainer}>
						<Image style={styles.image} src={page.imageURL ?? ""} />
						<Image
							style={styles.imageFogBorders}
							src={"/pdfs/viewer/fog-borders-ebook.png"}
						/>
					</div>

					<Text style={styles.pageNumberRightSide}>{2 * index + 2}</Text>
				</Page>
			</>
		)) ?? null
	);
};

export default ArrayOfPagesPDF;
