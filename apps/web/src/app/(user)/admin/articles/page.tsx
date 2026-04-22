import React, { Suspense } from 'react';

import { AdminArticleCard } from '@/modules/article/client';
import { ArticlesCatalog } from '@/modules/article/server';
import Spinner from '@/shared/components/Spinner';

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

const Page = async ({ searchParams }: Props) => {
  return (
    <Suspense
      fallback={
        <div className="grow flex items-center justify-center">
          <Spinner className="size-16" />
        </div>
      }
    >
      <ArticlesCatalog
        searchParamsPromise={searchParams}
        statuses={['IN_REVIEW']}
        basePath="/admin/articles"
        title="Articles for review"
        renderItem={(article) => (
          <AdminArticleCard key={article.id} article={article} />
        )}
      />
    </Suspense>
  );
};

export default Page;
