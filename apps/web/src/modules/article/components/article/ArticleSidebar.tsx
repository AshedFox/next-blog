import { UserDto } from '@workspace/contracts';
import { Button } from '@workspace/ui/components/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@workspace/ui/components/card';
import { format } from 'date-fns';
import Link from 'next/link';
import React from 'react';

import { UserAvatar } from '@/modules/user/client';

type Props = {
  author: UserDto;
};

const ArticleSidebar = async ({ author }: Props) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>About author</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-row items-center gap-2">
        <UserAvatar user={author} className="size-20" />
        <div>
          <div className="text-lg">{author.name}</div>
          <Button
            className="p-0 text-sm text-primary-highlight h-fit"
            size="sm"
            variant="link"
            asChild
          >
            <Link href={`/users/${author.username}`}>@{author.username}</Link>
          </Button>
          <div className="text-xs text-muted-foreground">
            Since {format(author.createdAt, 'PPP')}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ArticleSidebar;
