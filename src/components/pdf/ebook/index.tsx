import React from "react";
import { WebStory } from "@/components/ui/story-book/constants";
import { PageSize } from "@react-pdf/types";
import { Document, StyleSheet, Font } from "@react-pdf/renderer";

import QRPagePDF from "./pages/qr-page";
import LogoPagePDF from "./pages/logo-page";
import FinalPagePDF from "./pages/final-page";
import TitlePagePDF from "./pages/title-page";
import ArrayOfPagesPDF from "./pages/array-of-pages";

Font.register({
	family: "Aleo",
	src: "/pdfs/viewer/fonts/Aleo/Aleo-VariableFont_wght.ttf",
});
Font.register({
	family: "Andika",
	src: "/pdfs/viewer/fonts/Andika/Andika-Regular.ttf",
});
Font.register({
	family: "AndikaBold",
	src: "/pdfs/viewer/fonts/Andika/Andika-Bold.ttf",
});

export const globalStyles = StyleSheet.create({
	page: {
		display: "flex",
		flexDirection: "column",
		backgroundColor: "#f1e7d4",
		alignItems: "center",
		justifyContent: "center",
	},
	root: {
		fontFamily: "Andika",
	},
});

export const pageSize: PageSize = [433, 649];

interface EBookPDFProps {
	storyData: WebStory;
}

const EBookPDF = ({ storyData }: EBookPDFProps) => (
	<Document style={globalStyles.root}>
		<LogoPagePDF />
		{/* todo: implement the QR page pdf */}
		{/*<QRPagePDF />*/}
		<TitlePagePDF storyData={storyData} />
		<ArrayOfPagesPDF storyData={storyData} />
		<FinalPagePDF />
	</Document>
);

export default EBookPDF;
