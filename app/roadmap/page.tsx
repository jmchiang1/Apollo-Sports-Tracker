import { Suspense } from "react";
import { RoadmapView } from "@/components/roadmap/RoadmapView";
import { PageSkeleton } from "@/components/ui/Skeleton";

export default function RoadmapPage() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <RoadmapView />
    </Suspense>
  );
}
