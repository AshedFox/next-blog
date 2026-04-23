'use client';

import { ArticleVoteDto } from '@workspace/contracts';
import { Button } from '@workspace/ui/components/button';
import { ArrowBigUp } from 'lucide-react';
import React, { useTransition } from 'react';
import { toast } from 'sonner';

import { deleteArticleVoteAction, upvoteArticleAction } from '../client';

type Props = {
  articleId: string;
  userVote?: ArticleVoteDto;
};

export const UpvoteButton = ({ userVote, articleId }: Props) => {
  const isUpvoted = userVote ? userVote.value > 0 : false;
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      variant="outline"
      size="icon"
      disabled={isPending}
      onClick={() => {
        startTransition(async () => {
          if (isUpvoted) {
            const { error } = await deleteArticleVoteAction(articleId);

            if (error) {
              toast.error('Failed to upvote article');
            }
            return;
          }
          const { error } = await upvoteArticleAction(articleId);

          if (error) {
            toast.error('Failed to cancel article vote');
          }
        });
      }}
    >
      <ArrowBigUp className={isUpvoted ? 'fill-current' : ''} />
    </Button>
  );
};
