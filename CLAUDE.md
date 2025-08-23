# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Running the Application
```bash
# Start both frontend and backend in parallel
npm run dev

# Start frontend only (with Vite)
npm run dev:frontend

# Start backend only (Convex)
npm run dev:backend

# Build for production
npm run build

# Lint and type check
npm run lint
```

### Testing
The `lint` command performs TypeScript type checking for both frontend and Convex code, and validates the build process.

## Project Architecture

### Technology Stack
- **Frontend**: React 19 with TypeScript, Vite, Tailwind CSS
- **Backend**: Convex for real-time data sync and serverless functions
- **Authentication**: Convex Auth with anonymous authentication
- **UI Library**: Custom components with Tailwind styling

### Component Architecture

The application follows a hierarchical component structure centered around the `UnlockFlow` component:

**Core Component Hierarchy:**
- `UnlockFlow` is the main orchestrator that provides context through three nested providers:
  - `ThemeProvider`: Global theming context
  - `StageDataProvider`: Stage and substep data management
  - `FlowStateProvider`: UI state management (current stage, expanded views, completion status)

**Component Organization (`src/components/`):**
- **providers/**: Context providers for state management
- **layout/**: Container and layout components (FlowContainer, HorizontalFlowLayout, VerticalSubstepList)
- **display/**: Text and label components (HeaderTitle, StageLabel, SubstepText)
- **visual/**: Visual elements (StageNode, ConnectionArrow, ProgressBar)
- **interactive/**: User interaction handlers (StageClickHandler, ActionButton)
- **animation/**: Animation wrappers (GlowEffect, PulseAnimation)
- **status/**: Status indicators (SubstepStatus, FailSafeIndicator)

### Backend Structure (Convex)

**Key Files:**
- `convex/schema.ts`: Database schema definition
- `convex/auth.config.ts`: Authentication configuration
- `convex/http.ts`: HTTP routes and API endpoints
- `convex/router.ts`: User-defined HTTP routes (separate from auth routes)

**Authentication Flow:**
The app uses Convex Auth with anonymous authentication for easy sign-in. Authentication routes are protected in `convex/http.ts` and should not be modified directly.

### Path Aliases
TypeScript is configured with path aliases:
- `@/*` maps to `./src/*`

This allows imports like `import { utils } from '@/lib/utils'`

## Convex-Specific Guidelines

Follow the Convex guidelines from `.cursor/rules/convex_rules.mdc`:
- Use the new function syntax for all Convex functions
- Include argument and return validators for all functions
- Use `v.null()` for null returns
- Prefer indexes over filters in queries
- Use file-based routing for function references

## Important Notes

- The project is connected to Convex deployment: `sincere-bullfrog-704`
- HTTP routes in `convex/router.ts` are kept separate from authentication routes
- The frontend code is in `src/` (not `app/` as mentioned in README)
- Authentication is handled by Convex Auth with anonymous sign-in enabled