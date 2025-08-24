import { action } from "./_generated/server";
import { v } from "convex/values";

/**
 * Direct Notion API integration - bypasses Convex database entirely
 * Returns fresh data directly from Notion API without any caching layer
 * Uses dynamic property mapping to eliminate hard-coded property IDs
 */

// Property mapping interface
interface PropertyMapping {
  [propertyName: string]: string; // property name -> property ID
}

// Cache for property mappings (simple in-memory cache)
let propertyMappingCache: PropertyMapping | null = null;
let cacheTimestamp: number = 0;
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

/**
 * Fetches database schema from Notion API and creates property name -> ID mapping
 * Uses caching to avoid repeated API calls
 */
async function getPropertyMapping(databaseId: string, notionApiKey: string): Promise<PropertyMapping> {
  // Check cache first
  const now = Date.now();
  if (propertyMappingCache && (now - cacheTimestamp) < CACHE_DURATION) {
    console.log("📋 Using cached property mappings");
    return propertyMappingCache;
  }

  console.log("🔍 Fetching database schema for property mappings...");
  
  try {
    const response = await fetch(`https://api.notion.com/v1/databases/${databaseId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${notionApiKey}`,
        'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Database schema fetch failed: ${response.status} ${response.statusText}`);
    }

    const databaseSchema = await response.json();
    const mapping: PropertyMapping = {};
    
    // Build property name -> ID mapping from schema
    Object.entries(databaseSchema.properties).forEach(([propertyId, propertyInfo]: [string, any]) => {
      const propertyName = propertyInfo.name;
      if (propertyName) {
        mapping[propertyName] = propertyId;
        console.log(`📍 Mapped: "${propertyName}" -> "${propertyId}"`);
      }
    });

    // Cache the mapping
    propertyMappingCache = mapping;
    cacheTimestamp = now;
    
    console.log(`✅ Property mapping complete: ${Object.keys(mapping).length} properties cached`);
    return mapping;
    
  } catch (error) {
    console.error("❌ Failed to fetch property mappings:", error);
    // If we have stale cache, use it as fallback
    if (propertyMappingCache) {
      console.log("⚠️ Using stale cached mappings as fallback");
      return propertyMappingCache;
    }
    throw error;
  }
}

/**
 * Generic property extraction helpers using property name instead of hard-coded IDs
 */

// Extract string value from title property
function extractTitleProperty(properties: any, mapping: PropertyMapping, propertyName: string): string {
  try {
    const propertyId = mapping[propertyName];
    if (!propertyId) return 'Untitled';
    
    const titleProp = properties[propertyId];
    if (titleProp?.title?.[0]?.plain_text) {
      return titleProp.title[0].plain_text;
    }
    return 'Untitled';
  } catch {
    return 'Untitled';
  }
}

// Extract number value from number property
function extractNumberProperty(properties: any, mapping: PropertyMapping, propertyName: string): number | undefined {
  try {
    const propertyId = mapping[propertyName];
    if (!propertyId) return undefined;
    
    const numberProp = properties[propertyId];
    return numberProp?.number ?? undefined;
  } catch {
    return undefined;
  }
}

// Extract string value from select property
function extractSelectProperty(properties: any, mapping: PropertyMapping, propertyName: string): string | undefined {
  try {
    const propertyId = mapping[propertyName];
    if (!propertyId) return undefined;
    
    const selectProp = properties[propertyId];
    return selectProp?.select?.name ?? undefined;
  } catch {
    return undefined;
  }
}

// Extract array of strings from multi-select property
function extractMultiSelectProperty(properties: any, mapping: PropertyMapping, propertyName: string): string[] {
  try {
    const propertyId = mapping[propertyName];
    if (!propertyId) return [];
    
    const multiSelectProp = properties[propertyId];
    return multiSelectProp?.multi_select?.map((item: any) => item.name) || [];
  } catch {
    return [];
  }
}

// Extract string value from rich text property
function extractRichTextProperty(properties: any, mapping: PropertyMapping, propertyName: string): string | undefined {
  try {
    const propertyId = mapping[propertyName];
    if (!propertyId) return undefined;
    
    const richTextProp = properties[propertyId];
    const text = richTextProp?.rich_text?.map((rt: any) => rt.plain_text).join('');
    return text || undefined;
  } catch {
    return undefined;
  }
}

// Extract date string from date property
function extractDateProperty(properties: any, mapping: PropertyMapping, propertyName: string): string | undefined {
  try {
    const propertyId = mapping[propertyName];
    if (!propertyId) return undefined;
    
    const dateProp = properties[propertyId];
    return dateProp?.date?.start ?? undefined;
  } catch {
    return undefined;
  }
}

// Fallback function to search for property by value pattern (for migration safety)
function findPropertyByPattern(properties: any, searchPattern: string, propertyType: 'select' | 'number' | 'rich_text' = 'select'): any {
  try {
    for (const [key, prop] of Object.entries(properties)) {
      if (propertyType === 'select' && (prop as any)?.select?.name?.includes(searchPattern)) {
        return (prop as any).select.name;
      }
      if (propertyType === 'number' && (prop as any)?.number !== undefined && key.toLowerCase().includes(searchPattern.toLowerCase())) {
        return (prop as any).number;
      }
      if (propertyType === 'rich_text' && (prop as any)?.rich_text && key.toLowerCase().includes(searchPattern.toLowerCase())) {
        return (prop as any).rich_text?.map((rt: any) => rt.plain_text).join('');
      }
    }
    return undefined;
  } catch {
    return undefined;
  }
}

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
      
      // Get property mappings (cached automatically)
      const propertyMapping = await getPropertyMapping(databaseId, notionApiKey);
      
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
      
      // Transform to match timeline format using dynamic property mapping
      const transformedRecords = data.results.map((page: any) => {        
        return {
          _id: `notion_${page.id}`, // Fake ID for compatibility
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

// Refactored helper functions using property names instead of hard-coded IDs
function extractTitle(properties: any, mapping: PropertyMapping): string {
  // Use new robust extraction with fallback
  const title = extractTitleProperty(properties, mapping, 'Task Name');
  if (title && title !== 'Untitled') return title;
  
  // Legacy fallback for backward compatibility
  try {
    const titleProp = properties['Task Name'] || properties.title;
    if (titleProp?.title?.[0]?.plain_text) {
      return titleProp.title[0].plain_text;
    }
  } catch {
    // Ignore errors, continue to default
  }
  
  return 'Untitled';
}

function extractWeek(properties: any, mapping: PropertyMapping): number | undefined {
  // Use new robust extraction with fallback
  const week = extractNumberProperty(properties, mapping, 'Week');
  if (week !== undefined) return week;
  
  // Legacy fallback
  try {
    const weekProp = properties['FsRO'];
    return weekProp?.number || undefined;
  } catch {
    return undefined;
  }
}

function extractPhase(properties: any, mapping: PropertyMapping): string | undefined {
  // Use new robust extraction first
  const phase = extractSelectProperty(properties, mapping, 'Phase');
  if (phase) return phase;
  
  // Enhanced fallback with pattern matching
  const patternResult = findPropertyByPattern(properties, 'Phase', 'select');
  if (patternResult) return patternResult;
  
  // Legacy fallback
  try {
    const possibleKeys = ['ZyVe', 'Phase', 'phase'];
    for (const key of possibleKeys) {
      const phaseProp = properties[key];
      if (phaseProp?.select?.name) {
        return phaseProp.select.name;
      }
    }
  } catch {
    // Continue to final fallback
  }
  
  return undefined;
}

function extractStatus(properties: any, mapping: PropertyMapping): string | undefined {
  // Use new robust extraction first
  const status = extractSelectProperty(properties, mapping, 'Status');
  if (status) return status;
  
  // Legacy fallback
  try {
    const possibleKeys = ['Z[au', 'Status', 'status'];
    for (const key of possibleKeys) {
      const statusProp = properties[key];
      if (statusProp?.select?.name) {
        return statusProp.select.name;
      }
    }
  } catch {
    // Ignore errors
  }
  
  return undefined;
}

function extractPriority(properties: any, mapping: PropertyMapping): string | undefined {
  // Use new robust extraction first
  const priority = extractSelectProperty(properties, mapping, 'Priority');
  if (priority) return priority;
  
  // Legacy fallback
  try {
    const priorityProp = properties['WpFO'];
    return priorityProp?.select?.name || undefined;
  } catch {
    return undefined;
  }
}

function extractAssignee(properties: any, mapping: PropertyMapping): string | undefined {
  // Use new robust extraction first
  const assignee = extractSelectProperty(properties, mapping, 'Assignee');
  if (assignee) return assignee;
  
  // Legacy fallback with multiple key variations
  try {
    const possibleKeys = ['t[K\\', 't[K\\\\', 'Assignee', 'assignee'];
    for (const key of possibleKeys) {
      const assigneeProp = properties[key];
      if (assigneeProp?.select?.name) {
        return assigneeProp.select.name;
      }
    }
  } catch {
    // Ignore errors
  }
  
  return undefined;
}

function extractCategory(properties: any, mapping: PropertyMapping): string[] {
  // Use new robust extraction first
  const category = extractMultiSelectProperty(properties, mapping, 'Category');
  if (category.length > 0) return category;
  
  // Legacy fallback
  try {
    const categoryProp = properties['}WSF'];
    return categoryProp?.multi_select?.map((item: any) => item.name) || [];
  } catch {
    return [];
  }
}

function extractDescription(properties: any, mapping: PropertyMapping): string | undefined {
  // Use new robust extraction first
  const description = extractRichTextProperty(properties, mapping, 'Description');
  if (description) return description;
  
  // Legacy fallback
  try {
    const descProp = properties['=HYC'];
    return descProp?.rich_text?.map((rt: any) => rt.plain_text).join('') || undefined;
  } catch {
    return undefined;
  }
}

function extractSuccessCriteria(properties: any, mapping: PropertyMapping): string | undefined {
  // Use new robust extraction first
  const criteria = extractRichTextProperty(properties, mapping, 'Success Criteria');
  if (criteria) return criteria;
  
  // Legacy fallback
  try {
    const criteriaProp = properties['=GGp'];
    return criteriaProp?.rich_text?.map((rt: any) => rt.plain_text).join('') || undefined;
  } catch {
    return undefined;
  }
}

function extractDependencies(properties: any, mapping: PropertyMapping): string | undefined {
  // Use new robust extraction first
  const dependencies = extractRichTextProperty(properties, mapping, 'Dependencies');
  if (dependencies) return dependencies;
  
  // Legacy fallback
  try {
    const depProp = properties['kDm\\'];
    return depProp?.rich_text?.map((rt: any) => rt.plain_text).join('') || undefined;
  } catch {
    return undefined;
  }
}

function extractRisks(properties: any, mapping: PropertyMapping): string | undefined {
  // Use new robust extraction first
  const risks = extractRichTextProperty(properties, mapping, 'Risks');
  if (risks) return risks;
  
  // Legacy fallback
  try {
    const riskProp = properties['V>|B'];
    return riskProp?.rich_text?.map((rt: any) => rt.plain_text).join('') || undefined;
  } catch {
    return undefined;
  }
}

function extractDueDate(properties: any, mapping: PropertyMapping): string | undefined {
  // Use new robust extraction first
  const dueDate = extractDateProperty(properties, mapping, 'Due Date');
  if (dueDate) return dueDate;
  
  // Legacy fallback
  try {
    const dueProp = properties['oY^i'];
    return dueProp?.date?.start || undefined;
  } catch {
    return undefined;
  }
}

function extractPhaseNumber(properties: any, mapping: PropertyMapping): number | undefined {
  // Use new robust extraction first
  const phaseNumber = extractNumberProperty(properties, mapping, 'Phase Number');
  if (phaseNumber !== undefined) return phaseNumber;
  
  // Legacy fallback
  try {
    const phaseNumProp = properties['%60uWQ'];
    if (phaseNumProp?.number !== undefined) {
      return phaseNumProp.number;
    }
  } catch {
    // Ignore errors
  }
  
  return undefined;
}