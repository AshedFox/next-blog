'use client';

import { Button } from '@workspace/ui/components/button';
import React, { useTransition } from 'react';
import { toast } from 'sonner';

import { approveArticleAction } from '../actions/approve-article';

type Props = {
  articleId: string;
  className?: string;
};

export const ApproveArticleButton = ({ articleId, className }: Props) => {
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      onClick={() => {
        startTransition(async () => {
          const { error } = await approveArticleAction(articleId);

          if (error) {
            toast.error('Failed to approve article');
          }
        });
      }}
      disabled={isPending}
      className={className}
      variant="default"
    >
      Approve
    </Button>
  );
};
