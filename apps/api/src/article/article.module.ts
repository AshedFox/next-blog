import { Module } from '@nestjs/common';

import { FileModule } from '@/file/file.module';
import { StorageModule } from '@/storage/storage.module';

import { ArticleController } from './article.controller';
import { ArticleService } from './article.service';

@Module({
  imports: [StorageModule, FileModule],
  controllers: [ArticleController],
  providers: [ArticleService],
  exports: [ArticleService],
})
export class ArticleModule {}
