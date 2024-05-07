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
		padding: 9, // bleeding equal to 0.125in for amazon
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
		width: 325,
		marginTop: 250,
		fontSize: 15,
		letterSpacing: "1px",
	},
	copyrightContainer: {
		display: "flex",
		flexDirection: "row",
		alignItems: "center",
		marginBottom: 60,
		alignSelf: "flex-start",
		marginLeft: 35,
		letterSpacing: "1px",
	},
	copyrightImage: {
		height: 25,
	},
	copyrightText: {
		marginLeft: 5,
		fontSize: 12,
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
		top: "0%",
		left: 0,
		width: "100%",
	},
	storyTitleAndAuthorContainer: {
		marginTop: 50,
	},
	storyTitle: {
		fontSize: 22,
		fontFamily: "AleoBold",
		marginBottom: 10,
		textAlign: "center",
	},
	authorText: {
		fontSize: 12,
		textAlign: "center",
	},
});

// with dpi = 72 the conversion is 1mm = 2.83px
const mmToPx = (mm: number): number => mm * 2.83;

const calculateDynamicStyle = (pagesNumber: number): [number, number] => {
	const fluffPages = 6; // pages that does not contain story content like blank pages, title page, etc.
	const n = pagesNumber * 2 + fluffPages;

	const baseFullWidth = 311.15;
	const baseSpineWidth = 0;
	const adjustmentFactor = 1.43 / 24;

	const fullWidth = baseFullWidth + adjustmentFactor * n;
	const spineWidth = baseSpineWidth + adjustmentFactor * n;

	return [fullWidth, spineWidth];
};

interface CoverAmazonPDFProps {
	storyData: WebStory;
}

const CoverAmazonPDF = ({ storyData }: CoverAmazonPDFProps) => {
	if (!storyData?.coverImage || !storyData?.user) {
		return null;
	}

	const [fullWidthInMM] = calculateDynamicStyle(
		storyData?.scenes?.[0]?.storySegments?.length || 0
	);
	const fullWidth = mmToPx(fullWidthInMM);

	const rectangleSize: PageSize = [fullWidth, 666];

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
							©️ {new Date().getFullYear()} Story.com
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
							A story by {`${storyData?.user.name} ${storyData?.user.lastName}`}
						</Text>
					</div>
				</div>
			</Page>
		</Document>
	);
};

export default CoverAmazonPDF;
