import { useQuery } from '@tanstack/react-query';
import { graphHelpers } from '../db-helpers';
import { useAuth } from '@/context/AuthContext';

export function useKnowledgeGraph() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['knowledge-graph', user?.id],
    queryFn: () => graphHelpers.getGraph(user!.id),
    enabled: !!user,
  });
}

export function useNodes() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['nodes', user?.id],
    queryFn: () => graphHelpers.getNodes(user!.id),
    enabled: !!user,
  });
}

export function useEdges() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['edges', user?.id],
    queryFn: () => graphHelpers.getEdges(user!.id),
    enabled: !!user,
  });
}
