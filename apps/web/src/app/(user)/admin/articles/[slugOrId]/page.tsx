import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';

import { Article, ArticleSkeleton } from '@/modules/article/server';
import { getArticle } from '@/modules/article/server';
import { AdminArticleActions } from '@/modules/article-moderation/client';

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

  return {
    title: result.data.title,
    authors: [
      {
        name: result.data.author.name,
        url: `/users/${result.data.author.username}`,
      },
    ],
  };
}

const Page = async ({ params }: Props) => {
  return (
    <Suspense fallback={<ArticleSkeleton />}>
      <Article
        slugOrIdPromise={params.then((params) => params.slugOrId)}
        renderActions={(article) => <AdminArticleActions article={article} />}
      />
    </Suspense>
  );
};

export default Page;
