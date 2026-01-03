'use client';

import {
  InfiniteData,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { CommentSearchResponseDto } from '@workspace/contracts';
import { toast } from 'sonner';

import { deleteCommentAction } from '../client';

export function useDeleteComment(articleId: string, id: string) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: () => deleteCommentAction(id),
    onSuccess: ({ error, data }) => {
      if (error) {
        toast.error(error.message);
        return;
      }
      toast.success('Comment deleted successfully!');

      queryClient.setQueryData<InfiniteData<CommentSearchResponseDto>>(
        ['articles', articleId, 'comments'],
        (oldData) => {
          if (!oldData) {
            return oldData;
          }

          return {
            ...oldData,
            pages: oldData.pages.map((page) => ({
              ...page,
              data: page.data.filter((comment) => comment.id !== data.id),
            })),
          };
        }
      );
    },
    onError: () => {
      toast.error('Something went wrong!');
    },
  });

  return {
    deleteComment: mutation.mutate,
    isPending: mutation.isPending,
  };
}
