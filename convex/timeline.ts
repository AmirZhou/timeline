import { v } from "convex/values";
import { action, query, ActionCtx, QueryCtx } from "./_generated/server";
import { api } from "./_generated/api";

// Triggers manual synchronization of Notion database with timeline data
export const triggerNotionSync = action({
  args: { 
    forceFullSync: v.optional(v.boolean())
  },
  handler: async (ctx: ActionCtx, { forceFullSync = false }): Promise<{ success: boolean; synced: number }> => {
    const databaseId = "2584f2e11dba819eb0f5fc54bff7b13f"; // Project timeline database ID
    
    try {
      const result: any = await ctx.runAction(api.notion.sync.syncNotionDatabase, {
        databaseId,
        forceFullSync
      });
      
      console.log("Timeline sync completed:", result);
      return result;
    } catch (error) {
      console.error("Timeline sync failed:", error);
      throw error;
    }
  }
});

// Retrieves filtered project timeline data from Notion integration
export const getProjectTimeline = query({
  args: {
    phase: v.optional(v.string()),
    status: v.optional(v.string()),
    priority: v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx: QueryCtx, filters): Promise<any[]> => {
    const databaseId = "2584f2e11dba819eb0f5fc54bff7b13f";
    
    return await ctx.runQuery(api.notion.sync.getRecords, {
      databaseId,
      filters: filters,
      sortBy: "week",
      sortDirection: "asc",
      limit: filters.limit,
    });
  }
});

// Returns current synchronization status and metadata
export const getSyncStatus = query({
  handler: async (ctx: QueryCtx): Promise<any> => {
    const databaseId = "2584f2e11dba819eb0f5fc54bff7b13f";
    
    return await ctx.runQuery(api.notion.sync.getSyncStatus, {
      databaseId
    });
  }
});

// TEST ACTION: Test Notion propagation delay to diagnose timing issues
export const testPropagationDelay = action({
  args: {
    delayIntervals: v.optional(v.array(v.number()))
  },
  handler: async (ctx: ActionCtx, { delayIntervals }): Promise<any> => {
    const databaseId = "2584f2e11dba819eb0f5fc54bff7b13f";
    
    return await ctx.runAction(api.notion.sync.testNotionPropagationDelay, {
      databaseId,
      delayIntervals
    });
  }
});

// TEST ACTION: Legacy compatibility - redirects to original sync module test
export const testTimeGateHypothesis = action({
  args: {
    testScenario: v.optional(v.union(v.literal("baseline"), v.literal("rapid_changes"), v.literal("recovery"))),
    taskId: v.optional(v.string()) // Specific task to monitor
  },
  handler: async (ctx: ActionCtx, { testScenario = "baseline", taskId }): Promise<any> => {
    // NOTE: Time-gate hypothesis has been DISPROVED (2025-08-24)
    // This function now returns a summary instead of running tests
    // Full test suite is available in convex/testing/notionTimeGate.ts
    
    return {
      status: "HYPOTHESIS_DISPROVED",
      date: "2025-08-24",
      result: "Time-gate mechanism does not exist in Notion API",
      evidence: "Rapid successive changes are immediately visible via API",
      testScenario: testScenario,
      recommendation: "Investigation should focus on network latency, caching, and rate limiting",
      fullTestSuite: "Available in convex/testing/notionTimeGate.ts",
      documentation: "See docs/NOTION-TIMEGATE-INVESTIGATION.md"
    };
  }
});