import { ArticleWithRelationsDto } from '@workspace/contracts';
import { ButtonGroup } from '@workspace/ui/components/button-group';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@workspace/ui/components/card';
import { Field } from '@workspace/ui/components/field';
import { Suspense } from 'react';

import { getMe } from '@/modules/user/server';

import { ApproveArticleButton } from './ApproveArticleButton';
import { ModerationLogsDropdown } from './ModerationLogsDropdown';
import { RejectArticleDialog } from './RejectArticleDialog';

type Props = {
  article: ArticleWithRelationsDto<['author']>;
};

export const AdminArticleActions = async ({ article }: Props) => {
  const currentUser = await getMe();

  if (
    !currentUser ||
    currentUser.role !== 'ADMIN' ||
    article.status !== 'IN_REVIEW'
  ) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <Field>
          <ButtonGroup>
            <ApproveArticleButton articleId={article.id} className="grow" />
            <RejectArticleDialog articleId={article.id} className="grow" />
          </ButtonGroup>
          <Suspense>
            <ModerationLogsDropdown articleId={article.id} />
          </Suspense>
        </Field>
      </CardContent>
    </Card>
  );
};
