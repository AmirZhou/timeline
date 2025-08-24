import { Client } from "@notionhq/client";

export interface NotionRecord {
  id: string;
  title: string;
  properties: Record<string, any>;
  createdTime: number;
  lastModified: number;
  url: string;
}

export class NotionSyncClient {
  private notion: Client;
  private apiKey: string;

  constructor(apiKey: string) {
    this.notion = new Client({
      auth: apiKey,
    });
    this.apiKey = apiKey;
  }

  // EXACT COPY of working raw API
  async fetchDatabaseChanges(
    databaseId: string, 
    lastSync?: number,
    options?: { maxRetries?: number; retryDelay?: number }
  ): Promise<NotionRecord[]> {
    console.log("🔍 NOTION FETCH: Using EXACT raw API logic...");
    
    try {
      const response = await fetch(`https://api.notion.com/v1/databases/${databaseId}/query`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
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
      console.log(`📦 Notion returned ${data.results.length} records`);
      
      // Use EXACT same transformation as raw API
      return data.results.map((page: any) => ({
        id: page.id,
        title: this.extractTitleSimple(page.properties),
        properties: {
          week: this.extractWeek(page.properties) ?? undefined,
          phase: this.extractPhase(page.properties) ?? undefined,
          status: this.extractStatusSimple(page.properties) ?? undefined,
          priority: this.extractPriority(page.properties) ?? undefined,
          assignee: this.extractAssigneeSimple(page.properties) ?? undefined,
          category: this.extractCategory(page.properties),
          description: this.extractDescription(page.properties) ?? undefined,
          successCriteria: this.extractSuccessCriteria(page.properties) ?? undefined,
          dependencies: this.extractDependencies(page.properties) ?? undefined,
          risks: this.extractRisks(page.properties) ?? undefined,
          dueDate: this.extractDueDate(page.properties) ?? undefined,
        },
        createdTime: new Date(page.created_time).getTime(),
        lastModified: new Date(page.last_edited_time).getTime(),
        url: page.url,
      }));
      
    } catch (error) {
      console.error("❌ NOTION FETCH ERROR:", error);
      throw new Error(`Raw Notion API failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Simple extraction methods - identical to raw API
  private extractTitleSimple(properties: any): string {
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

  private extractAssigneeSimple(properties: any): string | null {
    try {
      const assigneeProp = properties['t[K\\'] || properties.Assignee;
      return assigneeProp?.select?.name || null;
    } catch {
      return null;
    }
  }

  private extractStatusSimple(properties: any): string | null {
    try {
      const statusProp = properties['Z[au'] || properties.Status;
      return statusProp?.select?.name || null;
    } catch {
      return null;
    }
  }

  private extractWeek(properties: any): number | null {
    try {
      const weekProp = properties['FsRO'];
      return weekProp?.number || null;
    } catch {
      return null;
    }
  }

  private extractPhase(properties: any): string | null {
    try {
      const phaseProp = properties['ZyVe'];
      return phaseProp?.select?.name || null;
    } catch {
      return null;
    }
  }

  private extractPriority(properties: any): string | null {
    try {
      const priorityProp = properties['WpFO'];
      return priorityProp?.select?.name || null;
    } catch {
      return null;
    }
  }

  private extractCategory(properties: any): string[] {
    try {
      const categoryProp = properties['}WSF'];
      return categoryProp?.multi_select?.map((item: any) => item.name) || [];
    } catch {
      return [];
    }
  }

  private extractDescription(properties: any): string | null {
    try {
      const descProp = properties['=HYC'];
      return descProp?.rich_text?.map((rt: any) => rt.plain_text).join('') || null;
    } catch {
      return null;
    }
  }

  private extractSuccessCriteria(properties: any): string | null {
    try {
      const criteriaProp = properties['=GGp'];
      return criteriaProp?.rich_text?.map((rt: any) => rt.plain_text).join('') || null;
    } catch {
      return null;
    }
  }

  private extractDependencies(properties: any): string | null {
    try {
      const depProp = properties['kDm\\'];
      return depProp?.rich_text?.map((rt: any) => rt.plain_text).join('') || null;
    } catch {
      return null;
    }
  }

  private extractRisks(properties: any): string | null {
    try {
      const riskProp = properties['V>|B'];
      return riskProp?.rich_text?.map((rt: any) => rt.plain_text).join('') || null;
    } catch {
      return null;
    }
  }

  private extractDueDate(properties: any): string | null {
    try {
      const dueProp = properties['oY^i'];
      return dueProp?.date?.start || null;
    } catch {
      return null;
    }
  }

  private transformNotionPage(notionPage: any): NotionRecord {
    const properties = this.transformProperties(notionPage.properties);
    const lastModified = new Date(notionPage.last_edited_time).getTime();
    
    // Enhanced logging for assignee field specifically
    const rawAssignee = notionPage.properties['t[K\\'];
    if (rawAssignee) {
      console.log(`    🔎 Raw Assignee Property:`, JSON.stringify(rawAssignee, null, 2));
      console.log(`    🔄 Transformed Assignee: "${properties.assignee}"`);
    }
    
    return {
      id: notionPage.id,
      title: this.extractTitle(notionPage.properties),
      properties: {
        week: properties.week,
        phase: properties.phase,
        status: properties.status,
        priority: properties.priority,
        assignee: properties.assignee,
        category: properties.category,
        description: properties.description,
        successCriteria: properties.successCriteria,
        dependencies: properties.dependencies,
        risks: properties.risks,
        dueDate: properties.dueDate,
      },
      createdTime: new Date(notionPage.created_time).getTime(),
      lastModified: lastModified,
      url: notionPage.url,
    };
  }

  private extractTitle(properties: any): string {
    const titleProp = Object.values(properties).find((prop: any) => prop.type === "title") as any;
    return titleProp?.title?.[0]?.plain_text || "Untitled";
  }

  private transformProperties(properties: any): Record<string, any> {
    const transformed: Record<string, any> = {};

    for (const [key, value] of Object.entries(properties)) {
      const camelKey = this.camelCase(key);
      const extractedValue = this.extractPropertyValue(value);
      
      // Debug logging for property extraction
      if (key.toLowerCase().includes('assign')) {
        console.log(`🔍 Extracting property "${key}" (${(value as any).type}):`, extractedValue);
      }
      
      transformed[camelKey] = extractedValue;
    }

    return transformed;
  }

  private extractPropertyValue(property: any): any {
    switch (property.type) {
      case 'title':
        return property.title?.[0]?.plain_text || '';
      case 'rich_text':
        return property.rich_text?.map((rt: any) => rt.plain_text).join('') || '';
      case 'number':
        return property.number;
      case 'select':
        return property.select?.name || null;
      case 'multi_select':
        return property.multi_select?.map((item: any) => item.name) || [];
      case 'date':
        return property.date?.start || null;
      case 'checkbox':
        return property.checkbox;
      case 'people':
        // Handle people/assignee fields - extract names
        return property.people?.map((person: any) => person.name || person.id).join(', ') || null;
      case 'email':
        return property.email;
      case 'phone_number':
        return property.phone_number;
      case 'url':
        return property.url;
      case 'relation':
        // Handle relation fields - extract IDs or titles
        return property.relation?.map((rel: any) => rel.id) || [];
      case 'formula':
        // Handle formula fields based on their result type
        return this.extractFormulaValue(property.formula);
      case 'rollup':
        // Handle rollup fields based on their result type
        return this.extractRollupValue(property.rollup);
      default:
        console.warn(`Unhandled Notion property type: ${property.type}`, property);
        return null;
    }
  }

  private extractFormulaValue(formula: any): any {
    if (!formula) return null;
    switch (formula.type) {
      case 'string':
        return formula.string;
      case 'number':
        return formula.number;
      case 'boolean':
        return formula.boolean;
      case 'date':
        return formula.date?.start || null;
      default:
        return null;
    }
  }

  private extractRollupValue(rollup: any): any {
    if (!rollup) return null;
    switch (rollup.type) {
      case 'array':
        return rollup.array?.map((item: any) => this.extractPropertyValue(item)) || [];
      case 'number':
        return rollup.number;
      case 'date':
        return rollup.date?.start || null;
      default:
        return null;
    }
  }

  private camelCase(str: string): string {
    return str
      .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) =>
        index === 0 ? word.toLowerCase() : word.toUpperCase()
      )
      .replace(/\s+/g, '')
      .replace(/[^a-zA-Z0-9]/g, '');
  }
}