import { useQuery } from '@tanstack/react-query';
import { meetingHelpers } from '../db-helpers';
import { useAuth } from '@/context/AuthContext';

export function useMeetings() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['meetings', user?.id],
    queryFn: () => meetingHelpers.getMeetings(user!.id),
    enabled: !!user,
  });
}

export function useMeeting(id: string) {
  return useQuery({
    queryKey: ['meetings', id],
    queryFn: () => meetingHelpers.getMeeting(id),
    enabled: !!id,
  });
}
