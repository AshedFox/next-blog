import { articleSearchSchema } from '@workspace/contracts';
import { Metadata } from 'next';
import React, { Suspense } from 'react';

import { ArticleCard } from '@/modules/article/client';
import {
  ArticlesCatalog,
  createArticleSearchParams,
} from '@/modules/article/server';
import Spinner from '@/shared/components/Spinner';

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  try {
    const search = await articleSearchSchema.parseAsync(params);
    const cleanParams = createArticleSearchParams(search);

    return {
      title: `${slug} - Articles`,
      alternates: {
        canonical: `/tags/${slug}?${cleanParams.toString()}`,
      },
    };
  } catch {
    return {
      title: `${slug} - Articles`,
      alternates: {
        canonical: `/tags/${slug}`,
      },
    };
  }
}

const Page = async ({ searchParams, params }: Props) => {
  return (
    <Suspense
      fallback={
        <div className="grow flex items-center justify-center">
          <Spinner className="size-16" />
        </div>
      }
    >
      <ContentWrapper params={params} searchParams={searchParams} />
    </Suspense>
  );
};

const ContentWrapper = async ({ searchParams, params }: Props) => {
  const { slug } = await params;
  return (
    <ArticlesCatalog
      searchParamsPromise={searchParams}
      fixedFilters={{
        status: ['DRAFT'],
        tag: [slug],
      }}
      basePath={`/tags/${slug}`}
      title={`Explore "${slug}" articles`}
      renderItem={(article) => (
        <ArticleCard key={article.id} article={article} />
      )}
    />
  );
};

export default Page;
