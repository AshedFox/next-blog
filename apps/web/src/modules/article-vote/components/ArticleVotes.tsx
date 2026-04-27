import { Badge } from '@workspace/ui/components/badge';

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
      <UpvoteButton
        articleId={articleId}
        userVote={userVote?.data}
        userId={user?.id}
      />

      <Badge variant="outline">{total.data.total}</Badge>

      <DownvoteButton
        articleId={articleId}
        userVote={userVote?.data}
        userId={user?.id}
      />
    </div>
  );
};
