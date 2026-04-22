'use client';

import { Button } from '@workspace/ui/components/button';
import React, { useTransition } from 'react';
import { toast } from 'sonner';

import { publishArticleAction } from '../actions/publish-article';

type Props = {
  articleId: string;
  className?: string;
};

export const PublishArticleButton = ({ articleId, className }: Props) => {
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      onClick={() => {
        startTransition(async () => {
          const { error } = await publishArticleAction(articleId);

          if (error) {
            toast.error('Failed to publish article');
          }
        });
      }}
      disabled={isPending}
      className={className}
      variant="outline"
    >
      Publish
    </Button>
  );
};
