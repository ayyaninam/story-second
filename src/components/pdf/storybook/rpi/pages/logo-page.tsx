import { Image, Text, Page, StyleSheet } from "@react-pdf/renderer";
import { pageSize, globalStyles } from "../index";

const styles = StyleSheet.create({
	logo: {
		marginTop: 100,
		width: 300,
		height: 300,
	},
	text: {
		marginTop: 100,
		fontSize: 16,
		fontFamily: "Aleo",
	},
});

const LogoPagePDF = () => (
	<Page size={pageSize} style={globalStyles.page}>
		<Image style={styles.logo} src="/pdfs/viewer/logo.png" />
		<Text style={styles.text}>©️ {new Date().getFullYear()} Story.com</Text>
	</Page>
);

export default LogoPagePDF;
