'use client';

import { CommentVoteDto } from '@workspace/contracts';
import { Badge } from '@workspace/ui/components/badge';

import { useCommentVote } from '../hooks/useCommentVote';
import { VoteButton } from './VoteButton';

type Props = {
  commentId: string;
  commentVotesTotal: number;
  userId?: string;
  userVote?: CommentVoteDto;
};

export const CommentVotes = ({
  commentId,
  userId,
  commentVotesTotal,
  userVote,
}: Props) => {
  const isUpvoted = userVote ? userVote.value > 0 : false;
  const isDownvoted = userVote ? userVote.value < 0 : false;

  const { upvote, downvote, deleteVote, isPending } = useCommentVote(
    commentId,
    userId,
    userVote
  );

  const handleUpvoteClick = () => {
    if (!userId) {
      return;
    }

    if (isUpvoted) {
      deleteVote();
    } else {
      upvote();
    }
  };

  const handleDownvoteClick = () => {
    if (!userId) {
      return;
    }

    if (isDownvoted) {
      deleteVote();
    } else {
      downvote();
    }
  };

  return (
    <div className="flex gap-3 items-center">
      <VoteButton
        direction="up"
        isActive={isUpvoted}
        disabled={!userId || isPending}
        onClick={handleUpvoteClick}
      />

      <Badge variant="outline">{commentVotesTotal}</Badge>

      <VoteButton
        direction="down"
        isActive={isDownvoted}
        disabled={!userId || isPending}
        onClick={handleDownvoteClick}
      />
    </div>
  );
};
