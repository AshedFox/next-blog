import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@workspace/ui/components/card';
import React from 'react';

import { CommentsList, CreateCommentCard } from '@/features/comment/client';
import { searchArticleComments } from '@/features/comment/server';
import { getMe } from '@/features/user/server';

import { getArticle } from '../../server';

type Props = {
  slugOrId: string;
};

const ArticleCommentsError = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Comments</CardTitle>
      </CardHeader>
      <CardContent className="p-4 text-center text-muted-foreground">
        <p>Failed to load comments</p>
      </CardContent>
    </Card>
  );
};

const ArticleComments = async ({ slugOrId }: Props) => {
  const articleResult = await getArticle(slugOrId);

  if (articleResult.error) {
    return <ArticleCommentsError />;
  }

  const article = articleResult.data;

  const commentsResult = await searchArticleComments(article.id, {
    include: ['author'],
  });

  if (commentsResult.error) {
    return <ArticleCommentsError />;
  }

  const currentUser = await getMe();
  const commentsData = commentsResult.data;

  return (
    <div className="flex flex-col gap-4">
      <Card className="flex flex-col gap-3">
        <CardHeader>
          <CardTitle>Comments</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {commentsData.data.length === 0 ? (
            <span className="text-sm text-muted-foreground">
              No comments yet...
            </span>
          ) : (
            <CommentsList
              articleId={article.id}
              initialData={commentsData}
              currentUserId={currentUser?.id}
            />
          )}
        </CardContent>
      </Card>
      {currentUser && (
        <CreateCommentCard articleId={article.id} currentUser={currentUser} />
      )}
    </div>
  );
};

export default ArticleComments;
