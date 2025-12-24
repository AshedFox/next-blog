import { CreateCommentDto } from './dto/create-comment.dto';

export type CreateCommentInput = CreateCommentDto & {
  authorId: string;
};
