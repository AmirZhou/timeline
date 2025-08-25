import { action } from "./_generated/server";
import { v } from "convex/values";

interface PropertyMapping {
  [propertyName: string]: string;
}

let propertyMappingCache: PropertyMapping | null = null;
let cacheTimestamp: number = 0;
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

async function getPropertyMapping(databaseId: string, notionApiKey: string): Promise<PropertyMapping> {
  const now = Date.now();
  if (propertyMappingCache && (now - cacheTimestamp) < CACHE_DURATION) {
    return propertyMappingCache;
  }

  try {
    const response = await fetch(`https://api.notion.com/v1/databases/${databaseId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${notionApiKey}`,
        'Notion-Version': '2022-06-28',
      },
    });

    if (!response.ok) {
      throw new Error(`Database schema fetch failed: ${response.status}`);
    }

    const databaseSchema = await response.json();
    const mapping: PropertyMapping = {};
    
    Object.entries(databaseSchema.properties).forEach(([propertyId, propertyInfo]: [string, any]) => {
      const propertyName = propertyInfo.name;
      if (propertyName) {
        mapping[propertyName] = propertyId;
      }
    });

    propertyMappingCache = mapping;
    cacheTimestamp = now;
    return mapping;
    
  } catch (error) {
    if (propertyMappingCache) {
      return propertyMappingCache;
    }
    throw error;
  }
}

// Generic property extractors
function extractNumberProperty(properties: any, mapping: PropertyMapping, propertyName: string): number | undefined {
  const propertyId = mapping[propertyName];
  return propertyId ? properties[propertyId]?.number : undefined;
}

function extractSelectProperty(properties: any, mapping: PropertyMapping, propertyName: string): string | undefined {
  const propertyId = mapping[propertyName];
  return propertyId ? properties[propertyId]?.select?.name : undefined;
}

function extractMultiSelectProperty(properties: any, mapping: PropertyMapping, propertyName: string): string[] {
  const propertyId = mapping[propertyName];
  return propertyId ? properties[propertyId]?.multi_select?.map((item: any) => item.name) || [] : [];
}

function extractRichTextProperty(properties: any, mapping: PropertyMapping, propertyName: string): string | undefined {
  const propertyId = mapping[propertyName];
  const text = propertyId ? properties[propertyId]?.rich_text?.map((rt: any) => rt.plain_text).join('') : undefined;
  return text || undefined;
}

function extractDateProperty(properties: any, mapping: PropertyMapping, propertyName: string): string | undefined {
  const propertyId = mapping[propertyName];
  return propertyId ? properties[propertyId]?.date?.start : undefined;
}

// Property extraction functions
function extractTitle(properties: any, mapping: PropertyMapping): string {
  const propertyId = mapping['Task Name'];
  if (propertyId && properties[propertyId]?.title?.[0]?.plain_text) {
    return properties[propertyId].title[0].plain_text;
  }
  // Fallback
  const titleProp = properties['Task Name'] || properties.title;
  return titleProp?.title?.[0]?.plain_text || 'Untitled';
}

function extractWeek(properties: any, mapping: PropertyMapping): number | undefined {
  return extractNumberProperty(properties, mapping, 'Week') || properties['FsRO']?.number;
}

function extractPhase(properties: any, mapping: PropertyMapping): string | undefined {
  return extractSelectProperty(properties, mapping, 'Phase') || properties['ZyVe']?.select?.name;
}

function extractPhaseNumber(properties: any, mapping: PropertyMapping): number | undefined {
  return extractNumberProperty(properties, mapping, 'Phase Number') || properties['%60uWQ']?.number;
}

function extractStatus(properties: any, mapping: PropertyMapping): string | undefined {
  return extractSelectProperty(properties, mapping, 'Status') || properties['Z[au']?.select?.name;
}

function extractPriority(properties: any, mapping: PropertyMapping): string | undefined {
  return extractSelectProperty(properties, mapping, 'Priority') || properties['WpFO']?.select?.name;
}

function extractAssignee(properties: any, mapping: PropertyMapping): string | undefined {
  return extractSelectProperty(properties, mapping, 'Assignee') || properties['t[K\\']?.select?.name;
}

function extractCategory(properties: any, mapping: PropertyMapping): string[] {
  const categories = extractMultiSelectProperty(properties, mapping, 'Category');
  return categories.length > 0 ? categories : properties['}WSF']?.multi_select?.map((item: any) => item.name) || [];
}

function extractDescription(properties: any, mapping: PropertyMapping): string | undefined {
  return extractRichTextProperty(properties, mapping, 'Description') || 
         properties['=HYC']?.rich_text?.map((rt: any) => rt.plain_text).join('') || undefined;
}

function extractSuccessCriteria(properties: any, mapping: PropertyMapping): string | undefined {
  return extractRichTextProperty(properties, mapping, 'Success Criteria') ||
         properties['=GGp']?.rich_text?.map((rt: any) => rt.plain_text).join('') || undefined;
}

function extractDependencies(properties: any, mapping: PropertyMapping): string | undefined {
  return extractRichTextProperty(properties, mapping, 'Dependencies') ||
         properties['kDm\\']?.rich_text?.map((rt: any) => rt.plain_text).join('') || undefined;
}

function extractRisks(properties: any, mapping: PropertyMapping): string | undefined {
  return extractRichTextProperty(properties, mapping, 'Risks') ||
         properties['V>|B']?.rich_text?.map((rt: any) => rt.plain_text).join('') || undefined;
}

function extractDueDate(properties: any, mapping: PropertyMapping): string | undefined {
  return extractDateProperty(properties, mapping, 'Due Date') || properties['oY^i']?.date?.start;
}

export const getProjectTimelineDirect = action({
  args: {
    phase: v.optional(v.string()),
    status: v.optional(v.string()),
    priority: v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  handler: async (_ctx, filters) => {
    const databaseId = process.env.NOTION_DATABASE_ID;
    const notionApiKey = process.env.NOTION_API_KEY;
    
    if (!notionApiKey) {
      throw new Error("NOTION_API_KEY not configured");
    }

    if (!databaseId) {
      throw new Error("NOTION_DATABASE_ID not configured");
    }

    try {
      const propertyMapping = await getPropertyMapping(databaseId, notionApiKey);
      
      const response = await fetch(`https://api.notion.com/v1/databases/${databaseId}/query`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${notionApiKey}`,
          'Notion-Version': '2022-06-28',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sorts: [{ timestamp: 'last_edited_time', direction: 'descending' }]
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Notion API Error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      
      const transformedRecords = data.results.map((page: any) => ({
        _id: `notion_${page.id}`,
        _creationTime: new Date(page.created_time).getTime(),
        notionId: page.id,
        title: extractTitle(page.properties, propertyMapping),
        properties: {
          week: extractWeek(page.properties, propertyMapping),
          phase: extractPhase(page.properties, propertyMapping),
          phaseNumber: extractPhaseNumber(page.properties, propertyMapping),
          status: extractStatus(page.properties, propertyMapping),
          priority: extractPriority(page.properties, propertyMapping),
          assignee: extractAssignee(page.properties, propertyMapping),
          category: extractCategory(page.properties, propertyMapping),
          description: extractDescription(page.properties, propertyMapping),
          successCriteria: extractSuccessCriteria(page.properties, propertyMapping),
          dependencies: extractDependencies(page.properties, propertyMapping),
          risks: extractRisks(page.properties, propertyMapping),
          dueDate: extractDueDate(page.properties, propertyMapping),
        },
        lastModified: new Date(page.last_edited_time).getTime(),
        createdTime: new Date(page.created_time).getTime(),
        isArchived: page.archived || false,
        url: page.url,
      }));

      // Apply filters
      let filteredRecords = transformedRecords;
      
      if (filters.phase) {
        filteredRecords = filteredRecords.filter((record: any) => record.properties.phase === filters.phase);
      }
      if (filters.status) {
        filteredRecords = filteredRecords.filter((record: any) => record.properties.status === filters.status);
      }
      if (filters.priority) {
        filteredRecords = filteredRecords.filter((record: any) => record.properties.priority === filters.priority);
      }

      // Sort by week and apply limit
      filteredRecords.sort((a: any, b: any) => (a.properties.week || 999) - (b.properties.week || 999));
      
      if (filters.limit) {
        filteredRecords = filteredRecords.slice(0, filters.limit);
      }

      return filteredRecords;
      
    } catch (error) {
      console.error("Direct API Error:", error);
      throw new Error(`Direct Notion API failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
});