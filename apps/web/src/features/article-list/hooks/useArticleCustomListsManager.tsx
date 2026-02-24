'use client';

import { InfiniteData, useQueryClient } from '@tanstack/react-query';
import {
  BaseListDto,
  CreateListDto,
  ListDto,
  ListSearchResponseDto,
} from '@workspace/contracts';
import { useMemo, useOptimistic, useTransition } from 'react';
import { toast } from 'sonner';

import {
  createListAction,
  setCustomListItemAction,
} from '@/features/list/client';

import { useInfiniteArticleCustomLists } from './useInfiniteArticleCustomLists';

export function useArticleCustomListsManager(
  articleId: string,
  initialIncluded: ListDto[],
  isOpen: boolean
) {
  const queryClient = useQueryClient();
  const [isPending, startTransition] = useTransition();

  const listQuery = useInfiniteArticleCustomLists(articleId, isOpen);

  const [optimisticIncluded, setOptimisticIncluded] = useOptimistic(
    initialIncluded,
    (
      state,
      action:
        | { type: 'add'; list: BaseListDto }
        | { type: 'remove'; listId: string }
    ) => {
      if (action.type === 'add') {
        return state.some((l) => l.id === action.list.id)
          ? state
          : [...state, action.list];
      }
      return state.filter((l) => l.id !== action.listId);
    }
  );

  const selectedIds = useMemo(
    () => new Set(optimisticIncluded.map((l) => l.id)),
    [optimisticIncluded]
  );

  const availableLists = useMemo(() => {
    return (listQuery.data?.pages.flatMap((p) => p.data) ?? []).filter(
      (list) => !selectedIds.has(list.id)
    );
  }, [listQuery.data?.pages, selectedIds]);

  const updateQueryCache = (
    action: 'remove' | 'restore',
    list: BaseListDto
  ) => {
    queryClient.setQueryData<InfiniteData<ListSearchResponseDto>>(
      ['articles', articleId, 'lists', 'custom'],
      (oldData) => {
        if (!oldData) {
          return oldData;
        }

        if (action === 'remove') {
          return {
            ...oldData,
            pages: oldData.pages.map((page) => ({
              ...page,
              data: page.data.filter((item) => item.id !== list.id),
            })),
          };
        }

        const newPages = [...oldData.pages];

        if (newPages.length > 0) {
          newPages[0] = { ...newPages[0]!, data: [list, ...newPages[0]!.data] };
        }

        return { ...oldData, pages: newPages };
      }
    );
  };

  const addToList = (list: BaseListDto) => {
    startTransition(async () => {
      setOptimisticIncluded({ type: 'add', list });
      updateQueryCache('remove', list);

      const { error } = await setCustomListItemAction(list.id, articleId, true);
      if (error) {
        toast.error('Failed to add to list');
        queryClient.invalidateQueries({
          queryKey: ['articles', articleId, 'lists'],
        });
      }
    });
  };

  const removeFromList = (list: BaseListDto) => {
    startTransition(async () => {
      setOptimisticIncluded({ type: 'remove', listId: list.id });
      updateQueryCache('restore', list);

      const { error } = await setCustomListItemAction(
        list.id,
        articleId,
        false
      );
      if (error) {
        toast.error('Failed to remove from list');
        queryClient.invalidateQueries({
          queryKey: ['articles', articleId, 'lists'],
        });
      }
    });
  };

  const createList = async (input: CreateListDto) => {
    const tempList: BaseListDto = {
      id: `temp-${Date.now()}`,
      name: input.name,
      isPublic: input.isPublic,
      systemType: null,
      userId: 'temp',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    startTransition(async () => {
      setOptimisticIncluded({ type: 'add', list: tempList });

      const result = await createListAction(input);

      if (result.error) {
        toast.error('Failed to create list');
        queryClient.invalidateQueries({
          queryKey: ['articles', articleId, 'lists'],
        });
        return;
      }

      await setCustomListItemAction(result.data.id, articleId, true);
    });
  };

  return {
    isPending,
    listQuery,
    optimisticIncluded,
    availableLists,
    actions: { addToList, removeFromList, createList },
  };
}
