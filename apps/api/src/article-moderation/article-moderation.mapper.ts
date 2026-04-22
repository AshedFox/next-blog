import { Injectable } from '@nestjs/common';
import { ArticleModerationInDto } from '@workspace/contracts';

import { ArticleMapper, ArticleWithRelations } from '@/article/article.mapper';
import { ArticleModerationLog, Comment } from '@/prisma/generated/client';
import { UserMapper, UserWithRelations } from '@/user/user.mapper';

export type ArticleModerationWithRelations = ArticleModerationLog & {
  admin?: UserWithRelations;
  article?: ArticleWithRelations;
};

@Injectable()
export class ArticleModerationMapper {
  constructor(
    private readonly articleMapper: ArticleMapper,
    private readonly userMapper: UserMapper
  ) {}

  map(log: ArticleModerationWithRelations): ArticleModerationInDto {
    const { article, admin, ...rest } = log;

    return {
      ...rest,
      admin: admin ? this.userMapper.map(admin) : undefined,
      article: article ? this.articleMapper.map(article) : undefined,
    };
  }

  mapMany(logs: ArticleModerationWithRelations[]): ArticleModerationInDto[] {
    return logs.map((log) => this.map(log));
  }
}
