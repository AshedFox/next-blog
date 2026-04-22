import { Injectable } from '@nestjs/common';
import { ArticleModerationInclude } from '@workspace/contracts';

import { ArticleModerationLog } from '@/prisma/generated/client';
import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class ArticleModerationService {
  constructor(private readonly prisma: PrismaService) {}

  findManyAndCountByArticle(
    articleId: string,
    take: number,
    skip: number,
    include: ArticleModerationInclude[] = []
  ): Promise<[ArticleModerationLog[], number]> {
    return this.prisma.$transaction(async (tx) => {
      const data = await tx.articleModerationLog.findMany({
        where: { articleId },
        take,
        skip,
        orderBy: { createdAt: 'desc' },
        include:
          include.length > 0
            ? Object.fromEntries(include.map((item) => [item, true]))
            : undefined,
      });
      const count = await tx.articleModerationLog.count({
        where: { articleId },
      });

      return [data, count];
    });
  }
}
