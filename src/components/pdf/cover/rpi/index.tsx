import React from "react";
import { WebStory } from "@/components/ui/story-book/constants";
import { PageSize } from "@react-pdf/types";
import {
	Page,
	Text,
	Document,
	Image,
	StyleSheet,
	Font,
} from "@react-pdf/renderer";
import Format from "@/utils/format";

Font.register({
	family: "Aleo",
	src: "/pdfs/viewer/fonts/Aleo/Aleo-VariableFont_wght.ttf",
});
Font.register({
	family: "AleoBold",
	src: "/pdfs/viewer/fonts/Aleo/Aleo-Bold.ttf",
});

export const styles = StyleSheet.create({
	root: {
		fontFamily: "Aleo",
	},
	page: {
		display: "flex",
		flexDirection: "row",
		backgroundColor: "#f1e7d4",
	},
	leftSide: {
		display: "flex",
		flexDirection: "column",
		width: "50%",
		alignItems: "center",
		justifyContent: "space-between",
	},
	storyDescription: {
		textAlign: "center",
		width: 400,
		marginTop: 200,
		fontSize: 16,
		letterSpacing: "1px",
	},
	copyrightContainer: {
		display: "flex",
		flexDirection: "row",
		alignItems: "center",
		marginBottom: 50,
	},
	copyrightImage: {
		height: 50,
	},
	copyrightText: {
		marginLeft: 10,
	},
	rightSide: {
		display: "flex",
		flexDirection: "column",
		width: "50%",
	},
	storyImageContainer: {
		position: "relative",
		height: "70%",
		width: "100%",
		overflow: "hidden",
	},
	storyImage: {
		position: "absolute",
		top: "-18%", // cut the top and bottom of the image equally to fit their container-limited height size
		left: 0,
		width: "100%",
	},
	storyTitleAndAuthorContainer: {
		marginTop: 50,
	},
	storyTitle: {
		fontSize: 24,
		fontFamily: "AleoBold",
		marginBottom: 10,
		textAlign: "center",
	},
	authorText: {
		fontSize: 18,
		textAlign: "center",
	},
});

const proportion = 1.92;
const horizontalSize = 650;
export const rectangleSize: PageSize = [
	horizontalSize * proportion,
	horizontalSize,
];

interface coverRpiPDFProps {
	storyData: WebStory;
}

const CoverRpiPDF = ({ storyData }: coverRpiPDFProps) => {
	if (!storyData?.coverImage || !storyData?.user) {
		return null;
	}

	return (
		<Document style={styles.root}>
			<Page size={rectangleSize} style={styles.page}>
				<div style={styles.leftSide}>
					<Text style={styles.storyDescription}>{storyData?.summary}</Text>
					<div style={styles.copyrightContainer}>
						<Image
							style={styles.copyrightImage}
							src="/pdf/logo-bw-outline.png"
						/>
						<Text style={styles.copyrightText}>
							©️ {new Date().getFullYear()} StoryBird.ai
						</Text>
					</div>
				</div>
				<div style={styles.rightSide}>
					<div style={styles.storyImageContainer}>
						<Image
							style={styles.storyImage}
							src={Format.GetImageUrl(storyData?.coverImage)}
						/>
					</div>
					<div style={styles.storyTitleAndAuthorContainer}>
						<Text style={styles.storyTitle}>{storyData?.storyTitle}</Text>
						<Text style={styles.authorText}>
							A story by {storyData?.user.name}
						</Text>
					</div>
				</div>
			</Page>
		</Document>
	);
};

export default CoverRpiPDF;
