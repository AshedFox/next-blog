import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';

import { EditArticle } from '@/features/article/client';
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

  return { title: `Edit ${result.data.title}` };
}

const Page = async ({ params }: Props) => {
  const slugOrIdPromise = params.then((p) => p.slugOrId);

  return (
    <div className="grow flex items-center justify-center from-primary/20 to-card bg-linear-135 px-2 py-8">
      <div className="w-full max-w-4xl">
        <Suspense fallback={<Spinner className="size-16 m-auto" />}>
          <EditArticle slugOrIdPromise={slugOrIdPromise} />
        </Suspense>
      </div>
    </div>
  );
};

export default Page;
