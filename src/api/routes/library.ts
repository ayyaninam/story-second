import {
  authFetcher,
  publicFetcher,
  publicProxyApiFetcher,
} from "@/lib/fetcher";
import { getJwt } from "@/utils/jwt";
import { mainSchema } from "../schema";
import { LibraryPageVideoQueryOptions } from "@/types";

const library = {
  get: async (
    topLevelCategory: string,
    slug: string,
    accessToken?: string
  ): Promise<mainSchema["ReturnVideoStoryDTO"]> => {
    const data: mainSchema["ReturnVideoStoryDTOApiResponse"] =
      await publicFetcher
        .get(`proxyApi/library/${topLevelCategory}/${slug}`)
        .json();

    if (!data.succeeded) {
      // TODO:figure out error boundaries
    }

    if (!data.data) {
      throw new Error("No data returned");
    }

    return data.data;
  },
  getVideos: async ({
    accessToken,
    params,
  }: {
    accessToken: string;
    params: LibraryPageVideoQueryOptions;
  }): Promise<mainSchema["ReturnVideoStoryDTOPagedList"]> => {
    const { topLevelCategory } = params;
    const searchParams = {
      ...params,
      topLevelCategory: "",
    };
    const data: mainSchema["ReturnVideoStoryDTOPagedListApiResponse"] =
      await publicProxyApiFetcher
        .get(`proxyApi/User/Videos/${topLevelCategory}`, {
          searchParams,
        })
        .json();
    if (!data.succeeded) {
      // TODO:figure out error boundaries
    }

    if (!data.data) {
      throw new Error("No data returned");
    }

    return data.data;
  },
  getCategories: async (): Promise<string[]> => {
    const data: mainSchema["StringICollectionApiResponse"] = await publicFetcher
      .get("api/StoryBook/Categories")
      .json();

    if (!data.succeeded) {
      // TODO:figure out error boundaries
    }

    if (!data.data) {
      throw new Error("No data returned");
    }

    return data.data;
  },
  getStoryBooks: async ({
    accessToken,
    params,
  }: {
    accessToken: string;
    params: LibraryPageVideoQueryOptions;
  }): Promise<mainSchema["ReturnWebStoryDTOPagedList"]> => {
    const { topLevelCategory } = params;
    const searchParams = {
      ...params,
      topLevelCategory: "",
    };
    const data: mainSchema["ReturnWebStoryDTOPagedListApiResponse"] =
      await authFetcher(accessToken)
        .get(`api/User/StoryBooks/${topLevelCategory}`, {
          searchParams: params,
        })
        .json();
    if (!data.succeeded) {
      // TODO:figure out error boundaries
    }

    if (!data.data) {
      throw new Error("No data returned");
    }

    return data.data;
  },
  getMultiple: async (
    params: {},
    accessToken?: string
  ): Promise<mainSchema["ReturnWebStoryDTOPagedList"]> => {
    const data: mainSchema["ReturnWebStoryDTOPagedListApiResponse"] =
      await publicFetcher
        .get(`api/library`, { searchParams: { ...params } })
        .json();

    if (!data.succeeded) {
      // TODO:figure out error boundaries
    }

    if (!data.data) {
      throw new Error("No data returned");
    }

    return data.data;
  },
  likeVideo: async ({
    id,
    params,
    token,
  }: {
    id: string;
    params: mainSchema["LikeStoryDTO"];
    token?: string;
  }): Promise<boolean> => {
    const data: mainSchema["BooleanApiResponse"] = await authFetcher(
      token || getJwt()
    )
      .patch(`api/Library/${id}/Like`, {
        body: JSON.stringify(params),
        headers: {
          "Content-Type": "application/json",
        },
      })
      .json();

    if (!data.succeeded) {
      // TODO:figure out error boundaries
    }

    if (!data.data) {
      throw new Error("No data returned");
    }

    return data.data;
  },
};

export default library;
