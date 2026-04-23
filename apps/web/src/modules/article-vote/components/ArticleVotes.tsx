import { getMe } from '@/modules/user/server';

import { getArticleVotesTotal, getOwnArticleVote } from '../server';
import { DownvoteButton } from './DownvoteButton';
import { UpvoteButton } from './UpvoteButton';

type Props = {
  articleId: string;
};

export const ArticleVotes = async ({ articleId }: Props) => {
  const [user, total] = await Promise.all([
    getMe(),
    getArticleVotesTotal(articleId),
  ]);

  if (total.error) {
    return null;
  }

  const userVote = user
    ? await getOwnArticleVote(articleId, user?.id)
    : undefined;

  return (
    <div className="flex gap-3 items-center">
      {user && <UpvoteButton articleId={articleId} userVote={userVote?.data} />}
      <span className="text-sm font-semibold text-muted-foreground w-4 text-center">
        {total.data.total}
      </span>
      {user && (
        <DownvoteButton articleId={articleId} userVote={userVote?.data} />
      )}
    </div>
  );
};
