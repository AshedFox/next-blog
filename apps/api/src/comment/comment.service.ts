import { Injectable, NotFoundException } from '@nestjs/common';
import { CommentInclude } from '@workspace/contracts';

import { DeletedMode, getDeletedFilter } from '@/common/soft-delete';
import { Comment, Prisma } from '@/prisma/generated/client';
import { PrismaService } from '@/prisma/prisma.service';

import { CreateCommentInput } from './comment.types';
import { CommentSearchDto } from './dto/comment-search.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Injectable()
export class CommentService {
  constructor(private readonly prisma: PrismaService) {}

  private mapInclude(
    include: CommentInclude[] = []
  ): Prisma.CommentInclude | undefined {
    return include.length > 0
      ? include.reduce((acc, item) => ({ ...acc, [item]: true }), {})
      : undefined;
  }

  create(input: CreateCommentInput): Promise<Comment> {
    return this.prisma.comment.create({ data: input });
  }

  findOne(
    id: string,
    mode: DeletedMode = 'exclude',
    include: CommentInclude[] = []
  ): Promise<Comment | null> {
    return this.prisma.comment.findUnique({
      where: { id, deletedAt: getDeletedFilter(mode) },
      include: this.mapInclude(include),
    });
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

  searchByAuthor(
    authorId: string,
    { limit, cursor, include, sort }: CommentSearchDto
  ): Promise<Comment[]> {
    return this.prisma.comment.findMany({
      where: { authorId },
      take: limit,
      cursor: cursor ? { id: cursor } : undefined,
      orderBy: sort,
      include: this.mapInclude(include),
    });
  }

  searchByArticle(
    articleId: string,
    { limit, cursor, include, sort }: CommentSearchDto
  ): Promise<Comment[]> {
    return this.prisma.comment.findMany({
      where: { articleId },
      take: limit + 1,
      cursor: cursor ? { id: cursor } : undefined,
      orderBy: sort,
      include: this.mapInclude(include),
    });
  }

  async update(id: string, input: UpdateCommentDto): Promise<Comment> {
    await this.getOne(id);

    return this.prisma.comment.update({
      where: { id },
      data: input,
    });
  }

  async restore(id: string): Promise<Comment> {
    await this.getOne(id, DeletedMode.ONLY);

    return this.prisma.comment.restore({ where: { id } });
  }

  async softDelete(id: string): Promise<Comment> {
    await this.getOne(id);

    return this.prisma.comment.softDelete({ where: { id } });
  }
}
