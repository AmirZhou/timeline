# Project Timeline - Codebase Overview

This file provides a comprehensive overview of the codebase structure, React components, and Convex backend functions. Designed to give agents quick insight into the architecture, function signatures, and component purposes.

## Project Architecture

**Technology Stack:**
- **Frontend**: React 19 + TypeScript + Vite + Tailwind CSS
- **Backend**: Convex (serverless functions only - no database)
- **Data Source**: Direct Notion API integration for project timeline data

**Core Flow:**
1. React app renders ProjectTimeline component with nested providers
2. Data flows DIRECTLY: Notion API → Convex Action → React State (no database caching)
3. UI displays project phases in vertical timeline with task nodes
4. Real-time data fetching - every refresh gets fresh data from Notion

**⚡ Key Architecture Change (August 2024):**
- **ELIMINATED database caching layer** - No more stale data issues
- **Direct API calls** - Fresh data from Notion on every refresh
- **No schema validation** - Simplified data handling
- **Faster iteration** - No database migrations or schema updates needed

---

## Notion Database Structure

**Database Name**: "Access Alberta Legal - 4 Month Development Timeline"  
**Database ID**: `2584f2e11dba819eb0f5fc54bff7b13f`  
**Icon**: 🏅  

### Property Schema

#### **Task Name** (`title`)
- **Type**: `title`
- **Description**: Primary task identifier and description
- **Required**: Yes (title field)

#### **Status** (`Z[au`)
- **Type**: `select`
- **Options**:
  - `Not Started` (gray)
  - `In Progress` (yellow) 
  - `In Review` (orange)
  - `Completed` (green)
  - `Blocked` (red)

#### **Priority** (`WpFO`)
- **Type**: `select`
- **Options**:
  - `Critical` (red)
  - `High` (orange)
  - `Medium` (yellow)
  - `Low` (gray)

#### **Phase** (`ZyVe`)
- **Type**: `select`
- **Options**:
  - `Phase 1: Foundation & Legal Framework` (blue)
  - `Phase 2: Core Development & Demo Preparation` (green)
  - `Phase 3: Advanced Features & User Testing` (orange)
  - `Phase 4: Polish & Market Package` (purple)

#### **Assignee** (`t[K\`)
- **Type**: `select`
- **Options**:
  - `Developer 1` (blue)
  - `Developer 2` (green)
  - `Both Developers` (orange)
  - `External` (gray)

#### **Category** (`}WSF`)
- **Type**: `multi_select`
- **Options**:
  - `Technical Development` (blue)
  - `Legal Compliance` (red)
  - `Business Development` (green)
  - `Personal Skills` (purple)
  - `Acquisition Prep` (pink)
  - `Demo/Testing` (orange)

#### **Week** (`FsRO`)
- **Type**: `number`
- **Format**: `number`
- **Description**: Target week number for task completion

#### **Due Date** (`oY^i`)
- **Type**: `date`
- **Description**: Specific deadline for task completion

#### **Description** (`=HYC`)
- **Type**: `rich_text`
- **Description**: Detailed task description and requirements

#### **Success Criteria** (`=GGp`)
- **Type**: `rich_text`
- **Description**: Definition of done and success metrics

#### **Dependencies** (`kDm\`)
- **Type**: `rich_text`
- **Description**: Prerequisites and blocking tasks

#### **Risks** (`V>|B`)
- **Type**: `rich_text`
- **Description**: Potential issues and mitigation strategies

### Sample Record Structure
```json
{
  "id": "2584f2e1-1dba-81d9-bbeb-d0c801e86f1f",
  "created_time": "2025-08-23T20:22:00.000Z",
  "last_edited_time": "2025-08-24T19:28:00.000Z",
  "properties": {
    "Task Name": {
      "type": "title",
      "title": [{"plain_text": "Setup: Project Foundation & Legal Research"}]
    },
    "Status": {
      "type": "select", 
      "select": {"name": "In Progress", "color": "yellow"}
    },
    "Priority": {
      "type": "select",
      "select": {"name": "Medium", "color": "yellow"}
    },
    "Phase": {
      "type": "select", 
      "select": {"name": "Phase 1: Foundation & Legal Framework", "color": "blue"}
    },
    "Assignee": {
      "type": "select",
      "select": {"name": "Developer 1", "color": "blue"}
    },
    "Category": {
      "type": "multi_select",
      "multi_select": [
        {"name": "Legal Compliance", "color": "red"},
        {"name": "Business Development", "color": "green"}
      ]
    },
    "Week": {"type": "number", "number": 1},
    "Due Date": {"type": "date", "date": {"start": "2025-09-08"}},
    "Description": {
      "type": "rich_text",
      "rich_text": [{"plain_text": "LIGHT WEEK - Classes starting..."}]
    }
  }
}
```

---

## React Components

### Main Application Components

#### **App.tsx** - `App(): JSX.Element`
Main application entry point that renders ProjectTimeline within a full-screen black background container.

#### **main.tsx** - Bootstrap
Application bootstrap with ConvexProvider wrapping the main App component. Configures Convex client connection.

#### **ProjectTimeline.tsx** - `ProjectTimeline(): React.FC`, `TimelineContent(): React.FC`
Main orchestrator component providing ThemeProvider → TimelineStateProvider → TimelineContent hierarchy.
TimelineContent renders HeaderTitle, HeaderSubtitle, SyncStatusBar, and VerticalTimelineLayout.


### Provider Components

#### **ThemeProvider.tsx** - `ThemeProvider(props: ThemeProviderProps): React.FC`, `useTheme(): ThemeColors`
Provides dark theme color context with predefined color scheme (background, text, accent, success, warning, error, border).
Key props: children (React.ReactNode).

#### **TimelineStateProvider.tsx** - `TimelineStateProvider(props: TimelineStateProviderProps): React.FC`, `useTimelineState(): TimelineStateContextType`
Central state management for timeline navigation, completion tracking, and Notion data.
Key props: children (ReactNode).

#### **PhaseDataProvider.tsx** - `PhaseDataProvider(props: PhaseDataProviderProps): React.FC`, `usePhaseData(): Phase[]`
Provides static phase data with hardcoded 5-phase workflow (Foundation & Legal Framework, Verification & Compliance, Implementation & Setup, Deployment & Distribution, Finalization & Launch).
Key props: children (React.ReactNode).

### Layout Components

#### **TimelineContainer.tsx** - `TimelineContainer(props: TimelineContainerProps): React.JSX.Element`
Main container wrapper applying theme colors, padding, border radius, and responsive centering.
Key props: children (React.ReactNode).

#### **VerticalTimelineLayout.tsx** - `VerticalTimelineLayout(): React.FC`
Main timeline layout component rendering vertical timeline with phases organized into columns.
Displays project phases in two-column layout with mobile-responsive single column view.

#### **PhaseRow.tsx** - `PhaseRow(props: PhaseRowProps): React.FC`
Layout wrapper for phase display with flex layout and center alignment.
Key props: children (React.ReactNode).

#### **VerticalTaskList.tsx** - `VerticalTaskList(props: VerticalTaskListProps): React.JSX.Element`
Simple vertical flexbox container for linear task arrangement with consistent spacing.
Key props: children (React.ReactNode).

### Display Components

#### **HeaderTitle.tsx** - `HeaderTitle(): React.JSX.Element`
Main title component displaying "PROJECT TIMELINE" with bold styling and theme colors.

#### **HeaderSubtitle.tsx** - `HeaderSubtitle(): React.JSX.Element`
Subtitle component showing "ACCESS ALBERTA LEGAL SERVICES" with accent color and letter spacing.

#### **PhaseLabel.tsx** - `PhaseLabel(props: PhaseLabelProps): React.JSX.Element`
Dynamic phase name labels with state-based styling for active/complete status.
Key props: text (string), isActive (boolean, optional), isComplete (boolean, optional).

#### **TaskText.tsx** - `TaskText(props: TaskTextProps): React.JSX.Element`
Substep content text with conditional styling and strikethrough for completed items.
Key props: content (string), isActive (boolean, optional), isComplete (boolean, optional).

#### **TaskCard.tsx** - `TaskCard(props: TaskCardProps): React.JSX.Element`
Compact clickable task display showing task number, title, status, and priority.
Key props: task (NotionTask), taskNumber (string), onClick (function, optional).

#### **TaskModal.tsx** - `TaskModal(props: TaskModalProps): React.JSX.Element | null`
Full-screen modal for detailed task information with sections for status, description, priority, timeline, and references.
Key props: task (NotionTask | null), isOpen (boolean), onClose (() => void), taskNumber (string, optional).

#### **TimelineNode.tsx** - `TimelineNode(props: TimelineNodeProps): React.JSX.Element`
Timeline node component displaying individual task with dot, number, title, and status.
Key props: task (NotionTask), taskNumber (string), phaseTitle (string), isPhaseStart (boolean), onClick (function, optional).

#### **InteractiveIndicator.tsx** - `InteractiveIndicator(): React.JSX.Element`
Badge component displaying "INTERACTIVE" with glowing border effect using theme accent color.

#### **VersionIndicator.tsx** - `VersionIndicator(): React.JSX.Element`
Simple version text display showing "4.0 Final Update from" with secondary text styling.

### Interactive Components

#### **ActionButton.tsx** - `ActionButton(props: ActionButtonProps): React.JSX.Element`
Customizable button with primary/secondary variants, disabled states, and glow effects.
Key props: text (string), onClick (() => void), variant ('primary' | 'secondary', optional), disabled (boolean, optional).

#### **PhaseClickHandler.tsx** - `PhaseClickHandler(props: PhaseClickHandlerProps): React.JSX.Element`
Wrapper component making children clickable for phase selection via setCurrentPhase.
Key props: phaseId (string), children (React.ReactNode).

#### **TaskClickHandler.tsx** - `TaskClickHandler(props: TaskClickHandlerProps): React.JSX.Element`
Interactive wrapper handling task selection and completion with hover effects and transitions.
Key props: taskId (string), children (React.ReactNode).

### Animation Components

#### **GlowEffect.tsx** - `GlowEffect(props: GlowEffectProps): React.JSX.Element`
Wrapper applying customizable glowing drop-shadow effects with intensity control and smooth transitions.
Key props: children (React.ReactNode), color (string), intensity (number, optional), isActive (boolean, optional).

#### **PulseAnimation.tsx** - `PulseAnimation(props: PulseAnimationProps): React.JSX.Element`
Wrapper applying pulsing opacity animation cycling between 100% and 70% opacity every 2 seconds.
Key props: children (React.ReactNode), isActive (boolean, optional).

### Status Components

#### **TaskStatus.tsx** - `TaskStatus(props: TaskStatusProps): React.JSX.Element`
Status indicator showing checkmarks, warnings, errors, or circles based on task state with theme colors.
Key props: complete (boolean), hasWarning (boolean, optional), hasError (boolean, optional).

#### **SyncStatusBar.tsx** - `SyncStatusBar(): React.JSX.Element | null`
Status bar displaying sync information, last sync time, record count, and manual refresh button with SVG icon.

#### **FailSafeIndicator.tsx** - `FailSafeIndicator(): React.JSX.Element`
Warning indicator displaying "FAIL-SAFE ACTIVE" with warning icon and semi-transparent styling.

#### **NotionPropagationWarning.tsx** - `NotionPropagationWarning(props: NotionPropagationWarningProps): React.JSX.Element | null`
Warning component for Notion data propagation delays with dismissible yellow alert styling.
Key props: isVisible (boolean), onDismiss (() => void, optional).

### Visual Components

#### **PhaseIcon.tsx** - `PhaseIcon(props: PhaseIconProps): React.JSX.Element`
Icon component displaying emoji symbols (▶, ✓, 🔓, ⬇, ⚙) with dynamic color changes based on state.
Key props: type ('play' | 'verify' | 'unlock' | 'download' | 'install'), isActive (boolean, optional), isComplete (boolean, optional).

#### **PhaseNode.tsx** - `PhaseNode(props: PhaseNodeProps): React.JSX.Element`
Circular node wrapper for PhaseIcon with dynamic borders, glow effects, shadows, and smooth transitions.
Key props: iconType ('play' | 'verify' | 'unlock' | 'download' | 'install'), isActive (boolean, optional), isComplete (boolean, optional), children (React.ReactNode, optional).

#### **ConnectionArrow.tsx** - `ConnectionArrow(props: ConnectionArrowProps): React.JSX.Element`
SVG arrow component connecting phases with active state color changes and glow effects.
Key props: isActive (boolean, optional).

#### **ProgressBar.tsx** - `ProgressBar(props: ProgressBarProps): React.JSX.Element`
Visual progress indicator with filled bar, smooth width transitions, and subtle glow effects.
Key props: percentage (number).

#### **TaskNumber.tsx** - `TaskNumber(props: TaskNumberProps): React.JSX.Element`
Number display for task identification with state-based styling and consistent spacing.
Key props: value (string), isActive (boolean, optional), isComplete (boolean, optional).

### Utility Functions

#### **utils.ts** - `cn(...inputs: ClassValue[]): string`
Utility function combining clsx and tailwind-merge for conditional className merging.
Enables clean conditional CSS class application throughout components.

---

## Convex Backend Functions

**🚨 IMPORTANT: No Database Schema Required**
- **No `schema.ts`** - Direct API approach bypasses database entirely
- **No database tables** - No caching, no sync metadata, no stored records
- **No validation schemas** - Raw Notion data is transformed in-flight

### Direct Notion API (`directNotionApi.ts`)

#### **getProjectTimelineDirect** - `action({ phase?: string, status?: string, priority?: string, limit?: number }): Promise<any[]>`
**Core function** - Fetches fresh data directly from Notion API and returns transformed results.
- Makes HTTP POST to `https://api.notion.com/v1/databases/{databaseId}/query`
- Transforms raw Notion properties to match UI expectations
- Applies filters (phase, status, priority) client-side
- Sorts by week and applies limit
- Returns data structure compatible with existing UI components

**Property Extraction Functions:**
- `extractTitle(properties)` - Gets task name from Notion title property
- `extractPhase(properties)` - Gets phase from 'Phase' property (fallback logic included)
- `extractStatus(properties)` - Gets status from multiple possible keys
- `extractPriority(properties)` - Gets priority level
- `extractAssignee(properties)` - Gets assigned person
- `extractWeek(properties)` - Gets target week number
- `extractCategory(properties)` - Gets category multi-select array
- `extractDescription(properties)` - Gets rich text description
- `extractSuccessCriteria(properties)` - Gets success criteria
- `extractDependencies(properties)` - Gets dependencies
- `extractRisks(properties)` - Gets risk information
- `extractDueDate(properties)` - Gets due date

### HTTP Routing (`http.ts`, `router.ts`)

#### **http.ts** - Basic HTTP router setup (currently empty)
#### **router.ts** - User-defined routes (currently empty)

---

## Integration Overview

**🔄 Direct API Data Flow (No Database):**
1. User clicks refresh → TimelineStateProvider.triggerSync()
2. React calls → api.directNotionApi.getProjectTimelineDirect()
3. Convex action makes → Direct HTTP POST to Notion API
4. Raw Notion response → Transform properties in-flight
5. Transformed data → React state (setAllTasks)
6. React state → UI renders immediately

**🎯 Key Benefits:**
- **Zero stale data** - Every refresh gets live Notion data
- **No schema maintenance** - No database migrations or validation updates
- **Faster development** - Change data structure without backend changes
- **Real-time accuracy** - See Notion changes instantly

**State Management:**
- **TimelineStateProvider** - Uses React `useState` instead of Convex queries
- **Direct API calls** - `useAction(api.directNotionApi.getProjectTimelineDirect)` 
- **Local state** - All data stored in React state, not database
- **ThemeProvider** - Provides consistent dark theme across components
- **PhaseDataProvider** - Supplies static workflow phase definitions


## Summary

**📊 Component Inventory:**
- **React Components**: 25 total (no authentication components)
  - Main App Components: 3 (App, main.tsx, ProjectTimeline)
  - Provider Components: 3 (ThemeProvider, TimelineStateProvider, PhaseDataProvider)
  - Layout Components: 4 (TimelineContainer, VerticalTimelineLayout, PhaseRow, VerticalTaskList)
  - Display Components: 9 (HeaderTitle, HeaderSubtitle, PhaseLabel, TaskText, TaskCard, TaskModal, TimelineNode, InteractiveIndicator, VersionIndicator)
  - Interactive Components: 3 (ActionButton, PhaseClickHandler, TaskClickHandler)
  - Animation Components: 2 (GlowEffect, PulseAnimation)
  - Status Components: 3 (TaskStatus, SyncStatusBar, FailSafeIndicator)
  - Visual Components: 5 (PhaseIcon, PhaseNode, ConnectionArrow, ProgressBar, TaskNumber)
  - Utility: 1 (utils.ts)

**⚡ Convex Functions**: **1 CORE FUNCTION** (simplified architecture)
  - **Direct API**: 1 function (`getProjectTimelineDirect`) - Fetches live data from Notion
  - **HTTP Routing**: 2 standard files (http.ts, router.ts) - Currently empty

**🏗️ Removed Components** (August 2024 simplification):
- ❌ Database schema (`schema.ts`) - No longer needed
- ❌ Sync functions (`timeline.ts`, `notion/sync.ts`) - Replaced by direct API
- ❌ NotionClient class (`lib/notionClient.ts`) - Simplified to inline functions
- ❌ Test components (`testing/` folder) - No longer needed
- ❌ Raw API test UI - Removed from main app

**🎯 Architecture Benefits:**
- **90% reduction** in Convex code complexity (1 function vs 11 functions)
- **Zero database maintenance** - No schema, migrations, or sync state
- **Real-time data** - Every refresh gets fresh Notion data
- **Faster development** - Change data structure without backend updates

This overview provides agents with comprehensive understanding of the streamlined direct API architecture.

---

## Development Commands

**Type Checking & Linting:**
```bash
npm run lint
```
This command runs the complete validation pipeline:
1. `tsc -p convex -noEmit` - Type-check Convex backend functions (only 1 function now!)
2. `tsc -p . -noEmit` - Type-check React frontend application  
3. `convex dev --once` - Generate types (no schema validation needed)
4. `vite build` - Test production build

**Development Server:**
```bash
npm run dev
```
Starts both frontend (Vite) and backend (Convex) in parallel.

**🔑 Environment Setup:**
- Ensure `NOTION_API_KEY` is set in `.env.local`
- No database setup required - direct API calls only

**Note:** Use `npm run lint` instead of running individual TypeScript checks as it provides comprehensive validation in a single command.
