import { v } from "convex/values";
import { action, query, ActionCtx, QueryCtx } from "./_generated/server";
import { api } from "./_generated/api";

// Demo action to manually trigger sync (DO NOT RUN until env vars are set)
export const triggerNotionSync = action({
  args: { 
    forceFullSync: v.optional(v.boolean())
  },
  handler: async (ctx: ActionCtx, { forceFullSync = false }): Promise<{ success: boolean; synced: number }> => {
    const databaseId = "2584f2e1-1dba-819e-b0f5-fc54bff7b13f"; // Your project timeline database
    
    try {
      const result: any = await ctx.runAction(api.notion.sync.syncNotionDatabase, {
        databaseId,
        forceFullSync
      });
      
      console.log("Manual sync completed:", result);
      return result;
    } catch (error) {
      console.error("Manual sync failed:", error);
      throw error;
    }
  }
});

// Demo query to get project timeline for frontend (safe to use after sync)
export const getProjectTimeline = query({
  args: {
    phase: v.optional(v.string()),
    status: v.optional(v.string()),
    priority: v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx: QueryCtx, filters): Promise<any[]> => {
    const databaseId = "2584f2e1-1dba-819e-b0f5-fc54bff7b13f";
    
    return await ctx.runQuery(api.notion.sync.getRecords, {
      databaseId,
      filters: filters,
      sortBy: "week",
      sortDirection: "asc",
      limit: filters.limit,
    });
  }
});

// Demo query to get current sync status (safe to check anytime)
export const getSyncStatus = query({
  handler: async (ctx: QueryCtx): Promise<any> => {
    const databaseId = "2584f2e1-1dba-819e-b0f5-fc54bff7b13f";
    
    return await ctx.runQuery(api.notion.sync.getSyncStatus, {
      databaseId
    });
  }
});