import { Module } from '@nestjs/common';

import { ArticleCommentController } from './article-comment.controller';
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';

@Module({
  controllers: [CommentController, ArticleCommentController],
  providers: [CommentService],
  exports: [CommentService],
})
export class CommentModule {}
