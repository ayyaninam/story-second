import GeneratePage from "@/features/generate";
import React, { ReactElement } from "react";
import { withPageAuthRequired, getSession } from "@auth0/nextjs-auth0";

import { HydrationBoundary } from "@tanstack/react-query";
import PageLayout from "@/components/layouts/PageLayout";
import { NextSeo } from "next-seo";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import useSaveSessionToken from "@/hooks/useSaveSessionToken";
import GenerateAccentStyle from "@/features/generate/generate-accent-style";

function Generate({
	session,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
	useSaveSessionToken(session.accessToken);

	return (
		<HydrationBoundary>
			<NextSeo
				title="Generate"
				description="Generate new Video, Trends and Storybooks"
				openGraph={{
					images: [
						{
							url: "/og-assets/og-story.png",
							width: 1200,
							height: 630,
							alt: "Generate with Story.com",
						},
					],
				}}
			/>
			<GenerateAccentStyle />
			<GeneratePage />
		</HydrationBoundary>
	);
}

Generate.getLayout = function getLayout(page: ReactElement) {
	return <PageLayout pageIndex={1}>{page}</PageLayout>;
};

export default Generate;

export async function getServerSideProps(context: GetServerSidePropsContext) {
	const session = await getSession(context.req, context.res);

	return {
		props: {
			session: { ...session },
		},
	};
}

// Disabled: don't need to check for authentication here - being checked in /create already
// export const getServerSideProps = withPageAuthRequired();
