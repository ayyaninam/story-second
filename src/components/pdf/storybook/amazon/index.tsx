import React from "react";
import { PageSize } from "@react-pdf/types";
import { Document, StyleSheet, Font } from "@react-pdf/renderer";

import QRPagePDF from "./pages/qr-page";
import LogoPagePDF from "./pages/logo-page";
import EmptyPagePDF from "./pages/empty-page";
import FinalPagePDF from "./pages/final-page";
import TitlePagePDF from "./pages/title-page";
import ArrayOfPagesPDF from "./pages/array-of-pages";
import { WebStory } from "@/components/ui/story-book/constants";

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
		backgroundColor: "#ffffff",
		alignItems: "center",
		justifyContent: "center",
	},
	root: {
		fontFamily: "Andika",
	},
});

export const pageSize: PageSize = [433, 649];

interface StorybookAmazonPDFProps {
	storyData: WebStory | null;
}

const StorybookAmazonPDF = ({ storyData }: StorybookAmazonPDFProps) => (
	<Document style={globalStyles.root}>
		<LogoPagePDF />
		{/* todo: implement the QRPage */}
		{/*<EmptyPagePDF />*/}
		{/*<QRPagePDF />*/}
		{/*<EmptyPagePDF />*/}
		<TitlePagePDF storyData={storyData} />
		<ArrayOfPagesPDF storyData={storyData} />
		<EmptyPagePDF />
		<FinalPagePDF />
		<EmptyPagePDF />
		<EmptyPagePDF />
		<EmptyPagePDF />
	</Document>
);

export default StorybookAmazonPDF;
