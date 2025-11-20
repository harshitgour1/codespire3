import { useQuery } from '@tanstack/react-query';
import { screenshotHelpers } from '../db-helpers';
import { useAuth } from '@/context/AuthContext';

export function useScreenshots(limit = 50) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['screenshots', user?.id, limit],
    queryFn: () => screenshotHelpers.getScreenshots(user!.id, limit),
    enabled: !!user,
  });
}

export function useSearchScreenshots(query: string) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['screenshots', 'search', user?.id, query],
    queryFn: () => screenshotHelpers.searchScreenshots(user!.id, query),
    enabled: !!user && query.length > 0,
  });
}
