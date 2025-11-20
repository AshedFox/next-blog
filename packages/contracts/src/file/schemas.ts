import z from 'zod';

import { datetimeOutSchema } from '../common';
import { FileStatus } from './enums';

export const initUploadResponseSchema = z.object({
  fileId: z.uuid(),
  uploadUrl: z.url(),
});

export const initUploadSchema = z.object({
  name: z.string().min(2).max(200),
  mimetype: z.string(),
  size: z.number().min(1).max(10_485_760),
});

export const fileSchema = z.object({
  id: z.uuid(),
  name: z.string().min(2).max(200),
  status: z.enum(FileStatus),
  mimetype: z.string(),
  size: z.number().min(1).max(10_485_760),
  createdAt: datetimeOutSchema,
  updatedAt: datetimeOutSchema,
  deletedAt: datetimeOutSchema.nullish(),
});
