'use client';

import { ArticleVoteDto } from '@workspace/contracts';
import { Button } from '@workspace/ui/components/button';
import { ArrowBigDown } from 'lucide-react';
import React, { useTransition } from 'react';
import { toast } from 'sonner';

import { deleteArticleVoteAction, downvoteArticleAction } from '../client';

type Props = {
  articleId: string;
  userVote?: ArticleVoteDto;
};

export const DownvoteButton = ({ userVote, articleId }: Props) => {
  const isDownvoted = userVote ? userVote.value < 0 : false;
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      variant="outline"
      size="icon"
      disabled={isPending}
      onClick={() => {
        startTransition(async () => {
          if (isDownvoted) {
            const { error } = await deleteArticleVoteAction(articleId);

            if (error) {
              toast.error('Failed to downvote article');
            }
            return;
          }
          const { error } = await downvoteArticleAction(articleId);

          if (error) {
            toast.error('Failed to cancel article vote');
          }
        });
      }}
    >
      <ArrowBigDown className={isDownvoted ? 'fill-current' : ''} />
    </Button>
  );
};
