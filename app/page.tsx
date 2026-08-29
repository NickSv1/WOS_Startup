import { Suspense } from "react";
import LandingPage from "@/components/marketing/LandingPage";

export default function Home() {
  return (
    <Suspense fallback={null}>
      <LandingPage />
    </Suspense>
  );
}
