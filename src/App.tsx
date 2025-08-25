import { ProjectTimeline } from "./components/ProjectTimeline";
import { DEFAULT_TIMELINE_CONFIG } from "./types/config";

export default function App() {
  return (
    <div className="min-h-screen bg-black">
      <ProjectTimeline config={DEFAULT_TIMELINE_CONFIG} />
    </div>
  );
}