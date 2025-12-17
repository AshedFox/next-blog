'use server';

import { InitUploadDto } from '@workspace/contracts';

import { initUpload } from '../server';

export async function initUploadAction(input: InitUploadDto) {
  const { data, error } = await initUpload(input);

  if (error) {
    return { error };
  }

  return { data };
}
