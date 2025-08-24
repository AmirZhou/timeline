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
3. UI displays project phases in horizontal timeline with task cards
4. Real-time sync status and manual refresh capabilities

---

## React Components

### Main Application Components

#### **App.tsx** - `App()`
Main application entry point that renders ProjectTimeline within a full-screen black background container.

#### **main.tsx** - Bootstrap
Application bootstrap with ConvexProvider wrapping the main App component. Configures Convex client connection.

#### **ProjectTimeline.tsx** - `ProjectTimeline()`, `TimelineContent()`
Main orchestrator component providing ThemeProvider → TimelineStateProvider → TimelineContent hierarchy.
TimelineContent renders HeaderTitle, HeaderSubtitle, SyncStatusBar, and HorizontalTimelineLayout.


### Provider Components

#### **ThemeProvider.tsx** - `ThemeProvider(props: { children: React.ReactNode })`, `useTheme()`
Provides dark theme color context with predefined color scheme (background, text, accent, success, warning, error, border).
Exports useTheme hook for consuming theme colors throughout the app.

#### **TimelineStateProvider.tsx** - `TimelineStateProvider(props: { children: ReactNode })`, `useTimelineState()`
Central state management for timeline navigation, completion tracking, and Notion data.
Manages currentPhase, currentTask, completedPhases/Tasks sets, and integrates real-time Convex queries.
Provides triggerSync action and phase grouping logic for 4-column timeline layout.

#### **PhaseDataProvider.tsx** - `PhaseDataProvider(props: { children: React.ReactNode })`, `usePhaseData()`
Provides static phase data with hardcoded 5-phase workflow (Foundation & Legal Framework, Verification & Compliance, Implementation & Setup, Deployment & Distribution, Finalization & Launch).
Each phase contains id, name, icon type, completion status, and array of tasks.

### Layout Components

#### **TimelineContainer.tsx** - `TimelineContainer(props: { children: React.ReactNode })`
Main container wrapper applying theme colors, padding, border radius, and responsive centering.
Sets max width constraints and provides primary visual boundary for the timeline interface.

#### **HorizontalTimelineLayout.tsx** - `HorizontalTimelineLayout()`
Core timeline layout rendering project phases in horizontal 4-column grid.
Manages task cards, modal interactions, phase ordering, loading states, and connection arrows.
Integrates TaskCard and TaskModal for comprehensive task display and interaction.

#### **PhaseRow.tsx** - `PhaseRow(props: { children: React.ReactNode })`
Horizontal flexbox container with center alignment, gap spacing, and responsive wrapping.
Provides consistent spacing and alignment for phase-related elements.

#### **TaskGrid.tsx** - `TaskGrid()`
Grid layout displaying tasks across multiple phases using usePhaseData and useTimelineState.
Creates responsive grid based on phase count with interactive task elements.

#### **VerticalTaskList.tsx** - `VerticalTaskList(props: { children: React.ReactNode })`
Simple vertical flexbox container for linear task arrangement with consistent spacing.

### Display Components

#### **HeaderTitle.tsx** - `HeaderTitle()`
Main title component displaying "PROJECT TIMELINE" with bold 2rem font and theme text color.

#### **HeaderSubtitle.tsx** - `HeaderSubtitle()`
Subtitle component showing "ACCESS ALBERTA LEGAL SERVICES" with accent color and letter spacing.

#### **PhaseLabel.tsx** - `PhaseLabel(props: { text: string; isActive?: boolean; isComplete?: boolean })`
Dynamic phase name labels with state-based styling (color, font weight) based on active/complete status.

#### **TaskText.tsx** - `TaskText(props: { content: string; isActive?: boolean; isComplete?: boolean })`
Substep content text with conditional styling and strikethrough decoration for completed items.

#### **TaskCard.tsx** - `TaskCard(props: { task: NotionTask; taskNumber: string; onClick?: Function })`
Compact clickable task cards showing task number, truncated title, status dot, and priority badge.
Features hover effects and integrates with task modal for detailed view.

#### **TaskModal.tsx** - `TaskModal(props: { task: NotionTask | null; isOpen: boolean; onClose: Function; taskNumber?: string })`
Full-screen modal for detailed task information with sections for status, description, priority, timeline, and references.
Includes keyboard navigation, clipboard functionality, and direct Notion links.

#### **InteractiveIndicator.tsx** - `InteractiveIndicator()`
Badge component displaying "INTERACTIVE" with glowing border effect using theme accent color.

#### **VersionIndicator.tsx** - `VersionIndicator()`
Simple version text display showing "4.0 Final Update from" with secondary text styling.

### Interactive Components

#### **ActionButton.tsx** - `ActionButton(props: { text: string; onClick: Function; variant?: 'primary' | 'secondary'; disabled?: boolean })`
Customizable button with primary/secondary variants, disabled states, glow effects, and smooth transitions.

#### **PhaseClickHandler.tsx** - `PhaseClickHandler(props: { phaseId: string; children: React.ReactNode })`
Wrapper component making children clickable for phase selection via setCurrentPhase.

#### **TaskClickHandler.tsx** - `TaskClickHandler(props: { taskId: string; children: React.ReactNode })`
Interactive wrapper handling task selection and completion with hover effects and transitions.

### Animation Components

#### **GlowEffect.tsx** - `GlowEffect(props: { children: React.ReactNode; color: string; intensity?: number; isActive?: boolean })`
Wrapper applying customizable glowing drop-shadow effects with intensity control and smooth transitions.

#### **PulseAnimation.tsx** - `PulseAnimation(props: { children: React.ReactNode; isActive?: boolean })`
Wrapper applying pulsing opacity animation cycling between 100% and 70% opacity every 2 seconds.

### Status Components

#### **TaskStatus.tsx** - `TaskStatus(props: { complete: boolean; hasWarning?: boolean; hasError?: boolean; isActive?: boolean })`
Status indicator showing checkmarks, warnings, errors, or circles based on task state with theme colors.

#### **SyncStatusBar.tsx** - `SyncStatusBar()`
Status bar displaying sync information, last sync time, record count, and manual refresh button with SVG icon.
Shows colored dots for recent sync indicators and responsive design.

#### **FailSafeIndicator.tsx** - `FailSafeIndicator()`
Warning indicator displaying "FAIL-SAFE ACTIVE" with warning icon and semi-transparent styling.

### Visual Components

#### **PhaseIcon.tsx** - `PhaseIcon(props: { type: 'play' | 'verify' | 'unlock' | 'download' | 'install'; isActive?: boolean; isComplete?: boolean })`
Icon component displaying emoji symbols (▶️, ✓, 🔓, ⬇️, ⚙️) with dynamic color changes based on state.

#### **PhaseNode.tsx** - `PhaseNode(props: { iconType: PhaseIconType; isActive?: boolean; isComplete?: boolean; children?: React.ReactNode })`
Circular node wrapper for StageIcon with dynamic borders, glow effects, shadows, and smooth transitions.

#### **ConnectionArrow.tsx** - `ConnectionArrow(props: { isActive?: boolean })`
SVG arrow component connecting phases with active state color changes and glow effects.

#### **ProgressBar.tsx** - `ProgressBar(props: { percentage: number })`
Visual progress indicator with filled bar, smooth width transitions, and subtle glow effects.

#### **TaskNumber.tsx** - `TaskNumber(props: { value: string; isActive?: boolean; isComplete?: boolean })`
Number display for task identification with state-based styling and consistent spacing.

### Utility Functions

#### **utils.ts** - `cn(...inputs: ClassValue[])`
Utility function combining clsx and tailwind-merge for conditional className merging.
Enables clean conditional CSS class application throughout components.

---

## Convex Backend Functions

### Database Schema (`schema.ts`)

#### **Tables:**
- **notion_sync_meta**: Tracks sync status, timestamps, record counts, and error messages per database
- **notion_records**: Stores transformed Notion data with properties, metadata, and indexing

### Demo Functions (`demo.ts`)

#### **triggerNotionSync** - `action({ databaseId: string, forceFullSync?: boolean })`
Manual sync trigger action that fetches data from Notion API and updates local records.
Handles error states, updates sync metadata, and returns sync results.

#### **getProjectTimeline** - `query({ phase?: string, status?: string, priority?: string, limit?: number })`
Frontend query for retrieving filtered project timeline data from cached Notion records.
Supports filtering by phase, status, priority with optional result limiting.

#### **getSyncStatus** - `query({})`
Returns current synchronization status including last sync time, record count, and error states.


### Notion Sync Functions (`notion/sync.ts`)

#### **syncNotionDatabase** - `action({ databaseId: string, forceFullSync?: boolean })`
Core sync action fetching changes from Notion, transforming data, and batch upserting to Convex.
Manages sync metadata updates and comprehensive error handling with status tracking.

#### **batchUpsertRecords** - `internalMutation({ databaseId: string, records: NotionRecord[] })`
Internal mutation for batch inserting/updating Notion records with duplicate detection.
Compares lastModified timestamps to avoid unnecessary updates.

#### **updateSyncMeta** - `internalMutation({ databaseId, status, errorMessage?, recordCount, lastSyncTime })`
Internal mutation updating sync metadata table with current sync status and statistics.

#### **getLastSyncMeta** - `internalQuery({ databaseId: string })`
Internal query retrieving last sync metadata for incremental sync operations.

#### **getRecords** - `query({ databaseId, filters?, sortBy?, sortDirection?, limit? })`
Public query for frontend data retrieval with comprehensive filtering, sorting, and pagination.
Supports filtering by status, phase, priority, week with multiple sort options.

#### **getSyncStatus** - `query({ databaseId: string })`
Public query returning sync status information for frontend display including error messages.

### Notion Client (`lib/notionClient.ts`)

#### **NotionSyncClient** - Class for Notion API integration
- **constructor(apiKey: string)**: Initializes Notion client with API key
- **fetchDatabaseChanges(databaseId, lastSync?)**: Fetches database changes since last sync with filtering
- **transformNotionPage(notionPage)**: Transforms raw Notion data to standardized format
- **extractTitle(properties)**: Extracts page title from Notion properties
- **transformProperties(properties)**: Converts Notion properties to camelCase with type handling
- **extractPropertyValue(property)**: Handles different Notion property types (title, rich_text, number, select, etc.)
- **camelCase(str)**: Utility for converting strings to camelCase format

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
- **React Components**: 27 total (no authentication components)
  - Main App Components: 3 (App, main.tsx, ProjectTimeline)
  - Provider Components: 3 (Theme, TimelineState, PhaseData)
  - Layout Components: 5 (TimelineContainer, HorizontalTimelineLayout, PhaseRow, TaskGrid, VerticalTaskList)
  - Display Components: 7 (HeaderTitle, HeaderSubtitle, PhaseLabel, TaskText, TaskCard, TaskModal, InteractiveIndicator, VersionIndicator)
  - Interactive Components: 3 (ActionButton, PhaseClickHandler, TaskClickHandler)
  - Animation Components: 2 (GlowEffect, PulseAnimation)
  - Status Components: 3 (TaskStatus, SyncStatusBar, FailSafeIndicator)
  - Visual Components: 5 (PhaseIcon, PhaseNode, ConnectionArrow, ProgressBar, TaskNumber)
  - Utility: 1 (utils.ts)

- **Convex Functions**: 11 total (no authentication functions)
  - Demo Functions: 3 (triggerNotionSync, getProjectTimeline, getSyncStatus)
  - Notion Sync Functions: 6 (syncNotionDatabase, batchUpsertRecords, updateSyncMeta, getLastSyncMeta, getRecords, getSyncStatus)
  - Notion Client Class: 1 with 6 methods
  - HTTP Routing: 1 (basic setup, currently empty)

This overview provides agents with comprehensive understanding of component relationships, data flows, and function signatures for effective codebase navigation and modification.
