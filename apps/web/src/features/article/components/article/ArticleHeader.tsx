import { Badge } from '@workspace/ui/components/badge';
import { format } from 'date-fns';
import { CalendarIcon, ClockIcon } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

import { UserAvatar } from '@/features/user/client';

import { getArticle, getReadingTime } from '../../server';

type Props = {
  slugOrId: string;
};

const ArticleHeader = async ({ slugOrId }: Props) => {
  const result = await getArticle(slugOrId);

  if (result.error) {
    return null;
  }

  const article = result.data;

  const readingTime = getReadingTime(article);

  return (
    <div className="relative w-full overflow-hidden">
      <div className="absolute bg-accent inset-0" />

      <div className="relative z-10 space-y-4 py-10 @lg:py-20 px-4 w-full max-w-4xl mx-auto overflow-hidden">
        <Badge>{article.status}</Badge>
        <h1 className="text-5xl @md:text-6xl @lg:text-7xl @xl:text-8xl font-bold leading-snug">
          {article.title}
        </h1>
        <div className="flex items-center gap-4 text-sm text-muted-foreground flex-col @lg:flex-row @lg:gap-6">
          <Link
            href={`/users/${article.author.username}`}
            className="flex items-center gap-1 group"
          >
            <UserAvatar user={article.author} />
            <span className="transition-all underline-offset-4 group-hover:underline">
              {article.author.name}
            </span>
          </Link>
          <div className="flex items-center gap-1">
            <CalendarIcon className="size-4" />
            <time dateTime={article.createdAt}>
              {format(article.createdAt, 'PPP')}
            </time>
          </div>
          <div className="flex items-center gap-1">
            <ClockIcon className="size-4" />
            <span>
              {readingTime.minutes > 0
                ? `${readingTime.minutes} min `
                : `${readingTime.seconds} sec `}
              to read
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticleHeader;
