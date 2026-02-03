import type { Formatter, TranscriptResult, FormatOptions } from '../types/index.ts'
import { formatTimestampBracket } from '../utils/time.ts'

export const txtFormatter: Formatter = {
  format(result: TranscriptResult, options: FormatOptions): string {
    return result.segments
      .map((segment) => {
        if (options.includeTimestamps) {
          return `${formatTimestampBracket(segment.startSeconds)} ${segment.text}`
        }
        return segment.text
      })
      .join('\n')
  },
}
