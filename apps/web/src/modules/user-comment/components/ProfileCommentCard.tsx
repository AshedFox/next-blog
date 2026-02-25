import { CommentDto } from '@workspace/contracts';
import { Card, CardContent, CardHeader } from '@workspace/ui/components/card';
import { format } from 'date-fns';
import Link from 'next/link';
import React from 'react';

type Props = {
  comment: CommentDto;
};

export function ProfileCommentCard({ comment }: Props) {
  return (
    <Card className="py-2 @md:py-4 gap-2">
      <CardHeader className="text-xs flex flex-row items-center px-2 @md:px-4">
        <div className="flex flex-col gap-1 @md:flex-row @md:gap-2">
          <span className="text-muted-foreground flex items-center gap-1">
            On{' '}
            {comment.article ? (
              <Link
                href={`/articles/${comment.article.slug}`}
                className="font-semibold text-foreground transition-all underline-offset-4 hover:underline line-clamp-1"
              >
                {comment.article.title}
              </Link>
            ) : (
              <span className="font-semibold text-foreground line-clamp-1">
                Article {comment.articleId}
              </span>
            )}
          </span>
          <time className="text-muted-foreground" dateTime={comment.createdAt}>
            {format(new Date(comment.createdAt), 'PPpp')}
          </time>
        </div>
      </CardHeader>
      <CardContent className="px-2 @md:px-4 flex flex-col gap-2">
        <p className="whitespace-break-spaces italic border-l-2 pl-3 border-muted-foreground/30 text-muted-foreground">
          {comment.content}
        </p>
      </CardContent>
    </Card>
  );
}
