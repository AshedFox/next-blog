import { Injectable } from '@nestjs/common';
import slugify from '@sindresorhus/slugify';
import { TagSearchDto } from '@workspace/contracts';

import { TagCreateInput } from '@/prisma/generated/models';
import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class TagService {
  constructor(private readonly prisma: PrismaService) {}

  async getOrCreateMany(tagsNames?: string[]) {
    if (!tagsNames?.length) {
      return [];
    }

    const tags = tagsNames.map((name) => ({
      name: name.trim(),
      slug: slugify(name, { lowercase: true }),
    })) satisfies TagCreateInput[];

    const slugs = tags.map((t) => t.slug);

    return this.prisma.$transaction(async (tx) => {
      const existingTags = await tx.tag.findMany({
        where: { slug: { in: slugs } },
      });

      const existingSlugs = new Set(existingTags.map((t) => t.slug));
      const newTags = tags.filter((t) => !existingSlugs.has(t.slug));

      if (newTags.length > 0) {
        const createdTags = await tx.tag.createManyAndReturn({
          data: newTags,
          skipDuplicates: true,
        });

        return [...existingTags, ...createdTags];
      }

      return existingTags;
    });
  }

  async search({ limit, query }: TagSearchDto) {
    if (!query) {
      return this.prisma.tag.findMany({
        take: limit,
        orderBy: {
          articles: { _count: 'desc' },
        },
      });
    }

    const searchSlug = slugify(query, { lowercase: true });

    return this.prisma.tag.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { slug: { contains: searchSlug } },
        ],
      },
      take: limit,
    });
  }
}
