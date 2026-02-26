import { Module } from '@nestjs/common';

import { ArticleModule } from '@/article/article.module';
import { StorageModule } from '@/storage/storage.module';
import { UserModule } from '@/user/user.module';

import { ArticleCommentController } from './article-comment.controller';
import { CommentController } from './comment.controller';
import { CommentMapper } from './comment.mapper';
import { CommentService } from './comment.service';
import { UserCommentController } from './user-comment.controller';

@Module({
  imports: [StorageModule, UserModule, ArticleModule],
  controllers: [
    CommentController,
    UserCommentController,
    ArticleCommentController,
  ],
  providers: [CommentService, CommentMapper],
  exports: [CommentService, CommentMapper],
})
export class CommentModule {}
