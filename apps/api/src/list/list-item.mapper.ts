import { Injectable } from '@nestjs/common';
import { ListItem } from '@prisma/client';
import { ListItemInDto } from '@workspace/contracts';

import { ArticleMapper, ArticleWithRelations } from '@/article/article.mapper';

export type ListItemWithRelations = ListItem & {
  article?: ArticleWithRelations;
};

@Injectable()
export class ListItemMapper {
  constructor(private readonly articleMapper: ArticleMapper) {}

  map(item: ListItemWithRelations): ListItemInDto {
    const { article, ...rest } = item;

    return {
      ...rest,
      article: article ? this.articleMapper.map(article) : undefined,
    };
  }

  mapMany(items: ListItemWithRelations[]): ListItemInDto[] {
    return items.map((item) => this.map(item));
  }
}
