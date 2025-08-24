import { action } from "./_generated/server";
import { v } from "convex/values";

/**
 * Direct Notion API integration - bypasses Convex database entirely
 * Returns fresh data directly from Notion API without any caching layer
 */

export const getProjectTimelineDirect = action({
  args: {
    phase: v.optional(v.string()),
    status: v.optional(v.string()),
    priority: v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  handler: async (_ctx, filters) => {
    const databaseId = "2584f2e11dba819eb0f5fc54bff7b13f";
    const notionApiKey = process.env.NOTION_API_KEY;
    
    if (!notionApiKey) {
      throw new Error("NOTION_API_KEY not configured");
    }

    try {
      console.log("🔄 Direct API: Fetching fresh data from Notion...");
      
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
          ]
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Notion API Error: ${response.status} ${response.statusText} - ${errorText}`);
      }

      const data = await response.json();
      console.log(`📦 Direct API: Retrieved ${data.results.length} records`);
      
      // Transform to match timeline format
      const transformedRecords = data.results.map((page: any) => {        
        return {
          _id: `notion_${page.id}`, // Fake ID for compatibility
          _creationTime: new Date(page.created_time).getTime(),
          notionId: page.id,
          title: extractTitle(page.properties),
          properties: {
            week: extractWeek(page.properties),
            phase: extractPhase(page.properties),
            phaseNumber: extractPhaseNumber(page.properties),
            status: extractStatus(page.properties),
            priority: extractPriority(page.properties),
            assignee: extractAssignee(page.properties),
            category: extractCategory(page.properties),
            description: extractDescription(page.properties),
            successCriteria: extractSuccessCriteria(page.properties),
            dependencies: extractDependencies(page.properties),
            risks: extractRisks(page.properties),
            dueDate: extractDueDate(page.properties),
          },
          lastModified: new Date(page.last_edited_time).getTime(),
          createdTime: new Date(page.created_time).getTime(),
          isArchived: page.archived || false,
          url: page.url,
        };
      });

      // Apply filters
      let filteredRecords = transformedRecords;
      
      if (filters.phase) {
        filteredRecords = filteredRecords.filter((record: any) => 
          record.properties.phase === filters.phase
        );
      }
      
      if (filters.status) {
        filteredRecords = filteredRecords.filter((record: any) => 
          record.properties.status === filters.status
        );
      }
      
      if (filters.priority) {
        filteredRecords = filteredRecords.filter((record: any) => 
          record.properties.priority === filters.priority
        );
      }

      // Sort by week
      filteredRecords.sort((a: any, b: any) => {
        const weekA = a.properties.week || 999;
        const weekB = b.properties.week || 999;
        return weekA - weekB;
      });

      // Apply limit
      if (filters.limit) {
        filteredRecords = filteredRecords.slice(0, filters.limit);
      }

      console.log(`✅ Direct API: Returning ${filteredRecords.length} filtered records`);
      return filteredRecords;
      
    } catch (error) {
      console.error("❌ Direct API Error:", error);
      throw new Error(`Direct Notion API failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
});

// Helper functions for property extraction
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

function extractWeek(properties: any): number | undefined {
  try {
    const weekProp = properties['FsRO'];
    return weekProp?.number || undefined;
  } catch {
    return undefined;
  }
}

function extractPhase(properties: any): string | undefined {
  try {
    // Try multiple possible keys for Phase property
    const possibleKeys = ['ZyVe', 'Phase', 'phase'];
    
    for (const key of possibleKeys) {
      const phaseProp = properties[key];
      if (phaseProp?.select?.name) {
        return phaseProp.select.name;
      }
    }
    
    // Fallback: look for any property that has "Phase" in the value
    for (const [key, prop] of Object.entries(properties)) {
      const value = (prop as any)?.select?.name;
      if (value && typeof value === 'string' && value.includes('Phase')) {
        console.log(`🔍 Found phase via fallback - key: "${key}", value: "${value}"`);
        return value;
      }
    }
    
    return undefined;
  } catch {
    return undefined;
  }
}

function extractStatus(properties: any): string | undefined {
  try {
    // Try multiple possible keys
    const possibleKeys = ['Z[au', 'Status', 'status'];
    
    for (const key of possibleKeys) {
      const statusProp = properties[key];
      if (statusProp?.select?.name) {
        return statusProp.select.name;
      }
    }
    return undefined;
  } catch {
    return undefined;
  }
}

function extractPriority(properties: any): string | undefined {
  try {
    const priorityProp = properties['WpFO'];
    return priorityProp?.select?.name || undefined;
  } catch {
    return undefined;
  }
}

function extractAssignee(properties: any): string | undefined {
  try {
    // Try multiple possible keys - note the different escaping
    const possibleKeys = ['t[K\\', 't[K\\\\', 'Assignee', 'assignee'];
    
    for (const key of possibleKeys) {
      const assigneeProp = properties[key];
      if (assigneeProp?.select?.name) {
        return assigneeProp.select.name;
      }
    }
    return undefined;
  } catch {
    return undefined;
  }
}

function extractCategory(properties: any): string[] {
  try {
    const categoryProp = properties['}WSF'];
    return categoryProp?.multi_select?.map((item: any) => item.name) || [];
  } catch {
    return [];
  }
}

function extractDescription(properties: any): string | undefined {
  try {
    const descProp = properties['=HYC'];
    return descProp?.rich_text?.map((rt: any) => rt.plain_text).join('') || undefined;
  } catch {
    return undefined;
  }
}

function extractSuccessCriteria(properties: any): string | undefined {
  try {
    const criteriaProp = properties['=GGp'];
    return criteriaProp?.rich_text?.map((rt: any) => rt.plain_text).join('') || undefined;
  } catch {
    return undefined;
  }
}

function extractDependencies(properties: any): string | undefined {
  try {
    const depProp = properties['kDm\\'];
    return depProp?.rich_text?.map((rt: any) => rt.plain_text).join('') || undefined;
  } catch {
    return undefined;
  }
}

function extractRisks(properties: any): string | undefined {
  try {
    const riskProp = properties['V>|B'];
    return riskProp?.rich_text?.map((rt: any) => rt.plain_text).join('') || undefined;
  } catch {
    return undefined;
  }
}

function extractDueDate(properties: any): string | undefined {
  try {
    const dueProp = properties['oY^i'];
    return dueProp?.date?.start || undefined;
  } catch {
    return undefined;
  }
}

function extractPhaseNumber(properties: any): number | undefined {
  try {
    const phaseNumProp = properties['%60uWQ'];
    if (phaseNumProp?.number !== undefined) {
      return phaseNumProp.number;
    }
    return undefined;
  } catch {
    return undefined;
  }
}