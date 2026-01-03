import { Suspense } from 'react';

import ArticleBody from './ArticleBody';
import ArticleBodySkeleton from './ArticleBodySkeleton';
import ArticleComments from './ArticleComments';
import ArticleHeader from './ArticleHeader';
import ArticleSidebar from './ArticleSidebar';
import ArticleSidebarSkeleton from './ArticleSidebarSkeleton';

type Props = {
  slugOrIdPromise: Promise<string>;
};

export const Article = async ({ slugOrIdPromise }: Props) => {
  const slugOrId = await slugOrIdPromise;

  return (
    <article className="@container flex flex-col gap-4">
      <Suspense fallback={<div className="h-96 bg-accent animate-pulse" />}>
        <ArticleHeader slugOrId={slugOrId} />
      </Suspense>
      <div className="@container relative grid gap-4 grid-cols-3 w-full p-4 mx-auto max-w-6xl">
        <div className="col-span-3 @3xl:col-span-2 flex flex-col gap-4">
          <Suspense fallback={<ArticleBodySkeleton />}>
            <ArticleBody slugOrId={slugOrId} />
          </Suspense>
        </div>
        <div className="col-span-3 @3xl:col-span-1 h-fit sticky top-4">
          <Suspense fallback={<ArticleSidebarSkeleton />}>
            <ArticleSidebar slugOrId={slugOrId} />
          </Suspense>
        </div>
        <section className="col-span-3 @3xl:col-span-2">
          <Suspense>
            <ArticleComments slugOrId={slugOrId} />
          </Suspense>
        </section>
      </div>
    </article>
  );
};
