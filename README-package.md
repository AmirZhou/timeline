# @bitravage/timeline

A reusable React timeline component with Notion integration, featuring glassmorphic design and dark/light theme support.

## Features

- 🎨 **Dark/Light Theme Support** - Beautiful glassmorphic design in both themes
- 🔄 **Real-time Notion Sync** - Direct integration with Notion databases
- 🚀 **Framework Agnostic** - Works with Vite, Next.js, Create React App, and more
- ♿ **Accessible** - WCAG 2.1 AA compliant with keyboard navigation
- 📱 **Responsive** - Mobile-first design with adaptive layouts
- 🎯 **Zero Configuration** - No external CSS imports required
- 🔧 **TypeScript** - Full TypeScript support with exported types

## Installation

```bash
npm install @bitravage/timeline
```

## Quick Start

```tsx
import { Timeline } from '@bitravage/timeline';

// Basic usage - reads VITE_CONVEX_URL from environment
export function App() {
  return <Timeline />;
}
```

## Configuration

### Environment Variables

The component automatically detects your framework and reads the appropriate environment variable:

- **Vite**: `VITE_CONVEX_URL`
- **Next.js**: `NEXT_PUBLIC_CONVEX_URL`
- **Create React App**: `REACT_APP_CONVEX_URL`
- **Node.js**: `CONVEX_URL`

### Manual Configuration

```tsx
<Timeline 
  theme="light" 
  convexUrl="https://your-deployment.convex.cloud"
  className="my-custom-wrapper"
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `theme` | `'dark' \| 'light'` | `'dark'` | Visual theme mode |
| `className` | `string` | `undefined` | CSS class for the container |
| `convexUrl` | `string` | `undefined` | Convex deployment URL (auto-detected if not provided) |

## Themes

### Dark Theme (Default)
- Deep dark backgrounds with bright accent colors
- Glass morphism with dark translucent effects
- Optimized for low-light environments

### Light Theme
- Clean light backgrounds with subtle shadows
- Light glass morphism effects
- Professional appearance for business contexts

## Framework Support

### Vite
```bash
# .env.local
VITE_CONVEX_URL=https://your-deployment.convex.cloud
```

### Next.js
```bash
# .env.local
NEXT_PUBLIC_CONVEX_URL=https://your-deployment.convex.cloud
```

### Create React App
```bash
# .env.local
REACT_APP_CONVEX_URL=https://your-deployment.convex.cloud
```

## Requirements

- React 18+
- A Convex deployment with the timeline backend functions
- Node.js 16+ (for building)

## Development

This component is part of a larger timeline management system. For backend setup and Notion integration, see the full documentation.

## License

MIT © bitravage