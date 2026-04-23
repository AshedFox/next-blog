import 'server-only';

import {
  ArticleVoteDto,
  ArticleVoteGetManyResponseDto,
  ArticleVotesTotalDto,
} from '@workspace/contracts';

import { serverApi } from '@/lib/api/server';

export function fetchOwnArticleVote(articleId: string) {
  return serverApi.get<ArticleVoteDto>(
    `/api/users/me/articles/${articleId}/votes`,
    true
  );
}

export function fetchOwnArticleVotes() {
  return serverApi.get<ArticleVoteGetManyResponseDto>(
    `/api/users/me/articles/votes`,
    true
  );
}

export function fetchArticleVotesTotal(articleId: string) {
  return serverApi.get<ArticleVotesTotalDto>(
    `/api/articles/${articleId}/votes/total`
  );
}

export function upvoteArticle(articleId: string) {
  return serverApi.post<ArticleVoteDto>(
    `/api/articles/${articleId}/votes/upvote`,
    undefined,
    true
  );
}

export function downvoteArticle(articleId: string) {
  return serverApi.post<ArticleVoteDto>(
    `/api/articles/${articleId}/votes/downvote`,
    undefined,
    true
  );
}

export function deleteArticleVote(articleId: string) {
  return serverApi.delete<ArticleVoteDto>(
    `/api/articles/${articleId}/votes`,
    true
  );
}
