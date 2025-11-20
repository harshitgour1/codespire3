import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ZoomIn, ZoomOut, RotateCcw, Search, Filter } from "lucide-react";
import { motion } from "framer-motion";
import { mockGraphNodes, mockGraphEdges, type GraphNode, type GraphEdge } from "@/services/mock-graph";

const NODE_COLORS: Record<string, string> = {
  document: '#3b82f6',
  person: '#10b981',
  project: '#8b5cf6',
  topic: '#f59e0b',
  meeting: '#ec4899',
  action: '#ef4444',
};

const EDGE_COLORS: Record<string, string> = {
  related_to: '#94a3b8',
  mentioned_in: '#64748b',
  created_by: '#3b82f6',
  attended_by: '#10b981',
  discusses: '#ec4899',
};

export function GraphCanvas() {
  const [nodes, setNodes] = useState<GraphNode[]>(mockGraphNodes);
  const [edges, setEdges] = useState<GraphEdge[]>(mockGraphEdges);
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [filterType, setFilterType] = useState<string | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const dragStart = useRef({ x: 0, y: 0 });

  // Initialize node positions
  useEffect(() => {
    const centerX = 400;
    const centerY = 300;
    const radius = 150;
    
    const positionedNodes = nodes.map((node, index) => {
      if (node.x !== undefined && node.y !== undefined) {
        return node;
      }
      const angle = (index / nodes.length) * 2 * Math.PI;
      return {
        ...node,
        x: centerX + Math.cos(angle) * radius + (Math.random() - 0.5) * 100,
        y: centerY + Math.sin(angle) * radius + (Math.random() - 0.5) * 100,
      };
    });
    
    setNodes(positionedNodes);
  }, []);

  // Filter nodes and edges
  useEffect(() => {
    if (!filterType) {
      setNodes(mockGraphNodes.map((n, i) => ({ ...n, x: nodes[i]?.x, y: nodes[i]?.y })));
      setEdges(mockGraphEdges);
      return;
    }

    const filteredNodes = mockGraphNodes.filter(n => n.type === filterType);
    const filteredNodeIds = new Set(filteredNodes.map(n => n.id));
    const filteredEdges = mockGraphEdges.filter(
      e => filteredNodeIds.has(e.source) || filteredNodeIds.has(e.target)
    );
    const allRelevantNodeIds = new Set([
      ...filteredEdges.map(e => e.source),
      ...filteredEdges.map(e => e.target),
    ]);
    const allRelevantNodes = mockGraphNodes.filter(n => allRelevantNodeIds.has(n.id));

    setNodes(allRelevantNodes.map((n, i) => ({ ...n, x: nodes[i]?.x, y: nodes[i]?.y })));
    setEdges(filteredEdges);
  }, [filterType]);

  const handleZoom = (delta: number) => {
    setZoom(prev => Math.max(0.5, Math.min(2, prev + delta)));
  };

  const handleReset = () => {
    setZoom(1);
    setOffset({ x: 0, y: 0 });
    setSelectedNode(null);
    setFilterType(null);
  };

  const nodeTypes = Array.from(new Set(mockGraphNodes.map(n => n.type)));

  const getConnectedNodes = (nodeId: string) => {
    const connected = new Set<string>();
    edges.forEach(edge => {
      if (edge.source === nodeId) connected.add(edge.target);
      if (edge.target === nodeId) connected.add(edge.source);
    });
    return Array.from(connected);
  };

  return (
    <div className="w-full h-full flex flex-col space-y-4">
      {/* Controls */}
      <div className="flex items-center justify-between gap-4 pb-4 border-b">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <select
            value={filterType || ""}
            onChange={(e) => setFilterType(e.target.value || null)}
            className="text-sm border rounded-md px-2 py-1 bg-background"
          >
            <option value="">All Types</option>
            {nodeTypes.map(type => (
              <option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleZoom(-0.1)}
            className="h-8"
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          <span className="text-sm text-muted-foreground min-w-[60px] text-center">
            {Math.round(zoom * 100)}%
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleZoom(0.1)}
            className="h-8"
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleReset}
            className="h-8"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Graph Canvas */}
      <div className="flex-1 relative overflow-hidden rounded-lg border bg-slate-50 dark:bg-slate-950">
        <div
          ref={canvasRef}
          className="w-full h-full relative"
          style={{
            transform: `scale(${zoom}) translate(${offset.x}px, ${offset.y}px)`,
            transformOrigin: 'center center',
          }}
        >
          {/* SVG for edges */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            {edges.map(edge => {
              const sourceNode = nodes.find(n => n.id === edge.source);
              const targetNode = nodes.find(n => n.id === edge.target);
              if (!sourceNode || !targetNode || !sourceNode.x || !sourceNode.y || !targetNode.x || !targetNode.y) {
                return null;
              }

              const opacity = edge.weight ? edge.weight * 0.6 : 0.4;
              const color = EDGE_COLORS[edge.type] || '#94a3b8';

              return (
                <line
                  key={edge.id}
                  x1={sourceNode.x}
                  y1={sourceNode.y}
                  x2={targetNode.x}
                  y2={targetNode.y}
                  stroke={color}
                  strokeWidth={edge.weight ? edge.weight * 2 : 1.5}
                  strokeOpacity={opacity}
                />
              );
            })}
          </svg>

          {/* Nodes */}
          <div className="relative w-full h-full">
            {nodes.map((node) => {
              if (node.x === undefined || node.y === undefined) return null;

              const isSelected = selectedNode?.id === node.id;
              const isHighlighted = selectedNode && getConnectedNodes(selectedNode.id).includes(node.id);

              return (
                <motion.div
                  key={node.id}
                  initial={false}
                  animate={{
                    x: node.x - (node.size || 30) / 2,
                    y: node.y - (node.size || 30) / 2,
                    scale: isSelected ? 1.2 : isHighlighted ? 1.1 : 1,
                  }}
                  className="absolute cursor-pointer"
                  onClick={() => setSelectedNode(node)}
                  style={{
                    width: node.size || 30,
                    height: node.size || 30,
                  }}
                >
                  <div
                    className={`w-full h-full rounded-full border-2 transition-all ${
                      isSelected
                        ? 'border-foreground shadow-lg ring-2 ring-primary'
                        : isHighlighted
                        ? 'border-primary shadow-md'
                        : 'border-background shadow'
                    }`}
                    style={{
                      backgroundColor: NODE_COLORS[node.type] || '#94a3b8',
                    }}
                    title={node.label}
                  />
                  <div
                    className={`absolute top-full left-1/2 -translate-x-1/2 mt-2 whitespace-nowrap text-xs font-medium px-2 py-1 rounded shadow-md transition-all ${
                      isSelected ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
                    }`}
                    style={{
                      backgroundColor: NODE_COLORS[node.type] || '#94a3b8',
                      color: 'white',
                    }}
                  >
                    {node.label}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Node Details Panel */}
      {selectedNode && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="border-t pt-4"
        >
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{selectedNode.label}</CardTitle>
                  <Badge className="mt-2" style={{ backgroundColor: NODE_COLORS[selectedNode.type] }}>
                    {selectedNode.type}
                  </Badge>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedNode(null)}
                >
                  ×
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div>
                  <span className="text-sm font-medium text-muted-foreground">Connections: </span>
                  <span className="text-sm">{getConnectedNodes(selectedNode.id).length}</span>
                </div>
                {selectedNode.metadata && (
                  <div className="text-sm text-muted-foreground">
                    {JSON.stringify(selectedNode.metadata, null, 2)}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Legend */}
      <div className="pt-2 border-t">
        <div className="flex flex-wrap gap-4 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-medium text-muted-foreground">Types:</span>
            {nodeTypes.map(type => (
              <div key={type} className="flex items-center gap-1">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: NODE_COLORS[type] }}
                />
                <span className="text-muted-foreground">{type}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
