import z from 'zod';

import {
  fileSchema,
  initUploadResponseSchema,
  initUploadSchema,
} from './schemas';

export type InitUploadResponseDto = z.infer<typeof initUploadResponseSchema>;

export type InitUploadDto = z.infer<typeof initUploadSchema>;

export type FileDto = z.infer<typeof fileSchema>;

export type FileInDto = z.input<typeof fileSchema>;
