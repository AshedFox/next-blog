import { Module } from '@nestjs/common';

import { CommentModule } from '@/comment/comment.module';
import { FileModule } from '@/file/file.module';
import { StorageModule } from '@/storage/storage.module';

import { ArticleController } from './article.controller';
import { ArticleService } from './article.service';

@Module({
  imports: [StorageModule, FileModule, CommentModule],
  controllers: [ArticleController],
  providers: [ArticleService],
  exports: [ArticleService],
})
export class ArticleModule {}
