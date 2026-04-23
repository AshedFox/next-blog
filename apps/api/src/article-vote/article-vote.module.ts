import { Module } from '@nestjs/common';

import { ArticleVoteController } from './article-vote.controller';
import { ArticleVoteService } from './article-vote.service';
import { UserArticleVoteController } from './user-article-vote.controller';

@Module({
  controllers: [ArticleVoteController, UserArticleVoteController],
  providers: [ArticleVoteService],
  exports: [ArticleVoteService],
})
export class ArticleVoteModule {}
