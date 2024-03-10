/* eslint-disable @tanstack/query/exhaustive-deps */
import LibraryPage from "@/features/library";
import React, { ReactElement } from "react";
import { withPageAuthRequired } from "@auth0/nextjs-auth0";

import PageLayout from "@/components/layouts/PageLayout";
import { NextSeo } from "next-seo";
import LibraryAccentStyle from "@/features/library/library-accent-style";

function Library() {
	return (
		<>
			<NextSeo
				title="Library"
				description="Find your videos, trends, storybooks, all in one place"
				openGraph={{
					images: [
						{
							url: "/og-assets/og-library.png",
							width: 1200,
							height: 630,
							alt: "Library Story.com",
						},
					],
				}}
			/>
			<LibraryAccentStyle />
			<LibraryPage />
		</>
	);
}

Library.getLayout = function getLayout(page: ReactElement) {
	return <PageLayout pageIndex={2}>{page}</PageLayout>;
};

export default Library;

export const getServerSideProps = withPageAuthRequired();
