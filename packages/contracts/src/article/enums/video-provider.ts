export const VideoProvider = {
  YOUTUBE: 'YOUTUBE',
  VIMEO: 'VIMEO',
} as const;

export type VideoProvider = (typeof VideoProvider)[keyof typeof VideoProvider];

export function isVideoProvider(value: unknown): value is VideoProvider {
  return VIDEO_PROVIDER_VALUES.includes(value as VideoProvider);
}

export const VIDEO_PROVIDER_VALUES = Object.values(
  VideoProvider
) as VideoProvider[];

export const VIDEO_PROVIDER_KEYS = Object.keys(VideoProvider) as Array<
  keyof typeof VideoProvider
>;
