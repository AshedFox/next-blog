import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { File, FileStatus } from '@prisma/client';
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
    await this.getOne(id);

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
    await this.getOne(id);

    await this.storageService.delete(id);

    return this.prisma.file.delete({ where: { id } });
  }
}
