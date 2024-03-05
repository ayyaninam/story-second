import api from "@/api";
import { mainSchema } from "@/api/schema";
import { WebStoryProvider } from "@/features/edit-story/providers/WebstoryContext";
import ScenesLayout from "@/features/scenes/ScenesLayout";
import ScriptLayout from "@/features/scenes/ScriptLayout";
import StoryboardLayout from "@/features/scenes/StoryboardLayout";
import PageLayout from "@/components/layouts/PageLayout";
import editStoryReducer, {
  EditStoryAction,
  EditStoryDraft,
} from "@/features/scenes/reducers/edit-reducer";
import {
  WebstoryToStoryDraft,
  filterSelectedKeysFromObject,
} from "@/features/scenes/utils/storydraft";
import useSaveSessionToken from "@/hooks/useSaveSessionToken";
import { QueryKeys } from "@/lib/queryKeys";
import { StoryOutputTypes } from "@/utils/enums";
import { getSession } from "@auth0/nextjs-auth0";
import {
  QueryClient,
  dehydrate,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { notFound } from "next/navigation";
import { useRouter } from "next/router";
import React, { ReactElement, useEffect } from "react";
import { useImmerReducer } from "use-immer";
import EditAccentStyles from "@/features/scenes/edit-accent-style";
import Script from "next/script";

const EditorPage = ({
  dehydratedState,
  session,
  storyData,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  useSaveSessionToken(session.accessToken);
  const router = useRouter();
  const queryClient = useQueryClient();

  const Webstory = useQuery<mainSchema["ReturnVideoStoryDTO"]>({
    queryFn: () =>
      api.video.get(
        router.query.genre!.toString(),
        router.query.id!.toString(),
        storyData.storyType
      ),
    // eslint-disable-next-line @tanstack/query/exhaustive-deps -- pathname includes everything we need
    queryKey: [QueryKeys.STORY, router.asPath],
    initialData: storyData,
    refetchInterval: 1000,
    // Disable once all the videoKeys are obtained
  });

  const [story, dispatch] = useImmerReducer<EditStoryDraft, EditStoryAction>(
    editStoryReducer,
    WebstoryToStoryDraft(Webstory.data!)
  );

  useEffect(() => {
    dispatch({
      type: "reset",
      draft: WebstoryToStoryDraft(Webstory.data),
    });
  }, [
    JSON.stringify(
      filterSelectedKeysFromObject({
        originalObject: Webstory.data,
        keysToBeFiltered: ["renderedVideoKey"],
      })
    ),
  ]);

  if (router.query.editor === "script") {
    return (
      <WebStoryProvider initialValue={storyData}>
        <Script id={'intercom-editor'}>
          {`
            window.intercomSettings = {
              hide_default_launcher: true,
            };
          `}
        </Script>
        <EditAccentStyles />
        <ScriptLayout {...{ story, dispatch }} />
      </WebStoryProvider>
    );
  } else if (router.query.editor === "storyboard") {
    return (
      <WebStoryProvider initialValue={storyData}>
        <EditAccentStyles />
        <StoryboardLayout {...{ story, dispatch }} />
      </WebStoryProvider>
    );
  } else if (router.query.editor === "scenes") {
    return (
      <WebStoryProvider initialValue={storyData}>
        <EditAccentStyles />
        <ScenesLayout {...{ story, dispatch }} />
      </WebStoryProvider>
    );
  }
  return notFound();
};

EditorPage.getLayout = function getLayout(page: ReactElement) {
  return <PageLayout pageIndex={1}>{page}</PageLayout>;
};

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const session = await getSession(ctx.req, ctx.res);

  // @ts-expect-error Not typing correctly
  const { genre, id, editor } = ctx.params;
  if (!genre || !id || !["scenes", "script", "storyboard"].includes(editor)) {
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
  }

  return {
    props: {
      session: { ...session },
      storyData,
      dehydratedState: dehydrate(queryClient),
    },
  };
};

export default EditorPage;
