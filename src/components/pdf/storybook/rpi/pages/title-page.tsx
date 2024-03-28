import { Text, Page, StyleSheet } from "@react-pdf/renderer";
import { WebStory } from "@/models";
import { pageSize, globalStyles } from "../index";

const styles = StyleSheet.create({
  text: {
    fontSize: 32,
    fontFamily: "Aleo"
  },
});

interface StorybookPDFProps {
  storyData: WebStory | null;
}

const TitlePagePDF = ({ storyData }: StorybookPDFProps) => (
  <Page size={pageSize} style={globalStyles.page}>
    <Text style={styles.text}>
      {storyData?.storyTitle}
    </Text>
  </Page>
)

export default TitlePagePDF
