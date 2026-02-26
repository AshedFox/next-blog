import { Injectable } from '@nestjs/common';
import { File } from '@prisma/client';
import { FileInDto } from '@workspace/contracts';

import { StorageService } from '@/storage/storage.service';

@Injectable()
export class FileMapper {
  constructor(private readonly storageService: StorageService) {}

  map(file: File): FileInDto {
    return {
      ...file,
      url: this.storageService.getPublicUrl(file.id),
    };
  }

  mapMany(files: File[]): FileInDto[] {
    return files.map((file) => this.map(file));
  }
}
