import React from 'react';

export const CommentVotesSkeleton = () => {
  return (
    <div className="flex gap-3 items-center">
      <div className="size-9 bg-accent animate-pulse rounded-xl" />
      <div className="h-9 w-4 bg-accent animate-pulse rounded-xl" />
      <div className="size-9 bg-accent animate-pulse rounded-xl" />
    </div>
  );
};
