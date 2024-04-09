import { Text, Page, StyleSheet } from "@react-pdf/renderer";
import { WebStory } from "@/components/ui/story-book/constants";
import { pageSize, globalStyles } from "../index";

const styles = StyleSheet.create({
	text: {
		fontSize: 24,
		fontFamily: "AndikaBold",
	},
});

interface StorybookPDFProps {
	storyData: WebStory;
}

const TitlePagePDF = ({ storyData }: StorybookPDFProps) => (
	<Page size={pageSize} style={globalStyles.page}>
		<Text style={styles.text}>{storyData?.storyTitle}</Text>
	</Page>
);

export default TitlePagePDF;
