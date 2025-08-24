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

  constructor(apiKey: string) {
    this.notion = new Client({
      auth: apiKey,
    });
  }

  // Read-only: Fetch changes from Notion for caching in Convex
  async fetchDatabaseChanges(
    databaseId: string, 
    lastSync?: number
  ): Promise<NotionRecord[]> {
    try {
      const response = await this.notion.databases.query({
        database_id: databaseId,
        filter: lastSync ? {
          timestamp: "last_edited_time",
          last_edited_time: {
            after: new Date(lastSync).toISOString(),
          },
        } : undefined,
        sorts: [
          {
            timestamp: "last_edited_time",
            direction: "descending",
          },
        ],
      });

      console.log(`Fetched ${response.results.length} records from Notion`);
      return response.results.map((page: any) => this.transformNotionPage(page));
    } catch (error) {
      console.error("Error fetching from Notion:", error);
      throw new Error(`Notion API error: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  private transformNotionPage(notionPage: any): NotionRecord {
    const properties = this.transformProperties(notionPage.properties);
    
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
      lastModified: new Date(notionPage.last_edited_time).getTime(),
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
      transformed[camelKey] = this.extractPropertyValue(value);
    }

    return transformed;
  }

  private extractPropertyValue(property: any): any {
    if (!property || !property.type) {
      console.warn("Invalid property structure:", property);
      return null;
    }

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
      case 'url':
        return property.url;
      case 'email':
        return property.email;
      case 'phone_number':
        return property.phone_number;
      case 'people':
      case 'person':
        return property.people?.map((person: any) => ({
          id: person.id,
          name: person.name || person.plain_text || 'Unknown',
          email: person.person?.email || null
        })) || [];
      case 'relation':
        return property.relation?.map((rel: any) => rel.id) || [];
      case 'rollup':
        return this.extractRollupValue(property.rollup);
      case 'formula':
        return this.extractFormulaValue(property.formula);
      case 'status':
        return property.status?.name || null;
      case 'created_time':
      case 'last_edited_time':
        return property[property.type];
      case 'created_by':
      case 'last_edited_by':
        return {
          id: property[property.type]?.id,
          name: property[property.type]?.name || 'Unknown'
        };
      case 'files':
        return property.files?.map((file: any) => ({
          name: file.name,
          url: file.file?.url || file.external?.url
        })) || [];
      default:
        console.warn(`Unhandled property type: ${property.type}`, property);
        return property[property.type] || null;
    }
  }

  private extractRollupValue(rollup: any): any {
    if (!rollup) return null;
    
    switch (rollup.type) {
      case 'number':
        return rollup.number;
      case 'date':
        return rollup.date?.start || null;
      case 'array':
        return rollup.array?.map((item: any) => this.extractPropertyValue({ type: item.type, [item.type]: item[item.type] })) || [];
      default:
        return rollup[rollup.type] || null;
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
        return formula[formula.type] || null;
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