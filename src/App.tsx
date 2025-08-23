import { Authenticated, Unauthenticated, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { SignInForm } from "./SignInForm";
import { SignOutButton } from "./SignOutButton";
import { Toaster } from "sonner";
import { UnlockFlow } from "./components/UnlockFlow";

export default function App() {
  return (
    <div className="min-h-screen bg-black">
      <UnlockFlow />
    </div>
  );
}