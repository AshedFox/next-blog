import { Card, CardContent } from '@workspace/ui/components/card';
import { notFound } from 'next/navigation';
import React from 'react';

import { getArticle } from '../../server';
import BlocksRenderer from './BlocksRenderer';

type Props = {
  slugOrId: string;
};

const ArticleBody = async ({ slugOrId }: Props) => {
  const result = await getArticle(slugOrId);

  if (result.error) {
    return notFound();
  }

  const article = result.data;

  return (
    <Card className="p-4 @md:p-6 @xl:p-8">
      <CardContent className="space-y-4 prose prose-sm @md:prose-base @lg:prose-lg @xl:prose-xl @4xl:prose-2xl dark:prose-invert prose-img:m-0 prose-pre:m-0 p-0">
        <BlocksRenderer article={article} />
      </CardContent>
    </Card>
  );
};

export default ArticleBody;
