import { useQuery } from '@tanstack/react-query';
import { timelineHelpers } from '../db-helpers';
import { useAuth } from '@/context/AuthContext';

export function useTimeline(startDate?: Date, endDate?: Date) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['timeline', user?.id, startDate?.toISOString(), endDate?.toISOString()],
    queryFn: () => timelineHelpers.getTimelineEvents(user!.id, startDate, endDate),
    enabled: !!user,
  });
}
