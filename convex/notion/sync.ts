import { v } from "convex/values";
import { action, internalMutation, internalQuery, query } from "../_generated/server";
import { internal } from "../_generated/api";
import { NotionSyncClient } from "../lib/notionClient";

// Action: Fetch data from Notion (runs on server, can make HTTP requests)
export const syncNotionDatabase = action({
  args: { 
    databaseId: v.string(),
    forceFullSync: v.optional(v.boolean())
  },
  handler: async (ctx, { databaseId, forceFullSync = false }) => {
    // Get last sync metadata (declare at function scope)
    const lastSync = await ctx.runQuery(internal.notion.sync.getLastSyncMeta, { databaseId });
    
    try {
      // Get Notion API key from environment
      const notionApiKey = process.env.NOTION_API_KEY;
      if (!notionApiKey) {
        throw new Error("NOTION_API_KEY not configured");
      }
      
      // Initialize Notion client and fetch changes
      const client = new NotionSyncClient(notionApiKey);
      // Simple fetch: Just get all data like the working raw API
      const changes = await client.fetchDatabaseChanges(databaseId);
      
      console.log(`Found ${changes.length} changes from Notion`);

      if (changes.length > 0) {
        // Batch upsert records to Convex
        await ctx.runMutation(internal.notion.sync.batchUpsertRecords, {
          databaseId,
          records: changes
        });
        
        console.log(`Successfully synced ${changes.length} records from Notion`);
      }
      
      // Update sync metadata with current time to prevent gaps in future syncs
      await ctx.runMutation(internal.notion.sync.updateSyncMeta, {
        databaseId,
        status: "success",
        recordCount: changes.length,
        lastSyncTime: Date.now()  // Use sync completion time, not record timestamps
      });
      
      return { success: true, synced: changes.length };
      
    } catch (error) {
      console.error("Notion sync failed:", error);
      
      // Update sync metadata with error - preserve previous sync time to retry missed records
      await ctx.runMutation(internal.notion.sync.updateSyncMeta, {
        databaseId,
        status: "error",
        errorMessage: error instanceof Error ? error.message : String(error),
        recordCount: 0,
        lastSyncTime: lastSync?.lastSyncTime || Date.now()
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
        // Update existing record if it's newer
        if (record.lastModified > existing.lastModified) {
          await ctx.db.patch(existing._id, recordData);
        }
      } else {
        // Insert new record
        await ctx.db.insert("notion_records", recordData);
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
      let aValue, bValue;
      
      if (sortBy === "lastModified" || sortBy === "createdTime") {
        aValue = a[sortBy];
        bValue = b[sortBy];
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

// TEST ACTION: Verify Notion propagation delay with multiple fetches
export const testNotionPropagationDelay = action({
  args: { 
    databaseId: v.string(),
    delayIntervals: v.optional(v.array(v.number())) // Array of delay intervals in seconds
  },
  handler: async (ctx, { databaseId, delayIntervals = [1, 5, 10, 20, 30] }) => {
    console.log(`\n🧪 TESTING NOTION PROPAGATION DELAY`);
    console.log(`📊 Database ID: ${databaseId}`);
    console.log(`⏱️ Test intervals: ${delayIntervals.map(d => `${d}s`).join(', ')}`);
    
    const notionApiKey = process.env.NOTION_API_KEY;
    if (!notionApiKey) {
      throw new Error("NOTION_API_KEY not configured");
    }
    
    const client = new NotionSyncClient(notionApiKey);
    const testResults: Array<{
      delay: number;
      timestamp: string;
      recordCount: number;
      records: Array<{
        title: string;
        lastEditedTime: string;
        assignee: string | null;
        status: string | null;
      }>;
    }> = [];
    
    // Perform initial fetch to establish baseline
    console.log(`\n🔄 Baseline fetch (0s delay):`);
    const baselineRecords = await client.fetchDatabaseChanges(databaseId);
    
    testResults.push({
      delay: 0,
      timestamp: new Date().toISOString(),
      recordCount: baselineRecords.length,
      records: baselineRecords.slice(0, 5).map(record => ({
        title: record.title,
        lastEditedTime: new Date(record.lastModified).toISOString(),
        assignee: record.properties.assignee,
        status: record.properties.status,
      }))
    });
    
    // Perform delayed fetches
    for (const delaySeconds of delayIntervals) {
      console.log(`\n⏳ Waiting ${delaySeconds} seconds before next fetch...`);
      await new Promise(resolve => setTimeout(resolve, delaySeconds * 1000));
      
      console.log(`\n🔄 Fetch after ${delaySeconds}s delay:`);
      const delayedRecords = await client.fetchDatabaseChanges(databaseId);
      
      testResults.push({
        delay: delaySeconds,
        timestamp: new Date().toISOString(),
        recordCount: delayedRecords.length,
        records: delayedRecords.slice(0, 5).map(record => ({
          title: record.title,
          lastEditedTime: new Date(record.lastModified).toISOString(),
          assignee: record.properties.assignee,
          status: record.properties.status,
        }))
      });
      
      // Compare with baseline to detect changes
      const baselineFirst = testResults[0].records[0];
      const currentFirst = delayedRecords[0];
      
      if (baselineFirst && currentFirst) {
        const assigneeChanged = baselineFirst.assignee !== currentFirst.properties.assignee;
        const lastEditedChanged = baselineFirst.lastEditedTime !== new Date(currentFirst.lastModified).toISOString();
        
        console.log(`  📊 Comparison with baseline:`);
        console.log(`    - Assignee changed: ${assigneeChanged ? '✅ YES' : '❌ NO'}`);
        console.log(`    - Last edited time changed: ${lastEditedChanged ? '✅ YES' : '❌ NO'}`);
        
        if (lastEditedChanged && !assigneeChanged) {
          console.log(`    ⚠️  STALE DATA DETECTED: last_edited_time updated but assignee value didn't change!`);
        }
      }
    }
    
    console.log(`\n📋 TEST RESULTS SUMMARY:`);
    testResults.forEach((result, index) => {
      console.log(`  ${index === 0 ? 'Baseline' : `${result.delay}s delay`}: ${result.recordCount} records, first assignee: "${result.records[0]?.assignee || 'none'}"`);
    });
    
    return {
      testCompleted: true,
      totalTests: testResults.length,
      results: testResults,
      summary: `Tested ${delayIntervals.length + 1} intervals, found ${testResults.length} data points`
    };
  }
});