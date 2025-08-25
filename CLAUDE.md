# Project Timeline - Technical Reference

NPM package for transforming Notion databases into interactive timeline components for React applications.

## Architecture

**Stack:** React 19 + TypeScript + Tailwind CSS + Convex + Notion API

**Data Flow:**
1. Notion API → Convex Action (dynamic property mapping)
2. Convex → React State (no database caching)
3. React → Interactive Timeline UI

**Key Features:**
- Direct API integration (real-time data)
- Dynamic property discovery (works with any Notion database)
- 24-hour property mapping cache
- Zero database requirements

## Component API

### Main Component
```typescript
ProjectTimeline(): React.FC
```

### Providers
```typescript
ThemeProvider(props: { children: ReactNode }): React.FC
TimelineStateProvider(props: { children: ReactNode }): React.FC
PhaseDataProvider(props: { children: ReactNode }): React.FC

// Hooks
useTheme(): ThemeColors
useTimelineState(): TimelineStateContextType
usePhaseData(): Phase[]
```

### Core Components
```typescript
// Layout
TimelineContainer(props: { children: ReactNode }): JSX.Element
VerticalTimelineLayout(): React.FC
PhaseRow(props: { children: ReactNode }): React.FC
VerticalTaskList(props: { children: ReactNode }): JSX.Element

// Display
TaskCard(props: { task: NotionTask; taskNumber: string; onClick?: () => void }): JSX.Element
TaskModal(props: { task: NotionTask | null; isOpen: boolean; onClose: () => void; taskNumber?: string }): JSX.Element | null
TimelineNode(props: { task: NotionTask; taskNumber: string; phaseTitle: string; isPhaseStart: boolean; onClick?: () => void }): JSX.Element

// Interactive
ActionButton(props: { text: string; onClick: () => void; variant?: 'primary' | 'secondary'; disabled?: boolean }): JSX.Element
PhaseClickHandler(props: { phaseId: string; children: ReactNode }): JSX.Element
TaskClickHandler(props: { taskId: string; children: ReactNode }): JSX.Element

// Status
TaskStatus(props: { complete: boolean; hasWarning?: boolean; hasError?: boolean }): JSX.Element
SyncStatusBar(): JSX.Element | null

// Visual
PhaseIcon(props: { type: IconType; isActive?: boolean; isComplete?: boolean }): JSX.Element
ProgressBar(props: { percentage: number }): JSX.Element

// Effects
GlowEffect(props: { children: ReactNode; color: string; intensity?: number; isActive?: boolean }): JSX.Element
PulseAnimation(props: { children: ReactNode; isActive?: boolean }): JSX.Element
```

## Convex Backend

### Primary Action
```typescript
getProjectTimelineDirect(args: {
  phase?: string;
  status?: string;
  priority?: string;
  limit?: number;
}): Promise<NotionTask[]>
```

### Property Mapping System
```typescript
getPropertyMapping(databaseId: string, notionApiKey: string): Promise<PropertyMapping>

// Extractors
extractTitleProperty(properties: any, mapping: PropertyMapping, propertyName: string): string
extractNumberProperty(properties: any, mapping: PropertyMapping, propertyName: string): number | undefined
extractSelectProperty(properties: any, mapping: PropertyMapping, propertyName: string): string | undefined
extractMultiSelectProperty(properties: any, mapping: PropertyMapping, propertyName: string): string[]
extractRichTextProperty(properties: any, mapping: PropertyMapping, propertyName: string): string | undefined
extractDateProperty(properties: any, mapping: PropertyMapping, propertyName: string): string | undefined
```

## Notion Database Schema

### Required Properties
- **Task Name** (title): Primary task identifier
- **Status** (select): Not Started | In Progress | In Review | Completed | Blocked
- **Priority** (select): Critical | High | Medium | Low
- **Phase** (select): Phase grouping for timeline organization
- **Phase Number** (number): Numeric phase order (1-n)

### Optional Properties
- **Week** (number): Timeline position
- **Due Date** (date): Task deadline
- **Assignee** (select): Task owner
- **Category** (multi_select): Task categorization
- **Description** (rich_text): Detailed information
- **Success Criteria** (rich_text): Completion requirements
- **Dependencies** (rich_text): Prerequisites
- **Risks** (rich_text): Potential issues
- **Reference** (rich_text): External links, resources, and documentation

## Type Definitions

```typescript
interface NotionTask {
  id: string;
  title: string;
  status?: string;
  priority?: string;
  phase?: string;
  phaseNumber?: number;
  week?: number;
  dueDate?: string;
  assignee?: string;
  category?: string[];
  description?: string;
  successCriteria?: string;
  dependencies?: string;
  risks?: string;
  reference?: string;
  createdTime: string;
  lastEditedTime: string;
}

interface ThemeColors {
  background: string;
  text: string;
  accent: string;
  success: string;
  warning: string;
  error: string;
  border: string;
}
```

## Commands

```bash
npm run dev        # Development server
npm run build      # Production build
npm run lint       # Type checking & validation
npm test          # Run tests
```

## Environment Setup

```bash
# .env.local
NOTION_API_KEY=your_notion_api_key
CONVEX_URL=your_convex_deployment_url
```

## NPM Package

Published as: `@bitravage/timeline`

Installation:
```bash
npm install @bitravage/timeline
```

Usage:
```jsx
import { ProjectTimeline } from '@bitravage/timeline';

function App() {
  return <ProjectTimeline />;
}
```