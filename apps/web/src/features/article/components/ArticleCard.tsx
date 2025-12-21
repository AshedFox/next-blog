import { ArticleDto } from '@workspace/contracts';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@workspace/ui/components/card';
import { format } from 'date-fns';
import { CalendarIcon, ClockIcon, ImageOffIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

import { UserAvatar } from '@/features/user/client';

import {
  getArticleFirstImage,
  getArticleSnippet,
  getReadingTime,
} from '../utils';

type Props = {
  article: ArticleDto;
};

const ArticleCard = ({ article }: Props) => {
  const image = getArticleFirstImage(article);
  const snippet = getArticleSnippet(article);
  const readingTime = getReadingTime(article);

  return (
    <Card key={article.id} className="overflow-hidden p-0 gap-4 @container">
      <CardHeader className="p-0">
        <div className="h-40 bg-muted rounded-t-md overflow-hidden relative">
          {image ? (
            <Image
              src={image}
              alt={article.title}
              className="object-cover"
              fill
            />
          ) : (
            <div className="size-full flex items-center justify-center text-muted-foreground">
              <ImageOffIcon className="size-12" />
            </div>
          )}
        </div>
        <CardTitle className="line-clamp-2 text-lg px-4 pt-2">
          <Link href={`/articles/${article.slug ?? article.id}`}>
            {article.title}
          </Link>
        </CardTitle>
      </CardHeader>
      <CardContent className="grow py-0 px-4text-sm text-muted-foreground">
        {snippet ? (
          <p className="line-clamp-3">{snippet}</p>
        ) : (
          <p className="text-muted-foreground italic">
            This article doesn&apos;t have any text yet...
          </p>
        )}
      </CardContent>
      <CardFooter className="grid text-xs text-muted-foreground p-4! gap-2 border-t">
        {article.author && (
          <Link
            href={`/users/${article.author.username}`}
            className="flex items-center gap-1 group w-fit"
          >
            <UserAvatar className="size-6" user={article.author} />
            <span className="transition-all underline-offset-4 group-hover:underline">
              {article.author.name}
            </span>
          </Link>
        )}

        <div className="flex justify-between gap-2">
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
      </CardFooter>
    </Card>
  );
};

export default ArticleCard;
