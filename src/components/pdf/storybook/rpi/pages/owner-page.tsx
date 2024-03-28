import { Image, Text, Page, StyleSheet, View } from "@react-pdf/renderer";
import { pageSize, globalStyles } from "../index";

const styles = StyleSheet.create({
	container: {
		position: "relative",
		height: 180,
		width: "70%",
		borderColor: "#A7A7A7",
		borderWidth: 3,
		borderRadius: 32,
		paddingVertical: 20,
		paddingHorizontal: 36,
		paddingLeft: 140,
	},
	text: {
		fontSize: 18,
		marginLeft: 20,
		marginBottom: 80,
		fontFamily: "Aleo",
	},
	image: {
		position: "absolute",
		top: "45%",
		left: 0,
		transform: "translate(-40%, -50%)",
		height: 150,
	},
	placeholderLine: {
		width: "100%",
		height: 2,
		backgroundColor: "#717171",
	},
});

const OwnerPagePDF = () => (
	<Page size={pageSize} style={globalStyles.page}>
		<View style={styles.container}>
			<Image style={styles.image} src="/pdfs/viewer/kiwi-with-hat.png" />
			<Text style={styles.text}>This book belongs to...</Text>
			<View style={styles.placeholderLine}></View>
		</View>
	</Page>
);

export default OwnerPagePDF;
