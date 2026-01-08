import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { File, FileStatus } from '@prisma/client';
import { FileInDto } from '@workspace/contracts';
import { randomUUID } from 'crypto';

import { DeletedMode, getDeletedFilter } from '@/common/soft-delete';
import { PrismaService } from '@/prisma/prisma.service';
import { StorageService } from '@/storage/storage.service';

import { InitUploadDto } from './dto/init-upload.dto';

@Injectable()
export class FileService {
  private readonly logger = new Logger(FileService.name);

  constructor(
    private readonly storageService: StorageService,
    private readonly prisma: PrismaService
  ) {}

  enrich(file: File): FileInDto {
    return {
      ...file,
      url: this.storageService.getPublicUrl(file.id),
    };
  }

  async findOne(
    id: string,
    mode: DeletedMode = 'exclude'
  ): Promise<File | null> {
    return this.prisma.file.findUnique({
      where: {
        id,
        deletedAt: getDeletedFilter(mode),
      },
    });
  }

  async getOne(id: string, mode: DeletedMode = 'exclude'): Promise<File> {
    const file = await this.findOne(id, mode);

    if (!file) {
      throw new NotFoundException('File not found!');
    }

    return file;
  }

  async findMany(
    ids: string[],
    mode: DeletedMode = 'exclude'
  ): Promise<File[]> {
    return this.prisma.file.findMany({
      where: {
        id: { in: ids },
        deletedAt: getDeletedFilter(mode),
      },
    });
  }

  async initUpload(data: InitUploadDto) {
    const id = randomUUID();
    const uploadUrl = await this.storageService.getUploadUrl(id, data.mimetype);

    await this.prisma.file.create({
      data: {
        ...data,
        id,
      },
    });

    return { fileId: id, uploadUrl };
  }

  async completeUpload(id: string): Promise<File> {
    const existing = await this.getOne(id);

    if (existing.status === FileStatus.UPLOADED) {
      throw new BadRequestException('File already uploaded!');
    }

    const realSize = await this.storageService.getSize(id);

    const file = await this.prisma.file.update({
      where: { id },
      data: { size: realSize, status: FileStatus.UPLOADED },
    });

    return file;
  }

  async markAsDeleted(id: string): Promise<File> {
    return this.prisma.file.softDelete({
      where: { id },
    });
  }

  async markManyAsDeleted(ids: string[]): Promise<number> {
    const { count } = await this.prisma.file.softDeleteMany({
      where: { id: { in: ids } },
    });

    return count;
  }

  async delete(id: string): Promise<File> {
    await this.storageService.delete(id);

    return this.prisma.file.delete({ where: { id } });
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async clearOldNotUploaded(): Promise<void> {
    this.logger.log('Clearing old not uploaded files...');

    const filesToDelete = await this.prisma.file.findMany({
      where: {
        status: FileStatus.PENDING,
        createdAt: { lt: new Date(Date.now() - 3_600_000) },
      },
    });

    if (filesToDelete.length === 0) {
      this.logger.log(`No old not uploaded files`);
      return;
    }

    const ids = filesToDelete.map((file) => file.id);

    await this.storageService.deleteMany(ids);

    await this.prisma.file.deleteMany({
      where: { id: { in: ids } },
    });

    this.logger.log(`Deleted ${filesToDelete.length} old not uploaded files`);
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async clearMarkedAsDeleted(): Promise<void> {
    this.logger.log('Clearing marked as deleted files...');

    const filesToDelete = await this.prisma.file.findMany({
      where: {
        deletedAt: { not: null },
      },
    });

    if (filesToDelete.length === 0) {
      this.logger.log(`No marked as deleted files`);
      return;
    }

    const ids = filesToDelete.map((file) => file.id);

    await this.storageService.deleteMany(ids);

    await this.prisma.file.deleteMany({
      where: { id: { in: ids } },
    });

    this.logger.log(`Deleted ${filesToDelete.length} marked as deleted files`);
  }
}
