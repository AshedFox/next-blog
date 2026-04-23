import { articleVoteSchema } from '@workspace/contracts';
import { createZodDto } from 'nestjs-zod';

export class ArticleVoteDto extends createZodDto(articleVoteSchema) {}
