# Timeline Component Usage Guide

## Overview
This project provides a reusable timeline component that integrates with Notion databases to display project phases and tasks in a vertical timeline format.

## Configuration

### Environment Variables
Set these environment variables in your Convex environment:

```bash
NOTION_API_KEY=your_notion_api_key_here
NOTION_DATABASE_ID=your_database_id_here
```

### Timeline Configuration
Configure the timeline titles using the `TimelineConfig` interface:

```typescript
import { ProjectTimeline } from './components/ProjectTimeline';
import { TimelineConfig } from './types/config';

const customConfig: TimelineConfig = {
  title: "YOUR PROJECT TIMELINE",
  subtitle: "Your Organization Name"
};

function App() {
  return (
    <div className="min-h-screen bg-black">
      <ProjectTimeline config={customConfig} />
    </div>
  );
}
```

### Default Configuration
If no config is provided, the component uses these defaults:
- Title: "PROJECT TIMELINE"
- Subtitle: "ACCESS ALBERTA LEGAL SERVICES"

## Required Notion Database Schema

Your Notion database should include these properties:

### Required Properties
- **Task Name** (title) - Primary task identifier
- **Status** (select) - Options: Not Started, In Progress, In Review, Completed, Blocked
- **Phase** (select) - Phase groupings for timeline display
- **Phase Number** (number) - Numeric identifier (1-4) for phase ordering

### Optional Properties
- **Priority** (select) - Critical, High, Medium, Low
- **Week** (number) - Target completion week
- **Due Date** (date) - Specific deadline
- **Assignee** (select) - Task assignee
- **Category** (multi_select) - Task categories
- **Description** (rich_text) - Detailed description
- **Success Criteria** (rich_text) - Definition of done
- **Dependencies** (rich_text) - Prerequisites
- **Risks** (rich_text) - Potential issues

## Component Architecture

### Core Components
- `ProjectTimeline` - Main orchestrator with providers
- `TimelineStateProvider` - State management for timeline data
- `ThemeProvider` - Dark theme configuration
- `VerticalTimelineLayout` - Main layout component

### Display Components
- `HeaderTitle` / `HeaderSubtitle` - Configurable title components
- `TaskCard` / `TaskModal` - Task display and details
- `TimelineNode` - Individual task nodes
- `SyncStatusBar` - Data sync status

### Interactive Features
- Click tasks to view detailed modal
- Real-time data sync from Notion
- Phase-based timeline organization
- Status-based visual indicators

## Usage Example

```typescript
import { ProjectTimeline } from './components/ProjectTimeline';
import { TimelineConfig } from './types/config';

const timelineConfig: TimelineConfig = {
  title: "DEVELOPMENT TIMELINE",
  subtitle: "My Software Project"
};

export default function App() {
  return (
    <div className="min-h-screen bg-black">
      <ProjectTimeline config={timelineConfig} />
    </div>
  );
}
```

## Development

### Commands
```bash
npm run dev    # Start development server
npm run lint   # Run type checking and linting
```

### Architecture Benefits
- **No database dependencies** - Direct Notion API integration
- **Dynamic property mapping** - Works with any database structure
- **Real-time data** - Fresh data on every refresh
- **Self-healing** - Multi-layer fallbacks for reliability