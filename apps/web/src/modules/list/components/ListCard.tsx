import { ListDto, SystemListType } from '@workspace/contracts';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@workspace/ui/components/card';
import { cn } from '@workspace/ui/lib/utils';
import {
  BookmarkIcon,
  GlobeIcon,
  HeartIcon,
  ListIcon,
  LockIcon,
} from 'lucide-react';
import Link from 'next/link';
import React from 'react';

type Props = {
  list: ListDto;
};

export function ListCard({ list }: Props) {
  let Icon = ListIcon;
  let listName = list.name;

  if (list.systemType === SystemListType.FAVORITE) {
    Icon = HeartIcon;
    listName = 'Favorites';
  } else if (list.systemType === SystemListType.READ_LATER) {
    Icon = BookmarkIcon;
    listName = 'Read Later';
  }

  return (
    <Card className="transition-all hover:bg-muted/50 h-full flex flex-col">
      <CardHeader>
        <CardAction>
          <Icon
            className={cn('size-6', {
              'text-red-500 fill-red-500':
                list.systemType === SystemListType.FAVORITE,
              'text-blue-500 fill-blue-500':
                list.systemType === SystemListType.READ_LATER,
              'text-muted-foreground': !list.systemType,
            })}
          />
        </CardAction>
        <CardTitle className="text-base line-clamp-1">
          <Link href={`/lists/${list.id}`} className="hover:underline">
            {listName}
          </Link>
        </CardTitle>
        <CardDescription className="line-clamp-2">
          {list.stats?.items || 0} items
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0 flex items-center gap-1.5 text-xs text-muted-foreground">
        {list.isPublic ? (
          <>
            <GlobeIcon className="size-3" />
            <span>Public</span>
          </>
        ) : (
          <>
            <LockIcon className="size-3" />
            <span>Private</span>
          </>
        )}
      </CardContent>
    </Card>
  );
}
