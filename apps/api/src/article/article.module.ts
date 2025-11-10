import { Module } from '@nestjs/common';

import { StorageModule } from '@/storage/storage.module';

import { ArticleController } from './article.controller';
import { ArticleSerializer } from './article.serializer';
import { ArticleService } from './article.service';

@Module({
  imports: [StorageModule],
  controllers: [ArticleController],
  providers: [ArticleService, ArticleSerializer],
  exports: [ArticleService],
})
export class ArticleModule {}
