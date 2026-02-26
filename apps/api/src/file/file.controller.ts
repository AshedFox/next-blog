import { Body, Controller, Param, Post } from '@nestjs/common';
import { ZodResponse } from 'nestjs-zod';

import { FileDto } from './dto/file.dto';
import { InitUploadDto } from './dto/init-upload.dto';
import { InitUploadResponseDto } from './dto/init-upload-response.dto';
import { FileMapper } from './file.mapper';
import { FileService } from './file.service';

@Controller('files')
export class FileController {
  constructor(
    private readonly fileService: FileService,
    private readonly fileMapper: FileMapper
  ) {}

  @Post('init')
  @ZodResponse({ type: InitUploadResponseDto, status: 200 })
  initUpload(@Body() data: InitUploadDto) {
    return this.fileService.initUpload(data);
  }

  @Post(':id/complete')
  @ZodResponse({ type: FileDto, status: 200 })
  async completeUpload(@Param('id') id: string) {
    return this.fileMapper.map(await this.fileService.completeUpload(id));
  }
}
