# Timeline Component for Notion

Turn your Notion database into a beautiful, interactive timeline for your portfolio website in just 2 minutes!

![Timeline Component Demo](./demo/timeline-overview.gif)
*[GIF Placeholder: Overview of the interactive timeline component showing phases and tasks]*

## What is this?

A React component that automatically transforms your Notion project database into a stunning visual timeline. Perfect for students and developers who want to showcase their project progress on portfolio websites.

### ✨ Features

- **Live Data Sync** - Your timeline updates automatically when you change your Notion database
- **Interactive Design** - Click on tasks to see detailed information in beautiful modals
- **Mobile Friendly** - Looks great on phones, tablets, and desktops
- **Zero Maintenance** - No databases to manage, no servers to maintain
- **Customizable** - Change colors and fonts to match your portfolio style (coming soon!)

![Interactive Features Demo](./demo/interactive-features.gif)
*[GIF Placeholder: Clicking on tasks, showing modal details, status updates]*

## Who is this for?

- **Students** building portfolio websites to showcase projects
- **Developers** who want to display project progress professionally
- **Teams** tracking multi-phase projects in Notion
- **Anyone** who uses Notion for project management and wants a beautiful timeline view

## How does it work?

1. **Create your Notion database** with your project tasks
2. **Deploy to Convex** (takes 30 seconds)
3. **Add to your website** with one line of code

That's it! Your timeline automatically stays in sync with your Notion data.

![Setup Process Demo](./demo/setup-process.gif)
*[GIF Placeholder: Quick setup process from Notion to deployed timeline]*

## Quick Start

### Step 1: Set up your Notion Database

Create a Notion database with these columns:
- **Task Name** (Title) - What needs to be done
- **Status** (Select) - Not Started, In Progress, Completed, etc.
- **Priority** (Select) - Critical, High, Medium, Low
- **Phase** (Select) - Group your tasks into project phases
- **Phase Number** (Number) - Order your phases (1, 2, 3...)

Optional columns for more details:
- **Week** (Number) - When the task should happen
- **Due Date** (Date) - Task deadline
- **Description** (Text) - More details about the task
- **Assignee** (Select) - Who's responsible

### Step 2: Get your Notion API Key

1. Go to [Notion Developers](https://www.notion.so/my-integrations)
2. Create a new integration
3. Copy your API key
4. Share your database with the integration

### Step 3: Deploy with Convex

```bash
# Install the package
npm install @bitravage/timeline

# Or clone for development
git clone https://github.com/AmirZhou/timeline
cd timeline

# Install dependencies
npm install

# Set up your environment
echo "NOTION_API_KEY=your_notion_api_key_here" > .env.local

# Deploy to Convex
npx convex deploy
```

**Requirements:**
- Node.js 18+ 
- React 18+ (works with React 19)

### Step 4: Add to Your Website

```jsx
import { ProjectTimeline } from '@bitravage/timeline';

function App() {
  return (
    <div>
      <h1>My Portfolio</h1>
      <ProjectTimeline />
    </div>
  );
}
```

## Live Examples

![Portfolio Integration Demo](./demo/portfolio-integration.gif)
*[GIF Placeholder: Timeline component integrated into different portfolio websites]*

## Powered By

<div align="center">
  <img src="./assets/notion-logo.png" alt="Notion" height="40" />
  &nbsp;&nbsp;&nbsp;&nbsp;
  <img src="./assets/convex-logo.png" alt="Convex" height="40" />
</div>

This component uses **Notion** as your database and **Convex** for seamless real-time synchronization.

## Coming Soon

- 🎨 **Theme Customization** - Match your portfolio's color scheme
- 🔤 **Font Selection** - Choose from popular web fonts
- 📱 **More Layouts** - Horizontal timelines, Gantt charts, and more
- 🔗 **Direct Notion Links** - Click to edit tasks directly in Notion
- 📊 **Progress Analytics** - Track your project completion over time

## Support

- 📺 [Watch the 2-minute setup video](#)
- 📖 [Read the documentation](./docs)
- 💬 [Join our Discord community](#)
- 🐛 [Report issues on GitHub](https://github.com/AmirZhou/timeline/issues)

## License

MIT License - Use it freely in your personal and commercial projects!

---

Built with ❤️ for students and developers who love Notion