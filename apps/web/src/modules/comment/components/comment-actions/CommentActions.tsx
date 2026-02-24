import { CommentDto } from '@workspace/contracts';
import { ButtonGroup } from '@workspace/ui/components/button-group';
import React from 'react';

import { DeleteCommentAlert } from './DeleteCommentAlert';
import { EditCommentDialog } from './EditCommentDialog';

type Props = {
  comment: CommentDto;
};

export const CommentActions = ({ comment }: Props) => {
  return (
    <ButtonGroup className="ml-auto">
      <EditCommentDialog id={comment.id} initialData={comment} />
      <DeleteCommentAlert id={comment.id} articleId={comment.articleId} />
    </ButtonGroup>
  );
};
