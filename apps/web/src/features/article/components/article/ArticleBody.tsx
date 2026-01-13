import { ArticleWithRelationsDto } from '@workspace/contracts';
import { Card, CardContent } from '@workspace/ui/components/card';
import React from 'react';

import BlocksRenderer from './BlocksRenderer';

type Props = {
  article: ArticleWithRelationsDto<['author']>;
};

const ArticleBody = async ({ article }: Props) => {
  return (
    <Card className="p-4 @md:p-6 @xl:p-8">
      <CardContent className="space-y-4 prose prose-sm @md:prose-base @lg:prose-lg @xl:prose-xl @4xl:prose-2xl dark:prose-invert prose-img:m-0 prose-pre:m-0 p-0">
        <BlocksRenderer article={article} />
      </CardContent>
    </Card>
  );
};

export default ArticleBody;
