'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import {
  InfiniteData,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import {
  CommentSearchResponseDto,
  CreateCommentDto,
  createCommentSchema,
  UserDto,
} from '@workspace/contracts';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { createCommentAction } from '../client';

export const useCreateComment = (
  articleId: string,
  currentUser: UserDto,
  onSuccess?: () => void
) => {
  const queryClient = useQueryClient();

  const form = useForm({
    resolver: zodResolver(createCommentSchema),
    defaultValues: {
      articleId,
      content: '',
    },
  });

  const mutation = useMutation({
    mutationFn: createCommentAction,
    onSuccess: ({ data, error }) => {
      if (error) {
        toast.error(error.message);
        return;
      }

      toast.success('Commented successfully!');
      onSuccess?.();
      form.reset();

      queryClient.setQueryData<InfiniteData<CommentSearchResponseDto>>(
        ['articles', articleId, 'comments'],
        (oldData) => {
          if (!oldData) {
            return oldData;
          }

          const newPages = [...oldData.pages];

          if (newPages.length > 0) {
            newPages[0] = {
              ...newPages[0]!,
              data: [
                { ...data, author: currentUser },
                ...(newPages[0]!.data ?? []),
              ],
            };
          }

          return {
            ...oldData,
            pages: newPages,
          };
        }
      );
    },
    onError: () => {
      toast.error('Something went wrong!');
    },
  });

  const onSubmit = (values: CreateCommentDto) => {
    mutation.mutate(values);
  };

  return {
    form,
    onSubmit: form.handleSubmit(onSubmit),
    isPending: mutation.isPending,
  };
};
