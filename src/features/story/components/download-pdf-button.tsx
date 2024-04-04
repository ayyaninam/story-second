import React, { ReactElement } from "react";
import dynamic from "next/dynamic";
import StorybookAmazonPDF from "@/components/pdf/storybook/amazon";
import StorybookRpiPDF from "@/components/pdf/storybook/rpi";
import CoverRpiPDF from "@/components/pdf/cover/rpi";
import CoverAmazonPDF from "@/components/pdf/cover/amazon";
import { WebStory } from "@/components/ui/story-book/constants";
import { Button } from "@/components/ui/button";
import Ebook from "@/components/pdf/ebook";

const ReactPDFDownloadLink = dynamic(
	() => import("@react-pdf/renderer").then((mod) => mod.PDFDownloadLink),
	{
		ssr: false,
		loading: () => <p>Loading...</p>,
	}
);

type Variant =
	| "storybook-rpi"
	| "storybook-amazon"
	| "cover-rpi"
	| "cover-amazon"
	| "ebook";

interface DownloadPDFButtonProps {
	storyData: WebStory;
	variant: Variant;
}

const DownloadPDFButton = ({ storyData, variant }: DownloadPDFButtonProps) => {
	const document = (
		{
			"storybook-amazon": <StorybookAmazonPDF storyData={storyData} />,
			"storybook-rpi": <StorybookRpiPDF storyData={storyData} />,
			"cover-rpi": <CoverRpiPDF storyData={storyData} />,
			"cover-amazon": <CoverAmazonPDF storyData={storyData} />,
			ebook: <Ebook storyData={storyData} />,
		} as Record<Variant, ReactElement>
	)[variant];

	return (
		<Button variant="accent" asChild className="cursor-pointer">
			<ReactPDFDownloadLink
				document={document}
				fileName={`${storyData.storyTitle}_${variant}.pdf`}
			>
				{({ loading, error }) =>
					error
						? "Error loading PDF..."
						: loading
							? "Loading PDF..."
							: "Download PDF"
				}
			</ReactPDFDownloadLink>
		</Button>
	);
};

export default DownloadPDFButton;
