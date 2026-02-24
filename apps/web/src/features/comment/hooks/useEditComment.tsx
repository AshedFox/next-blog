'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import {
  InfiniteData,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import {
  CommentDto,
  CommentSearchResponseDto,
  UpdateCommentDto,
  updateCommentSchema,
} from '@workspace/contracts';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { editCommentAction } from '../client';

export const useEditComment = (
  id: string,
  initialData: CommentDto,
  onSuccess?: () => void
) => {
  const queryClient = useQueryClient();
  const form = useForm({
    resolver: zodResolver(updateCommentSchema),
    defaultValues: initialData,
  });

  const mutation = useMutation({
    mutationFn: (input: UpdateCommentDto) => editCommentAction(id, input),
    onSuccess: ({ error, data }) => {
      if (error) {
        toast.error(error.message);
        return;
      }

      toast.success('Comment edited successfully!');
      onSuccess?.();

      queryClient.setQueryData<InfiniteData<CommentSearchResponseDto>>(
        ['articles', initialData.articleId, 'comments'],
        (oldData) => {
          if (!oldData) {
            return oldData;
          }

          return {
            ...oldData,
            pages: oldData.pages.map((page) => ({
              ...page,
              data: page.data.map((comment) =>
                comment.id === data.id ? { ...comment, ...data } : comment
              ),
            })),
          };
        }
      );
    },
    onError: () => {
      toast.error('Something went wrong!');
    },
  });

  const onSubmit = async (values: UpdateCommentDto) => {
    return mutation.mutate(values);
  };

  return {
    form,
    onSubmit: form.handleSubmit(onSubmit),
    isPending: mutation.isPending,
    isDirty: form.formState.isDirty,
  };
};
