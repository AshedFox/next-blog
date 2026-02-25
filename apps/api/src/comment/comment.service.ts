import { Injectable, NotFoundException } from '@nestjs/common';
import { CommentInclude } from '@workspace/contracts';

import { enrichArticleBlocks } from '@/article/article.utils';
import { DeletedMode, getDeletedFilter } from '@/common/soft-delete';
import { Article, Comment, Prisma } from '@/prisma/generated/client';
import { PrismaService } from '@/prisma/prisma.service';
import { StorageService } from '@/storage/storage.service';

import { CreateCommentInput } from './comment.types';
import { CommentSearchDto } from './dto/comment-search.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Injectable()
export class CommentService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly storageService: StorageService
  ) {}

  private enrich<T extends Comment & { article?: Article | null }>(
    comment: T
  ): T {
    if (comment.article) {
      comment.article = {
        ...comment.article,
        blocks: enrichArticleBlocks(
          comment.article.blocks as Prisma.JsonArray,
          (fileId) => this.storageService.getPublicUrl(fileId)
        ) as unknown as Prisma.JsonValue,
      };
    }
    return comment;
  }

  private enrichMany<T extends Comment & { article?: Article | null }>(
    comments: T[]
  ): T[] {
    return comments.map((c) => this.enrich(c));
  }

  private mapInclude(
    include: CommentInclude[] = []
  ): Prisma.CommentInclude | undefined {
    return include.length > 0
      ? Object.fromEntries(include.map((item) => [item, true]))
      : undefined;
  }

  create(input: CreateCommentInput): Promise<Comment> {
    return this.prisma.comment.create({ data: input });
  }

  async findOne(
    id: string,
    mode: DeletedMode = 'exclude',
    include: CommentInclude[] = []
  ): Promise<Comment | null> {
    const comment = await this.prisma.comment.findUnique({
      where: { id, deletedAt: getDeletedFilter(mode) },
      include: this.mapInclude(include),
    });
    return comment ? this.enrich(comment) : null;
  }

  async getOne(
    id: string,
    mode: DeletedMode = 'exclude',
    include: CommentInclude[] = []
  ): Promise<Comment> {
    const comment = await this.findOne(id, mode, include);
    if (!comment) {
      throw new NotFoundException('Comment not found');
    }
    return comment;
  }

  async searchByAuthor(
    authorId: string,
    { limit, cursor, include, sort }: CommentSearchDto
  ): Promise<Comment[]> {
    const comments = await this.prisma.comment.findMany({
      where: { authorId },
      take: limit,
      cursor: cursor ? { id: cursor } : undefined,
      orderBy: sort,
      include: this.mapInclude(include),
    });
    return this.enrichMany(comments);
  }

  async searchByArticle(
    articleId: string,
    { limit, cursor, include, sort }: CommentSearchDto
  ): Promise<Comment[]> {
    const comments = await this.prisma.comment.findMany({
      where: { articleId },
      take: limit + 1,
      cursor: cursor ? { id: cursor } : undefined,
      orderBy: sort,
      include: this.mapInclude(include),
    });
    return this.enrichMany(comments);
  }

  async update(id: string, input: UpdateCommentDto): Promise<Comment> {
    return this.prisma.comment.update({
      where: { id },
      data: input,
    });
  }

  async restore(id: string): Promise<Comment> {
    return this.prisma.comment.restore({ where: { id } });
  }

  async softDelete(id: string): Promise<Comment> {
    return this.prisma.comment.softDelete({ where: { id } });
  }
}
