import { v } from "convex/values";
import { action, query } from "./_generated/server";
import { api, internal } from "./_generated/api";

// Demo action to manually trigger sync (DO NOT RUN until env vars are set)
export const triggerNotionSync = action({
  args: { 
    forceFullSync: v.optional(v.boolean())
  },
  handler: async (ctx, { forceFullSync = false }): Promise<{ success: boolean; synced?: number; retrying?: boolean; nextAttempt?: number }> => {
    const databaseId = "2584f2e11dba819eb0f5fc54bff7b13f"; // Your project timeline database
    
    try {
      const result: { success: boolean; synced?: number; retrying?: boolean; nextAttempt?: number } = await ctx.runAction(internal.notion.sync.syncNotionDatabase, {
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
  handler: async (ctx, filters) => {
    const databaseId = "2584f2e11dba819eb0f5fc54bff7b13f";
    
    // Directly query the database rather than calling another query
    let query = ctx.db
      .query("notion_records")
      .withIndex("by_database", (q) => q.eq("notionDatabaseId", databaseId));

    // Apply filters if provided
    if (filters.status || filters.phase || filters.priority) {
      query = query.filter((q) => {
        let conditions = q.eq(q.field("isArchived"), false);
        if (filters.status) {
          conditions = q.and(conditions, q.eq(q.field("properties.status"), filters.status));
        }
        if (filters.phase) {
          conditions = q.and(conditions, q.eq(q.field("properties.phase"), filters.phase));
        }
        if (filters.priority) {
          conditions = q.and(conditions, q.eq(q.field("properties.priority"), filters.priority));
        }
        return conditions;
      });
    }

    let results = await query.collect();
    
    // Sort by week
    results.sort((a, b) => {
      const aWeek = a.properties.week || 999;
      const bWeek = b.properties.week || 999;
      return aWeek - bWeek;
    });

    // Apply limit
    if (filters.limit) {
      results = results.slice(0, filters.limit);
    }

    return results;
  }
});

// Demo query to get current sync status (safe to check anytime)
export const getSyncStatus = query({
  handler: async (ctx) => {
    const databaseId = "2584f2e11dba819eb0f5fc54bff7b13f";
    
    // Directly query the sync metadata
    const meta = await ctx.db
      .query("notion_sync_meta")
      .withIndex("by_database", (q) => q.eq("databaseId", databaseId))
      .first();

    if (!meta) {
      return { status: "never_synced", lastSyncTime: null, recordCount: 0 };
    }

    return {
      status: meta.syncStatus,
      lastSyncTime: meta.lastSyncTime,
      recordCount: meta.recordCount,
      errorMessage: meta.errorMessage,
    };
  }
});