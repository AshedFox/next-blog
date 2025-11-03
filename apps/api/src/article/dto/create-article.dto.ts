import { Type } from 'class-transformer';
import { IsDefined, Length, ValidateNested } from 'class-validator';

import { ArticleContentDto } from './article-content.dto';

export class CreateArticleDto {
  @Length(2, 127)
  title!: string;

  @IsDefined()
  @ValidateNested()
  @Type(() => ArticleContentDto)
  content!: ArticleContentDto;
}
