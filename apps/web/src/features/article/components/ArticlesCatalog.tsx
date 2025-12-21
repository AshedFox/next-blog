import { articleSearchSchema, PaginatedMetaOffset } from '@workspace/contracts';
import React from 'react';

import { Paginator } from '@/shared/components/Paginator';
import Search from '@/shared/components/Search';

import { searchArticles } from '../server';
import ArticleCard from './ArticleCard';
import ArticleSort from './ArticleSort';

type Props = {
  searchParamsPromise: Promise<Record<string, string | string[] | undefined>>;
};

export const ArticlesCatalog = async ({ searchParamsPromise }: Props) => {
  const searchParams = await searchParamsPromise;
  const search = await articleSearchSchema.parseAsync({
    ...searchParams,
    include: ['author'],
  });

  const { data, error } = await searchArticles(search);

  if (error) {
    throw new Error(error.message);
  }

  const articles = data.data;
  const meta = data.meta as PaginatedMetaOffset;

  return (
    <div className="@container grow flex flex-col gap-6 max-w-6xl mx-auto w-full px-4 py-10">
      <div className="flex items-center gap-4 max-w-4xl mx-auto w-full">
        <Search />
        <ArticleSort />
      </div>

      <div className="grow">
        {articles.length === 0 ? (
          <div className="text-center text-muted-foreground py-16">
            No articles found...
          </div>
        ) : (
          <div className="grid grid-cols-1 @md:grid-cols-2 @2xl:grid-cols-3 gap-2 @md:gap-3 @2xl:gap-4">
            {articles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        )}
      </div>

      <Paginator
        currentPage={meta.page}
        totalPages={meta.totalPages}
        showNextPrev
        pathname="/articles"
        searchParams={searchParams}
      />
    </div>
  );
};
