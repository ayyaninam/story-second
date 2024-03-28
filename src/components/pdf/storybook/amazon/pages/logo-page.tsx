import { Image, Page, StyleSheet } from "@react-pdf/renderer";
import { pageSize, globalStyles } from "../index";

const styles = StyleSheet.create({
	logo: {
		width: 255,
		marginLeft: 27,
		marginBottom: 27,
	},
});

const LogoPagePDF = () => (
	<Page size={pageSize} style={globalStyles.page}>
		<Image style={styles.logo} src="/pdfs/viewer/logo.png" />
	</Page>
);

export default LogoPagePDF;
