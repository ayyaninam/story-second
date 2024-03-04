import PublishedStory from "@/features/publish-story";
import api from "@/api";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { StoryOutputTypes } from "@/utils/enums";
import { WebStoryProvider } from "@/features/edit-story/providers/WebstoryContext";
import { getSession } from "@auth0/nextjs-auth0";
import React, {ReactElement} from "react";
import useSaveSessionToken from "@/hooks/useSaveSessionToken";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import { QueryKeys } from "@/lib/queryKeys";
import Format from "@/utils/format";
import {NextSeo} from "next-seo";
import PageLayout from "@/components/layouts/PageLayout";

export default function PublishPage({
  storyData,
  session,
  dehydratedState,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  useSaveSessionToken(session.accessToken);
  return (
    <HydrationBoundary state={dehydratedState}>
      <NextSeo
        title={storyData?.storyTitle || undefined}
        description={
          storyData?.summary ||
          "Find your videos, trends, storybooks, all in one place"
        }
        openGraph={{
          images: [
            {
              url: storyData?.coverImage
                ? Format.GetImageUrl(storyData.coverImage)
                : "/og-assets/og-story.png",
              width: 1200,
              height: 630,
              alt: storyData?.storyTitle || "Story.com",
            },
          ],
        }}
      />
      {/* declare css variables */}
      <style jsx global>{`
				:root {
					--menu-item-border-color: rgba(206, 122, 255, 0.3);
					--menu-item-selected-background-color: radial-gradient(
						88.31% 100% at 0% 50%,
						rgba(187, 85, 247, 0.5) 25.5%,
						rgba(102, 129, 255, 0) 100%
					);
					--menu-item-selected-border-color: rgba(206, 122, 255, 0.2);
					--stepper-box-shadow: 0px 4px 4px 0px rgba(187, 85, 247, 0.4);
					--accent-color-50: #faf5ff;
					--accent-color-100: #f3e8ff;
					--accent-color-200: #e9d5ff;
					--accent-color-300: #d8b4fe;
					--accent-color-400: #c084fc;
					--accent-color-500: #a855f7;
					--accent-color-600: #9333ea;
					--accent-color-700: #7e22ce;
					--accent-color-800: #6b21a8;
					--accent-color-900: #581c87;
					--accent-color-950: #3b0764;
				}
			`}</style>
      <WebStoryProvider initialValue={storyData}>
        <PublishedStory storyData={storyData} session={session} />
      </WebStoryProvider>
    </HydrationBoundary>
  );
}

PublishPage.getLayout = function getLayout(page: ReactElement) {
	return <PageLayout pageIndex={1}>{page}</PageLayout>;
};

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const session = await getSession(ctx.req, ctx.res);

  // @ts-expect-error Not typing correctly
  const { genre, id } = ctx.params;
  if (!genre || !id) {
    return {
      notFound: true,
    };
  }

  const queryClient = new QueryClient();
  const storyData = await queryClient.fetchQuery({
    queryFn: async () =>
      await api.video.get(genre, id, StoryOutputTypes.SplitScreen),
    // eslint-disable-next-line @tanstack/query/exhaustive-deps -- pathname includes everything we need
    queryKey: [QueryKeys.STORY, ctx.resolvedUrl],
  });
  if (session?.accessToken) {
    await queryClient.prefetchQuery({
      queryFn: async () =>
        await api.webstory.interactions(
          storyData?.id as string,
          session?.accessToken
        ),
      // eslint-disable-next-line @tanstack/query/exhaustive-deps -- pathname includes everything we need
      queryKey: [QueryKeys.INTERACTIONS, ctx.resolvedUrl],
    });
    await queryClient.prefetchQuery({
      queryFn: async () => await api.user.get(),
      // eslint-disable-next-line @tanstack/query/exhaustive-deps -- pathname includes everything we need
      queryKey: [QueryKeys.USER],
    });
  }

  return {
    props: {
      session: { ...session },
      storyData,
      dehydratedState: dehydrate(queryClient),
    },
  };
};
