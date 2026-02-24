import React from 'react';

import ArticleBodySkeleton from './ArticleBodySkeleton';
import ArticleSidebarSkeleton from './ArticleSidebarSkeleton';

export const ArticleSkeleton = () => {
  return (
    <div className="@container flex flex-col gap-4">
      <div className="h-96 bg-accent animate-pulse rounded-xl" />
      <div className="@container relative grid gap-4 grid-cols-3 w-full p-4 mx-auto max-w-6xl">
        <div className="col-span-3 @3xl:col-span-2 flex flex-col gap-4">
          <ArticleBodySkeleton />
        </div>
        <div className="col-span-3 @3xl:col-span-1 h-fit sticky top-4 space-y-2">
          <ArticleSidebarSkeleton />
        </div>
      </div>
    </div>
  );
};
