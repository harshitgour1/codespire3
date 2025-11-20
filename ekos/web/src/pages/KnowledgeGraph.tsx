import { GraphCanvas } from "@/components/graph/GraphCanvas";

export default function KnowledgeGraph() {
  return (
    <div className="container mx-auto p-6 h-full flex flex-col space-y-4">
      <h1 className="text-3xl font-bold tracking-tight">Knowledge Graph</h1>
      <div className="flex-1">
        <GraphCanvas />
      </div>
    </div>
  );
}
