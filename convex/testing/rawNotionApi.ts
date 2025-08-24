import { action } from "../_generated/server";
import { v } from "convex/values";

/**
 * Raw Notion API action - bypasses our sync logic entirely
 * This calls Notion API directly and returns raw response without any processing
 */
export const fetchRawNotionData = action({
  args: { 
    databaseId: v.string(),
    pageSize: v.optional(v.number())
  },
  handler: async (ctx, { databaseId, pageSize = 10 }) => {
    const notionApiKey = process.env.NOTION_API_KEY;
    
    if (!notionApiKey) {
      throw new Error("NOTION_API_KEY not configured");
    }

    try {
      console.log("🧪 RAW API: Calling Notion API directly...");
      
      const response = await fetch(`https://api.notion.com/v1/databases/${databaseId}/query`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${notionApiKey}`,
          'Notion-Version': '2022-06-28',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sorts: [
            {
              timestamp: 'last_edited_time',
              direction: 'descending'
            }
          ],
          page_size: pageSize
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Notion API Error: ${response.status} ${response.statusText} - ${errorText}`);
      }

      const data = await response.json();
      
      console.log(`🧪 RAW API: Retrieved ${data.results.length} records`);
      
      // Return raw data with minimal transformation for comparison
      return {
        success: true,
        timestamp: Date.now(),
        recordCount: data.results.length,
        records: data.results.map((page: any) => ({
          id: page.id,
          title: extractTitle(page.properties),
          assignee: extractAssignee(page.properties),
          status: extractStatus(page.properties),
          lastModified: page.last_edited_time,
          rawProperties: {
            assignee: page.properties['t[K\\'] || null,
            status: page.properties['Z[au'] || null,
          }
        }))
      };
      
    } catch (error) {
      console.error("🧪 RAW API Error:", error);
      throw new Error(`Raw Notion API failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
});

// Helper functions - identical to what we use elsewhere
function extractTitle(properties: any): string {
  try {
    const titleProp = properties['Task Name'] || properties.title;
    if (titleProp?.title?.[0]?.plain_text) {
      return titleProp.title[0].plain_text;
    }
    return 'Untitled';
  } catch {
    return 'Untitled';
  }
}

function extractAssignee(properties: any): string | null {
  try {
    const assigneeProp = properties['t[K\\'] || properties.Assignee;
    return assigneeProp?.select?.name || null;
  } catch {
    return null;
  }
}

function extractStatus(properties: any): string | null {
  try {
    const statusProp = properties['Z[au'] || properties.Status;
    return statusProp?.select?.name || null;
  } catch {
    return null;
  }
}