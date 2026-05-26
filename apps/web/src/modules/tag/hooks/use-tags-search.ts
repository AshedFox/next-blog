import { useQuery } from '@tanstack/react-query';
import { BaseTagDto } from '@workspace/contracts';

import { clientApi } from '@/lib/api/client';

export function useTagsSearch(query: string) {
  return useQuery({
    queryKey: ['tags', 'search', query],
    queryFn: async () => {
      const searchParams = new URLSearchParams();

      if (query) {
        searchParams.set('query', query);
      }

      return clientApi.get<BaseTagDto[]>(
        `/api/tags?${searchParams.toString()}`
      );
    },
    staleTime: 30 * 1000,
  });
}
