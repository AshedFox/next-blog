import { Injectable, NotFoundException } from '@nestjs/common';
import { CommentVoteGetManyDto } from '@workspace/contracts';

import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class CommentVoteService {
  constructor(private readonly prisma: PrismaService) {}

  async upvote(commentId: string, userId: string) {
    return this.prisma.commentVote.upsert({
      where: { userId_commentId: { commentId, userId } },
      create: { commentId, userId, value: 1 },
      update: { value: 1 },
    });
  }

  async downvote(commentId: string, userId: string) {
    return this.prisma.commentVote.upsert({
      where: { userId_commentId: { commentId, userId } },
      create: { commentId, userId, value: -1 },
      update: { value: -1 },
    });
  }

  async findOne(commentId: string, userId: string) {
    return this.prisma.commentVote.findFirst({
      where: { commentId, userId },
    });
  }

  async getOne(commentId: string, userId: string) {
    const vote = await this.findOne(commentId, userId);

    if (!vote) {
      throw new NotFoundException("User don't have vote for this comment");
    }

    return vote;
  }

  async getManyAndCountByUser(
    userId: string,
    { page, limit, commentsIds, include = [] }: CommentVoteGetManyDto
  ) {
    return this.prisma.$transaction([
      this.prisma.commentVote.findMany({
        where: {
          userId,
          commentId: commentsIds ? { in: commentsIds } : undefined,
        },
        take: limit,
        skip: (page - 1) * limit,
        include:
          include.length > 0
            ? Object.fromEntries(include.map((item) => [item, true]))
            : undefined,
      }),
      this.prisma.commentVote.count({
        where: { userId },
      }),
    ]);
  }

  async getManyAndCountByComment(
    commentId: string,
    { page, limit, include = [] }: CommentVoteGetManyDto
  ) {
    return this.prisma.$transaction([
      this.prisma.commentVote.findMany({
        where: { commentId },
        take: limit,
        skip: (page - 1) * limit,
        include:
          include.length > 0
            ? Object.fromEntries(include.map((item) => [item, true]))
            : undefined,
      }),
      this.prisma.commentVote.count({
        where: { commentId },
      }),
    ]);
  }

  async getTotalForComment(commentId: string) {
    return this.prisma.commentVote
      .aggregate({
        _sum: { value: true },
        where: { commentId },
      })
      .then((r) => r._sum.value ?? 0);
  }

  async getTotalsForComments(commentsIds: string[]) {
    return this.prisma.commentVote
      .groupBy({
        by: ['commentId'],
        _sum: { value: true },

        where: { commentId: { in: commentsIds } },
      })
      .then((r) =>
        Object.fromEntries(r.map((s) => [s.commentId, s._sum.value ?? 0]))
      );
  }

  async delete(commentId: string, userId: string) {
    return this.prisma.commentVote.delete({
      where: { userId_commentId: { userId, commentId } },
    });
  }
}
