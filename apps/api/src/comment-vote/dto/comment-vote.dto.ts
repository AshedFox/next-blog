import { commentVoteSchema } from '@workspace/contracts';
import { createZodDto } from 'nestjs-zod';

export class CommentVoteDto extends createZodDto(commentVoteSchema) {}
