import React from 'react';

import { ArticleCard } from '@/modules/article/client';
import { searchArticles } from '@/modules/article/server';

type Props = {
  userId: string;
};

export async function ProfileArticlesTab({ userId }: Props) {
  const { data: articles, error } = await searchArticles({
    authorId: [userId],
    limit: 10,
    sort: { createdAt: 'desc' },
  });

  if (error || !articles?.data.length) {
    return (
      <div className="py-8 text-center text-muted-foreground">
        No articles published yet.
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
