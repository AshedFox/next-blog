import { createIncludeSchema } from '../../common';
import { CommentInclude } from '../enums';

export const commentIncludeSchema = createIncludeSchema(CommentInclude).catch(
  []
);
