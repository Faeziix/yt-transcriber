export interface TranscriptSegment {
  index: number
  text: string
  startSeconds: number
  endSeconds: number
  durationSeconds: number
}

export interface TranscriptResult {
  videoId: string
  language: string
  segments: TranscriptSegment[]
  metadata: {
    totalSegments: number
    extractedAt: string
  }
}

export type OutputFormat = 'txt' | 'srt' | 'json'

export interface FormatOptions {
  includeTimestamps: boolean
}

export interface Formatter {
  format(result: TranscriptResult, options: FormatOptions): string
}

export const EXIT_CODES = {
  SUCCESS: 0,
  INVALID_ARGS: 1,
  VIDEO_UNAVAILABLE: 2,
  NETWORK_ERROR: 3,
  FILE_ERROR: 4,
} as const
