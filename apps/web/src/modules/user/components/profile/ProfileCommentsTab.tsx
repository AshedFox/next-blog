import React from 'react';

import { searchUserComments } from '@/modules/comment/server';
import { ProfileCommentCard } from '@/modules/user-comment/client';

type Props = {
  userId: string;
};

export async function ProfileCommentsTab({ userId }: Props) {
  const { data, error } = await searchUserComments(userId, {
    include: ['article'],
    limit: 10,
  });

  if (error || !data?.data.length) {
    return (
      <div className="py-8 text-center text-muted-foreground">
        No comments yet.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {data.data.map((comment) => (
        <ProfileCommentCard key={comment.id} comment={comment} />
      ))}
    </div>
  );
}
