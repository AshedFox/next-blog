import { Module } from '@nestjs/common';

import { ArticleStatsController } from './article-stats.controller';
import { ArticleStatsService } from './article-stats.service';

@Module({
  controllers: [ArticleStatsController],
  providers: [ArticleStatsService],
  exports: [ArticleStatsService],
})
export class ArticleStatsModule {}
