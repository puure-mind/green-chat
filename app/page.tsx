import { AuthGate } from "@/features/auth/ui/auth-gate";

export default function Home() {
  return <AuthGate />;
}
