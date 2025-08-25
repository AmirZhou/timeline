# Instructions for Next Agent: Notion Database Update

## Context Summary
We are building an Alberta Legal Document Management Platform - a 4-month college project for two students focusing on legal tech portfolio development. We've created a comprehensive 24-task timeline and need to update the Notion database.

## Current State
- ✅ 24 detailed tasks created in JSON format: `alberta-legal-timeline-tasks.json`
- ✅ Existing Notion database ID: `2584f2e1-1dba-819e-b0f5-fc54bff7b13f`
- ✅ Current database has all required fields EXCEPT the new Resources field
- ✅ Code updated to handle `reference` field (mapped to new Resources field)

## Database Field Mapping
**Current Notion Database Fields:**
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

**MISSING FIELD TO ADD:**
- **Resources** (rich_text) - For external links, government resources, legal documentation

## Critical Tasks for Next Agent

### 1. Add Resources Field to Database
- Use Notion MCP to add new "Resources" field (rich_text type)
- **IMPORTANT:** Field should be named "Resources" not "Reference" (Reference already exists in code)

### 2. Update JSON File Structure
- Add "Resources" field to all 24 tasks in `alberta-legal-timeline-tasks.json`
- Use placeholder text: "TBD - Manual curation of relevant legal resources and documentation links"

### 3. Database Schema Update Requirements
The Resources field should contain:
- Links to Alberta government legal resources
- PIPA compliance documentation
- Legal acts and regulations
- Technical implementation guides
- Industry best practices

**Example Resources content:**
```
For PIPA Compliance task: 
- Alberta PIPA Act: https://www.qp.alberta.ca/documents/Acts/P06P5.pdf
- OIPC Guidelines: https://www.oipc.ab.ca/
- Privacy Impact Assessment Template: [link]
```

### 4. Code Integration Notes
- `extractResourcesProperty()` function already exists in `convex/directNotionApi.ts`
- `NotionTask.reference` field maps to new Resources database field
- TaskModal component ready to display Resources information

### 5. Import Tasks to Database
- Use Notion MCP to update existing 18 tasks OR create new 24 tasks
- Ensure all field mappings work correctly
- Test that Resources field displays properly

## Important Constraints
- **DO NOT** populate Resources field content yet - leave as TBD placeholders
- **DO NOT** publish NPM package
- Focus on database structure and task import
- Verify all field mappings work with existing timeline component

## Project Focus
This is a legitimate legal tech project focusing on:
- Document management (no legal advice)
- Information sharing platform
- Professional networking tools
- Alberta lawyer directory (public info)
- Legal forms catalog (public domain)

**Avoiding unauthorized practice of law** - no legal advice features.

## Files Modified
- `alberta-legal-timeline-tasks.json` - 24 detailed tasks
- `CLAUDE.md` - Updated schema with Resources field
- `src/types/task.ts` - Added reference field
- `convex/directNotionApi.ts` - Added extractResourcesProperty
- `src/components/display/TaskModal.tsx` - Display Resources

## Success Criteria
- New Resources field added to Notion database
- JSON file updated with Resources placeholders
- All 24 tasks imported successfully
- Timeline component displays new Resources field
- No errors in task loading/display

The user will manually curate Resources field content after database structure is complete.