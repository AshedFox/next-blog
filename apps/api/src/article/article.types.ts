import { CreateArticleDto } from './dto/create-article.dto';

export type CreateArticleInput = CreateArticleDto & {
  authorId: string;
};
