import { TimelineCanvas } from "@/components/timeline/TimelineCanvas";

export default function Timeline() {
  return (
    <div className="container mx-auto p-6 h-full flex flex-col space-y-4">
      <h1 className="text-3xl font-bold tracking-tight">Timeline</h1>
      <div className="flex-1">
        <TimelineCanvas />
      </div>
    </div>
  );
}
