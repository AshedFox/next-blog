import { articleSearchSchema } from '@workspace/contracts';
import { Metadata } from 'next';
import React, { Suspense } from 'react';

import { ArticlesCatalog } from '@/features/article/components/ArticlesCatalog';
import { createArticleSearchParams } from '@/features/article/utils';
import Spinner from '@/shared/components/Spinner';

export async function generateMetadata({
  searchParams,
}: PageProps<'/articles'>): Promise<Metadata> {
  const params = await searchParams;
  try {
    const search = await articleSearchSchema.parseAsync(params);
    const cleanParams = createArticleSearchParams(search);

    return {
      title: 'Articles',
      alternates: {
        canonical: `/articles?${cleanParams.toString()}`,
      },
    };
  } catch {
    return {
      title: 'Articles',
      alternates: {
        canonical: '/articles',
      },
    };
  }
}

const Page = ({ searchParams }: PageProps<'/articles'>) => {
  return (
    <Suspense
      fallback={
        <div className="grow flex items-center justify-center">
          <Spinner className="size-16" />
        </div>
      }
    >
      <ArticlesCatalog searchParamsPromise={searchParams} />
    </Suspense>
  );
};

export default Page;
