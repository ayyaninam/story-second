/* eslint-disable @tanstack/query/exhaustive-deps */
import LibraryPage from "@/features/library";
import React, { ReactElement } from "react";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { withPageAuthRequired } from "@auth0/nextjs-auth0";

import api from "@/api";
import { QueryKeys } from "@/lib/queryKeys";
import { DisplayAspectRatios, StoryOutputTypes } from "@/utils/enums";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { VIDEO_ORIENTATIONS } from "@/features/library/constants";
import PageLayout from "@/components/layouts/PageLayout";
import { getSession } from "@auth0/nextjs-auth0";
import { NextSeo } from "next-seo";
import Routes from "@/routes";

function Library({
  session,
  dehydratedState,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const accessToken = (session.accessToken as string) || "";
  return (
    <HydrationBoundary state={dehydratedState}>
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
      {/* declare css variables */}
      <style jsx global>{`
        :root {
          --menu-item-border-color: rgba(122, 255, 180, 0.2);
          --menu-item-selected-background-color: radial-gradient(
            88.31% 100% at 0% 50%,
            rgba(48, 149, 136, 0.5) 25.5%,
            rgba(48, 149, 136, 0) 100%
          );
          --menu-item-selected-border-color: rgba(56, 142, 131, 0.2);
          --stepper-box-shadow: 0px 4px 4px 0px rgba(122, 255, 133, 0.4);

          --accent-color-50: #f0fdfa;
          --accent-color-100: #ccfbf1;
          --accent-color-200: #99f6e4;
          --accent-color-300: #5eead4;
          --accent-color-400: #2dd4bf;
          --accent-color-500: #14b8a6;
          --accent-color-600: #0d9488;
          --accent-color-700: #0f766e;
          --accent-color-800: #115e59;
          --accent-color-900: #134e4a;
          --accent-color-950: #042f2e;
        }
      `}</style>
      <LibraryPage accessToken={accessToken} />
    </HydrationBoundary>
  );
}

Library.getLayout = function getLayout(page: ReactElement) {
  return <PageLayout pageIndex={2}>{page}</PageLayout>;
};

export default Library;

async function _getServerSideProps({
  req,
  res,
  resolvedUrl,
  query,
}: GetServerSidePropsContext) {
  const session = await getSession(req, res);

  if (session == null || session.accessToken == null) {
    // if protected by withPageAuthRequired, this should never happen
    return {
      redirect: {
        destination: `${Routes.authpage}?returnTo=${resolvedUrl}`,
        permanent: false,
      },
    };
  }
  // # TODO: For development purposes only - remove this in production
  // Avoids redirect to dev pages and sends to absolute path
  if (req?.url && req.url.toString().includes("/_next/data")) {
    req.url = "/library?genre=all";
  }

  const accessToken = session.accessToken;

  // accessToken.isValidJWT()
  const queryClient = new QueryClient();
  const {
    genre: queryGenre,
    page = "1",
    orientation = VIDEO_ORIENTATIONS.ALL.id,
    sort = "desc",
  } = query;

  try {
    await queryClient.fetchQuery({
      queryFn: () => api.library.getCategories(),
      queryKey: [QueryKeys.CATEGORIES],
      staleTime: 3000,
    });
  } catch (error) {
    console.error("Error fetching data", error);
  }

  const categories = queryClient.getQueryData<string[]>([QueryKeys.CATEGORIES]);

  const genre = categories?.includes(queryGenre as string)
    ? (queryGenre as string)
    : "all";

  const isDescending = sort === "desc";

  try {
    if (orientation === VIDEO_ORIENTATIONS.ALL.id) {
      await Promise.all([
        queryClient.fetchQuery({
          queryFn: () =>
            api.library.getVideos({
              accessToken,
              params: {
                PageSize: 7,
                resolution: DisplayAspectRatios["1024x576"],
                CurrentPage: 1,
                topLevelCategory: genre as string,
                storyType: StoryOutputTypes.Video,
                isDescending: isDescending,
              },
            }),
          queryKey: [QueryKeys.WIDE_VIDEOS, genre, isDescending, accessToken],
          staleTime: 3000,
        }),
        queryClient.fetchQuery({
          queryFn: () =>
            api.library.getVideos({
              accessToken: accessToken,
              params: {
                PageSize: 5,
                resolution: DisplayAspectRatios["576x1024"],
                CurrentPage: 1,
                topLevelCategory: genre as string,
                storyType: StoryOutputTypes.Video,
                isDescending: isDescending,
              },
            }),
          queryKey: [
            QueryKeys.VERTICAL_VIDEOS,
            genre,
            isDescending,
            accessToken,
          ],
          staleTime: 3000,
        }),
        queryClient.fetchQuery({
          queryFn: () =>
            api.library.getStoryBooks({
              accessToken: accessToken,
              params: {
                PageSize: 5,
                CurrentPage: 1,
                topLevelCategory: genre as string,
                isDescending: isDescending,
              },
            }),
          queryKey: [QueryKeys.STORY_BOOKS, genre, isDescending, accessToken],
          staleTime: 3000,
        }),
        queryClient.fetchQuery({
          queryFn: () =>
            api.library.getVideos({
              accessToken: accessToken,
              params: {
                PageSize: 5,
                storyType: StoryOutputTypes.SplitScreen,
                resolution: DisplayAspectRatios["576x1024"],
                CurrentPage: 1,
                topLevelCategory: genre as string,
                isDescending: isDescending,
              },
            }),
          queryKey: [QueryKeys.TIK_TOK, genre, isDescending, accessToken],
          staleTime: 3000,
        }),
      ]);
    } else {
      const filterOptions = {
        CurrentPage: parseInt(page as string),
        topLevelCategory: genre as string,
        searchTerm: "",
      };
      await queryClient.fetchQuery({
        queryFn: () => {
          if (orientation === VIDEO_ORIENTATIONS.BOOK.id) {
            return api.library.getStoryBooks({
              accessToken,
              params: {
                PageSize: 50,
                ...filterOptions,
              },
            });
          }
          if (orientation === VIDEO_ORIENTATIONS.TIK_TOK.id) {
            return api.library.getVideos({
              accessToken: accessToken,
              params: {
                PageSize: 50,
                storyType: StoryOutputTypes.SplitScreen,
                resolution: DisplayAspectRatios["576x1024"],
                ...filterOptions,
              },
            });
          }
          return api.library.getVideos({
            accessToken: accessToken,
            params: {
              PageSize: 50,
              storyType: StoryOutputTypes.Video,
              resolution:
                orientation === VIDEO_ORIENTATIONS.WIDE.id
                  ? DisplayAspectRatios["1024x576"]
                  : DisplayAspectRatios["576x1024"],
              ...filterOptions,
            },
          });
        },
        queryKey: [QueryKeys.GALLERY, filterOptions, orientation, accessToken],
        staleTime: 3000,
      });
    }
  } catch (error: any) {
    if (error.response?.status === 401) {
      return {
        redirect: {
          destination: `${Routes.authpage}?returnTo=${resolvedUrl}`,
          permanent: false,
        },
      };
    }
    console.error("Error fetching data", error);
  }

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
      session: { ...session },
    },
  };
}

export const getServerSideProps = withPageAuthRequired({
  getServerSideProps: _getServerSideProps,
});
