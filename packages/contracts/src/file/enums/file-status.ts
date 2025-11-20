export const FileStatus = {
  PENDING: 'PENDING',
  UPLOADED: 'UPLOADED',
} as const;

export type FileStatus = (typeof FileStatus)[keyof typeof FileStatus];

export function isFileStatus(value: string): value is FileStatus {
  return Object.values(FileStatus).includes(value as FileStatus);
}
