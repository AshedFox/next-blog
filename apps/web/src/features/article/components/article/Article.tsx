import { notFound } from 'next/navigation';
import { Suspense } from 'react';

import {
  ArticleLists,
  ArticleListsSkeleton,
} from '@/features/article-list/client';

import { getArticle } from '../../server';
import ArticleBody from './ArticleBody';
import ArticleComments from './ArticleComments';
import ArticleCommentsSkeleton from './ArticleCommentsSkeleton';
import ArticleHeader from './ArticleHeader';
import ArticleSidebar from './ArticleSidebar';

type Props = {
  slugOrIdPromise: Promise<string>;
};

export const Article = async ({ slugOrIdPromise }: Props) => {
  const slugOrId = await slugOrIdPromise;
  const article = await getArticle(slugOrId);

  if (article.error) {
    return notFound();
  }

  return (
    <article className="@container flex flex-col gap-4">
      <ArticleHeader article={article.data} />
      <div className="@container relative grid gap-4 grid-cols-3 w-full p-4 mx-auto max-w-6xl">
        <div className="col-span-3 @3xl:col-span-2 flex flex-col gap-4">
          <ArticleBody article={article.data} />
        </div>
        <div className="col-span-3 @3xl:col-span-1 h-fit @3xl:sticky top-4 space-y-2">
          <ArticleSidebar author={article.data.author} />
          <Suspense fallback={<ArticleListsSkeleton />}>
            <ArticleLists articleId={article.data.id} />
          </Suspense>
        </div>
        <section className="col-span-3 @3xl:col-span-2">
          <Suspense fallback={<ArticleCommentsSkeleton />}>
            <ArticleComments articleId={article.data.id} />
          </Suspense>
        </section>
      </div>
    </article>
  );
};
