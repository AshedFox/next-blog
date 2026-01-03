'use client';

import { UserDto } from '@workspace/contracts';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@workspace/ui/components/card';
import React from 'react';

import { SubmitButton } from '@/shared/components/SubmitButton';

import { useCreateComment } from '../hooks';
import { CreateCommentFields } from './CreateCommentFields';

type Props = {
  articleId: string;
  currentUser: UserDto;
};

export const CreateCommentCard = ({ articleId, currentUser }: Props) => {
  const { form, isPending, onSubmit } = useCreateComment(
    articleId,
    currentUser
  );

  return (
    <form onSubmit={onSubmit}>
      <Card className="gap-2 py-4">
        <CardHeader>
          <CardTitle>Create comment</CardTitle>
        </CardHeader>
        <CardContent>
          <CreateCommentFields control={form.control} />
        </CardContent>
        <CardFooter className="justify-end">
          <SubmitButton isSubmitting={isPending} submittingText="Commenting">
            Create
          </SubmitButton>
        </CardFooter>
      </Card>
    </form>
  );
};
