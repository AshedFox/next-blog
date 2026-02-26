import { Module } from '@nestjs/common';

import { PrismaModule } from '@/prisma/prisma.module';
import { StorageModule } from '@/storage/storage.module';

import { FileController } from './file.controller';
import { FileMapper } from './file.mapper';
import { FileService } from './file.service';

@Module({
  imports: [PrismaModule, StorageModule],
  controllers: [FileController],
  providers: [FileService, FileMapper],
  exports: [FileService, FileMapper],
})
export class FileModule {}
