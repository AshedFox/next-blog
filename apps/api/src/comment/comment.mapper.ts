import { Injectable } from '@nestjs/common';
import { Comment } from '@prisma/client';
import { CommentInDto } from '@workspace/contracts';

import { ArticleMapper, ArticleWithRelations } from '@/article/article.mapper';
import { UserMapper, UserWithRelations } from '@/user/user.mapper';

export type CommentWithRelations = Comment & {
  author?: UserWithRelations;
  article?: ArticleWithRelations;
};

@Injectable()
export class CommentMapper {
  constructor(
    private readonly articleMapper: ArticleMapper,
    private readonly userMapper: UserMapper
  ) {}

  map(comment: CommentWithRelations): CommentInDto {
    const { author, article, ...rest } = comment;

    return {
      ...rest,
      author: author ? this.userMapper.map(author) : undefined,
      article: article ? this.articleMapper.map(article) : undefined,
    };
  }

  mapMany(comments: CommentWithRelations[]): CommentInDto[] {
    return comments.map((comment) => this.map(comment));
  }
}
