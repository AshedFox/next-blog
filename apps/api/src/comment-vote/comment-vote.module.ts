import { Module } from '@nestjs/common';

import { CommentVoteController } from './comment-vote.controller';
import { CommentVoteService } from './comment-vote.service';
import { UserCommentVoteController } from './user-comment-vote.controller';

@Module({
  controllers: [CommentVoteController, UserCommentVoteController],
  providers: [CommentVoteService],
  exports: [CommentVoteService],
})
export class CommentVoteModule {}
