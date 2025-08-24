import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Notion sync metadata - tracks sync status and progress
  notion_sync_meta: defineTable({
    databaseId: v.string(),
    lastSyncTime: v.number(),
    syncStatus: v.union(v.literal("success"), v.literal("error"), v.literal("running")),
    errorMessage: v.optional(v.string()),
    recordCount: v.number(),
    totalSynced: v.optional(v.number()),
  }).index("by_database", ["databaseId"]),

  // Notion records - transformed and cleaned data from Notion
  notion_records: defineTable({
    notionId: v.string(),           // Notion page ID
    notionDatabaseId: v.string(),   // Source database ID
    title: v.string(),              // Task name from Notion title
    properties: v.object({          // Transformed Notion properties
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
    lastModified: v.number(),       // Notion last_edited_time
    createdTime: v.number(),        // Notion created_time
    isArchived: v.boolean(),        // Notion archived status
    url: v.string(),                // Notion page URL
    rawNotionData: v.optional(v.any()), // Backup of original data for debugging
  })
  .index("by_database", ["notionDatabaseId"])
  .index("by_notion_id", ["notionId"])
  .index("by_last_modified", ["lastModified"])
  .index("by_status", ["properties.status"])
  .index("by_week", ["properties.week"])
  .index("by_phase", ["properties.phase"]),
});