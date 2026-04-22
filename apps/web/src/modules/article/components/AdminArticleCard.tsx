import { ArticleDto } from '@workspace/contracts';
import {
  Card,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@workspace/ui/components/card';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

import { UserAvatar } from '@/modules/user/client';

type Props = {
  article: ArticleDto;
};

export const AdminArticleCard = ({ article }: Props) => {
  return (
    <Card key={article.id} className="overflow-hidden p-0 gap-4 @container">
      <CardHeader className="p-0">
        <CardTitle className="line-clamp-2 text-lg px-4 pt-2">
          <Link href={`/admin/articles/${article.slug ?? article.id}`}>
            {article.title}
          </Link>
        </CardTitle>
      </CardHeader>
      <CardFooter className="grid text-xs text-muted-foreground px-4 py-4 gap-2 border-t">
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
        </div>
      </CardFooter>
    </Card>
  );
};
