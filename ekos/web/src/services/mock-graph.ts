// Mock knowledge graph data

export interface GraphNode {
  id: string;
  label: string;
  type: 'document' | 'person' | 'project' | 'topic' | 'meeting' | 'action';
  x?: number;
  y?: number;
  color?: string;
  size?: number;
  metadata?: Record<string, any>;
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  type: 'related_to' | 'mentioned_in' | 'created_by' | 'attended_by' | 'discusses';
  label?: string;
  weight?: number;
}

export const mockGraphNodes: GraphNode[] = [
  // Documents
  { id: 'doc_001', label: 'Q3 Financial Report', type: 'document', color: '#3b82f6', size: 40 },
  { id: 'doc_002', label: 'Product Roadmap 2024', type: 'document', color: '#3b82f6', size: 35 },
  { id: 'doc_003', label: 'Design System', type: 'document', color: '#3b82f6', size: 30 },
  
  // People
  { id: 'person_001', label: 'Alex Chen', type: 'person', color: '#10b981', size: 35 },
  { id: 'person_002', label: 'Sarah Johnson', type: 'person', color: '#10b981', size: 35 },
  { id: 'person_003', label: 'Mike Rodriguez', type: 'person', color: '#10b981', size: 30 },
  { id: 'person_004', label: 'Jennifer Lee', type: 'person', color: '#10b981', size: 30 },
  
  // Projects
  { id: 'project_001', label: 'Q4 Features', type: 'project', color: '#8b5cf6', size: 45 },
  { id: 'project_002', label: 'API Optimization', type: 'project', color: '#8b5cf6', size: 40 },
  { id: 'project_003', label: 'Dashboard Redesign', type: 'project', color: '#8b5cf6', size: 35 },
  
  // Topics
  { id: 'topic_001', label: 'Revenue Growth', type: 'topic', color: '#f59e0b', size: 35 },
  { id: 'topic_002', label: 'Product Launch', type: 'topic', color: '#f59e0b', size: 30 },
  { id: 'topic_003', label: 'Performance', type: 'topic', color: '#f59e0b', size: 30 },
  
  // Meetings
  { id: 'meeting_001', label: 'Engineering Standup', type: 'meeting', color: '#ec4899', size: 35 },
  { id: 'meeting_002', label: 'Product Review', type: 'meeting', color: '#ec4899', size: 30 },
  
  // Actions
  { id: 'action_001', label: 'Investigate API Performance', type: 'action', color: '#ef4444', size: 25 },
  { id: 'action_002', label: 'Review Dashboard PR', type: 'action', color: '#ef4444', size: 25 },
];

export const mockGraphEdges: GraphEdge[] = [
  // Document relationships
  { id: 'e1', source: 'doc_001', target: 'topic_001', type: 'related_to', weight: 0.9 },
  { id: 'e2', source: 'doc_001', target: 'project_001', type: 'related_to', weight: 0.8 },
  { id: 'e3', source: 'doc_002', target: 'project_001', type: 'related_to', weight: 0.95 },
  { id: 'e4', source: 'doc_002', target: 'topic_002', type: 'related_to', weight: 0.9 },
  { id: 'e5', source: 'doc_003', target: 'project_003', type: 'related_to', weight: 0.85 },
  
  // People relationships
  { id: 'e6', source: 'person_001', target: 'doc_001', type: 'created_by', weight: 1.0 },
  { id: 'e7', source: 'person_002', target: 'doc_002', type: 'created_by', weight: 1.0 },
  { id: 'e8', source: 'person_003', target: 'doc_003', type: 'created_by', weight: 1.0 },
  { id: 'e9', source: 'person_001', target: 'meeting_001', type: 'attended_by', weight: 1.0 },
  { id: 'e10', source: 'person_002', target: 'meeting_001', type: 'attended_by', weight: 1.0 },
  { id: 'e11', source: 'person_003', target: 'meeting_001', type: 'attended_by', weight: 1.0 },
  { id: 'e12', source: 'person_004', target: 'meeting_002', type: 'attended_by', weight: 1.0 },
  
  // Meeting relationships
  { id: 'e13', source: 'meeting_001', target: 'project_002', type: 'discusses', weight: 0.9 },
  { id: 'e14', source: 'meeting_001', target: 'project_003', type: 'discusses', weight: 0.8 },
  { id: 'e15', source: 'meeting_001', target: 'topic_003', type: 'discusses', weight: 0.85 },
  { id: 'e16', source: 'meeting_002', target: 'project_001', type: 'discusses', weight: 0.95 },
  
  // Action relationships
  { id: 'e17', source: 'action_001', target: 'project_002', type: 'related_to', weight: 1.0 },
  { id: 'e18', source: 'action_001', target: 'meeting_001', type: 'mentioned_in', weight: 0.9 },
  { id: 'e19', source: 'action_002', target: 'project_003', type: 'related_to', weight: 1.0 },
  { id: 'e20', source: 'action_002', target: 'meeting_001', type: 'mentioned_in', weight: 0.85 },
  
  // Topic relationships
  { id: 'e21', source: 'topic_001', target: 'topic_002', type: 'related_to', weight: 0.7 },
  { id: 'e22', source: 'topic_003', target: 'project_002', type: 'related_to', weight: 0.9 },
];

