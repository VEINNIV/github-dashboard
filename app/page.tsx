import { Suspense } from "react";
import HomeClient from "./HomeClient";

/**
 * useSearchParams() inside HomeClient requires a Suspense boundary.
 * This server component provides that boundary cleanly.
 */
export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-screen" />}>
      <HomeClient />
    </Suspense>
  );
}
