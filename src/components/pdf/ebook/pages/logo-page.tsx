import { Image, Page, StyleSheet, Text } from "@react-pdf/renderer";
import { pageSize, globalStyles } from "../index";

const styles = StyleSheet.create({
	logo: {
		width: 280,
		marginBottom: 25,
	},
	text: {
		fontSize: 16,
	},
});

const LogoPagePDF = () => (
	<Page size={pageSize} style={globalStyles.page}>
		<Image style={styles.logo} src="/pdfs/viewer/logo.png" />
		<Text style={styles.text}>©️ {new Date().getFullYear()} Story.com </Text>
	</Page>
);

export default LogoPagePDF;
