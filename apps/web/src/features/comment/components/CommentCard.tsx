import { CommentDto } from '@workspace/contracts';
import { Card, CardContent, CardHeader } from '@workspace/ui/components/card';
import { format } from 'date-fns';
import Link from 'next/link';
import React from 'react';

import { UserAvatar } from '@/features/user/client';

import { CommentActions } from './comment-actions';

type Props = {
  comment: CommentDto;
  isOwn?: boolean;
};

export const CommentCard = ({ comment, isOwn }: Props) => {
  return (
    <Card className="py-2 @md:py-4 gap-2">
      <CardHeader className="text-xs flex flex-row items-center px-2 @md:px-4">
        <UserAvatar className="size-6" user={comment.author!} />
        <div className="flex flex-col gap-1 @md:flex-row @md:gap-2">
          <Link
            href={`/users/${comment.author!.username}`}
            className="font-semibold transition-all underline-offset-4 hover:underline"
          >
            {comment.author!.name}
          </Link>
          <time className="text-muted-foreground" dateTime={comment.createdAt}>
            {format(comment.createdAt, 'PPpp')}
          </time>
        </div>
        {isOwn && <CommentActions comment={comment} />}
      </CardHeader>
      <CardContent className="px-2 @md:px-4">
        <p className="whitespace-break-spaces">{comment.content}</p>
      </CardContent>
    </Card>
  );
};
