import 'server-only';

import {
  FileDto,
  InitUploadDto,
  InitUploadResponseDto,
} from '@workspace/contracts';

import { serverApi } from '@/lib/api/server';

export function initUpload(input: InitUploadDto) {
  return serverApi.post<InitUploadResponseDto>('/api/files/init', input, true);
}

export function completeUpload(id: string) {
  return serverApi.post<FileDto>(`/api/files/${id}/complete`, undefined, true);
}
