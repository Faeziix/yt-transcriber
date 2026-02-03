import type { Formatter, TranscriptResult } from '../types/index.ts'
import { formatTimestampSrt } from '../utils/time.ts'

export const srtFormatter: Formatter = {
  format(result: TranscriptResult): string {
    return result.segments
      .map((segment, index) => {
        const sequenceNumber = index + 1
        const startTime = formatTimestampSrt(segment.startSeconds)
        const endTime = formatTimestampSrt(segment.endSeconds)

        return `${sequenceNumber}\n${startTime} --> ${endTime}\n${segment.text}`
      })
      .join('\n\n')
  },
}
