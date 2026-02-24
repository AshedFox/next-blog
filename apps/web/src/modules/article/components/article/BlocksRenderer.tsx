import { ArticleBlockType, ArticleDto } from '@workspace/contracts';
import { Separator } from '@workspace/ui/components/separator';
import Image from 'next/image';
import React, { JSX, Suspense } from 'react';

import { CodeBlock } from '@/shared/components/CodeBlock';
import Spinner from '@/shared/components/Spinner';

import ArticleSegments from './ArticleSegments';

type Props = {
  article: ArticleDto;
};

const BlocksRenderer = ({ article }: Props) => {
  return article.blocks.map((block) => {
    switch (block.type) {
      case ArticleBlockType.PARAGRAPH:
        return (
          <p key={block.id}>
            <ArticleSegments segments={block.content} />
          </p>
        );
      case ArticleBlockType.HEADING: {
        const Tag = `h${block.level}` as keyof JSX.IntrinsicElements;
        return (
          <Tag id={block.id} key={block.id}>
            <ArticleSegments segments={block.content} />
          </Tag>
        );
      }
      case ArticleBlockType.QUOTE:
        return (
          <figure key={block.id}>
            <blockquote>
              <ArticleSegments segments={block.content} />
            </blockquote>
            <figcaption className='before:content-["—"]'>
              {block.author}
            </figcaption>
          </figure>
        );
      case ArticleBlockType.CODE:
        return (
          <Suspense key={block.id} fallback={<Spinner className="size-16" />}>
            <CodeBlock code={block.content} language={block.language} />
          </Suspense>
        );
      case ArticleBlockType.VIDEO:
        return (
          <div
            key={block.id}
            className="w-full aspect-video rounded-lg overflow-hidden"
          >
            <iframe className="h-full w-full" src={block.embedUrl} />
          </div>
        );
      case ArticleBlockType.IMAGE:
        return (
          <div
            key={block.id}
            className="relative flex items-center justify-center"
          >
            <Image
              className="object-cover max-h-[80dvh] w-auto rounded-lg"
              width={0}
              height={0}
              src={block.url}
              alt={block.alt ?? ''}
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        );
      case ArticleBlockType.LIST: {
        const Tag = (
          block.style === 'ordered' ? 'ol' : 'ul'
        ) as keyof JSX.IntrinsicElements;
        return (
          <Tag key={block.id} className="list-inside">
            {block.items.map((item) => (
              <li key={item.id}>
                <ArticleSegments segments={item.content} />
              </li>
            ))}
          </Tag>
        );
      }
      case ArticleBlockType.DIVIDER:
        return <Separator key={block.id} />;
    }
  });
};

export default BlocksRenderer;
