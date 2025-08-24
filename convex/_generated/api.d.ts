/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as http from "../http.js";
import type * as lib_notionClient from "../lib/notionClient.js";
import type * as notion_sync from "../notion/sync.js";
import type * as router from "../router.js";
import type * as testing_networkLatency from "../testing/networkLatency.js";
import type * as testing_notionTimeGate from "../testing/notionTimeGate.js";
import type * as timeline from "../timeline.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  http: typeof http;
  "lib/notionClient": typeof lib_notionClient;
  "notion/sync": typeof notion_sync;
  router: typeof router;
  "testing/networkLatency": typeof testing_networkLatency;
  "testing/notionTimeGate": typeof testing_notionTimeGate;
  timeline: typeof timeline;
}>;
declare const fullApiWithMounts: typeof fullApi;

export declare const api: FilterApi<
  typeof fullApiWithMounts,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApiWithMounts,
  FunctionReference<any, "internal">
>;

export declare const components: {};
