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
    lastSync?: number,
    options?: { maxRetries?: number; retryDelay?: number }
  ): Promise<NotionRecord[]> {
    const { maxRetries = 2, retryDelay = 5000 } = options || {};
    
    for (let attempt = 1; attempt <= maxRetries + 1; attempt++) {
      const isRetry = attempt > 1;
      const fetchTimestamp = Date.now();
      let requestStartTime = 0; // Initialize timing variable
      
      console.log(`\n🔍 NOTION FETCH DEBUG ${isRetry ? `(Retry ${attempt - 1}/${maxRetries})` : ''} - ${new Date(fetchTimestamp).toISOString()}`);
      console.log(`📊 Database ID: ${databaseId}`);
      console.log(`⏰ Last sync filter: ${lastSync ? new Date(lastSync).toISOString() : 'FULL SYNC (no filter)'}`);  
      
      if (isRetry) {
        console.log(`🔄 Retrying due to potential stale data detection...`);
      }
    
    try {
      // Network timing instrumentation (using Date.now() since performance.now() not available in Convex)
      requestStartTime = Date.now();
      const requestTimestamp = new Date().toISOString();
      
      console.log(`🌐 NETWORK REQUEST START: ${requestTimestamp}`);
      
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

      // Calculate and log network timing
      const requestEndTime = Date.now();
      const responseTimestamp = new Date().toISOString();
      const networkLatency = requestEndTime - requestStartTime;
      
      console.log(`🌐 NETWORK TIMING ANALYSIS:`);
      console.log(`   📡 Request start: ${requestTimestamp}`);
      console.log(`   📥 Response received: ${responseTimestamp}`);
      console.log(`   ⏱️ Total network latency: ${networkLatency.toFixed(2)}ms`);
      console.log(`   📊 Records returned: ${response.results.length}`);
      console.log(`   📈 Latency per record: ${response.results.length > 0 ? (networkLatency / response.results.length).toFixed(2) : 'N/A'}ms`);
      
      // Categorize latency performance
      let performanceCategory = '';
      if (networkLatency < 500) performanceCategory = '🟢 EXCELLENT';
      else if (networkLatency < 1000) performanceCategory = '🟡 GOOD';
      else if (networkLatency < 2000) performanceCategory = '🟠 MODERATE';
      else performanceCategory = '🔴 SLOW';
      
      console.log(`   🎯 Performance rating: ${performanceCategory}`);

        console.log(`📦 Notion returned ${response.results.length} records`);
        
        let suspiciousRecords = 0;
        let recentlyEditedRecords = 0;
        
        // Log detailed info for each record to detect stale data
        const transformedRecords = response.results.map((page: any, index: number) => {
          const lastEditedTime = new Date(page.last_edited_time).getTime();
          const timeSinceEdit = fetchTimestamp - lastEditedTime;
          const assigneeValue = page.properties['t[K\\\\']?.select?.name || null;
          
          console.log(`\n  Record ${index + 1}/${response.results.length}:`);
          console.log(`    📝 Title: ${this.extractTitle(page.properties)}`);
          console.log(`    🕐 Last edited: ${new Date(lastEditedTime).toISOString()}`);
          console.log(`    ⏱️ Time since edit: ${Math.round(timeSinceEdit / 1000)}s ago`);
          console.log(`    👤 Assignee value: "${assigneeValue}"`);
          
          // Flag potentially stale data (edited within last 30 seconds)
          if (timeSinceEdit < 30000) {
            recentlyEditedRecords++;
            console.log(`    ⚠️ WARNING: Recently edited (${Math.round(timeSinceEdit / 1000)}s ago) - data might be stale!`);
            
            // Additional heuristic: if edit is very recent but field seems empty/default
            if (timeSinceEdit < 10000 && (!assigneeValue || assigneeValue === 'Developer 1')) {
              suspiciousRecords++;
              console.log(`    🚨 HIGHLY SUSPICIOUS: Very recent edit with default/empty assignee!`);
            }
          }
          
          return this.transformNotionPage(page);
        });
        
        // Decide whether to retry based on suspicious data patterns
        const shouldRetry = (
          attempt <= maxRetries && 
          recentlyEditedRecords > 0 && 
          (suspiciousRecords > 0 || recentlyEditedRecords >= response.results.length * 0.3)
        );
        
        if (shouldRetry) {
          console.log(`\n🔄 STALE DATA DETECTED: ${suspiciousRecords} suspicious records, ${recentlyEditedRecords} recently edited`);
          console.log(`⏳ Waiting ${retryDelay / 1000}s before retry...`);
          await new Promise(resolve => setTimeout(resolve, retryDelay));
          continue; // Retry the fetch
        }
        
        console.log(`✅ Fetch completed at ${new Date().toISOString()}`);
        if (isRetry) {
          console.log(`🎉 Retry successful - data appears fresh!`);
        }
        console.log(`📈 Stats: ${recentlyEditedRecords} recently edited, ${suspiciousRecords} suspicious\n`);
        
        return transformedRecords;
      } catch (error) {
        const errorTime = Date.now();
        const timeToError = errorTime - (requestStartTime || fetchTimestamp);
        
        console.error(`❌ NETWORK ERROR (attempt ${attempt}):`, error);
        console.log(`⏱️ Time to error: ${timeToError.toFixed(2)}ms`);
        console.log(`🕐 Error timestamp: ${new Date().toISOString()}`);
        
        // If this is the last attempt, throw the error
        if (attempt === maxRetries + 1) {
          throw new Error(`Notion API error: ${error instanceof Error ? error.message : String(error)}`);
        }
        
        // Otherwise, wait and retry
        console.log(`⏳ Waiting ${retryDelay / 1000}s before retry due to error...`);
        await new Promise(resolve => setTimeout(resolve, retryDelay));
      }
    }
    
    // This should never be reached, but just in case
    throw new Error('Unexpected end of retry loop');
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