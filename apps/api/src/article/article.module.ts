import { Module } from '@nestjs/common';

import { FileModule } from '@/file/file.module';
import { StorageModule } from '@/storage/storage.module';
import { TagModule } from '@/tag/tag.module';
import { UserModule } from '@/user/user.module';

import { ArticleController } from './article.controller';
import { ArticleMapper } from './article.mapper';
import { ArticleService } from './article.service';

@Module({
  imports: [StorageModule, FileModule, UserModule, TagModule],
  controllers: [ArticleController],
  providers: [ArticleService, ArticleMapper],
  exports: [ArticleService, ArticleMapper],
})
export class ArticleModule {}
