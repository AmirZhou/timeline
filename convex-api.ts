import { type FunctionReference, anyApi } from "convex/server";
import { type GenericId as Id } from "convex/values";

export const api: PublicApiType = anyApi as unknown as PublicApiType;
export const internal: InternalApiType = anyApi as unknown as InternalApiType;

export type PublicApiType = {
  demo: {
    triggerNotionSync: FunctionReference<
      "action",
      "public",
      { forceFullSync?: boolean },
      any
    >;
    getProjectTimeline: FunctionReference<
      "query",
      "public",
      { limit?: number; phase?: string; priority?: string; status?: string },
      any
    >;
    getSyncStatus: FunctionReference<"query", "public", any, any>;
  };
  notion: {
    sync: {
      syncNotionDatabase: FunctionReference<
        "action",
        "public",
        { databaseId: string; forceFullSync?: boolean },
        any
      >;
      getRecords: FunctionReference<
        "query",
        "public",
        {
          databaseId: string;
          filters?: {
            phase?: string;
            priority?: string;
            status?: string;
            week?: number;
          };
          limit?: number;
          sortBy?: string;
          sortDirection?: "asc" | "desc";
        },
        any
      >;
      getSyncStatus: FunctionReference<
        "query",
        "public",
        { databaseId: string },
        any
      >;
    };
  };
};
export type InternalApiType = {};
