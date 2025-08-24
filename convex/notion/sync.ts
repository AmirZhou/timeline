import { v } from "convex/values";
import { action, internalAction, internalMutation, internalQuery, query } from "../_generated/server";
import { internal } from "../_generated/api";
import { NotionSyncClient } from "../lib/notionClient";

// Action: Fetch data from Notion (runs on server, can make HTTP requests)
// Make this internal so it can be scheduled
export const syncNotionDatabase = internalAction({
  args: { 
    databaseId: v.string(),
    forceFullSync: v.optional(v.boolean()),
    retryAttempt: v.optional(v.number())
  },
  handler: async (ctx, { databaseId, forceFullSync = false, retryAttempt = 0 }) => {
    try {
      // Get Notion API key from environment
      const notionApiKey = process.env.NOTION_API_KEY;
      if (!notionApiKey) {
        throw new Error("NOTION_API_KEY not configured");
      }

      // Update sync status to running
      await ctx.runMutation(internal.notion.sync.updateSyncMeta, {
        databaseId,
        status: "running",
        recordCount: 0,
        lastSyncTime: Date.now()
      });

      // Get last sync metadata
      const lastSync = await ctx.runQuery(internal.notion.sync.getLastSyncMeta, { databaseId });
      
      // Force full sync if:
      // 1. Explicitly requested
      // 2. Last sync was more than 1 hour ago (catch missed changes)
      // 3. Last sync had errors
      const oneHourAgo = Date.now() - (60 * 60 * 1000);
      const shouldForceFullSync = forceFullSync || 
        !lastSync || 
        lastSync.lastSyncTime < oneHourAgo ||
        lastSync.syncStatus === "error";
      
      // Initialize Notion client and fetch changes
      const client = new NotionSyncClient(notionApiKey);
      const changes = await client.fetchDatabaseChanges(
        databaseId, 
        shouldForceFullSync ? undefined : lastSync?.lastSyncTime
      );
      
      console.log(`Sync mode: ${shouldForceFullSync ? 'FULL' : 'INCREMENTAL'}, Found ${changes.length} changes`);
      
      console.log(`Found ${changes.length} changes from Notion`);

      if (changes.length > 0) {
        // Batch upsert records to Convex
        await ctx.runMutation(internal.notion.sync.batchUpsertRecords, {
          databaseId,
          records: changes
        });
        
        console.log(`Successfully synced ${changes.length} records from Notion`);
      }
      
      // Update sync metadata
      await ctx.runMutation(internal.notion.sync.updateSyncMeta, {
        databaseId,
        status: "success",
        recordCount: changes.length,
        lastSyncTime: Date.now()
      });
      
      return { success: true, synced: changes.length };
      
    } catch (error) {
      console.error(`Notion sync failed (attempt ${retryAttempt + 1}):`, error);
      
      // Implement exponential backoff retry logic
      const maxRetries = 3;
      const shouldRetry = retryAttempt < maxRetries && 
        error instanceof Error &&
        (error.message.includes('rate limit') || 
         error.message.includes('timeout') ||
         error.message.includes('network'));
      
      if (shouldRetry) {
        const retryDelay = Math.min(1000 * Math.pow(2, retryAttempt), 10000); // Cap at 10 seconds
        console.log(`Retrying sync in ${retryDelay}ms...`);
        
        // Schedule retry
        await ctx.scheduler.runAfter(retryDelay, internal.notion.sync.syncNotionDatabase, {
          databaseId,
          forceFullSync,
          retryAttempt: retryAttempt + 1
        });
        
        return { success: false, retrying: true, nextAttempt: retryAttempt + 1 };
      }
      
      // Update sync metadata with error
      await ctx.runMutation(internal.notion.sync.updateSyncMeta, {
        databaseId,
        status: "error",
        errorMessage: `${error instanceof Error ? error.message : String(error)} (after ${retryAttempt + 1} attempts)`,
        recordCount: 0,
        lastSyncTime: Date.now()
      });
      
      throw error;
    }
  }
});

// Internal mutation: Batch upsert records from Notion
export const batchUpsertRecords = internalMutation({
  args: {
    databaseId: v.string(),
    records: v.array(v.object({
      id: v.string(),
      title: v.string(),
      properties: v.object({
        week: v.optional(v.number()),
        phase: v.optional(v.string()),
        status: v.optional(v.string()),
        priority: v.optional(v.string()),
        assignee: v.optional(v.string()),
        category: v.optional(v.array(v.string())),
        description: v.optional(v.string()),
        successCriteria: v.optional(v.string()),
        dependencies: v.optional(v.string()),
        risks: v.optional(v.string()),
        dueDate: v.optional(v.string()),
      }),
      createdTime: v.number(),
      lastModified: v.number(),
      url: v.string(),
    }))
  },
  handler: async (ctx, { databaseId, records }) => {
    for (const record of records) {
      // Check if record already exists
      const existing = await ctx.db
        .query("notion_records")
        .withIndex("by_notion_id", (q) => q.eq("notionId", record.id))
        .first();

      const recordData = {
        notionId: record.id,
        notionDatabaseId: databaseId,
        title: record.title,
        properties: record.properties,
        lastModified: record.lastModified,
        createdTime: record.createdTime,
        isArchived: false,
        url: record.url,
      };

      if (existing) {
        // Always update if we're doing a force sync, or if the record is newer
        const shouldUpdate = forceFullSync || record.lastModified > existing.lastModified;
        
        if (shouldUpdate) {
          await ctx.db.patch(existing._id, {
            ...recordData,
            // Preserve the original creation time from our database
            createdTime: existing.createdTime,
          });
          console.log(`Updated record: ${record.title} (${existing.lastModified} -> ${record.lastModified})`);
        } else {
          console.log(`Skipped record (no changes): ${record.title}`);
        }
      } else {
        // Insert new record
        await ctx.db.insert("notion_records", recordData);
        console.log(`Inserted new record: ${record.title}`);
      }
    }
  },
});

// Internal mutation: Update sync metadata
export const updateSyncMeta = internalMutation({
  args: {
    databaseId: v.string(),
    status: v.union(v.literal("success"), v.literal("error"), v.literal("running")),
    errorMessage: v.optional(v.string()),
    recordCount: v.number(),
    lastSyncTime: v.number(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("notion_sync_meta")
      .withIndex("by_database", (q) => q.eq("databaseId", args.databaseId))
      .first();

    const metaData = {
      databaseId: args.databaseId,
      lastSyncTime: args.lastSyncTime,
      syncStatus: args.status,
      errorMessage: args.errorMessage,
      recordCount: args.recordCount,
    };

    if (existing) {
      await ctx.db.patch(existing._id, metaData);
    } else {
      await ctx.db.insert("notion_sync_meta", metaData);
    }
  },
});

// Internal query: Get last sync metadata
export const getLastSyncMeta = internalQuery({
  args: { databaseId: v.string() },
  handler: async (ctx, { databaseId }) => {
    return await ctx.db
      .query("notion_sync_meta")
      .withIndex("by_database", (q) => q.eq("databaseId", databaseId))
      .first();
  },
});

// Public query: Get all records for frontend display
export const getRecords = query({
  args: {
    databaseId: v.string(),
    filters: v.optional(v.object({
      status: v.optional(v.string()),
      phase: v.optional(v.string()),
      priority: v.optional(v.string()),
      week: v.optional(v.number()),
    })),
    sortBy: v.optional(v.string()),
    sortDirection: v.optional(v.union(v.literal("asc"), v.literal("desc"))),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, { databaseId, filters, sortBy = "lastModified", sortDirection = "desc", limit }) => {
    let query = ctx.db
      .query("notion_records")
      .withIndex("by_database", (q) => q.eq("notionDatabaseId", databaseId));

    // Apply filters
    if (filters) {
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
        if (filters.week !== undefined) {
          conditions = q.and(conditions, q.eq(q.field("properties.week"), filters.week));
        }
        
        return conditions;
      });
    }

    // Get results
    let results = await query.collect();

    // Sort results
    results.sort((a, b) => {
      let aValue: any, bValue: any;
      
      if (sortBy === "lastModified" || sortBy === "createdTime") {
        aValue = a[sortBy as keyof typeof a];
        bValue = b[sortBy as keyof typeof b];
      } else {
        aValue = (a.properties as any)[sortBy];
        bValue = (b.properties as any)[sortBy];
      }
      
      if (aValue === null || aValue === undefined) aValue = "";
      if (bValue === null || bValue === undefined) bValue = "";
      
      const comparison = aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      return sortDirection === "desc" ? -comparison : comparison;
    });

    // Apply limit
    if (limit) {
      results = results.slice(0, limit);
    }

    return results;
  },
});

// Public query: Get sync status for frontend
export const getSyncStatus = query({
  args: { databaseId: v.string() },
  handler: async (ctx, { databaseId }) => {
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
  },
});

// Public action: Force a full sync (useful for testing/debugging)
export const forceFullSync = action({
  args: { databaseId: v.string() },
  handler: async (ctx, { databaseId }): Promise<{ success: boolean; synced?: number; retrying?: boolean; nextAttempt?: number }> => {
    console.log(`Force full sync requested for database: ${databaseId}`);
    return await ctx.runAction(internal.notion.sync.syncNotionDatabase, {
      databaseId,
      forceFullSync: true
    });
  },
});

// Scheduled action: Auto-sync every 10 minutes
export const scheduledSync = internalAction({
  handler: async (ctx) => {
    const databaseId = process.env.NOTION_DATABASE_ID;
    if (!databaseId) {
      console.warn("NOTION_DATABASE_ID not configured, skipping scheduled sync");
      return;
    }
    
    console.log("Running scheduled sync...");
    
    try {
      await ctx.runAction(internal.notion.sync.syncNotionDatabase, {
        databaseId,
        forceFullSync: false
      });
    } catch (error) {
      console.error("Scheduled sync failed:", error);
      // Don't throw - let the next scheduled sync try again
    }
    
    // Schedule next sync (10 minutes)
    await ctx.scheduler.runAfter(10 * 60 * 1000, internal.notion.sync.scheduledSync, {});
  },
});

// Mutation to initialize scheduled syncing (call this once to start)
export const initializeScheduledSync = internalMutation({
  handler: async (ctx) => {
    // Schedule the first sync to start immediately
    await ctx.scheduler.runAfter(0, internal.notion.sync.scheduledSync, {});
    console.log("Scheduled sync initialized");
  },
});