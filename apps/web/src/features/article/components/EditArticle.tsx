import { ArticleBlockType } from '@workspace/contracts';
import { notFound } from 'next/navigation';
import React from 'react';

import { getArticle } from '../server';
import { EditArticleForm } from './EditArticleForm';

type Props = {
  slugOrIdPromise: Promise<string>;
};

export const EditArticle = async ({ slugOrIdPromise }: Props) => {
  const slugOrId = await slugOrIdPromise;
  const result = await getArticle(slugOrId);

  if (result.error) {
    notFound();
  }

  return (
    <EditArticleForm
      id={result.data.id}
      initialData={{
        ...result.data,
        blocks: result.data.blocks.map((block) => {
          if (block.type === ArticleBlockType.VIDEO) {
            return { ...block, url: block.embedUrl };
          }
          return block;
        }),
      }}
    />
  );
};
