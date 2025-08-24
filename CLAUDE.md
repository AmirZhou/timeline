# Project Timeline - Codebase Overview

This file provides a comprehensive overview of the codebase structure, React components, and Convex backend functions. Designed to give agents quick insight into the architecture, function signatures, and component purposes.

## Project Architecture

**Technology Stack:**
- **Frontend**: React 19 + TypeScript + Vite + Tailwind CSS
- **Backend**: Convex (serverless functions + real-time database)
- **Data Source**: Notion API integration for project timeline data

**Core Flow:**
1. React app renders ProjectTimeline component with nested providers
2. Data flows from Notion → Convex (via sync actions) → React (via queries)
3. UI displays project phases in vertical timeline with task nodes
4. Real-time sync status and manual refresh capabilities

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

### Database Schema (`schema.ts`)

#### **Tables:**
- **notion_sync_meta**: Tracks sync status, timestamps, record counts, and error messages per database
- **notion_records**: Stores transformed Notion data with properties, metadata, and indexing

### Timeline API Functions (`timeline.ts`)

#### **triggerNotionSync** - `action({ forceFullSync?: boolean }): Promise<{ success: boolean; synced: number }>`
Manual sync trigger action that fetches data from Notion API and updates local records.
Handles error states, updates sync metadata, and returns sync results.

#### **getProjectTimeline** - `query({ phase?: string, status?: string, priority?: string, limit?: number }): Promise<any[]>`
Frontend query for retrieving filtered project timeline data from cached Notion records.
Supports filtering by phase, status, priority with optional result limiting.

#### **getSyncStatus** - `query({}): Promise<any>`
Returns current synchronization status including last sync time, record count, and error states.


### Notion Sync Functions (`notion/sync.ts`)

#### **syncNotionDatabase** - `action({ databaseId: string, forceFullSync?: boolean }): Promise<{ success: boolean; synced: number }>`
Core sync action fetching changes from Notion, transforming data, and batch upserting to Convex.
Manages sync metadata updates and comprehensive error handling with status tracking.

#### **batchUpsertRecords** - `internalMutation({ databaseId: string, records: NotionRecord[] }): Promise<void>`
Internal mutation for batch inserting/updating Notion records with duplicate detection.
Compares lastModified timestamps to avoid unnecessary updates.

#### **updateSyncMeta** - `internalMutation({ databaseId: string, status: 'success' | 'error' | 'running', errorMessage?: string, recordCount: number, lastSyncTime: number }): Promise<void>`
Internal mutation updating sync metadata table with current sync status and statistics.

#### **getLastSyncMeta** - `internalQuery({ databaseId: string }): Promise<SyncMeta | null>`
Internal query retrieving last sync metadata for incremental sync operations.

#### **getRecords** - `query({ databaseId: string, filters?: FilterOptions, sortBy?: string, sortDirection?: 'asc' | 'desc', limit?: number }): Promise<NotionRecord[]>`
Public query for frontend data retrieval with comprehensive filtering, sorting, and pagination.
Supports filtering by status, phase, priority, week with multiple sort options.

#### **getSyncStatus** - `query({ databaseId: string }): Promise<SyncStatusResponse>`
Public query returning sync status information for frontend display including error messages.

### Notion Client (`lib/notionClient.ts`)

#### **NotionSyncClient** - Class for Notion API integration
- **constructor(apiKey: string)**: Initializes Notion client with API key
- **fetchDatabaseChanges(databaseId: string, lastSync?: number): Promise<NotionRecord[]>**: Fetches database changes since last sync with filtering
- **transformNotionPage(notionPage: any): NotionRecord**: Transforms raw Notion data to standardized format
- **extractTitle(properties: any): string**: Extracts page title from Notion properties
- **transformProperties(properties: any): Record<string, any>**: Converts Notion properties to camelCase with type handling
- **extractPropertyValue(property: any): any**: Handles different Notion property types (title, rich_text, number, select, etc.)
- **camelCase(str: string): string**: Utility for converting strings to camelCase format

### HTTP Routing (`http.ts`, `router.ts`)

#### **http.ts** - Basic HTTP router setup (currently empty)
#### **router.ts** - User-defined routes (currently empty)

---

## Integration Overview

**Data Flow:**
1. Notion Database → NotionSyncClient.fetchDatabaseChanges()
2. Raw data → transformNotionPage() → NotionRecord format
3. NotionRecord[] → batchUpsertRecords() → Convex database
4. Frontend queries getProjectTimeline() → React components
5. UI updates trigger manual sync via triggerNotionSync()

**State Management:**
- TimelineStateProvider centralizes navigation, completion tracking, and Notion data
- ThemeProvider provides consistent dark theme across components
- PhaseDataProvider supplies static workflow phase definitions


## Summary

**Component Inventory:**
- **React Components**: 26 total (no authentication components)
  - Main App Components: 3 (App, main.tsx, ProjectTimeline)
  - Provider Components: 3 (ThemeProvider, TimelineStateProvider, PhaseDataProvider)
  - Layout Components: 4 (TimelineContainer, VerticalTimelineLayout, PhaseRow, VerticalTaskList)
  - Display Components: 9 (HeaderTitle, HeaderSubtitle, PhaseLabel, TaskText, TaskCard, TaskModal, TimelineNode, InteractiveIndicator, VersionIndicator)
  - Interactive Components: 3 (ActionButton, PhaseClickHandler, TaskClickHandler)
  - Animation Components: 2 (GlowEffect, PulseAnimation)
  - Status Components: 3 (TaskStatus, SyncStatusBar, FailSafeIndicator)
  - Visual Components: 5 (PhaseIcon, PhaseNode, ConnectionArrow, ProgressBar, TaskNumber)
  - Utility: 1 (utils.ts)

- **Convex Functions**: 11 total (no authentication functions)
  - Timeline API Functions: 3 (triggerNotionSync, getProjectTimeline, getSyncStatus)
  - Notion Sync Functions: 6 (syncNotionDatabase, batchUpsertRecords, updateSyncMeta, getLastSyncMeta, getRecords, getSyncStatus)
  - Notion Client Class: 1 with 7 methods
  - HTTP Routing: 1 (basic setup, currently empty)

This overview provides agents with comprehensive understanding of component relationships, data flows, and function signatures for effective codebase navigation and modification.

---

## Development Commands

**Type Checking & Linting:**
```bash
npm run lint
```
This command runs the complete validation pipeline:
1. `tsc -p convex -noEmit` - Type-check Convex backend functions
2. `tsc -p . -noEmit` - Type-check React frontend application  
3. `convex dev --once` - Validate Convex schema and generate types
4. `vite build` - Test production build

**Note:** Use `npm run lint` instead of running individual TypeScript checks (`npx tsc -p convex -noEmit` or `npx tsc -p . -noEmit`) as it provides comprehensive validation in a single command.
