import React from 'react';

import { ArticleCard } from '@/modules/article/client';
import { searchArticles } from '@/modules/article/server';

type Props = {
  userId: string;
  isOwn?: boolean;
};

export async function ProfileArticlesTab({ userId, isOwn = false }: Props) {
  const { data: articles, error } = await searchArticles({
    authorId: [userId],
    limit: 10,
    sort: { createdAt: 'desc' },
    include: ['tags'],
    status: !isOwn ? ['PUBLISHED'] : undefined,
  });

  if (error || !articles?.data.length) {
    return (
      <div className="py-8 text-center text-muted-foreground">
        {isOwn ? 'No articles' : ' No articles published yet  '}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 @2xl:grid-cols-2 gap-2 @2xl:gap-4">
      {articles.data.map((article) => (
        <ArticleCard key={article.id} article={article} />
      ))}
    </div>
  );
}
