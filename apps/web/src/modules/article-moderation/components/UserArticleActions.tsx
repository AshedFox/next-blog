import { ArticleWithRelationsDto } from '@workspace/contracts';
import { Badge } from '@workspace/ui/components/badge';
import { Button } from '@workspace/ui/components/button';
import { ButtonGroup } from '@workspace/ui/components/button-group';
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from '@workspace/ui/components/card';
import { Field } from '@workspace/ui/components/field';
import Link from 'next/link';
import React, { Suspense } from 'react';

import { getMe } from '@/modules/user/server';

import { ModerationLogsDropdown } from './ModerationLogsDropdown';
import { PublishArticleButton } from './PublishArticleButton';

type Props = {
  article: ArticleWithRelationsDto<['author']>;
};

export const UserArticleActions = async ({ article }: Props) => {
  const currentUser = await getMe();

  if (!currentUser || article.authorId !== currentUser.id) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Actions</CardTitle>
        <CardAction>
          <Badge
            variant={
              article.status === 'PUBLISHED'
                ? 'default'
                : article.status === 'REJECTED'
                  ? 'destructive'
                  : 'outline'
            }
          >
            {article.status.toLowerCase()}
          </Badge>
        </CardAction>
      </CardHeader>
      <CardContent>
        <Field>
          {(article.status === 'DRAFT' || article.status === 'REJECTED') && (
            <ButtonGroup>
              <PublishArticleButton articleId={article.id} className="grow" />
              <Button className="grow" variant="outline" asChild>
                <Link href={`/articles/${article.id}/edit`}>Edit</Link>
              </Button>
            </ButtonGroup>
          )}
          <Suspense>
            <ModerationLogsDropdown articleId={article.id} />
          </Suspense>
        </Field>
      </CardContent>
    </Card>
  );
};
