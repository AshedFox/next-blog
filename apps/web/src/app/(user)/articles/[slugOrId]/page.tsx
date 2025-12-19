import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import React, { Suspense } from 'react';

import { Article } from '@/features/article/client';
import { getArticle } from '@/features/article/server';
import Spinner from '@/shared/components/Spinner';

type Props = {
  params: Promise<{
    slugOrId: string;
  }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slugOrId } = await params;
  const result = await getArticle(slugOrId);

  if (result.error) {
    notFound();
  }

  return { title: result.data.title };
}

const Page = ({ params }: Props) => {
  const slugOrIdPromise = params.then((params) => params.slugOrId);

  return (
    <Suspense fallback={<Spinner className="size-16" />}>
      <Article slugOrIdPromise={slugOrIdPromise} />
    </Suspense>
  );
};

export default Page;
