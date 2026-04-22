import {
  ArticleDto,
  ArticleStatus,
  PaginatedMetaOffset,
} from '@workspace/contracts';
import React, { ReactNode } from 'react';

import { Paginator } from '@/shared/components/Paginator';
import Search from '@/shared/components/Search';

import { searchArticles } from '../server';
import ArticleSort from './ArticleSort';

type Props = {
  searchParamsPromise: Promise<Record<string, string | string[] | undefined>>;
  statuses?: ArticleStatus[];
  title: string;
  basePath: string;
  renderItem: (article: ArticleDto) => ReactNode;
};

export const ArticlesCatalog = async ({
  searchParamsPromise,
  statuses = ['PUBLISHED'],
  basePath,
  title,
  renderItem,
}: Props) => {
  const searchParams = await searchParamsPromise;

  const { data, error } = await searchArticles({
    ...searchParams,
    page: Number(searchParams.page ?? 1),
    status: statuses,
    include: ['author'],
  });

  if (error) {
    throw new Error(error.message);
  }

  const articles = data.data;
  const meta = data.meta as PaginatedMetaOffset;

  return (
    <div className="@container grow flex flex-col gap-6 max-w-6xl mx-auto w-full px-4 py-10">
      <h1 className="text-3xl font-extrabold">{title}</h1>

      <div className="flex items-center gap-4 w-full">
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
            {articles.map(renderItem)}
          </div>
        )}
      </div>

      <Paginator
        currentPage={meta.page}
        totalPages={meta.totalPages}
        showNextPrev
        pathname={basePath}
        searchParams={searchParams}
      />
    </div>
  );
};
