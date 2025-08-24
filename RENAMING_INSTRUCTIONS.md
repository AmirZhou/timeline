# Component Renaming Instructions: UnlockFlow → Timeline

## Overview
The current codebase uses misleading "UnlockFlow" terminology that is legacy from an earlier concept. This project actually renders a **timeline component** for displaying project phases and tasks from Notion data. All "UnlockFlow", "Flow", "Stage", and "Substep" terminology should be renamed to accurately reflect timeline functionality.

## Primary Objective
Transform the component hierarchy from:
```
UnlockFlow → FlowStateProvider → StageDataProvider
```
To:
```
ProjectTimeline → TimelineStateProvider → PhaseDataProvider
```

---

## 1. Main Component Files to Rename

### Core Component Transformation

#### **File Renames:**
```bash
src/components/UnlockFlow.tsx → src/components/ProjectTimeline.tsx
src/components/providers/FlowStateProvider.tsx → src/components/providers/TimelineStateProvider.tsx
src/components/providers/StageDataProvider.tsx → src/components/providers/PhaseDataProvider.tsx
```

#### **Component & Function Renames:**

**UnlockFlow.tsx → ProjectTimeline.tsx:**
- `UnlockFlow` component → `ProjectTimeline`
- `FlowContent` component → `TimelineContent`
- Update imports: `import { ProjectTimeline } from "./components/ProjectTimeline"`

**FlowStateProvider.tsx → TimelineStateProvider.tsx:**
- `FlowStateProvider` → `TimelineStateProvider`
- `FlowStateProviderProps` → `TimelineStateProviderProps`
- `FlowState` interface → `TimelineState`
- `FlowStateContext` → `TimelineStateContext`
- `FlowStateContextType` → `TimelineStateContextType`
- `useFlowState` hook → `useTimelineState`
- Variables:
  - `currentStage` → `currentPhase`
  - `completedStages` → `completedPhases`
  - `setCurrentStage` → `setCurrentPhase`
  - `completeStage` → `completePhase`

**StageDataProvider.tsx → PhaseDataProvider.tsx:**
- `StageDataProvider` → `PhaseDataProvider`
- `StageDataProviderProps` → `PhaseDataProviderProps`
- `Stage` interface → `Phase`
- `Substep` interface → `Task` or `PhaseTask`
- `StageDataContext` → `PhaseDataContext`
- `useStageData` hook → `usePhaseData`
- `stageData` array → `phaseData`
- Individual stage objects:
  ```typescript
  // FROM:
  { id: 'enter-site', name: 'Enter Site', icon: 'play', substeps: [...] }
  // TO:
  { id: 'phase-1', name: 'Foundation & Setup', icon: 'play', tasks: [...] }
  ```

---

## 2. Layout Component Renames

#### **Files to Rename:**
```bash
src/components/layout/HorizontalFlowLayout.tsx → src/components/layout/HorizontalTimelineLayout.tsx
src/components/layout/FlowContainer.tsx → src/components/layout/TimelineContainer.tsx
src/components/layout/StageRow.tsx → src/components/layout/PhaseRow.tsx
src/components/layout/SubstepGrid.tsx → src/components/layout/TaskGrid.tsx
src/components/layout/VerticalSubstepList.tsx → src/components/layout/VerticalTaskList.tsx
```

#### **Component Renames:**
- `HorizontalFlowLayout` → `HorizontalTimelineLayout`
- `FlowContainer` → `TimelineContainer`
- `StageRow` → `PhaseRow`
- `SubstepGrid` → `TaskGrid`
- `VerticalSubstepList` → `VerticalTaskList`

---

## 3. Display Component Updates

#### **Files to Rename:**
```bash
src/components/display/StageLabel.tsx → src/components/display/PhaseLabel.tsx
src/components/display/SubstepText.tsx → src/components/display/TaskText.tsx
src/components/display/SubstepStatus.tsx → src/components/display/TaskStatus.tsx
```

#### **Component & Props Renames:**
- `StageLabel` → `PhaseLabel`
- `StageLabelProps` → `PhaseLabelProps`
- `SubstepText` → `TaskText`
- `SubstepTextProps` → `TaskTextProps`
- `SubstepStatus` → `TaskStatus`
- `SubstepStatusProps` → `TaskStatusProps`

---

## 4. Interactive Component Updates

#### **Files to Rename:**
```bash
src/components/interactive/StageClickHandler.tsx → src/components/interactive/PhaseClickHandler.tsx
src/components/interactive/SubstepClickHandler.tsx → src/components/interactive/TaskClickHandler.tsx
```

#### **Component & Props Renames:**
- `StageClickHandler` → `PhaseClickHandler`
- `StageClickHandlerProps` → `PhaseClickHandlerProps`
- `SubstepClickHandler` → `TaskClickHandler`
- `SubstepClickHandlerProps` → `TaskClickHandlerProps`
- Props: `stageId` → `phaseId`, `substepId` → `taskId`

---

## 5. Visual Component Updates

#### **Files to Rename:**
```bash
src/components/visual/StageIcon.tsx → src/components/visual/PhaseIcon.tsx
src/components/visual/StageNode.tsx → src/components/visual/PhaseNode.tsx
src/components/visual/SubstepNumber.tsx → src/components/visual/TaskNumber.tsx
```

#### **Component & Props Renames:**
- `StageIcon` → `PhaseIcon`
- `StageIconProps` → `PhaseIconProps`
- `StageNode` → `PhaseNode`
- `StageNodeProps` → `PhaseNodeProps`
- `SubstepNumber` → `TaskNumber`
- `SubstepNumberProps` → `TaskNumberProps`

---

## 6. Import Statement Updates

**After renaming files, update ALL import statements across the codebase:**

#### **In App.tsx:**
```typescript
// FROM:
import { UnlockFlow } from "./components/UnlockFlow";
// TO:
import { ProjectTimeline } from "./components/ProjectTimeline";
```

#### **In ProjectTimeline.tsx (formerly UnlockFlow.tsx):**
```typescript
// FROM:
import { FlowStateProvider } from './providers/FlowStateProvider';
import { FlowContainer } from './layout/FlowContainer';
import { HorizontalFlowLayout } from './layout/HorizontalFlowLayout';
// TO:
import { TimelineStateProvider } from './providers/TimelineStateProvider';
import { TimelineContainer } from './layout/TimelineContainer';
import { HorizontalTimelineLayout } from './layout/HorizontalTimelineLayout';
```

#### **Update all hook imports:**
```typescript
// FROM:
import { useFlowState } from '../providers/FlowStateProvider';
import { useStageData } from '../providers/StageDataProvider';
// TO:
import { useTimelineState } from '../providers/TimelineStateProvider';
import { usePhaseData } from '../providers/PhaseDataProvider';
```

---

## 7. TypeScript Interface Updates

#### **Core Type Definitions:**
```typescript
// In PhaseDataProvider.tsx (formerly StageDataProvider.tsx)
export interface PhaseTask {  // formerly Substep
  id: string;
  number: string;
  text: string;
  complete: boolean;
}

export interface Phase {  // formerly Stage
  id: string;
  name: string;
  icon: 'play' | 'verify' | 'unlock' | 'download' | 'install';
  tasks: PhaseTask[];  // formerly substeps
  complete: boolean;
}
```

#### **State Interface Updates:**
```typescript
// In TimelineStateProvider.tsx
interface TimelineState {  // formerly FlowState
  currentPhase: string;    // formerly currentStage
  currentTask: string;     // formerly currentSubstep
  completedPhases: Set<string>;  // formerly completedStages
  completedTasks: Set<string>;   // formerly completedSubsteps
}
```

---

## 8. Variable and Function Renames

#### **In TimelineStateProvider.tsx:**
```typescript
// State management functions:
setCurrentPhase(phaseId: string)     // formerly setCurrentStage
setCurrentTask(taskId: string)       // formerly setCurrentSubstep
completePhase(phaseId: string)       // formerly completeStage
completeTask(taskId: string)         // formerly completeSubstep
```

#### **Throughout component files:**
- `stageId` → `phaseId`
- `substepId` → `taskId`
- `isActive` remains the same
- `isComplete` remains the same

---

## 9. Static Data Updates

#### **In PhaseDataProvider.tsx:**
Update the hardcoded phase data to reflect actual project phases:

```typescript
const phaseData: Phase[] = [
  {
    id: 'foundation',
    name: 'Foundation & Legal Framework',
    icon: 'play',
    complete: false,
    tasks: [
      { id: '1.1', number: '1.1', text: 'Research legal requirements', complete: false },
      { id: '1.2', number: '1.2', text: 'Set up legal structure', complete: false },
      { id: '1.3', number: '1.3', text: 'Obtain necessary licenses', complete: false },
    ]
  },
  // ... continue with actual project phases
];
```

---

## 10. Component JSX Updates

#### **Update component usage throughout:**
```tsx
// In ProjectTimeline.tsx component return:
<TimelineStateProvider>
  <TimelineContainer>
    <HorizontalTimelineLayout />
  </TimelineContainer>
</TimelineStateProvider>

// Update hook usage:
const { currentPhase, setCurrentPhase, phases } = useTimelineState();
const phaseData = usePhaseData();
```

---

## 11. CSS Class Updates (if applicable)

If there are any CSS classes referencing "stage", "substep", or "flow", update them:
```css
/* FROM: */
.stage-container, .substep-item, .flow-layout
/* TO: */
.phase-container, .task-item, .timeline-layout
```

---

## 12. Documentation Updates

After renaming, update:

1. **CLAUDE.md** - Replace all references:
   - "UnlockFlow" → "ProjectTimeline"
   - "FlowStateProvider" → "TimelineStateProvider"
   - "StageDataProvider" → "PhaseDataProvider"
   - "stage" → "phase"
   - "substep" → "task"
   - Update component counts and descriptions

2. **Component descriptions** - Update all function documentation to reflect timeline terminology

---

## 13. Implementation Order

Execute renames in this sequence to avoid broken imports:

1. **Start with data types** - Rename interfaces and types first
2. **Rename provider files** - TimelineStateProvider, PhaseDataProvider
3. **Rename layout components** - Work from containers outward
4. **Rename display/visual components** - Update leaf components
5. **Rename interactive components** - Update click handlers
6. **Update main components** - ProjectTimeline, App.tsx
7. **Fix all import statements** - Use IDE find/replace
8. **Update documentation** - CLAUDE.md and component comments
9. **Test and verify** - Ensure no broken references

---

## 14. Verification Checklist

After completing all renames:

- [ ] All files have been renamed according to the mapping above
- [ ] All import/export statements updated
- [ ] All component names and props interfaces updated
- [ ] All hook names updated (`useTimelineState`, `usePhaseData`)
- [ ] All TypeScript interfaces renamed
- [ ] Static data arrays updated with meaningful names
- [ ] No references to "UnlockFlow", "FlowState", "Stage", "Substep" remain
- [ ] App compiles without TypeScript errors
- [ ] App runs without runtime errors
- [ ] CLAUDE.md documentation updated
- [ ] All component functionality preserved

---

## Expected Outcome

After completion, the component hierarchy should be:
```
ProjectTimeline
├── TimelineStateProvider
│   └── PhaseDataProvider
│       └── TimelineContent
│           ├── HeaderTitle
│           ├── HeaderSubtitle
│           ├── SyncStatusBar
│           └── HorizontalTimelineLayout
│               ├── PhaseRow
│               ├── TaskGrid
│               ├── PhaseIcon
│               ├── TaskCard
│               └── TaskModal
```

This will create a coherent, semantically accurate timeline component that properly reflects the project's actual purpose of displaying project timeline data from Notion.