import { articleSearchSchema } from '@workspace/contracts';
import { Metadata } from 'next';
import React, { Suspense } from 'react';

import { ArticlesCatalog } from '@/modules/article/client';
import { createArticleSearchParams } from '@/modules/article/utils';
import Spinner from '@/shared/components/Spinner';

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata({
  searchParams,
}: Props): Promise<Metadata> {
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

const Page = ({ searchParams }: Props) => {
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
