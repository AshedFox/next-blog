import React from 'react';

export const ArticleListsSkeleton = () => {
  return (
    <div className="flex items-center gap-1">
      <div className="size-10 bg-accent animate-pulse rounded-full" />
      <div className="size-10 bg-accent animate-pulse rounded-full" />
      <div className="size-10 bg-accent animate-pulse rounded-full" />
    </div>
  );
};
