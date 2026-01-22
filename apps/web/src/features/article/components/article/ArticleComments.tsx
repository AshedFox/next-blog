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

type Props = {
  articleId: string;
};

const ArticleComments = async ({ articleId }: Props) => {
  const [currentUser, { data, error }] = await Promise.all([
    getMe(),
    searchArticleComments(articleId, {
      include: ['author'],
    }),
  ]);

  return (
    <div className="flex flex-col gap-4">
      <Card className="flex flex-col gap-3">
        <CardHeader>
          <CardTitle>Comments</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {error ? (
            <span className="text-sm text-muted-foreground">
              Failed to load comments
            </span>
          ) : (
            <CommentsList
              articleId={articleId}
              initialData={data}
              currentUserId={currentUser?.id}
            />
          )}
        </CardContent>
      </Card>
      {currentUser && (
        <CreateCommentCard articleId={articleId} currentUser={currentUser} />
      )}
    </div>
  );
};

export default ArticleComments;
