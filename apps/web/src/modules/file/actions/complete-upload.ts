'use server';

import { completeUpload } from '../server';

export async function completeUploadAction(id: string) {
  const { data, error } = await completeUpload(id);

  if (error) {
    return { error };
  }

  return { data };
}
