'use client';

import { FileDto } from '@workspace/contracts';
import { useCallback } from 'react';
import { toast } from 'sonner';

import { completeUploadAction } from '../actions/complete-upload';
import { initUploadAction } from '../actions/init-upload';

export const useFileUpload = (onSuccess?: (file: FileDto) => void) => {
  const handleUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.item(0);
      if (!file) return;

      try {
        const initResult = await initUploadAction({
          mimetype: file.type,
          name: file.name,
          size: file.size,
        });

        if (initResult.error) {
          toast.error(initResult.error.message);
          return;
        }

        const response = await fetch(initResult.data.uploadUrl, {
          method: 'PUT',
          body: file,
        });

        if (!response.ok) {
          throw new Error('Failed to upload file to storage');
        }

        const completeResult = await completeUploadAction(
          initResult.data.fileId
        );

        if (completeResult.error) {
          toast.error(completeResult.error.message);
          return;
        }

        toast.success('Image uploaded successfully');

        onSuccess?.(completeResult.data);
      } catch {
        toast.error('Something went wrong during upload');
      }
    },
    [onSuccess]
  );

  return { handleUpload };
};
