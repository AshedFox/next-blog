import { Module } from '@nestjs/common';

import { ArticleModule } from '@/article/article.module';
import { UserModule } from '@/user/user.module';

import { ArticleModerationController } from './article-moderation.controller';
import { ArticleModerationMapper } from './article-moderation.mapper';
import { ArticleModerationService } from './article-moderation.service';

@Module({
  imports: [ArticleModule, UserModule],
  controllers: [ArticleModerationController],
  providers: [ArticleModerationService, ArticleModerationMapper],
  exports: [ArticleModerationService, ArticleModerationMapper],
})
export class ArticleModerationModule {}
