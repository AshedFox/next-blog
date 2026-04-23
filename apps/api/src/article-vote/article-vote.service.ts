import { Injectable, NotFoundException } from '@nestjs/common';
import { ArticleVoteInclude } from '@workspace/contracts';

import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class ArticleVoteService {
  constructor(private readonly prisma: PrismaService) {}

  async upvote(articleId: string, userId: string) {
    return this.prisma.articleVote.upsert({
      where: { userId_articleId: { articleId, userId } },
      create: { articleId, userId, value: 1 },
      update: { value: 1 },
    });
  }

  async downvote(articleId: string, userId: string) {
    return this.prisma.articleVote.upsert({
      where: { userId_articleId: { articleId, userId } },
      create: { articleId, userId, value: -1 },
      update: { value: -1 },
    });
  }

  async findOne(articleId: string, userId: string) {
    return this.prisma.articleVote.findFirst({
      where: { articleId, userId },
    });
  }

  async getOne(articleId: string, userId: string) {
    const vote = await this.findOne(articleId, userId);

    if (!vote) {
      throw new NotFoundException("User don't have vote for this article");
    }

    return vote;
  }

  async getManyAndCountByUser(
    userId: string,
    take: number,
    skip: number,
    include: ArticleVoteInclude[] = []
  ) {
    return this.prisma.$transaction([
      this.prisma.articleVote.findMany({
        where: { userId },
        skip,
        take,
        include:
          include.length > 0
            ? Object.fromEntries(include.map((item) => [item, true]))
            : undefined,
      }),
      this.prisma.articleVote.count({
        where: { userId },
      }),
    ]);
  }

  async getManyAndCountByArticle(
    articleId: string,
    take: number,
    skip: number,
    include: ArticleVoteInclude[] = []
  ) {
    return this.prisma.$transaction([
      this.prisma.articleVote.findMany({
        where: { articleId },
        skip,
        take,
        include:
          include.length > 0
            ? Object.fromEntries(include.map((item) => [item, true]))
            : undefined,
      }),
      this.prisma.articleVote.count({
        where: { articleId },
      }),
    ]);
  }

  async getTotalForArticle(articleId: string) {
    return this.prisma.articleVote.aggregate({
      _sum: { value: true },
      where: { articleId },
    });
  }

  async delete(articleId: string, userId: string) {
    return this.prisma.articleVote.delete({
      where: { userId_articleId: { userId, articleId } },
    });
  }
}
