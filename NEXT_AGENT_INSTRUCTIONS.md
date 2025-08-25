# Next Agent Instructions: Update Notion Database with Reference Field

## Context
The timeline component now supports a new "Reference" field for storing external links, resources, and documentation. The backend extraction logic and UI components have been implemented, but the Notion database needs to be updated with actual data including the new Reference field.

## Current State
- ✅ Reference field extraction added to `/convex/directNotionApi.ts`
- ✅ UI component updated in TaskModal to display Reference section
- ✅ Type definitions updated with `reference?: string`
- ✅ Documentation updated in CLAUDE.md
- 🔄 **Next Step**: Update Notion database records with Reference field data

## Database Information
- **Database ID**: `2584f2e11dba819eb0f5fc54bff7b13f`
- **Database Name**: "Access Alberta Legal - 4 Month Development Timeline"
- **Location**: Available in project as Notion MCP integration

## Task Overview
1. **Fetch current database schema** to get field IDs
2. **Delete existing records** from the database
3. **Add Reference field** to database if it doesn't exist
4. **Import new records** with Reference field data from JSON

## Step-by-Step Instructions

### Step 1: Database Schema Analysis
Use Notion MCP to fetch the current database structure:

```typescript
// Get database schema to understand current field IDs
mcp__notion__API-retrieve-a-database({
  database_id: "2584f2e11dba819eb0f5fc54bff7b13f"
})
```

**Expected Fields (verify these exist):**
- Task Name (title)
- Status (select)
- Priority (select) 
- Phase (select)
- Phase Number (number)
- Week (number)
- Due Date (date)
- Assignee (select)
- Category (multi_select)
- Description (rich_text)
- Success Criteria (rich_text)
- Dependencies (rich_text)
- Risks (rich_text)
- **Reference (rich_text)** ← NEW FIELD TO ADD

### Step 2: Clear Existing Records
Query all records and delete them:

```typescript
// First, get all records
mcp__notion__API-post-database-query({
  database_id: "2584f2e11dba819eb0f5fc54bff7b13f"
})

// Then delete each record
mcp__notion__API-delete-a-block({
  block_id: "record_id_here"
})
```

### Step 3: Add Reference Field (if missing)
If Reference field doesn't exist, add it to database:

```typescript
mcp__notion__API-update-a-database({
  database_id: "2584f2e11dba819eb0f5fc54bff7b13f",
  properties: {
    "Reference": {
      "rich_text": {}
    }
  }
})
```

### Step 4: Import New Records with Reference Data
Use the JSON file `/alberta-legal-timeline-tasks.json` to create new records.

**Important Mapping Notes:**
- The JSON uses human-readable field names
- Notion API requires actual property IDs from the database schema
- Build a mapping object: `fieldName → propertyId`

**Example JSON structure to expect:**
```json
{
  "Task Name": "Setup: Project Foundation & Legal Research",
  "Status": "In Progress",
  "Priority": "Medium",
  "Phase": "Phase 1: Foundation & Legal Framework",
  "Phase Number": 1,
  "Week": 1,
  "Reference": "- API Documentation: https://docs.notion.com\n- Legal Guide: https://legal-guide.com"
}
```

**Create records with proper property IDs:**
```typescript
mcp__notion__API-post-page({
  parent: {
    page_id: "2584f2e11dba819eb0f5fc54bff7b13f"
  },
  properties: {
    [titlePropertyId]: {
      "title": [
        {
          "text": {
            "content": taskData["Task Name"]
          }
        }
      ]
    },
    [referencePropertyId]: {
      "rich_text": [
        {
          "text": {
            "content": taskData["Reference"] || ""
          }
        }
      ]
    }
    // ... map all other fields similarly
  }
})
```

### Step 5: Verification
After import:
1. Query the database to verify all records were created
2. Test the timeline application to ensure data displays correctly
3. Verify Reference field shows in TaskModal when present

## Key Implementation Details

### Field ID Mapping Process
1. Get database schema response
2. Extract `properties` object
3. Build mapping: `properties[fieldName] → propertyId`
4. Use this mapping for all record operations

### Reference Field Format
- **Type**: `rich_text`
- **Content**: Multi-line text with links and resources
- **Example**:
  ```
  - Documentation: https://docs.example.com
  - Tutorial: https://tutorial.com/guide  
  - Stack Overflow: https://stackoverflow.com/questions/123
  ```

### Error Handling
- Handle missing fields gracefully
- Validate JSON data before import
- Provide clear error messages for any failures
- Ensure atomic operations (all succeed or all fail)

## Files to Reference
- **JSON Data**: `/alberta-legal-timeline-tasks.json` - Contains records to import
- **Backend Logic**: `/convex/directNotionApi.ts` - Shows expected field extraction
- **Type Definitions**: `/src/types/task.ts` - Shows NotionTask interface

## Success Criteria
✅ Database schema retrieved and field IDs mapped correctly  
✅ All existing records deleted from database  
✅ Reference field exists in database schema  
✅ All JSON records imported successfully with Reference data  
✅ Timeline application displays Reference field in TaskModal  
✅ No data inconsistencies or missing fields  

## Branch Strategy
- Work on current branch (main) or create: `feature/populate-reference-data`
- Commit changes with clear descriptions
- Test thoroughly before pushing

## Testing Commands
After implementation, test with:
```bash
npm run dev  # Start development server
# Navigate to timeline and click on tasks with Reference data
# Verify Reference section appears in TaskModal
```

This task bridges the gap between the implemented Reference field feature and actual data population in the Notion database.