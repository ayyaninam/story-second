import React from "react";
import { PageSize } from "@react-pdf/types";
import { Document, StyleSheet, Font } from "@react-pdf/renderer";

import { WebStory } from "@/components/ui/story-book/constants";

import LogoPagePDF from "./pages/logo-page";
import OwnerPagePDF from "./pages/owner-page";
import EmptyPagePDF from "./pages/empty-page";
import QRPagePDF from "./pages/qr-page";
import TitlePagePDF from "./pages/title-page";
import FinalPagePDF from "./pages/final-page";
import ArrayOfPagesPDF from "./pages/array-of-pages";

Font.register({
	family: "Aleo",
	src: "/pdfs/viewer/fonts/Aleo/Aleo-VariableFont_wght.ttf",
});
Font.register({
	family: "Andika",
	src: "/pdfs/viewer/fonts/Andika/Andika-Regular.ttf",
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

export const pageSize: PageSize = [576, 576];

interface StorybookRpiPDFProps {
	storyData: WebStory | null;
}

const StorybookRpiPDF = ({ storyData }: StorybookRpiPDFProps) => (
	<Document style={globalStyles.root}>
		<LogoPagePDF />
		{/*<OwnerPagePDF />*/}
		{/* todo: implement the QR Page */}
		{/*<EmptyPagePDF />*/}
		{/*<QRPagePDF />*/}
		<TitlePagePDF storyData={storyData} />
		<ArrayOfPagesPDF storyData={storyData} />
		<FinalPagePDF />
	</Document>
);

export default StorybookRpiPDF;
