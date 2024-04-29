import { Image, Text, Page, StyleSheet } from "@react-pdf/renderer";
import { pageSize, globalStyles } from "../index";

const styles = StyleSheet.create({
	image: {
		height: 238,
	},
	qrSection: {
		display: "flex",
		flexDirection: "row",
		alignItems: "center",
		marginTop: 80,
		marginBottom: 35,
		marginLeft: 35,
	},
	qrImage: {
		height: 120,
	},
	qrTextContainer: {
		marginLeft: 15,
	},
	qrText: {
		fontSize: 18,
		lineHeight: 1.3,
		width: 175,
		textAlign: "center",
		letterSpacing: "1px",
	},
});

const QRPagePDF = () => (
	<Page size={pageSize} style={globalStyles.page}>
		<Image style={styles.image} src="/pdfs/viewer/kiwi-reading.png" />
		<div style={styles.qrSection}>
			<Image
				style={styles.qrImage}
				src="/pdfs/viewer/qr-example-do-not-use-in-production.png"
			/>
			<div style={styles.qrTextContainer}>
				<Text style={styles.qrText}>Scan this QR code to read online!</Text>
			</div>
		</div>
	</Page>
);

export default QRPagePDF;
