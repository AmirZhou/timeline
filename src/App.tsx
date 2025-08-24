import { ProjectTimeline } from "./components/ProjectTimeline";
import DirectNotionTest from "./components/testing/DirectNotionTest";

export default function App() {
  return (
    <div className="min-h-screen bg-black">
      <ProjectTimeline />
      <DirectNotionTest />
    </div>
  );
}