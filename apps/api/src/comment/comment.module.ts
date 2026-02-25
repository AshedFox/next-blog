import { Module } from '@nestjs/common';

import { StorageModule } from '@/storage/storage.module';

import { ArticleCommentController } from './article-comment.controller';
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';
import { UserCommentController } from './user-comment.controller';

@Module({
  imports: [StorageModule],
  controllers: [
    CommentController,
    UserCommentController,
    ArticleCommentController,
  ],
  providers: [CommentService],
  exports: [CommentService],
})
export class CommentModule {}
