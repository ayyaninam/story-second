import { Text, Page, StyleSheet } from "@react-pdf/renderer";
import { pageSize, globalStyles } from "../index";

const styles = StyleSheet.create({
  text: {
    fontSize: 24,
    fontFamily: "Aleo"
  },
});

const FinalPagePDF = () => (
  <Page size={pageSize} style={globalStyles.page}>
    <Text style={styles.text}>
      The End.
    </Text>
  </Page>
)

export default FinalPagePDF
